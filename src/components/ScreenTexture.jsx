import React, { useEffect, useMemo, useRef } from 'react';

import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

import { applyTextureTransform, drawTestWebAppTexture } from '../utils/screenTexture';

export function ScreenTexture({ target, page, textureTransform }) {
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

export function ImageScreenTexture({ target, src, textureTransform }) {
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
