import json
import os
import threading
from datetime import datetime

import faiss
import numpy as np
from flask import Blueprint, jsonify, request
from middleware import require_api_key
from sentence_transformers import SentenceTransformer
from sloka_explorer.routes import get_sloka
from utils.logging_utils import get_semantic_search_logger

semantic_search_bp = Blueprint('semantic_search', __name__, url_prefix='/api/semantic')

logger = get_semantic_search_logger()

class SearchResources:
    _instance = None
    _lock = threading.Lock()
    
    def __new__(cls):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super().__new__(cls)
                    cls._instance._initialized = False
        return cls._instance
    
    def __init__(self):
        if self._initialized:
            return
            
        with self._lock:
            if not self._initialized:
                self._load_components()
    
    def _load_components(self):
        try:
            # print("Loading SentenceTransformer model for semantic search...")
            #old model BAAI/bge-base-en-v1.5
            self.model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
            
            faiss_index_path = "data/embeddings/FAISS_index/rigveda_all_slokas.index"
            if os.path.exists(faiss_index_path):
                # print("Loading FAISS index...")
                self.faiss_index = faiss.read_index(faiss_index_path)
            else:
                raise Exception(f"FAISS index not found at {faiss_index_path}")
            
            slokas_mapping_path = "data/embeddings/FAISS_index/slokas_mapping.json"
            if os.path.exists(slokas_mapping_path):
                # print("Loading slokas mapping...")
                with open(slokas_mapping_path, "r", encoding="utf-8") as f:
                    self.slokas_list = json.load(f)
            else:
                raise Exception(f"Slokas mapping not found at {slokas_mapping_path}")
            
            self._initialized = True
            print("Semantic search components loaded successfully!")
            # print(f"Total indexed slokas: {len(self.slokas_list)}")
            
        except Exception as e:
            # print(f"Error loading semantic search components: {e}")
            self._initialized = False
            raise e

_search_resources = SearchResources()

def get_sloka_details(mandala, hymn, sloka):
    """Get detailed sloka information using existing sloka_explorer"""
    try:
        sloka_response = get_sloka(mandala, hymn, sloka)
        if sloka_response:
            sloka_data = sloka_response.get_json() if hasattr(sloka_response, 'get_json') else sloka_response
            # print(sloka_data)
            return sloka_data
        return None
    except Exception as e:
        # print(f"Error fetching sloka details: {e}")
        return None

def semantic_search(query, top_k=10):
    """Perform semantic search using existing infrastructure"""
    resources = SearchResources()
    
    if not resources._initialized:
        raise Exception("Search components not properly loaded")
    
    query_embedding = resources.model.encode([query])[0].astype("float32")
    
    distances, indices = resources.faiss_index.search(np.array([query_embedding]), top_k)
    
    results = []
    for distance, idx in zip(distances[0], indices[0]):
        if idx < len(resources.slokas_list):
            sloka_info = resources.slokas_list[idx]
            detailed_sloka = get_sloka_details(
                sloka_info["mandala"], 
                sloka_info["hymn_number"], 
                sloka_info["sloka_number"]
            )
            
            # Convert distance to similarity score (0-1 range, higher is better)
            # Using exponential decay: similarity = e^(-distance)
            # For typical distances (0.5-2.0), this gives good 0-1 range
            import math
            similarity = math.exp(-distance)
            
            if detailed_sloka:
                detailed_sloka['similarity_score'] = float(similarity)
                detailed_sloka['distance'] = float(distance)  # Keep original for debugging
                detailed_sloka['mandala'] = sloka_info["mandala"]
                detailed_sloka['hymn_number'] = sloka_info["hymn_number"]
                detailed_sloka['sloka_number'] = sloka_info["sloka_number"]
                results.append(detailed_sloka)
            else:
                results.append({
                    'location': f"{sloka_info['mandala']:02d}.{sloka_info['hymn_number']:03d}.{sloka_info['sloka_number']:02d}",
                    'mandala': sloka_info["mandala"],
                    'hymn_number': sloka_info["hymn_number"],
                    'sloka_number': sloka_info["sloka_number"],
                    'sanskrit': sloka_info.get("text", ""),
                    'similarity_score': float(similarity),
                    'distance': float(distance)
                })
    
    return results

