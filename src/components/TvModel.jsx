import React, { useEffect, useMemo } from 'react';

import { Bounds, useGLTF } from '@react-three/drei';

import { WEB1_SCREEN_TEXTURE, WEBPAGE_MESH_NAME } from '../constants/screen';
import { getMeshLabel, getMeshNames, matchesMeshName, normalizeMeshName } from '../utils/mesh';
import { ImageScreenTexture, ScreenTexture } from './ScreenTexture';

export default function TvModel({ hiddenMeshes, onMeshesChange, screenPage, screenMode, textureTransform }) {
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
