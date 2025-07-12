# Game API Integration Request - CV Bullet Generation

## To: Backend Developer
## From: Frontend Team
## Date: January 12, 2025
## Subject: AI-Powered CV Bullet Generation for Portfolio Game

---

## Executive Summary

We need to enhance the "Spot the Fake CV" game in Ashar's portfolio by replacing static CV bullets with AI-generated content. This will make the game more engaging, challenging, and scalable while maintaining excellent performance and minimal costs.

## Current Game Mechanics

**Game Overview:**
- Interactive quiz game: "Spot the Fake CV"
- 20 questions per round
- Each question shows 4 CV bullet points (3 real + 1 fake)
- Player must identify the fake bullet
- Progressive difficulty (fake bullets become more believable)

**Current Implementation:**
- Static database of pre-written bullets in 3 categories:
  - `professional` (realistic, high-quality bullets)
  - `inflated` (slightly exaggerated but believable)
  - `absurd` (obviously fake, humorous bullets)
- Random selection with temperature-based difficulty scaling

## Why AI Generation?

### Business Benefits:
1. **Infinite Content**: No repetition, fresh experience every game
2. **Dynamic Difficulty**: AI can generate progressively subtle fake bullets
3. **Contextual Relevance**: Bullets can be tailored to current PM/tech trends
4. **Scalability**: Easy to expand to other roles (engineering, marketing, etc.)

### Technical Benefits:
1. **Reduced Maintenance**: No need to manually write hundreds of bullets
2. **Better UX**: More challenging and engaging gameplay
3. **Analytics**: Can track which AI-generated bullets are hardest to detect

## Proposed API Endpoints

### Primary Endpoint: `/api/v1/game/generate-cv-bullets`

**Request Format:**
```json
POST /api/v1/game/generate-cv-bullets
{
  "count": 10,
  "bullet_type": "fake_subtle",
  "difficulty_level": 0.6,
  "role": "product_manager",
  "batch_id": "game_session_123"
}
```

**Response Format:**
```json
{
  "bullets": [
    {
      "id": "bullet_001",
      "text": "Increased user engagement by 847% through implementation of revolutionary AI-powered recommendation engine",
      "type": "fake_subtle",
      "difficulty": 0.6,
      "generated_at": "2025-01-12T10:30:00Z"
    }
  ],
  "metadata": {
    "model": "gemini-2.0-flash",
    "total_tokens": 180,
    "generation_time_ms": 250,
    "cache_duration": 3600
  }
}
```

### Supporting Endpoint: `/api/v1/game/prefetch-bullets`

For pre-generation during loading screens.

## Optimization Strategy

### 1. Batch Generation
**Current Plan**: Generate 1 bullet per API call (inefficient)
**Optimized Plan**: Generate 5-10 bullets per call

**Benefits:**
- Reduces API overhead
- Better cost efficiency
- Faster total generation time

### 2. Pre-generation
**Implementation**: Generate bullets during game loading/between questions
**Strategy**:
- Start generating next batch while current question is being answered
- Maintain buffer of 10-20 pre-generated bullets
- Refill buffer asynchronously

### 3. Caching Strategy
**Session Cache**: Store generated bullets for current game session
**Global Cache**: Cache by difficulty level and type (Redis/memory)
**Cache Duration**: 1-6 hours depending on type

**Cache Key Structure:**
```
game:bullets:{type}:{difficulty}:{role}:{timestamp_hour}
```

## Cost & Performance Analysis

### Token Usage (Optimized):
```
System Prompt: "Generate 10 fake CV bullets for a product manager. Make them believable but with subtle inaccuracies."
- Input: ~40 tokens
- Output: ~300 tokens (10 bullets × 30 tokens each)
- Total per batch: ~340 tokens
```

### Cost Calculation (Gemini 2.0 Flash):
- **Per Game** (20 questions): 2 batches = 680 tokens total
- **Input Cost**: 80 tokens × $0.075/1M = $0.000006
- **Output Cost**: 600 tokens × $0.30/1M = $0.00018
- **Total Cost per Game**: ~$0.000186 (**less than 0.02¢**)

### Performance Targets:
- **API Response Time**: <500ms per batch
- **Game Loading**: No perceptible delay
- **Buffer Management**: Always have 5+ bullets ready
- **Fallback**: Static bullets if API unavailable

## Technical Implementation Details

### Prompt Engineering:
```python
SYSTEM_PROMPTS = {
    "fake_subtle": """Generate fake CV bullets for a product manager that sound realistic but contain subtle inaccuracies. Focus on:
    - Slightly inflated metrics (believable but suspicious)
    - Buzzword overuse
    - Vague achievements
    - Impossible timelines
    Make them 15-25 words each.""",
    
    "fake_obvious": """Generate obviously fake CV bullets that are humorous but not offensive. Include:
    - Ridiculous metrics (500% improvements)
    - Impossible achievements
    - Absurd responsibilities
    Make them 15-25 words each."""
}
```

### Caching Logic:
```python
async def get_cv_bullets(count: int, bullet_type: str, difficulty: float):
    cache_key = f"bullets:{bullet_type}:{difficulty}"
    
    # Check cache first
    cached = await redis.get(cache_key)
    if cached and len(cached) >= count:
        return random.sample(cached, count)
    
    # Generate new batch
    new_bullets = await generate_with_ai(count * 2, bullet_type, difficulty)
    
    # Update cache
    await redis.setex(cache_key, 3600, new_bullets)
    
    return new_bullets[:count]
```

## Request for Backend Developer

### Please Verify:
1. **Feasibility**: Can you implement this with current infrastructure?
2. **Cost Estimates**: Do our token/cost calculations look correct?
3. **Performance**: Can we achieve <500ms response times?
4. **Caching**: What's the best caching strategy for our setup?
5. **Rate Limits**: Any concerns with Gemini API rate limits?

### Timeline Questions:
1. How long would this take to implement?
2. Should we implement in phases (basic → optimized)?
3. Any infrastructure changes needed?

### Technical Concerns:
1. Error handling strategy for API failures?
2. Monitoring/alerting for generation quality?
3. Content filtering for inappropriate generated content?

## Next Steps

1. **Backend Review**: Please review and provide feedback
2. **Prototype**: Start with basic endpoint, optimize later
3. **Testing**: A/B test AI vs static bullets for engagement
4. **Monitoring**: Track costs, performance, and user feedback

---

**Contact**: Frontend team available for clarification on game mechanics or technical requirements.

**Priority**: Medium-High (game enhancement, not critical path)

**Dependencies**: None - can implement alongside existing static system as fallback