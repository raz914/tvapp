import React, { useState } from 'react';

import { DEFAULT_TEXTURE_TRANSFORM } from './constants/screen';
import DebugPanel from './components/DebugPanel';
import Scene from './components/Scene';

export default function App() {
  const [meshes, setMeshes] = useState([]);
  const [hiddenMeshes, setHiddenMeshes] = useState(() => new Set());
  const [screenMode, setScreenMode] = useState('web1-texture');
  const [screenPage, setScreenPage] = useState('dashboard');
  const [textureTransform, setTextureTransform] = useState(() => ({ ...DEFAULT_TEXTURE_TRANSFORM }));

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
