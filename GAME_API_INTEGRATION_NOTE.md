# Game API Integration Request - CV Bullet Generation

## To: Backend Developer
## From: Frontend Team
## Date: January 12, 2025
## Subject: AI-Powered CV Bullet Generation for Portfolio Game

---

## Executive Summary

We need to enhance the "Spot the Fake CV" game in Ashar's portfolio by replacing static CV bullets with AI-generated content. This will make the game more engaging, challenging, and scalable while maintaining excellent performance and minimal costs.

**UPDATE: Simplified to temperature-based generation instead of bullet types for better gameplay.**

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
2. **Dynamic Difficulty**: Temperature-based fake bullet generation creates natural progression
3. **Contextual Relevance**: Bullets can be tailored to current PM/tech trends
4. **Scalability**: Easy to expand to other roles (engineering, marketing, etc.)
5. **Better Gameplay**: Removing obvious "fake_subtle" categories makes the game more fun

### Technical Benefits:
1. **Reduced Maintenance**: No need to manually write hundreds of bullets
2. **Better UX**: More challenging and engaging gameplay with less obvious fakes
3. **Analytics**: Can track which AI-generated bullets are hardest to detect
4. **Simplified API**: Single endpoint generates complete question set (3 real + 1 fake)

## Proposed API Endpoints

### Primary Endpoint: `/api/v1/game/generate-cv-bullets`

**UPDATED Request Format:**
```json
POST /api/v1/game/generate-cv-bullets
{
  "real_bullets_count": 3,
  "fake_bullets_count": 1,
  "real_temperature": 0.0,
  "fake_temperature": 0.6,
  "role": "product_manager"
}
```

**UPDATED Response Format:**
```json
{
  "real_bullets": [
    {
      "id": "real_001",
      "text": "Launched 3 key investment instruments including Mutual Funds, IPO, and SGB, improving AUM by 100%",
      "temperature": 0.0,
      "generated_at": "2025-01-12T10:30:00Z"
    }
  ],
  "fake_bullets": [
    {
      "id": "fake_001", 
      "text": "Increased user engagement by 847% through implementation of revolutionary quantum-powered recommendation engine",
      "temperature": 0.6,
      "generated_at": "2025-01-12T10:30:00Z"
    }
  ],
  "metadata": {
    "model": "gemini-2.0-flash",
    "total_tokens": 240,
    "generation_time_ms": 300,
    "cache_duration": 3600
  }
}
```

### Supporting Endpoint: `/api/v1/game/prefetch-bullets`

**Purpose**: Pre-generate bullets during loading screens and background processing for instant retrieval.

**UPDATED Request Format (with Randomization):**
```json
POST /api/v1/game/prefetch-bullets
{
  "session_id": "game_1673539200000",
  "total_questions": 20,
  "buffer_size": 15,
  "role": "product_manager",
  "difficulty_progression": "linear",
  "request_randomization": true,
  "rotation_count": 3,
  "exclude_ids": ["bullet_001", "bullet_047", "bullet_112"]
}
```

**Response Format:**
```json
{
  "success": true,
  "session_id": "game_1673539200000",
  "bullets_generated": 40,
  "buffer_status": "ready",
  "metadata": {
    "generation_time_ms": 1200,
    "cache_duration": 1800,
    "estimated_game_coverage": "100%"
  }
}
```

**UPDATED Backend Implementation Strategy (with Anti-Repetition):**
- Pre-generate bullet sets at various temperature levels (0.5, 0.6, 0.7, 0.8, 0.9, 1.0)
- **Randomization**: Use `request_randomization` flag and `rotation_count` to ensure variety
- **Exclusion Logic**: Skip bullets in `exclude_ids` to prevent immediate repetition
- **Buffer Shuffling**: Randomize order of bullet sets in buffer
- Store in session-specific buffer cache (`cv_bullets_buffer:{session_id}`)
- **Smart Selection**: Backend serves different bullets each time, avoiding recently used ones
- **Variety Tracking**: Keep track of served bullets to maximize diversity

