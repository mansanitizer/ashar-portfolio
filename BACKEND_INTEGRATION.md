# Backend Integration Documentation

## Overview
This document provides comprehensive guidance for integrating the FastAPI backend with the Vite-powered frontend portfolio.

## Architecture Overview

```
Frontend (Netlify)     Backend (Google Cloud Run)
├── Vite Build System  ├── FastAPI Application
├── Environment Config ├── API Endpoints
├── API Client         ├── Authentication
└── PostHog Analytics  └── Rate Limiting
```

## Required Backend Endpoints

### 1. Health Check
```python
@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}
```

### 2. Contact Form Submission
```python
@app.post("/api/contact")
async def submit_contact(contact_data: ContactSchema):
    # Expected payload:
    # {
    #   "contact": "email@example.com" or "+1234567890",
    #   "type": "email" or "phone",
    #   "timestamp": "2025-01-01T00:00:00Z",
    #   "source": "portfolio" or "game",
    #   "user_agent": "Mozilla/5.0...",
    #   "theme": "dark" or "light",
    #   "accent_color": "#0066FF"
    # }
    return {"success": True, "message": "Contact received"}
```

### 3. AI Content Generation (Future Feature)
```python
@app.post("/api/ai/generate")
async def generate_ai_content(request: AIGenerationRequest):
    # Expected payload:
    # {
    #   "prompt": "Generate a fake CV bullet point",
    #   "temperature": 0.7,
    #   "max_tokens": 100,
    #   "model": "gpt-3.5-turbo"
    # }
    return {"content": "Generated AI content", "model_used": "gpt-3.5-turbo"}
```

### 4. Game Score Submission
```python
@app.post("/api/game/score")
async def submit_game_score(score_data: GameScoreSchema):
    # Expected payload:
    # {
    #   "score": 850,
    #   "accuracy": 85.5,
    #   "time_played": 120,
    #   "level_reached": 3,
    #   "questions_answered": 20,
    #   "session_id": "uuid-string"
    # }
    return {"success": True, "leaderboard_position": 42}
```

### 5. Custom Analytics
```python
@app.post("/api/analytics")
async def submit_analytics(event_data: AnalyticsSchema):
    # Expected payload:
    # {
    #   "event_name": "portfolio_interaction",
    #   "properties": {
    #     "action": "theme_change",
    #     "theme": "dark",
    #     "user_id": "anonymous"
    #   },
    #   "timestamp": "2025-01-01T00:00:00Z"
    # }
    return {"success": True, "processed": True}
```

## Authentication & Security

### API Key Authentication
```python
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

async def verify_api_key(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if credentials.credentials != os.getenv("API_KEY"):
        raise HTTPException(status_code=401, detail="Invalid API key")
    return credentials.credentials
```

### CORS Configuration
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-portfolio.netlify.app",
        "http://localhost:3000",  # For development
        "http://127.0.0.1:3000"   # For development
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)
```

### Rate Limiting
```python
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.post("/api/contact")
@limiter.limit("5/minute")  # 5 requests per minute per IP
async def submit_contact(request: Request, contact_data: ContactSchema):
    # Implementation
    pass
```

## Environment Variables

### Required Environment Variables
```bash
# API Configuration
API_KEY=your-secure-api-key-here
DATABASE_URL=postgresql://user:pass@host:port/db

# CORS Settings
FRONTEND_URL=https://your-portfolio.netlify.app
ALLOWED_ORIGINS=https://your-portfolio.netlify.app,http://localhost:3000

# AI Integration (if using)
OPENAI_API_KEY=sk-your-openai-key
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key

# Email Configuration (for contact form)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Monitoring
SENTRY_DSN=https://your-sentry-dsn
LOG_LEVEL=INFO
```

## Data Schemas

### ContactSchema
```python
from pydantic import BaseModel, EmailStr
from typing import Literal

class ContactSchema(BaseModel):
    contact: str
    type: Literal["email", "phone"]
    timestamp: str
    source: Literal["portfolio", "game"]
    user_agent: str
    theme: Literal["dark", "light"]
    accent_color: str
```

### GameScoreSchema
```python
class GameScoreSchema(BaseModel):
    score: int
    accuracy: float
    time_played: int
    level_reached: int
    questions_answered: int
    session_id: str
    timestamp: str
