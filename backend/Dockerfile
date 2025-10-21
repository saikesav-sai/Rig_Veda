FROM python:3.11-slim as builder

WORKDIR /app

ENV PATH=/root/.local/bin:$PATH

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    g++ \
    wget \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

# Install PyTorch CPU version first (much smaller than GPU version)
RUN pip install --no-cache-dir --user \
    torch==2.1.0 --index-url https://download.pytorch.org/whl/cpu

RUN pip install --no-cache-dir --user -r requirements.txt

ENV SENTENCE_TRANSFORMERS_HOME=/root/.cache/torch/sentence_transformers
ENV TRANSFORMERS_OFFLINE=0
ENV HF_HUB_DISABLE_TELEMETRY=1

# Download ONLY safetensors model files using huggingface_hub
# This avoids downloading ONNX, OpenVINO, and other variants
RUN python -c "from huggingface_hub import snapshot_download; \
    import os; \
    os.makedirs('/root/.cache/torch/sentence_transformers', exist_ok=True); \
    snapshot_download( \
        repo_id='sentence-transformers/all-MiniLM-L6-v2', \
        cache_dir='/root/.cache/huggingface', \
        local_dir='/root/.cache/torch/sentence_transformers/sentence-transformers_all-MiniLM-L6-v2', \
        local_dir_use_symlinks=False, \
        ignore_patterns=['*.onnx', '*onnx*', '*openvino*', '*.bin', '*.h5', '*.ot', '*.msgpack'] \
    ); \
    print('✅ Model downloaded successfully (safetensors only)')"

# Verify the model loads correctly with safetensors
RUN python -c "from sentence_transformers import SentenceTransformer; \
    model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2', device='cpu'); \
    print('✅ Model loaded successfully'); \
    print(f'Model uses: {type(model[0]).__name__}')"

FROM python:3.11-slim

WORKDIR /app

COPY --from=builder /root/.local /root/.local

COPY --from=builder /root/.cache /root/.cache

# Copy application code
COPY . .

ENV PATH=/root/.local/bin:$PATH
ENV SENTENCE_TRANSFORMERS_HOME=/root/.cache/torch/sentence_transformers

RUN mkdir -p logs

EXPOSE 8008

ENV PYTHONUNBUFFERED=1
ENV FLASK_APP=app.py
ENV RUN_TUNNEL=false

CMD ["gunicorn", "--worker-class", "gevent", "--workers", "1", "--bind", "0.0.0.0:8008", "app:app"]
