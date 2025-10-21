// Central config for frontend
// Prefer environment variable when building/deploying
// e.g. set REACT_APP_API_BASE=http://your-domain/api
// export const API_BASE = process.env.REACT_APP_API_BASE || "https://veda_backend.saikesav.me/api";

// API Key for authentication
export const API_KEY = process.env.REACT_APP_API_KEY || "";

// For local network testing: Using laptop's IP address
export const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8008/api";
