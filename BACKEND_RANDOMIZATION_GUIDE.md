# Backend Anti-Repetition Implementation Guide

## Overview
The frontend now sends randomization parameters to prevent bullet repetition. This guide shows how to implement the anti-repetition logic on the backend.

---

## 1. Updated API Endpoints

### `/api/v1/game/prefetch-bullets` - Enhanced Parameters

**New Request Parameters:**
```json
{
  "session_id": "game_1673539200000",
  "total_questions": 20,
  "buffer_size": 15,
  "role": "product_manager",
  "difficulty_progression": "linear",
  "request_randomization": true,   // NEW: Signal to randomize generation
  "rotation_count": 3,             // NEW: Buffer rotation counter
  "exclude_ids": ["bullet_001"],   // NEW: Recently used bullet IDs to exclude
  "session_progress": 0.25         // NEW: Game progress (0.0-1.0) for adaptive sizing
}
```

### `/api/v1/game/generate-cv-bullets` - No Changes
This endpoint remains the same but should serve from the randomized buffer when available.

---

## 2. Backend Implementation Strategy

### **Step 1: Buffer Key Structure**
```python
# Cache keys for session-specific buffers
BUFFER_KEY = f"cv_bullets_buffer:{session_id}"
USED_IDS_KEY = f"cv_bullets_used:{session_id}"

# Example structure
{
  "cv_bullets_buffer:game_123": [
    {
      "temperature": 0.6,
      "real_bullets": [...],
      "fake_bullets": [...],
      "generated_at": "2025-01-12T10:30:00Z",
      "bullet_ids": ["real_001", "real_002", "fake_001"]
    }
  ]
}
```

### **Step 2: Prefetch Implementation**
```python
async def prefetch_bullets(request_data):
    session_id = request_data["session_id"]
    buffer_size = request_data["buffer_size"]
    exclude_ids = set(request_data.get("exclude_ids", []))
    session_progress = request_data.get("session_progress", 0.0)
    
    # Use current timestamp + rotation for true randomization
    if request_data.get("request_randomization", True):
        random.seed(int(time.time()) + request_data.get("rotation_count", 1))
    
    # Adaptive buffer sizing based on session progress
    # Frontend sends adaptive buffer_size, but backend can further optimize
    if session_progress < 0.2:
        # Early game: Generate extra variety for maximum freshness
        generation_multiplier = 1.5
    elif session_progress > 0.8:
        # Late game: Reduce generation to save resources
        generation_multiplier = 0.8
    else:
        generation_multiplier = 1.0
    
    effective_buffer_size = int(buffer_size * generation_multiplier)
    
    bullet_sets = []
    temperature_levels = [0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
    
    for temp in temperature_levels:
        for _ in range(effective_buffer_size // len(temperature_levels) + 1):
            # Generate bullets with exclusion logic
            real_bullets = await generate_real_bullets(
                count=3, 
                exclude_ids=exclude_ids
            )
            fake_bullets = await generate_fake_bullets(
                count=1, 
                temperature=temp,
                exclude_ids=exclude_ids
            )
            
            # Create bullet set
            bullet_set = {
                "temperature": temp,
                "real_bullets": real_bullets,
                "fake_bullets": fake_bullets,
                "generated_at": datetime.utcnow().isoformat(),
                "bullet_ids": [b["id"] for b in real_bullets + fake_bullets]
            }
            
            bullet_sets.append(bullet_set)
    
    # Shuffle the entire buffer for randomization
    random.shuffle(bullet_sets)
    
    # Store in cache with 30-minute expiry
    await redis.setex(
        f"cv_bullets_buffer:{session_id}", 
        1800, 
        json.dumps(bullet_sets)
    )
    
    return {
        "success": True,
        "session_id": session_id,
        "bullets_generated": len(bullet_sets) * 4,
        "buffer_status": "ready",
        "session_progress": session_progress,
        "adaptive_buffer_size": effective_buffer_size,
        "prefetch_strategy": "aggressive" if session_progress < 0.3 else "conservative"
    }
```

### **Step 3: Enhanced Bullet Generation with Exclusion**
```python
async def generate_real_bullets(count=3, exclude_ids=None):
    exclude_ids = exclude_ids or set()
    
    # Your existing real bullet generation logic
    bullets = await ai_model.generate(
        prompt="Generate realistic product manager CV bullets...",
        temperature=0.0,
        count=count * 2  # Generate extra for filtering
    )
    
    # Filter out excluded bullets
    filtered_bullets = []
    for bullet in bullets:
        # Skip if bullet ID or content hash is in exclude list
        bullet_hash = hashlib.md5(bullet["text"].encode()).hexdigest()[:8]
        if bullet["id"] not in exclude_ids and bullet_hash not in exclude_ids:
            filtered_bullets.append(bullet)
            
        if len(filtered_bullets) >= count:
            break
    
    return filtered_bullets[:count]

async def generate_fake_bullets(count=1, temperature=0.6, exclude_ids=None):
    exclude_ids = exclude_ids or set()
    
    # Your existing fake bullet generation logic
    bullets = await ai_model.generate(
        prompt="Generate fake product manager CV bullets...",
        temperature=temperature,
        count=count * 3  # Generate extra for filtering
    )
    
    # Filter out excluded bullets (same logic as real bullets)
    filtered_bullets = []
    for bullet in bullets:
        bullet_hash = hashlib.md5(bullet["text"].encode()).hexdigest()[:8]
        if bullet["id"] not in exclude_ids and bullet_hash not in exclude_ids:
            filtered_bullets.append(bullet)
            
        if len(filtered_bullets) >= count:
            break
    
    return filtered_bullets[:count]
```

