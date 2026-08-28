const fs = require('fs');
const path = require('path');

const dirsToScan = ['app', 'components', 'features'];
const extensions = ['.tsx', '.ts'];

const replacements = [
  // Append dark:shadow-none to any class containing shadow-card, shadow-soft-sm, shadow-soft-md, shadow-button
  { regex: /shadow-card(?! dark:shadow-none)/g, replace: 'shadow-card dark:shadow-none' },
  { regex: /shadow-soft-sm(?! dark:shadow-none)/g, replace: 'shadow-soft-sm dark:shadow-none' },
  { regex: /shadow-soft-md(?! dark:shadow-none)/g, replace: 'shadow-soft-md dark:shadow-none' },
  { regex: /shadow-button(?! dark:shadow-none)/g, replace: 'shadow-button dark:shadow-none' },
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
