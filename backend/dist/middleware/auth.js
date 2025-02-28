"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const http_exception_1 = require("hono/http-exception");
const backend_1 = require("@clerk/backend");
const config_1 = require("../config");
// Initialize Clerk with the secret key
const clerk = (0, backend_1.createClerkClient)({
    secretKey: config_1.CONFIG.CLERK_SECRET_KEY
});
async function authMiddleware(c, next) {
    try {
        // Get the token from the Authorization header
        const authHeader = c.req.header('Authorization');
        console.log('Auth header:', authHeader); // Debug log
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.error('Invalid or missing Authorization header');
            throw new http_exception_1.HTTPException(401, { message: 'Invalid authorization header' });
        }
        const token = authHeader.replace('Bearer ', '');
        console.log('Token extracted:', token.substring(0, 10) + '...'); // Debug log, only show first 10 chars
        try {
            // Use sessions.verifySession instead of jwt.verify
            const session = await clerk.sessions.getSession(token);
            console.log('Session verified:', session ? 'success' : 'failed');
            if (!session || !session.userId) {
                console.error('Invalid session or missing userId');
                throw new http_exception_1.HTTPException(401, { message: 'Invalid session' });
            }
            // Set the verified user ID in the context
            c.set('userId', session.userId);
            console.log('User authenticated:', session.userId);
            // Continue to the next middleware/route handler
            await next();
        }
        catch (verifyError) {
            console.error('Session verification failed:', verifyError);
            throw new http_exception_1.HTTPException(401, { message: 'Invalid session token' });
        }
    }
    catch (error) {
        console.error('Authentication error:', error);
        if (error instanceof http_exception_1.HTTPException) {
            throw error;
        }
        throw new http_exception_1.HTTPException(401, { message: 'Authentication failed' });
    }
}
