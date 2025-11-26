const cluster = require('cluster');
const os = require('os');

const cpuCount = os.cpus().length;

console.log(`The total number of CPUs is ${cpuCount}`);
console.log(`Primary pid=${process.pid}`);
cluster.setupMaster({
  exec: 'dist/main.js',
  args: ['--use', 'http'],
});


for (let i = 0; i < 2; i++) {
  cluster.fork({ FORK: i });
}
cluster.on('exit', (worker, code, signal) => {
  console.log(`worker ${worker.process.pid} has been killed`);
  console.log('Starting another worker');
  cluster.fork();
});