## Optimization Strategy

### 1. Batch Generation
**Current Plan**: Generate 1 bullet per API call (inefficient)
**Optimized Plan**: Generate 5-10 bullets per call

**Benefits:**
- Reduces API overhead
- Better cost efficiency
- Faster total generation time

### 2. IMPLEMENTED: Pre-generation via Prefetch
**Implementation**: Generate bullets during game loading/between questions
**Strategy**:
- ✅ Frontend calls `/api/v1/game/prefetch-bullets` on game start with randomization
- ✅ Backend pre-generates 15+ bullet sets at various temperature levels
- ✅ **Anti-Repetition**: Exclude recently used bullets via `exclude_ids` parameter
- ✅ **Random Selection**: Frontend randomly picks from suitable cached sets
- ✅ **Smart Tracking**: Track used bullet IDs to prevent immediate repetition
- ✅ Store in session-specific buffer (`cv_bullets_buffer:{session_id}`)
- ✅ Instant retrieval when game requests bullets
- ✅ Background refill when buffer runs low (<5 sets remaining) or variety low (<2 unused sets)
- ✅ **Buffer Rotation**: Clear old usage tracking every 3 rotations for maximum variety
- ✅ Non-blocking background prefetch during gameplay

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

### UPDATED Cost Calculation (Gemini 2.0 Flash):
- **Per Game** (20 questions): ~7 API calls = 1,360 tokens total
- **Input Cost**: 160 tokens × $0.075/1M = $0.000012
- **Output Cost**: 1,200 tokens × $0.30/1M = $0.00036
- **Total Cost per Game**: ~$0.000372 (**less than 0.04¢**)
- **Note**: Cost doubled but still negligible, and user experience significantly improved

### Performance Targets:
- **API Response Time**: <500ms per batch
- **Game Loading**: No perceptible delay
- **Buffer Management**: Always have 5+ bullets ready
- **Fallback**: Static bullets if API unavailable

## Technical Implementation Details

### UPDATED Prompt Engineering:
```python
# Temperature-based generation approach
REAL_BULLETS_PROMPT = """Generate realistic, professional CV bullets for a product manager. Focus on:
- Concrete, achievable metrics (10-50% improvements)
- Standard PM responsibilities
- Realistic timelines and scope
- Professional language
Make them 15-25 words each."""

FAKE_BULLETS_PROMPT = """Generate fake CV bullets for a product manager that sound professional but contain subtle inaccuracies. Adjust based on temperature:
- Temperature 0.5-0.6: Slightly inflated metrics, buzzword overuse
- Temperature 0.7-0.8: More obvious exaggerations, impossible timelines  
- Temperature 0.9-1.0: Absurd but humorous achievements
Make them 15-25 words each."""
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

## UPDATED Request for Backend Developer

### Key Changes Made:
1. **Simplified API**: Single endpoint now generates 3 real + 1 fake bullets per call
2. **Removed Bullet Types**: No more "fake_subtle" categorization - use temperature instead
3. **Temperature Control**: Real bullets at temp 0.0, fake bullets at temp 0.5+ based on game difficulty
4. **Role Parameter**: Currently hardcoded to "product_manager" (future: dropdown for different roles)
5. **Better UX**: Less obvious fake bullets make the game more challenging and fun

### Please Verify:
1. **New API Format**: Can you implement the updated request/response format?
2. **Temperature Logic**: Use temperature to control fake bullet obviousness (0.5=subtle, 1.0=absurd)
3. **Role Support**: Currently using "product_manager" - plan for future roles (software_engineer, designer, etc.)
4. **Cost Estimates**: Updated calculations show ~0.04¢ per game (still negligible)
5. **Performance**: Target instant retrieval via prefetch buffer, <500ms fallback generation
6. **Prefetch Buffer**: Implement session-specific buffer cache for pre-generated bullet sets
7. **Caching**: Cache complete sets of 4 bullets rather than individual types

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