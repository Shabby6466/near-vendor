// NOTE: Cluster mode caused unstable restarts in Docker (workers exiting repeatedly).
// For MVP we run a single process for stability.
// Later (with migrations + proper readiness/health), we can re-introduce clustering safely.

require('./dist/main.js');
