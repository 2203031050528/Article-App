"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const http_exception_1 = require("hono/http-exception");
const backend_1 = require("@clerk/backend");
const config_1 = require("../config");
// Initialize Clerk with the secret key
const clerk = (0, backend_1.createClerkClient)({ secretKey: config_1.CONFIG.CLERK_SECRET_KEY });
async function authMiddleware(c, next) {
    try {
        const sessionToken = c.req.header('Authorization')?.replace('Bearer ', '');
        if (!sessionToken) {
            throw new http_exception_1.HTTPException(401, { message: 'Unauthorized' });
        }
        // Verify the session token
        const session = await clerk.sessions.verifySession(sessionToken);
        c.set('userId', session.userId);
        await next();
    }
    catch (error) {
        throw new http_exception_1.HTTPException(401, { message: 'Unauthorized' });
    }
}
