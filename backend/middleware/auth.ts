import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { createClerkClient } from '@clerk/backend';
import { CONFIG } from '../config';

// Initialize Clerk with the secret key
const clerk = createClerkClient({ secretKey: CONFIG.CLERK_SECRET_KEY });

export async function authMiddleware(c: Context, next: () => Promise<void>) {
  try {
    const sessionToken = c.req.header('Authorization')?.replace('Bearer ', '');
    
    if (!sessionToken) {
      throw new HTTPException(401, { message: 'Unauthorized' });
    }

    // Verify the session token
    const session = await clerk.sessions.verifySession(sessionToken);
    c.set('userId', session.userId);
    
    await next();
  } catch (error) {
    throw new HTTPException(401, { message: 'Unauthorized' });
  }
} 