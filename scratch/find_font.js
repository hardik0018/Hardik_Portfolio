const fs = require('fs');
const content = fs.readFileSync('app/globals.css', 'utf8');
const lines = content.split('\n');
console.log('Total lines:', lines.length);
lines.forEach((line, i) => {
  if (line.includes('fontshare')) {
    console.log(`Line ${i + 1}: ${line}`);
  }
});
