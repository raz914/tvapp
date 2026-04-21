import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas, useLoader } from '@react-three/fiber';
import { Bounds, ContactShadows, Environment, Html, OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import './styles.css';

const WEBPAGE_MESH_NAME = 'Cylinder004_2';
const WEB1_SCREEN_TEXTURE = '/web1-screen.png';
const SCREEN_PAGES = ['dashboard', 'media', 'settings'];
const SCREEN_MODES = [
  { id: 'web1-texture', label: 'web1 texture' },
  { id: 'test-texture', label: 'test texture' },
];
const DEFAULT_TEXTURE_TRANSFORM = {
  rotation: 90,
  repeatX: 1,
  repeatY: 1,
  offsetX: 0,
  offsetY: 0,
};

function normalizeMeshName(name) {
  return name
    ?.trim()
    .replace(/[^a-z0-9]/giu, '')
    .toLowerCase();
}

function normalizeMeshFamilyName(name) {
  return name
    ?.trim()
    .replace(/[_-]\d+$/u, '')
    .replace(/[^a-z0-9]/giu, '')
    .toLowerCase();
}

function getMeshNames(object) {
  return [object.name, object.geometry?.name].filter(Boolean);
}

function getMeshLabel(object, index) {
  const [objectName, geometryName] = getMeshNames(object);

  if (objectName && geometryName && objectName !== geometryName) {
    return `${objectName} (${geometryName})`;
  }

  return objectName?.trim() || geometryName?.trim() || `Mesh ${index + 1}`;
}

function matchesMeshName(object, targetName) {
  const target = targetName.trim();
  const normalizedTarget = normalizeMeshName(targetName);
  const familyTarget = normalizeMeshFamilyName(targetName);
  const names = getMeshNames(object);

  if (names.some((name) => name === target || normalizeMeshName(name) === normalizedTarget)) {
    return true;
  }

  return names.some((name) => normalizeMeshFamilyName(name) === familyTarget);
}

function drawRoundedRect(context, x, y, width, height, radius) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
}

function drawStatCard(context, x, y, width, height, title, value, color) {
  drawRoundedRect(context, x, y, width, height, 18);
  context.fillStyle = '#1d232b';
  context.fill();

  context.fillStyle = color;
  context.fillRect(x + 24, y + 24, 56, 8);

  context.fillStyle = '#a8b3c2';
  context.font = '20px Arial, sans-serif';
  context.fillText(title, x + 24, y + 62);

  context.fillStyle = '#f6f4ec';
  context.font = 'bold 38px Arial, sans-serif';
  context.fillText(value, x + 24, y + 110);
}

function drawTopBar(context, title) {
  context.fillStyle = '#10141a';
  context.fillRect(0, 0, 768, 74);

  context.fillStyle = '#d6f36b';
  context.font = 'bold 24px Arial, sans-serif';
  context.fillText('RETRO.TV', 28, 45);

  context.fillStyle = '#f6f4ec';
  context.font = 'bold 30px Arial, sans-serif';
  context.fillText(title, 242, 46);

  context.fillStyle = '#27303b';
  drawRoundedRect(context, 628, 18, 112, 36, 18);
  context.fill();
  context.fillStyle = '#d6f36b';
  context.font = '18px Arial, sans-serif';
  context.fillText('ONLINE', 650, 42);
}

function drawGreeting(context) {
  context.fillStyle = '#d6f36b';
  context.font = 'bold 42px Arial, sans-serif';
  context.fillText('hello Lawaris peeps', 36, 186);
}

function drawDashboardPage(context) {
  drawTopBar(context, 'System Dashboard');

  context.fillStyle = '#151a21';
  context.fillRect(0, 74, 768, 438);
  drawGreeting(context);

  drawStatCard(context, 28, 226, 214, 122, 'Signal', '98%', '#d6f36b');
  drawStatCard(context, 278, 226, 214, 122, 'Load', '42%', '#75d5ff');
  drawStatCard(context, 528, 226, 214, 122, 'Temp', '31C', '#ffbd66');

  context.fillStyle = '#222a35';
  drawRoundedRect(context, 28, 378, 462, 94, 18);
  context.fill();
  context.fillStyle = '#f6f4ec';
  context.font = 'bold 22px Arial, sans-serif';
  context.fillText('Traffic', 54, 414);

  const bars = [22, 38, 30, 52, 43, 66, 59, 75, 48, 63];
  bars.forEach((bar, index) => {
    context.fillStyle = index % 2 === 0 ? '#d6f36b' : '#75d5ff';
    context.fillRect(62 + index * 39, 456 - bar, 22, bar);
  });

  context.fillStyle = '#222a35';
  drawRoundedRect(context, 528, 378, 214, 94, 18);
  context.fill();
  context.fillStyle = '#f6f4ec';
  context.font = 'bold 22px Arial, sans-serif';
  context.fillText('Status', 554, 414);
  context.fillStyle = '#d6f36b';
  context.font = '18px Arial, sans-serif';
  context.fillText('All channels clear', 554, 448);
  context.fillStyle = '#a8b3c2';
  context.font = '15px Arial, sans-serif';
  context.fillText(WEBPAGE_MESH_NAME, 554, 468);
}

