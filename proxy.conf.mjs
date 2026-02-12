const backendTarget = process.env.BACKEND_URL || 'http://127.0.0.1:8080';

console.log(`[proxy] Using backend target: ${backendTarget}`);

export default {
  '/api': {
    target: backendTarget,
    secure: false,
    changeOrigin: true,
    logLevel: 'debug'
  },
  '/auth': {
    target: backendTarget,
    secure: false,
    changeOrigin: true,
    logLevel: 'debug'
  }
};
