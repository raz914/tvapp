import { cp, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, resolve } from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const port = Number(process.env.WEB1_CAPTURE_PORT ?? 5188);
const viewport = process.env.WEB1_CAPTURE_VIEWPORT ?? '1280,850';
const outputPath = resolve(root, 'public/web1-screen.png');
const web1Url = `http://127.0.0.1:${port}/web1/index.html`;

const chromeCandidates = [
  process.env.CHROME_BIN,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
].filter(Boolean);

function findChrome() {
  const chromePath = chromeCandidates.find((candidate) => existsSync(candidate));

  if (!chromePath) {
    throw new Error('Chrome/Chromium was not found. Set CHROME_BIN to a browser executable and rerun npm run capture:web1.');
  }

  return chromePath;
}

function waitForServer(url, timeoutMs = 15000) {
  const startedAt = Date.now();

  return new Promise((resolveWait, rejectWait) => {
    const check = () => {
      fetch(url, { method: 'HEAD' })
        .then((response) => {
          if (response.ok) {
            resolveWait();
            return;
          }

          throw new Error(`HTTP ${response.status}`);
        })
        .catch((error) => {
          if (Date.now() - startedAt > timeoutMs) {
            rejectWait(error);
            return;
          }

          setTimeout(check, 250);
        });
    };

    check();
  });
}

function waitForExit(child, label) {
  return new Promise((resolveWait, rejectWait) => {
    child.once('error', rejectWait);
    child.once('exit', (code) => {
      if (code === 0) {
        resolveWait();
        return;
      }

      rejectWait(new Error(`${label} exited with code ${code}`));
    });
  });
}

async function syncWeb1Build() {
  await mkdir(resolve(root, 'public/web1'), { recursive: true });
  await mkdir(resolve(root, 'public/_next'), { recursive: true });
  await mkdir(resolve(root, 'public/assets'), { recursive: true });
  await cp(resolve(root, 'src/web1/index.html'), resolve(root, 'public/web1/index.html'));
  await cp(resolve(root, 'src/web1/404.html'), resolve(root, 'public/web1/404.html'));
  await cp(resolve(root, 'src/web1/_next'), resolve(root, 'public/_next'), { recursive: true, force: true });
  await cp(resolve(root, 'src/web1/assets'), resolve(root, 'public/assets'), { recursive: true, force: true });
}

async function assertPortAvailable() {
  const server = createServer();

  await new Promise((resolveListen, rejectListen) => {
    server.once('error', rejectListen);
    server.listen(port, '127.0.0.1', resolveListen);
  });

  await new Promise((resolveClose) => server.close(resolveClose));
}

async function main() {
  const chromePath = findChrome();

  await syncWeb1Build();
  await assertPortAvailable();

  const vite = spawn(
    process.execPath,
    [
      resolve(root, 'node_modules/vite/bin/vite.js'),
      '--host',
      '127.0.0.1',
      '--port',
      String(port),
      '--strictPort',
    ],
    {
      cwd: root,
      stdio: 'inherit',
    }
  );

  try {
    await waitForServer(web1Url);

    const chrome = spawn(
      chromePath,
      [
        '--headless=new',
        '--disable-gpu',
        '--hide-scrollbars',
        '--no-first-run',
        '--disable-extensions',
        `--window-size=${viewport}`,
        `--screenshot=${outputPath}`,
        web1Url,
      ],
      {
        cwd: root,
        stdio: 'inherit',
      }
    );

    await waitForExit(chrome, 'Chrome capture');
    console.log(`Captured ${web1Url} -> ${outputPath}`);
  } finally {
    vite.kill('SIGTERM');
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