function drawMediaPage(context) {
  drawTopBar(context, 'Media Library');

  context.fillStyle = '#10131a';
  context.fillRect(0, 74, 768, 438);
  drawGreeting(context);

  const items = [
    ['Synthwave Set', '#d6f36b'],
    ['Night Drive', '#75d5ff'],
    ['CRT Calibration', '#ff7aa8'],
  ];

  items.forEach(([title, color], index) => {
    const x = 36 + index * 244;
    drawRoundedRect(context, x, 218, 204, 198, 18);
    context.fillStyle = '#232b36';
    context.fill();
    context.fillStyle = color;
    context.fillRect(x + 24, 246, 156, 82);
    context.fillStyle = '#10131a';
    context.beginPath();
    context.moveTo(x + 92, 268);
    context.lineTo(x + 92, 306);
    context.lineTo(x + 128, 287);
    context.closePath();
    context.fill();
    context.fillStyle = '#f6f4ec';
    context.font = 'bold 22px Arial, sans-serif';
    context.fillText(title, x + 24, 364, 156);
    context.fillStyle = '#a8b3c2';
    context.font = '18px Arial, sans-serif';
    context.fillText('Ready to play', x + 24, 394);
  });

  context.fillStyle = '#d6f36b';
  drawRoundedRect(context, 222, 440, 324, 44, 22);
  context.fill();
  context.fillStyle = '#10131a';
  context.font = 'bold 22px Arial, sans-serif';
  context.fillText('PLAY SELECTED', 294, 469);
}

function drawSettingsPage(context) {
  drawTopBar(context, 'Display Settings');

  context.fillStyle = '#181d24';
  context.fillRect(0, 74, 768, 438);
  drawGreeting(context);

  const rows = [
    ['Brightness', 0.78],
    ['Contrast', 0.64],
    ['Saturation', 0.52],
    ['Scanline Blend', 0.36],
  ];

  rows.forEach(([label, value], index) => {
    const y = 234 + index * 52;
    context.fillStyle = '#f6f4ec';
    context.font = 'bold 22px Arial, sans-serif';
    context.fillText(label, 74, y);
    context.fillStyle = '#333d4a';
    drawRoundedRect(context, 292, y - 26, 380, 22, 11);
    context.fill();
    context.fillStyle = '#d6f36b';
    drawRoundedRect(context, 292, y - 26, 380 * value, 22, 11);
    context.fill();
  });

  context.fillStyle = '#222a35';
  drawRoundedRect(context, 74, 436, 620, 48, 14);
  context.fill();
  context.fillStyle = '#a8b3c2';
  context.font = '20px Arial, sans-serif';
  context.fillText('Screen UI is generated with Three.js CanvasTexture', 104, 468);
}

function drawTestWebAppTexture(canvas, page) {
  const context = canvas.getContext('2d');

  context.clearRect(0, 0, canvas.width, canvas.height);

  if (page === 'media') {
    drawMediaPage(context);
    return;
  }

  if (page === 'settings') {
    drawSettingsPage(context);
    return;
  }

  drawDashboardPage(context);
}

function applyTextureTransform(texture, transform) {
  texture.center.set(0.5, 0.5);
  texture.rotation = THREE.MathUtils.degToRad(transform.rotation);
  texture.repeat.set(transform.repeatX, transform.repeatY);
  texture.offset.set(transform.offsetX, transform.offsetY);
  texture.needsUpdate = true;
}

function ScreenTexture({ target, page, textureTransform }) {
  const originalMaterialRef = useRef(null);
  const { canvas, material, texture } = useMemo(() => {
    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = 768;
    textureCanvas.height = 512;

    const canvasTexture = new THREE.CanvasTexture(textureCanvas);
    canvasTexture.colorSpace = THREE.SRGBColorSpace;
    canvasTexture.flipY = false;
    canvasTexture.anisotropy = 8;

    return {
      canvas: textureCanvas,
      texture: canvasTexture,
      material: new THREE.MeshBasicMaterial({
        map: canvasTexture,
        toneMapped: false,
        side: THREE.DoubleSide,
      }),
    };
  }, []);

  useEffect(() => {
    originalMaterialRef.current = target.material;
    target.material = material;
    target.material.needsUpdate = true;

    return () => {
      target.material = originalMaterialRef.current;
      material.dispose();
      texture.dispose();
    };
  }, [material, target, texture]);

  useEffect(() => {
    drawTestWebAppTexture(canvas, page);
    texture.needsUpdate = true;
  }, [canvas, page, texture]);

  useEffect(() => {
    applyTextureTransform(texture, textureTransform);
  }, [texture, textureTransform]);

  return null;
}

