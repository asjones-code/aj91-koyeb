/**
 * Serverless function endpoint for Vercel/Netlify
 * For Koyeb, use functions/writing-feed.js directly
 */

// Re-export from functions directory
export { expressHandler as default, expressHandler as handler } from "../functions/writing-feed.js";