```

### AIGenerationRequest
```python
class AIGenerationRequest(BaseModel):
    prompt: str
    temperature: float = 0.7
    max_tokens: int = 100
    model: str = "gpt-3.5-turbo"
```

## Frontend Integration Points

### API Client Configuration
The frontend includes a pre-configured API client (`src/utils/api.js`) that handles:
- Authentication headers
- Request/response logging
- Error handling
- Rate limiting awareness

### Environment Variables (Frontend)
```env
# API Configuration
VITE_API_BASE_URL=https://your-backend.run.app
VITE_API_KEY=your-api-key-here

# PostHog Analytics
VITE_POSTHOG_KEY=phc_HLkBqAzWm6tU5qx5mLXF0ypPuD2NEJk51XjnHPQF6Ii
VITE_POSTHOG_HOST=https://us.posthog.com
```

## Error Handling

### Standard Error Responses
```python
from fastapi import HTTPException

# 400 Bad Request
raise HTTPException(status_code=400, detail="Invalid request data")

# 401 Unauthorized
raise HTTPException(status_code=401, detail="Invalid API key")

# 403 Forbidden
raise HTTPException(status_code=403, detail="Access denied")

# 404 Not Found
raise HTTPException(status_code=404, detail="Endpoint not found")

# 429 Too Many Requests
raise HTTPException(status_code=429, detail="Rate limit exceeded")

# 500 Internal Server Error
raise HTTPException(status_code=500, detail="Internal server error")
```

### Frontend Error Handling
The frontend API client automatically handles:
- Network errors
- Authentication errors
- Rate limiting errors
- Server errors

## Testing

### Backend Testing
```python
import pytest
from fastapi.testclient import TestClient

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_contact_submission():
    payload = {
        "contact": "test@example.com",
        "type": "email",
        "timestamp": "2025-01-01T00:00:00Z",
        "source": "portfolio",
        "user_agent": "test",
        "theme": "dark",
        "accent_color": "#0066FF"
    }
    response = client.post("/api/contact", json=payload)
    assert response.status_code == 200
```

### Frontend Testing
```bash
# Test API connectivity
npm run dev
# Navigate to http://localhost:3000
# Check browser console for API status logs
```

## Deployment

### Google Cloud Run Deployment
```yaml
# cloudbuild.yaml
steps:
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/portfolio-backend', '.']
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/portfolio-backend']
  - name: 'gcr.io/cloud-builders/gcloud'
    args: [
      'run', 'deploy', 'portfolio-backend',
      '--image', 'gcr.io/$PROJECT_ID/portfolio-backend',
      '--region', 'us-central1',
      '--platform', 'managed',
      '--allow-unauthenticated'
    ]
```

### Dockerfile
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
```

## Monitoring & Logging

### Structured Logging
```python
import logging
import structlog

structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.JSONRenderer()
    ],
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    wrapper_class=structlog.stdlib.BoundLogger,
    cache_logger_on_first_use=True,
)

logger = structlog.get_logger()
```

### Health Monitoring
```python
@app.get("/api/health")
async def health_check():
    # Check database connectivity
    # Check external API availability
    # Check system resources
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0",
        "checks": {
            "database": "healthy",
            "external_apis": "healthy",
            "memory": "healthy"
        }
    }
```

## Security Best Practices

1. **API Key Rotation**: Implement regular API key rotation
2. **Input Validation**: Validate all incoming data
3. **Rate Limiting**: Implement per-endpoint rate limiting
4. **HTTPS Only**: Ensure all communication is encrypted
5. **Error Handling**: Don't expose sensitive information in errors
6. **Logging**: Log all API requests for monitoring
7. **CORS**: Restrict origins to known domains only

## Future Enhancements

1. **WebSocket Integration**: Real-time features
2. **Database Integration**: User profiles and preferences
3. **Caching**: Redis for performance optimization
4. **Queue System**: Background task processing
5. **Analytics Dashboard**: Backend analytics interface
6. **A/B Testing**: Experiment framework
7. **Content Management**: Dynamic content updates

## Contact & Support

For questions about this integration, please contact:
- **Frontend Developer**: [Your contact]
- **Backend Developer**: [Backend dev contact]
- **Documentation**: This file and inline code comments