### **Step 4: Serving from Buffer**
```python
async def generate_cv_bullets(request_data):
    session_id = extract_session_from_request()  # From headers or generate
    
    # Try to serve from buffer first
    buffer_data = await redis.get(f"cv_bullets_buffer:{session_id}")
    
    if buffer_data:
        bullet_sets = json.loads(buffer_data)
        
        # Find suitable temperature match
        requested_temp = calculate_temperature_from_request(request_data)
        
        suitable_sets = [
            s for s in bullet_sets 
            if abs(s["temperature"] - requested_temp) < 0.1
        ]
        
        if suitable_sets:
            # Random selection from suitable sets
            selected_set = random.choice(suitable_sets)
            
            # Remove from buffer to prevent reuse
            bullet_sets.remove(selected_set)
            await redis.setex(
                f"cv_bullets_buffer:{session_id}",
                1800,
                json.dumps(bullet_sets)
            )
            
            # Track used bullet IDs
            used_ids = selected_set["bullet_ids"]
            await redis.sadd(f"cv_bullets_used:{session_id}", *used_ids)
            await redis.expire(f"cv_bullets_used:{session_id}", 1800)
            
            return {
                "real_bullets": selected_set["real_bullets"],
                "fake_bullets": selected_set["fake_bullets"],
                "metadata": {
                    "source": "buffer",
                    "temperature": selected_set["temperature"]
                }
            }
    
    # Fallback to regular generation if buffer empty
    return await generate_bullets_on_demand(request_data)
```

---

## 3. Testing the Implementation

### **Test Case 1: Basic Prefetch**
```bash
curl -X POST localhost:8000/api/v1/game/prefetch-bullets \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "test_123",
    "buffer_size": 15,
    "role": "product_manager",
    "random_seed": "test_seed"
  }'
```

### **Test Case 2: Prefetch with Exclusions**
```bash
curl -X POST localhost:8000/api/v1/game/prefetch-bullets \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "test_123",
    "buffer_size": 15,
    "role": "product_manager",
    "request_randomization": true,
    "rotation_count": 2,
    "exclude_ids": ["bullet_001", "bullet_023"],
    "session_progress": 0.15
  }'
```

### **Test Case 3: Verify Buffer Usage**
```bash
# This should return different bullets each time
curl -X POST localhost:8000/api/v1/game/generate-cv-bullets \
  -H "Content-Type: application/json" \
  -H "X-Session-ID: test_123" \
  -d '{
    "real_bullets_count": 3,
    "fake_bullets_count": 1,
    "real_temperature": 0.0,
    "fake_temperature": 0.6,
    "role": "product_manager"
  }'
```

---

## 4. Performance Considerations

### **Memory Management**
- Set Redis TTL to 30 minutes for buffer keys
- Limit `exclude_ids` to maximum 100 items
- Use Redis sets for efficient exclusion checking

### **Generation Efficiency**
- Generate 2-3x requested bullets for better filtering options
- Use bullet content hashing as backup exclusion method
- Implement retry logic if not enough unique bullets generated

### **Monitoring**
- Track buffer hit/miss rates
- Monitor excluded bullet counts
- Alert if generation consistently fails due to too many exclusions

---

## 5. Expected Frontend Behavior

1. **Game Start**: Frontend calls prefetch with `random_seed`
2. **Question Generation**: Frontend gets instant response from buffer
3. **Buffer Low**: Frontend triggers background prefetch with `exclude_ids`
4. **Rotation**: Every 3 prefetches, frontend clears some exclusions

---

## 6. Quick Implementation Checklist

- [ ] Add new parameters to prefetch endpoint
- [ ] Implement exclusion logic in bullet generation
- [ ] Add buffer storage with Redis/memory cache
- [ ] Implement random selection from buffer
- [ ] Add used bullet ID tracking
- [ ] Test with multiple consecutive requests
- [ ] Verify no immediate repetition occurs
- [ ] Monitor performance and memory usage

---

**Priority**: High - This prevents user experience issues with repetitive content
**Estimated Time**: 4-6 hours implementation + testing
**Dependencies**: Redis/cache system, existing bullet generation logic