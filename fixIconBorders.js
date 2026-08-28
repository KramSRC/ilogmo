const fs = require('fs');
const path = require('path');

const dirsToScan = ['app', 'components', 'features'];
const extensions = ['.tsx', '.ts'];

const colors = ['red', 'amber', 'emerald', 'blue', 'indigo', 'sky', 'purple', 'primary', 'neutral'];

const replacements = colors.map(color => ({
  regex: new RegExp(`border-${color}-100(?! dark:border)`, 'g'),
  replace: `border-${color}-100 dark:border-${color}-800/50`
}));

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
