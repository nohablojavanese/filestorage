import Redis from 'ioredis';


const redis = new Redis("rediss://default:Acx_AAIjcDFmMTc1NzlkMTU0Njk0ZjBmYjNkNzM1NzkxNDJkMDI5ZXAxMA@shining-bison-52351.upstash.io:6379");;

export async function rateLimit(ip: string): Promise<{ success: boolean; remainingAttempts: number }> {
  const key = `Login_Attempts:${ip}`;
  const limit = 10;
  const windowInSeconds = 3600; // 1 hour

  const attempts = await redis.incr(key);
  if (attempts === 1) {
    await redis.expire(key, windowInSeconds);
  }

  const remainingAttempts = Math.max(0, limit - attempts);

  if (attempts > limit) {
    return { success: false, remainingAttempts };
  }

  return { success: true, remainingAttempts };
}

export async function resetRateLimit(ip: string): Promise<void> {
  const key = `login_attempts:${ip}`;
  await redis.del(key);
}