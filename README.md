# Documentation:
**For detailed project View, Read My Hand Written [Documentation](Documentation.pdf)**


# Rig Veda Explorer [veda.saikesav.me](https://veda.saikesav.me)

A modern web application for exploring and searching the ancient Rig Veda texts with AI-powered semantic search and interactive chat capabilities.

## Features

- **Semantic Search**: Find relevant verses using natural language queries powered by AI embeddings
- **Veda Explorer**: Browse through all Mandalas, Hymns, and Slokas with detailed translations
- **AI Chatbot**: Interactive chat interface to ask questions about Vedic texts
- **Audio Support**: Listen to authentic Sanskrit recitations of verses
- **Random Verse Discovery**: Explore random verses for daily inspiration
- **3D Visualizations**: Immersive 3D Om symbol rendered with React Three Fiber

## Tech Stack

### Frontend
- **React** 19.2.0 - Modern UI framework
- **React Router** - Navigation and routing
- **React Three Fiber** - 3D graphics rendering
- **React Icons** - Icon library

### Backend
- **Flask** 3.0.0 - Python web framework
- **Sentence Transformers** - AI-powered text embeddings
- **FAISS** - Efficient similarity search
- **PyTorch** - Machine learning framework
- **Gunicorn** - Production WSGI server

### Infrastructure
- **Docker & Docker Compose** - Containerized deployment
- **Cloudflare Tunnel** - Secure public access
- **CORS Support** - Cross-origin resource sharing

## Project Structure

```
Rig_Veda/
├── backend/
│   ├── app.py                    # Flask application entry point
│   ├── requirements.txt          # Python dependencies
│   ├── Dockerfile               # Backend container configuration
│   ├── chat_bot/                # AI chatbot module
│   ├── semantic_search/         # Semantic search engine
│   ├── sloka_explorer/          # Verse exploration API
│   ├── middleware/              # Authentication middleware
│   ├── utils/                   # Utility functions
│   └── data/
│       ├── dataset/             # Rig Veda JSON datasets
│       └── embeddings/          # Pre-computed FAISS index
├── frontend/
│   ├── src/
│   │   ├── components/          # React components
│   │   └── config.js            # API configuration
│   ├── public/                  # Static assets
│   ├── package.json             # Node dependencies
│   └── Dockerfile               # Frontend container configuration
└── docker-compose.yml           # Multi-service orchestration
```

 **Local Development**
  If you want to deploy my project locally, [Email_ME](mailto:saikesav67254@gmail.com) for proper instructions.
### Prerequisites
- Docker and Docker Compose installed
- Node.js 16+ (for local development)
- Python 3.9+ (for local development)




## API Endpoints

### Semantic Search
- `POST /api/search` - Search verses by natural language query
- `GET /api/random-verses` - Get random verses
- `GET /api/status` - Check search engine status

### Veda Explorer
- `GET /api/mandalas` - List all Mandalas
- `GET /api/mandala/<id>/hymns` - Get hymns in a Mandala
- `GET /api/hymn/<mandala>/<hymn>` - Get specific hymn details

### Chatbot
- `POST /api/chat/intent` - Chat with AI about Vedic texts (requires API key)

## Features in Detail

### Semantic Search Engine
Uses state-of-the-art sentence transformers to encode queries and perform similarity search against 10,000+ Rig Veda verses using FAISS indexing for fast retrieval.

### Audio Integration
Dynamically fetches and caches Sanskrit audio recitations from my rig veda repo sources, providing an authentic experience.

### Responsive Design
Fully responsive interface that works seamlessly on desktop, tablet, and mobile devices.

## Health Checks

Both services include health checks:
- Backend: Checks Flask API availability
- Frontend: Verifies React app is serving

## License

This project is open source and available for educational and research purposes.

## Acknowledgments

- Rig Veda texts sourced from vedaweb.uni
- Audio recitations from aasi-archive/rv-audio

---

