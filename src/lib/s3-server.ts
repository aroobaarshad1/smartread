// src/lib/s3-server.ts
import fs from 'fs';
import path from 'path';
import os from 'os';
import axios from 'axios';

export async function downloadFromS3(url: string): Promise<string | null> {
  try {
    // Fetch the file from the URL using axios
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data);

    // Create tmp directory if it doesn't exist
    const tmpDir = os.platform() === "win32" 
      ? `C:\\Users\\${os.userInfo().username}\\AppData\\Local\\Temp`
      : '/tmp';
    
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }

    // Generate file path
    const fileNameToSave = path.join(tmpDir, `pdf-${Date.now()}.pdf`);
    
    // Save the file locally
    fs.writeFileSync(fileNameToSave, buffer);
    
    return fileNameToSave;
  } catch (error) {
    console.error('S3 download error:', error);
    return null;
  }
}