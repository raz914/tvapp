import React from 'react';

import { SCREEN_MODES, SCREEN_PAGES, WEBPAGE_MESH_NAME } from '../constants/screen';

export default function DebugPanel({
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
