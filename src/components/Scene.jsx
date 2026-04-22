import React, { Suspense, memo } from 'react';

import { Canvas } from '@react-three/fiber';
import { ContactShadows, Environment, OrbitControls } from '@react-three/drei';

import Loader from './Loader';
import TvModel from './TvModel';

const Scene = memo(function Scene({ hiddenMeshes, onMeshesChange, screenPage, screenMode, textureTransform }) {
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

export default Scene;
