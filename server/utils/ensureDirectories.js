import fs from 'fs';
import path from 'path';

const ensureDirectories = () => {
  // First ensure public directory exists
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
    console.log(`Created public directory: ${publicDir}`);
  }

  const directories = [
    'public/CandidateImages',
    'public/PartySymbols',
    'public/Faces'
  ];

  directories.forEach(dir => {
    const dirPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`Created directory: ${dirPath}`);
    } else {
      console.log(`Directory exists: ${dirPath}`);
    }
  });
};

export default ensureDirectories; 