function ImageScreenTexture({ target, src, textureTransform }) {
  const originalMaterialRef = useRef(null);
  const texture = useLoader(THREE.TextureLoader, src);
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: texture,
        toneMapped: false,
        side: THREE.DoubleSide,
      }),
    [texture]
  );

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.flipY = false;
    texture.needsUpdate = true;
  }, [texture]);

  useEffect(() => {
    originalMaterialRef.current = target.material;
    target.material = material;
    target.material.needsUpdate = true;

    return () => {
      target.material = originalMaterialRef.current;
      material.dispose();
    };
  }, [material, target]);

  useEffect(() => {
    applyTextureTransform(texture, textureTransform);
  }, [texture, textureTransform]);

  return null;
}

function TvModel({ hiddenMeshes, onMeshesChange, screenPage, screenMode, textureTransform }) {
  const { scene } = useGLTF('/tv.glb');
  const meshes = useMemo(() => {
    const items = [];

    scene.traverse((object) => {
      if (!object.isMesh) {
        return;
      }

      const label = getMeshLabel(object, items.length);
      items.push({
        id: object.uuid,
        name: label,
        type: object.type,
        object,
      });
    });

    return items;
  }, [scene]);
  const webpageMesh =
    meshes.find((mesh) =>
      getMeshNames(mesh.object).some(
        (name) => name === WEBPAGE_MESH_NAME || normalizeMeshName(name) === normalizeMeshName(WEBPAGE_MESH_NAME)
      )
    ) ?? meshes.find((mesh) => matchesMeshName(mesh.object, WEBPAGE_MESH_NAME));

  useEffect(() => {
    onMeshesChange(meshes.map(({ id, name, type }) => ({ id, name, type })));
  }, [meshes, onMeshesChange]);

  useEffect(() => {
    meshes.forEach(({ id, object }) => {
      object.visible = !hiddenMeshes.has(id);
    });
  }, [hiddenMeshes, meshes]);

  return (
    <>
      <Bounds fit clip observe margin={1.25}>
        <primitive object={scene} />
      </Bounds>
      {webpageMesh && screenMode === 'web1-texture' ? (
        <ImageScreenTexture target={webpageMesh.object} src={WEB1_SCREEN_TEXTURE} textureTransform={textureTransform} />
      ) : null}
      {webpageMesh && screenMode === 'test-texture' ? (
        <ScreenTexture target={webpageMesh.object} page={screenPage} textureTransform={textureTransform} />
      ) : null}
    </>
  );
}

function Loader() {
  return (
    <Html center>
      <div className="loader">Loading TV model</div>
    </Html>
  );
}

const Scene = React.memo(function Scene({ hiddenMeshes, onMeshesChange, screenPage, screenMode, textureTransform }) {
  return (
    <Canvas camera={{ position: [3, 2, 5], fov: 42 }} dpr={[1, 2]} shadows>
      <color attach="background" args={['#111214']} />
      <ambientLight intensity={0.75} />
      <directionalLight position={[4, 6, 5]} intensity={2.2} castShadow shadow-mapSize={[2048, 2048]} />
      <Suspense fallback={<Loader />}>
        <TvModel
          hiddenMeshes={hiddenMeshes}
          onMeshesChange={onMeshesChange}
          screenPage={screenPage}
          screenMode={screenMode}
          textureTransform={textureTransform}
        />
        <ContactShadows position={[0, -1.15, 0]} opacity={0.45} scale={8} blur={2.4} far={3} />
        <Environment preset="city" />
      </Suspense>
      <OrbitControls makeDefault enableDamping dampingFactor={0.06} minDistance={1.5} maxDistance={12} />
    </Canvas>
  );
});

