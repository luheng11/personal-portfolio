import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, '../..', 'uploads');

console.log('__dirname:', __dirname);
console.log('uploadDir:', uploadDir);
console.log('exists:', fs.existsSync(uploadDir));
