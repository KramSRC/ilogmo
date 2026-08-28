const fs = require('fs');
const path = require('path');

const dirsToScan = ['app', 'components', 'features'];
const extensions = ['.tsx', '.ts'];

const replacements = [
  // Backgrounds
  { regex: /bg-background-app(?! dark:bg-neutral-950)/g, replace: 'bg-background-app dark:bg-neutral-950' },
  { regex: /bg-white(?! dark:bg-neutral-900)/g, replace: 'bg-white dark:bg-neutral-900' },
  { regex: /bg-neutral-50(?! dark:bg-neutral-900)/g, replace: 'bg-neutral-50 dark:bg-neutral-900' },
  { regex: /bg-neutral-100(?! dark:bg-neutral-800)/g, replace: 'bg-neutral-100 dark:bg-neutral-800' },
  
  // Alert backgrounds
  { regex: /bg-blue-50(?! dark:bg-blue-900\/40)/g, replace: 'bg-blue-50 dark:bg-blue-900/40' },
  { regex: /bg-amber-50(?! dark:bg-amber-900\/40)/g, replace: 'bg-amber-50 dark:bg-amber-900/40' },
  { regex: /bg-red-50(?! dark:bg-red-900\/40)/g, replace: 'bg-red-50 dark:bg-red-900/40' },
  { regex: /bg-emerald-50(?! dark:bg-emerald-900\/40)/g, replace: 'bg-emerald-50 dark:bg-emerald-900/40' },
  { regex: /bg-primary-50(?! dark:bg-primary-900\/40)/g, replace: 'bg-primary-50 dark:bg-primary-900/40' },
  { regex: /bg-indigo-50(?! dark:bg-indigo-900\/40)/g, replace: 'bg-indigo-50 dark:bg-indigo-900/40' },
  { regex: /bg-sky-50(?! dark:bg-sky-900\/40)/g, replace: 'bg-sky-50 dark:bg-sky-900/40' },
  
  // Text colors
  { regex: /text-neutral-900(?! dark:text-neutral-100)/g, replace: 'text-neutral-900 dark:text-neutral-100' },
  { regex: /text-neutral-800(?! dark:text-neutral-200)/g, replace: 'text-neutral-800 dark:text-neutral-200' },
  { regex: /text-neutral-700(?! dark:text-neutral-300)/g, replace: 'text-neutral-700 dark:text-neutral-300' },
  { regex: /text-neutral-600(?! dark:text-neutral-400)/g, replace: 'text-neutral-600 dark:text-neutral-400' },
  { regex: /text-neutral-500(?! dark:text-neutral-400)/g, replace: 'text-neutral-500 dark:text-neutral-400' },
  
  // Alert Text colors
  { regex: /text-blue-900(?! dark:text-blue-100)/g, replace: 'text-blue-900 dark:text-blue-100' },
  { regex: /text-blue-700(?! dark:text-blue-300)/g, replace: 'text-blue-700 dark:text-blue-300' },
  { regex: /text-amber-900(?! dark:text-amber-100)/g, replace: 'text-amber-900 dark:text-amber-100' },
  { regex: /text-amber-800(?! dark:text-amber-300)/g, replace: 'text-amber-800 dark:text-amber-300' },
  { regex: /text-red-900(?! dark:text-red-100)/g, replace: 'text-red-900 dark:text-red-100' },
  { regex: /text-red-700(?! dark:text-red-300)/g, replace: 'text-red-700 dark:text-red-300' },
  { regex: /text-emerald-900(?! dark:text-emerald-100)/g, replace: 'text-emerald-900 dark:text-emerald-100' },
  { regex: /text-emerald-700(?! dark:text-emerald-300)/g, replace: 'text-emerald-700 dark:text-emerald-300' },
  { regex: /text-primary-700(?! dark:text-primary-300)/g, replace: 'text-primary-700 dark:text-primary-300' },
  
  // Borders
  { regex: /border-neutral-100(?! dark:border-neutral-800)/g, replace: 'border-neutral-100 dark:border-neutral-800' },
  { regex: /border-neutral-200(?! dark:border-neutral-800)/g, replace: 'border-neutral-200 dark:border-neutral-800' },
  { regex: /border-neutral-300(?! dark:border-neutral-700)/g, replace: 'border-neutral-300 dark:border-neutral-700' },
  
  // Alert borders
  { regex: /border-blue-200(?! dark:border-blue-800)/g, replace: 'border-blue-200 dark:border-blue-800' },
  { regex: /border-amber-200(?! dark:border-amber-800)/g, replace: 'border-amber-200 dark:border-amber-800' },
  { regex: /border-red-200(?! dark:border-red-800)/g, replace: 'border-red-200 dark:border-red-800' },
  { regex: /border-emerald-200(?! dark:border-emerald-800)/g, replace: 'border-emerald-200 dark:border-emerald-800' },
  { regex: /border-primary-100(?! dark:border-primary-800\/50)/g, replace: 'border-primary-100 dark:border-primary-800/50' },
  { regex: /border-indigo-100(?! dark:border-indigo-800\/50)/g, replace: 'border-indigo-100 dark:border-indigo-800/50' },
  { regex: /border-sky-100(?! dark:border-sky-800\/50)/g, replace: 'border-sky-100 dark:border-sky-800/50' },
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
