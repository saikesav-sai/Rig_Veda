import json
import os
from datetime import datetime
from typing import Any, Dict, List, Optional, Union

import dotenv
import requests
from flask import request

dotenv.load_dotenv()

LOGTAIL_SOURCE_TOKEN = os.getenv("log_token")
LOGTAIL_URL = "https://s1543114.eu-nbg-2.betterstackdata.com/"


def get_user_info():
    
    try:
        user_info = {
            "ip_address": request.headers.get('X-Forwarded-For', request.remote_addr),
            
            "user_agent": request.headers.get('User-Agent', 'Unknown'),
        }
        
        return user_info
    except RuntimeError:
        return {
            "ip_address": "N/A",
            "user_agent": "N/A"
        }

class RigVedaLogger:
    
    def __init__(self, service_name: str):
        self.service_name = service_name
        
    def log_to_logtail(self, 
                       event_type: str,
                       message: str,
                       success: bool = True,
                       processing_time: Optional[float] = None,
                       include_user_info: bool = True,
                       **kwargs) -> None:
        """
        Send comprehensive logs to Logtail (Better Stack)
        
        Args:
            event_type: Type of event (e.g., 'search', 'sloka_fetch', 'audio_request')
            message: Main log message
            success: Whether the operation was successful
            processing_time: Processing time in milliseconds
            include_user_info: Whether to include user/request information
            **kwargs: Additional context data
        """
        try:
            log_data = {
                "dt": datetime.utcnow().isoformat() + "Z",
                "level": "info" if success else "error",
                "message": message,
                "service": f"rigveda-{self.service_name}",
                "event_type": event_type,
                "success": success,
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "session_id": f"session_{datetime.now().strftime('%Y%m%d_%H')}",  # Hourly session grouping
            }
            
            if include_user_info:
                user_info = get_user_info()
                log_data["user_info"] = user_info
            
            if processing_time is not None:
                log_data["processing_time_ms"] = processing_time
            
            log_data.update(kwargs)
            
            headers = {
                "Authorization": f"Bearer {LOGTAIL_SOURCE_TOKEN}",
                "Content-Type": "application/json"
            }
            
            response = requests.post(
                LOGTAIL_URL, 
                json=log_data, 
                headers=headers,
                timeout=5
            )
            
        #     if response.status_code == 202:
        #         print(f"✅ Successfully logged {event_type} to Logtail")
        #     else:
        #         print(f"⚠️ Logtail logging failed: {response.status_code}")
                
        except Exception as e:
            print(f" Logtail logging error: {e}")

    def log_search_request(self, 
                          query: str, 
                          results_count: int,
                          top_k: int,
                          processing_time: float,
                          similarity_scores: Optional[List[float]] = None,
                          success: bool = True,
                          error_message: Optional[str] = None) -> None:
        """Log semantic search requests"""
        log_data = {
            "search_query": query,
            "query_length": len(query) if query else 0,
            "query_word_count": len(query.split()) if query else 0,
            "requested_results": top_k,
            "returned_results": results_count,
            "results_found": results_count > 0,
        }
        
        if similarity_scores:
            log_data.update({
                "min_similarity": min(similarity_scores),
                "max_similarity": max(similarity_scores),
                "avg_similarity": sum(similarity_scores) / len(similarity_scores),
                "similarity_scores": similarity_scores[:5]  # First 5 scores
            })
        
        if error_message:
            log_data["error_details"] = error_message
            
        self.log_to_logtail(
            event_type="semantic_search",
            message=f"Semantic search: {query[:50]}{'...' if len(query) > 50 else ''}",
            success=success,
            processing_time=processing_time,
            include_user_info=True,
            **log_data
        )

    def log_sloka_request(self,
                         mandala: int,
                         hymn: int,
                         sloka: int,
                         processing_time: float,
                         success: bool = True,
                         sloka_data: Optional[Dict] = None,
                         error_message: Optional[str] = None) -> None:
        """Log sloka fetch requests"""
        location = f"{mandala:02d}.{hymn:03d}.{sloka:02d}"
        
        log_data = {
            "mandala": mandala,
            "hymn_number": hymn,
            "sloka_number": sloka,
            "location": location,
        }
        
        if sloka_data:
            log_data.update({
                "has_sanskrit": bool(sloka_data.get("sanskrit")),
                "has_translation": bool(sloka_data.get("translation")),
                "sanskrit_length": len(sloka_data.get("sanskrit", "")),
                "translation_length": len(sloka_data.get("translation", "")),
            })
        
        if error_message:
            log_data["error_details"] = error_message
            
        self.log_to_logtail(
            event_type="sloka_fetch",
            message=f"Sloka request: {location}",
            success=success,
            processing_time=processing_time,
            include_user_info=True,
            **log_data
        )

    def log_audio_request(self,
                         mandala: int,
                         hymn: int,
                         stanza: int,
                         processing_time: float,
                         file_exists: bool,
                         file_size: Optional[int] = None,
                         success: bool = True,
                         error_message: Optional[str] = None) -> None:
        """Log audio file requests"""
        location = f"{mandala:02d}.{hymn:03d}.{stanza:02d}"
        
        log_data = {
            "mandala": mandala,
            "hymn_number": hymn,
            "stanza_number": stanza,
            "location": location,
            "file_exists": file_exists,
        }
        
        if file_size is not None:
            log_data["file_size_bytes"] = file_size
            
        if error_message:
            log_data["error_details"] = error_message
            
        self.log_to_logtail(
            event_type="audio_request",
            message=f"Audio request: {location}",
            success=success,
            processing_time=processing_time,
            include_user_info=True,
            **log_data
        )

    def log_index_request(self,
                         mandala: int,
                         processing_time: float,
                         hymns_count: int,
                         success: bool = True,
                         error_message: Optional[str] = None) -> None:
        """Log index/metadata requests"""
        log_data = {
            "mandala": mandala,
            "hymns_found": hymns_count,
        }
        
        if error_message:
            log_data["error_details"] = error_message
            
        self.log_to_logtail(
            event_type="index_request",
            message=f"Index request: Mandala {mandala}",
            success=success,
            processing_time=processing_time,
            include_user_info=True,
            **log_data
        )

    def log_random_request(self,
                          requested_count: int,
                          returned_count: int,
                          processing_time: float,
                          success: bool = True,
                          error_message: Optional[str] = None) -> None:
        """Log random verses requests"""
        log_data = {
            "requested_verses": requested_count,
            "returned_verses": returned_count,
        }
        
        if error_message:
            log_data["error_details"] = error_message
            
        self.log_to_logtail(
            event_type="random_verses",
            message=f"Random verses request: {requested_count} requested",
            success=success,
            processing_time=processing_time,
            include_user_info=True,
            **log_data
        )

    def log_status_check(self,
                        component_status: Dict[str, bool],
                        processing_time: float,
                        success: bool = True) -> None:
        """Log system status checks"""
        self.log_to_logtail(
            event_type="status_check",
            message="System status check",
            success=success,
            processing_time=processing_time,
            include_user_info=True,
            **component_status
        )

    def log_chat_bot_interaction(self,
                                user_query: str,
                                final_context: str,
                                intents_list: List[Dict],
                                generated_answer: Optional[Dict] = None,
                                success: bool = True,
                                processing_time: Optional[float] = None) -> None:
        """Log chat bot interactions (backward compatibility)"""
        answer_summary = None
        answer_intent = None
        
        if generated_answer and isinstance(generated_answer, dict):
            answer_summary = generated_answer.get("summary", "")[:200]  # First 200 chars
            answer_intent = generated_answer.get("intent_used", "")
            
        log_data = {
            "user_query": user_query,
            "query_length": len(user_query) if user_query else 0,
            "query_word_count": len(user_query.split()) if user_query else 0,
            
            "extracted_intents": intents_list,
            "intent_count": len(intents_list) if intents_list else 0,
            "has_semantic_search": any(intent.get("intent") == "semantic_search" for intent in intents_list) if intents_list else False,
            "has_location_search": any(intent.get("intent") == "fetch_by_location" for intent in intents_list) if intents_list else False,
            "has_asking_question": any(intent.get("intent") == "asking_question" for intent in intents_list) if intents_list else False,
            "has_other_question": any(intent.get("intent") == "other_question" for intent in intents_list) if intents_list else False,
            
            "context_length": len(final_context) if final_context else 0,
            "context_word_count": len(final_context.split()) if final_context else 0,
            "context_preview": final_context[:300] + "..." if final_context and len(final_context) > 300 else final_context,
            
            "answer_generated": generated_answer is not None,
            "answer_summary": answer_summary,
            "answer_intent_used": answer_intent,
            "answer_full": json.dumps(generated_answer, ensure_ascii=False)[:500] + "..." if generated_answer and len(str(generated_answer)) > 500 else generated_answer,
            
            "processing_success": success,
        }
        
        self.log_to_logtail(
            event_type="chat_bot_query",
            message="Rig Veda Query Processed" if success else "Rig Veda Query Failed",
            success=success,
            processing_time=processing_time,
            include_user_info=True,
            **log_data
        )

    def log_user_session(self,
                        session_action: str,
                        session_data: Optional[Dict] = None) -> None:
       
        log_data = {
            "session_action": session_action,
        }
        
        if session_data:
            log_data.update(session_data)
        
        self.log_to_logtail(
            event_type="user_session",
            message=f"User session: {session_action}",
            success=True,
            include_user_info=True,
            **log_data
        )
    
    def log_api_request(self,
                       endpoint: str,
                       method: str,
                       status_code: int,
                       processing_time: float,
                       request_size: Optional[int] = None,
                       response_size: Optional[int] = None,
                       error_message: Optional[str] = None) -> None:
        
        log_data = {
            "endpoint": endpoint,
            "http_method": method,
            "status_code": status_code,
            "success": 200 <= status_code < 400,
        }
        
        if request_size is not None:
            log_data["request_size_bytes"] = request_size
            
        if response_size is not None:
            log_data["response_size_bytes"] = response_size
            
        if error_message:
            log_data["error_details"] = error_message
        
        self.log_to_logtail(
            event_type="api_request",
            message=f"{method} {endpoint} - {status_code}",
            success=200 <= status_code < 400,
            processing_time=processing_time,
            include_user_info=True,
            **log_data
        )


# Module-specific logger instances
def get_semantic_search_logger():
    return RigVedaLogger("semantic-search")

def get_sloka_explorer_logger():
    return RigVedaLogger("sloka-explorer")

def get_chat_bot_logger():
    return RigVedaLogger("chatbot")