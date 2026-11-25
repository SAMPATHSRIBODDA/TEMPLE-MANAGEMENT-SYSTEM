import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SCREENS_DIR = path.join(__dirname, '../src/screens');

const walk = (dir, done) => {
  let results = [];
  fs.readdir(dir, (err, list) => {
    if (err) return done(err);
    let i = 0;
    (function next() {
      let file = list[i++];
      if (!file) return done(null, results);
      file = path.join(dir, file);
      fs.stat(file, (err, stat) => {
        if (stat && stat.isDirectory()) {
          walk(file, (err, res) => {
            results = results.concat(res);
            next();
          });
        } else {
          if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            results.push(file);
          }
          next();
        }
      });
    })();
  });
};

const transformFile = (filePath) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) throw err;
    let modified = data;

    // Backgrounds & Glassmorphism
    modified = modified.replace(/bg-white\b/g, 'bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl');
    modified = modified.replace(/bg-gray-50\b/g, 'bg-white/40 dark:bg-gray-800/40 backdrop-blur-md');
    
    // Borders
    modified = modified.replace(/border-gray-200\b/g, 'border-white/40 dark:border-gray-700/50');
    modified = modified.replace(/border-gray-100\b/g, 'border-white/20 dark:border-gray-800/50');
    
    // Text colors (Dark mode support)
    modified = modified.replace(/text-gray-900\b/g, 'text-gray-900 dark:text-gray-100');
    modified = modified.replace(/text-gray-800\b/g, 'text-gray-800 dark:text-gray-200');
    modified = modified.replace(/text-gray-700\b/g, 'text-gray-700 dark:text-gray-300');
    modified = modified.replace(/text-gray-600\b/g, 'text-gray-600 dark:text-gray-400');
    modified = modified.replace(/text-gray-500\b/g, 'text-gray-500 dark:text-gray-400');
    modified = modified.replace(/text-gray-400\b/g, 'text-gray-400 dark:text-gray-500');

    if (modified !== data) {
      fs.writeFile(filePath, modified, 'utf8', (err) => {
        if (err) throw err;
        console.log(`Transformed: ${path.relative(__dirname, filePath)}`);
      });
    }
  });
};

walk(SCREENS_DIR, (err, results) => {
  if (err) throw err;
  results.forEach(transformFile);
});
