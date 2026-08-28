const fs = require('fs');
const path = require('path');

const dirsToScan = ['app', 'components', 'features'];
const extensions = ['.tsx', '.ts'];

const replacements = [
  // Backgrounds
  { regex: /bg-background-app(?! dark:bg-neutral-950)/g, replace: 'bg-background-app dark:bg-neutral-950' },
  { regex: /bg-white(?! dark:bg-neutral-900)/g, replace: 'bg-white dark:bg-neutral-900' },
  { regex: /bg-neutral-50(?! dark:bg-neutral-900)/g, replace: 'bg-neutral-50 dark:bg-neutral-900' },
  
  // Text colors
  { regex: /text-neutral-900(?! dark:text-neutral-100)/g, replace: 'text-neutral-900 dark:text-neutral-100' },
  { regex: /text-neutral-800(?! dark:text-neutral-200)/g, replace: 'text-neutral-800 dark:text-neutral-200' },
  { regex: /text-neutral-700(?! dark:text-neutral-300)/g, replace: 'text-neutral-700 dark:text-neutral-300' },
  { regex: /text-neutral-600(?! dark:text-neutral-400)/g, replace: 'text-neutral-600 dark:text-neutral-400' },
  { regex: /text-neutral-500(?! dark:text-neutral-400)/g, replace: 'text-neutral-500 dark:text-neutral-400' },
  
  // Borders
  { regex: /border-neutral-100(?! dark:border-neutral-800)/g, replace: 'border-neutral-100 dark:border-neutral-800' },
  { regex: /border-neutral-200(?! dark:border-neutral-800)/g, replace: 'border-neutral-200 dark:border-neutral-800' },
  { regex: /border-neutral-300(?! dark:border-neutral-700)/g, replace: 'border-neutral-300 dark:border-neutral-700' },
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
