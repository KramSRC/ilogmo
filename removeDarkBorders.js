const fs = require('fs');
const path = require('path');

const dirsToScan = ['app', 'components', 'features'];
const extensions = ['.tsx', '.ts'];

const replacements = [
  // Replace the card borders with transparent in dark mode
  { regex: /border border-neutral-200 dark:border-neutral-800/g, replace: 'border border-neutral-200 dark:border-transparent' },
  { regex: /border-neutral-200 dark:border-neutral-800/g, replace: 'border-neutral-200 dark:border-transparent' }
];

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDir(fullPath);
    } else if (extensions.includes(path.extname(fullPath))) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      for (const { regex, replace } of replacements) {
        content = content.replace(regex, replace);
      }
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Updated:', fullPath);
      }
    }
  }
}

for (const dir of dirsToScan) {
  if (fs.existsSync(dir)) {
    processDir(dir);
  }
}
