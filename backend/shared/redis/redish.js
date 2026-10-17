import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);
//events
// connect
redis.on('connect', () => {
  console.log('Redis connected');
});

// error
redis.on('error', (err) => {
  console.error('Redis error:', err);
});

export default redis;