@semantic_search_bp.route('/search', methods=['POST'])
@require_api_key
def search():
    """Semantic search endpoint"""
    start_time = datetime.now()
    
    try:
        data = request.get_json()
        query = data.get('query', '').strip()
        top_k = data.get('top_k', 10)
        
        if not query:
            processing_time = (datetime.now() - start_time).total_seconds() * 1000
            logger.log_search_request(
                query="", 
                results_count=0, 
                top_k=top_k,
                processing_time=processing_time,
                success=False,
                error_message="Query is required"
            )
            return jsonify({'error': 'Query is required'}), 400
        
        results = semantic_search(query, top_k)
        
        processing_time = (datetime.now() - start_time).total_seconds() * 1000
        
        similarity_scores = [result.get('similarity_score') for result in results if 'similarity_score' in result]
        
        logger.log_search_request(
            query=query,
            results_count=len(results),
            top_k=top_k,
            processing_time=processing_time,
            similarity_scores=similarity_scores,
            success=True
        )
        
        return jsonify({
            'query': query,
            'results': results,
            'total_results': len(results),
            'success': True
        })
        
    except Exception as e:
        processing_time = (datetime.now() - start_time).total_seconds() * 1000
        error_msg = str(e)
        
        # Log failed search
        logger.log_search_request(
            query=query if 'query' in locals() else "",
            results_count=0,
            top_k=top_k if 'top_k' in locals() else 0,
            processing_time=processing_time,
            success=False,
            error_message=error_msg
        )
        
        # print(f"Search error: {e}")
        return jsonify({'error': error_msg}), 500

@semantic_search_bp.route('/random', methods=['GET'])
@require_api_key
def random_verses():
    """Get random verses for exploration"""
    start_time = datetime.now()
    
    try:
        resources = SearchResources()
        
        import random

        requested_count = 10
        available_count = min(requested_count, len(resources.slokas_list))
        random_indices = random.sample(range(len(resources.slokas_list)), available_count)
        random_results = []
        
        for idx in random_indices:
            sloka_info = resources.slokas_list[idx]
            detailed_sloka = get_sloka_details(
                sloka_info["mandala"], 
                sloka_info["hymn_number"], 
                sloka_info["sloka_number"]
            )
            
            if detailed_sloka:
                detailed_sloka['mandala'] = sloka_info["mandala"]
                detailed_sloka['hymn_number'] = sloka_info["hymn_number"]
                detailed_sloka['sloka_number'] = sloka_info["sloka_number"]
                random_results.append(detailed_sloka)
        
        processing_time = (datetime.now() - start_time).total_seconds() * 1000
        
        logger.log_random_request(
            requested_count=requested_count,
            returned_count=len(random_results),
            processing_time=processing_time,
            success=True
        )
        
        return jsonify({
            'results': random_results,
            'total_results': len(random_results),
            'success': True
        })
        
    except Exception as e:
        processing_time = (datetime.now() - start_time).total_seconds() * 1000
        error_msg = str(e)
        
        logger.log_random_request(
            requested_count=10,
            returned_count=0,
            processing_time=processing_time,
            success=False,
            error_message=error_msg
        )
        
        # print(f"Random verses error: {e}")
        return jsonify({'error': error_msg}), 500

@semantic_search_bp.route('/status', methods=['GET'])
def status():
    """Check if semantic search is ready"""
    start_time = datetime.now()
    
    try:
        resources = SearchResources()
        is_ready = resources._initialized
        
        component_status = {
            'ready': is_ready,
            'model_loaded': hasattr(resources, 'model') and resources.model is not None,
            'index_loaded': hasattr(resources, 'faiss_index') and resources.faiss_index is not None,
            'data_loaded': hasattr(resources, 'slokas_list') and resources.slokas_list is not None,
            'total_verses': len(resources.slokas_list) if hasattr(resources, 'slokas_list') and resources.slokas_list else 0
        }
        
        processing_time = (datetime.now() - start_time).total_seconds() * 1000
        
        logger.log_status_check(
            component_status=component_status,
            processing_time=processing_time,
            success=True
        )
        
        return jsonify(component_status)
        
    except Exception as e:
        processing_time = (datetime.now() - start_time).total_seconds() * 1000
        error_msg = str(e)
        
        logger.log_status_check(
            component_status={'ready': False, 'error': error_msg},
            processing_time=processing_time,
            success=False
        )
        
        return jsonify({'error': error_msg, 'ready': False}), 500

