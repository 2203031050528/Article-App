import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { createClerkClient } from '@clerk/backend';
import { CONFIG } from '../config';

// Initialize Clerk with the secret key
const clerk = createClerkClient({ secretKey: CONFIG.CLERK_SECRET_KEY });

export async function authMiddleware(c: Context, next: () => Promise<void>) {
  try {
    const token = c.req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      console.error('No token provided');
      throw new HTTPException(401, { message: 'Unauthorized - No token provided' });
    }

    try {
      // Verify the JWT token with Clerk
      const decoded = await clerk.verifyToken(token);
      if (!decoded) {
        throw new Error('Token verification failed');
      }
      
      // Set the user ID from the decoded token
      c.set('userId', decoded.sub);
      console.log('Auth successful for user:', decoded.sub);
      
      await next();
    } catch (error) {
      console.error('Token verification failed:', error);
      throw new HTTPException(401, { message: 'Invalid token' });
    }
  } catch (error) {
    console.error('Auth error:', error);
    throw new HTTPException(401, { message: 'Unauthorized' });
  }
} 