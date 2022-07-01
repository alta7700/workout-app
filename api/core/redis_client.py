from aioredis import Redis

import settings


redis = Redis(**settings.REDIS_CONNECTION)
redis.connection.check_health()
