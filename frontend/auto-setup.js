const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const os = require('os');

// --- 1. تكوين الملفات (Configurations) ---

const frontendPackageJson = {
  name: "mentalsense-frontend",
  private: true,
  version: "1.0.0",
  type: "module",
  scripts: {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  dependencies: {
    "@google/genai": "*",
    "lucide-react": "^0.294.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "react-webcam": "^7.2.0",
    "recharts": "^2.10.3",
    "framer-motion": "^10.16.4"
  },
  devDependencies: {
    "@types/react": "^18.2.37",
    "@types/react-dom": "^18.2.15",
    "@vitejs/plugin-react": "^4.2.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.31",
    "tailwindcss": "^3.3.5",
    "typescript": "^5.2.2",
    "vite": "^5.0.0"
  }
};

const backendPackageJson = {
  name: "mentalsense-backend",
  version: "1.0.0",
  main: "server.ts",
  scripts: {
    "dev": "ts-node-dev --respawn --transpile-only server.ts",
    "build": "tsc"
  },
  dependencies: {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "helmet": "^7.1.0",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.0.0",
    "@google/genai": "*"
  },
  devDependencies: {
    "@types/bcryptjs": "^2.4.6",
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/node": "^20.10.0",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.3.2"
  }
};

const viteConfigContent = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    'process.env': process.env
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  }
});`;

// --- 2. وظائف المساعدة (Helper Functions) ---

function createFile(filePath, content) {
  if (!fs.existsSync(filePath)) {
    console.log(`[SETUP] إنشاء ملف: ${filePath}`);
    fs.writeFileSync(filePath, typeof content === 'string' ? content : JSON.stringify(content, null, 2));
  } else {
    console.log(`[SETUP] الملف موجود مسبقاً: ${filePath} (تم التحديث لضمان التوافق)`);
    // نقوم بتحديث الملف لضمان أن الحزم صحيحة
    fs.writeFileSync(filePath, typeof content === 'string' ? content : JSON.stringify(content, null, 2));
  }
}

function runCommand(command, args, cwd) {
  return new Promise((resolve, reject) => {
    const cmd = os.platform() === 'win32' ? `${command}.cmd` : command;
    console.log(`[RUN] تشغيل: ${command} ${args.join(' ')} في ${cwd}`);
    
    const process = spawn(cmd, args, { cwd, stdio: 'inherit', shell: true });

    process.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Command failed with code ${code}`));
    });
  });
}

function runServer(command, args, cwd, label) {
  const cmd = os.platform() === 'win32' ? `${command}.cmd` : command;
  console.log(`[START] تشغيل ${label}...`);
  const process = spawn(cmd, args, { cwd, stdio: 'inherit', shell: true });
  return process;
}

// --- 3. التنفيذ الرئيسي (Main Execution) ---

async function main() {
  console.log("==========================================");
  console.log("   MentalSense AI - التثبيت والتشغيل الآلي   ");
  console.log("==========================================");

  try {
    // 1. إنشاء ملفات الروت (Frontend)
    createFile('package.json', frontendPackageJson);
    createFile('vite.config.ts', viteConfigContent);

    // 2. إنشاء ملفات الباك إند
    const backendPath = path.join(__dirname, 'backend');
    if (!fs.existsSync(backendPath)) {
      fs.mkdirSync(backendPath);
    }
    createFile(path.join(backendPath, 'package.json'), backendPackageJson);

    // 3. تثبيت حزم Frontend
    console.log("\n>>> جاري تثبيت مكتبات الواجهة الأمامية (Frontend)...");
    await runCommand('npm', ['install'], __dirname);

    // 4. تثبيت حزم Backend
    console.log("\n>>> جاري تثبيت مكتبات الواجهة الخلفية (Backend)...");
    await runCommand('npm', ['install'], backendPath);

    console.log("\n>>> تم التثبيت بنجاح! جاري تشغيل التطبيق...");
    console.log("    - الواجهة الأمامية: http://localhost:3000");
    console.log("    - السيرفر الخلفي:   http://localhost:5000");

    // 5. التشغيل المتزامن
    runServer('npm', ['run', 'dev'], backendPath, "Backend Server");
    
    // انتظار قليل لضمان إقلاع الباك إند قبل الفرونت إند
    setTimeout(() => {
        runServer('npm', ['run', 'dev'], __dirname, "Frontend React App");
    }, 2000);

  } catch (error) {
    console.error("\n[ERROR] حدث خطأ أثناء التثبيت:", error);
  }
}

main();