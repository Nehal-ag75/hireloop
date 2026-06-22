// server/diagnoseFrontend.js
// Run from server/ folder to check what's actually registered
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const serverJs = fs.readFileSync(path.join(process.cwd(), 'server.js'), 'utf8');
console.log('=== server.js (full) ===');
console.log(serverJs);

console.log('\n=== routes/ directory ===');
const routes = fs.readdirSync(path.join(process.cwd(), 'routes'));
console.log(routes);

// Check if api/axios.js exists in client
const axiosPath = path.join(process.cwd(), '..', 'client', 'src', 'api', 'axios.js');
console.log('\n=== client/src/api/axios.js ===');
if (fs.existsSync(axiosPath)) {
  console.log(fs.readFileSync(axiosPath, 'utf8'));
} else {
  console.log('FILE NOT FOUND — this is the bug if frontend imports from here');
}

// Check App.jsx routes
const appPath = path.join(process.cwd(), '..', 'client', 'src', 'App.jsx');
console.log('\n=== client/src/App.jsx ===');
if (fs.existsSync(appPath)) console.log(fs.readFileSync(appPath, 'utf8'));
else console.log('NOT FOUND');

// Check Problems.jsx current state
const probPath = path.join(process.cwd(), '..', 'client', 'src', 'pages', 'Problems.jsx');
console.log('\n=== client/src/pages/Problems.jsx (first 30 lines) ===');
if (fs.existsSync(probPath)) {
  console.log(fs.readFileSync(probPath, 'utf8').split('\n').slice(0,30).join('\n'));
} else console.log('NOT FOUND');

// Check Roadmap.jsx current state
const roadPath = path.join(process.cwd(), '..', 'client', 'src', 'pages', 'Roadmap.jsx');
console.log('\n=== client/src/pages/Roadmap.jsx (first 30 lines) ===');
if (fs.existsSync(roadPath)) {
  console.log(fs.readFileSync(roadPath, 'utf8').split('\n').slice(0,30).join('\n'));
} else console.log('NOT FOUND');