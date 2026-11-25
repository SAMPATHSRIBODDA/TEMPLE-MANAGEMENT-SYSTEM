const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else if (dirFile.endsWith('.tsx')) {
      filelist.push(dirFile);
    }
  });
  return filelist;
};

const files = walkSync('src/screens');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  const replacePatterns = [
    { regex: /backgroundColor:\s*'#FFF'/g, replace: 'backgroundColor: theme.colors.surface' },
    { regex: /backgroundColor:\s*'#F8F9FA'/g, replace: 'backgroundColor: theme.colors.background' },
    { regex: /color:\s*'#666'/g, replace: 'color: theme.colors.onSurfaceVariant' },
    { regex: /color="#666"/g, replace: 'color={theme.colors.onSurfaceVariant}' },
    { regex: /color="#333"/g, replace: 'color={theme.colors.onSurface}' },
    { regex: /borderColor:\s*'#EEE'/g, replace: 'borderColor: theme.colors.outline' },
    { regex: /borderBottomColor:\s*'#EEE'/g, replace: 'borderBottomColor: theme.colors.outline' },
    { regex: /borderTopColor:\s*'#EEE'/g, replace: 'borderTopColor: theme.colors.outline' },
    { regex: /borderColor:\s*'#F0F0F0'/g, replace: 'borderColor: theme.colors.surfaceVariant' },
    { regex: /borderBottomColor:\s*'#F0F0F0'/g, replace: 'borderBottomColor: theme.colors.surfaceVariant' },
    { regex: /backgroundColor:\s*'#F0F0F0'/g, replace: 'backgroundColor: theme.colors.surfaceVariant' }
  ];

  replacePatterns.forEach(({ regex, replace }) => {
    if (regex.test(content)) {
      content = content.replace(regex, replace);
      changed = true;
    }
  });

  if (changed) {
    if (content.includes('StyleSheet.create({') && !content.includes('makeStyles')) {
      content = content.replace(/const styles = StyleSheet\.create\(\{/g, 'const makeStyles = (theme: any) => StyleSheet.create({');
      
      if (content.includes('const theme = useTheme();')) {
        content = content.replace(/const theme = useTheme\(\);/g, 'const theme = useTheme();\n  const styles = makeStyles(theme);');
      } else {
        console.log(`WARNING: useTheme not found in ${file}, skipping style injection.`);
      }
    }
    
    fs.writeFileSync(file, content);
    console.log(`Refactored: ${file}`);
  }
});
