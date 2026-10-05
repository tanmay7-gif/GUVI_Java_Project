# FitPulse Database Schema Specification

## Entity Relationship Overview

```
+------------------+         +------------------+
|      users       |<--------|   workout_logs   |
+------------------+    1:N  +------------------+
         |
         | 1:N
         v
+------------------+    N:1  +---------------------+
|  user_challenges |-------->|  fitness_challenges |
+------------------+         +---------------------+
         |
         | 1:N
         v
+------------------+
| fitness_contents |
+------------------+
```

## Key Constraints & Indexes
1. `users.email`: Unique constraint and B-tree index for O(1) login lookups.
2. `workout_logs`: Composite indexes on `(user_id, logged_at)` for high-speed rolling 7-day aggregation.
3. `user_challenges`: Compound unique constraint `(user_id, challenge_id)` preventing duplicate enrollment in the same event.
4. `system_settings`: Key-value configuration store with unique `setting_key`.