function DebugPanel({
  meshes,
  hiddenMeshes,
  screenMode,
  screenPage,
  textureTransform,
  onToggleMesh,
  onShowAll,
  onHideAll,
  onScreenModeChange,
  onScreenPageChange,
  onTextureTransformChange,
}) {
  const visibleCount = meshes.length - hiddenMeshes.size;

  return (
    <aside className="debug-panel" aria-label="Mesh debug panel">
      <div className="debug-panel__header">
        <div>
          <h2>Debug Meshes</h2>
          <p>
            {visibleCount}/{meshes.length} visible
          </p>
        </div>
        <div className="debug-panel__actions">
          <button type="button" onClick={onShowAll}>
            All
          </button>
          <button type="button" onClick={onHideAll}>
            None
          </button>
        </div>
      </div>
      <div className="screen-page-control">
        <span>screen mode</span>
        <div className="screen-page-control__buttons">
          {SCREEN_MODES.map((mode) => (
            <button
              className={mode.id === screenMode ? 'is-active' : ''}
              type="button"
              key={mode.id}
              onClick={() => onScreenModeChange(mode.id)}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>
      <div className="screen-page-control">
        <span>{WEBPAGE_MESH_NAME} test page</span>
        <div className="screen-page-control__buttons">
          {SCREEN_PAGES.map((page) => (
            <button
              className={page === screenPage ? 'is-active' : ''}
              type="button"
              key={page}
              onClick={() => onScreenPageChange(page)}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
      <div className="texture-controls" aria-label="Screen texture controls">
        <label>
          <span>Rotate {textureTransform.rotation}deg</span>
          <input
            type="range"
            min="-180"
            max="180"
            step="90"
            value={textureTransform.rotation}
            onChange={(event) => onTextureTransformChange('rotation', Number(event.target.value))}
          />
        </label>
        <label>
          <span>Width {textureTransform.repeatX.toFixed(2)}</span>
          <input
            type="range"
            min="-2"
            max="2"
            step="0.01"
            value={textureTransform.repeatX}
            onChange={(event) => onTextureTransformChange('repeatX', Number(event.target.value))}
          />
        </label>
        <label>
          <span>Height {textureTransform.repeatY.toFixed(2)}</span>
          <input
            type="range"
            min="-2"
            max="2"
            step="0.01"
            value={textureTransform.repeatY}
            onChange={(event) => onTextureTransformChange('repeatY', Number(event.target.value))}
          />
        </label>
        <label>
          <span>U {textureTransform.offsetX.toFixed(2)}</span>
          <input
            type="range"
            min="-1"
            max="1"
            step="0.01"
            value={textureTransform.offsetX}
            onChange={(event) => onTextureTransformChange('offsetX', Number(event.target.value))}
          />
        </label>
        <label>
          <span>V {textureTransform.offsetY.toFixed(2)}</span>
          <input
            type="range"
            min="-1"
            max="1"
            step="0.01"
            value={textureTransform.offsetY}
            onChange={(event) => onTextureTransformChange('offsetY', Number(event.target.value))}
          />
        </label>
      </div>
      <div className="debug-panel__list">
        {meshes.length === 0 ? (
          <p className="debug-panel__empty">Loading meshes</p>
        ) : (
          meshes.map((mesh) => (
            <label className="mesh-toggle" key={mesh.id}>
              <input
                type="checkbox"
                checked={!hiddenMeshes.has(mesh.id)}
                onChange={() => onToggleMesh(mesh.id)}
              />
              <span>{mesh.name}</span>
            </label>
          ))
        )}
      </div>
    </aside>
  );
}

function App() {
  const [meshes, setMeshes] = useState([]);
  const [hiddenMeshes, setHiddenMeshes] = useState(() => new Set());
  const [screenMode, setScreenMode] = useState('web1-texture');
  const [screenPage, setScreenPage] = useState('dashboard');
  const [textureTransform, setTextureTransform] = useState(DEFAULT_TEXTURE_TRANSFORM);

  const handleToggleMesh = (meshId) => {
    setHiddenMeshes((current) => {
      const next = new Set(current);

      if (next.has(meshId)) {
        next.delete(meshId);
      } else {
        next.add(meshId);
      }

      return next;
    });
  };

  const handleShowAll = () => {
    setHiddenMeshes(new Set());
  };

  const handleHideAll = () => {
    setHiddenMeshes(new Set(meshes.map((mesh) => mesh.id)));
  };

  const handleTextureTransformChange = (key, value) => {
    setTextureTransform((current) => ({
      ...current,
      [key]: value,
    }));
  };

  return (
    <main className="app">
      <section className="viewer" aria-label="Interactive 3D TV model">
        <Scene
          hiddenMeshes={hiddenMeshes}
          onMeshesChange={setMeshes}
          screenPage={screenPage}
          screenMode={screenMode}
          textureTransform={textureTransform}
        />
      </section>
      <DebugPanel
        meshes={meshes}
        hiddenMeshes={hiddenMeshes}
        screenMode={screenMode}
        screenPage={screenPage}
        textureTransform={textureTransform}
        onToggleMesh={handleToggleMesh}
        onShowAll={handleShowAll}
        onHideAll={handleHideAll}
        onScreenModeChange={setScreenMode}
        onScreenPageChange={setScreenPage}
        onTextureTransformChange={handleTextureTransformChange}
      />
      <div className="hud">
        <h1>TV Model Viewer</h1>
        <p>Drag to orbit. Scroll to zoom.</p>
      </div>
    </main>
  );
}

useGLTF.preload('/tv.glb');

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
