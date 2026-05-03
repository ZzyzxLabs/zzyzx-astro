import React, { Suspense } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { TextureLoader } from 'three';
import GlobeBall from './GlobeBall';
import * as THREE from 'three';

function CameraRig() {
  useFrame((state, delta) => {
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;
    const progress = Math.min(scrollY / viewportHeight, 1);

    const startZ = 5;
    const endZ = 1.6;
    const currentZ = startZ - progress * (startZ - endZ);

    state.camera.position.z = THREE.MathUtils.lerp(
      state.camera.position.z,
      currentZ,
      5 * delta
    );
  });

  return null;
}

function StarField() {
  const { scene } = useThree();
  const bg = useLoader(TextureLoader, '/knog.png');
  bg.colorSpace = THREE.SRGBColorSpace;
  scene.background = bg;
  return null;
}

export default function Globe(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      style={{
        width: '100%',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        background: 'rgb(7,11,20)',
        ...props.style,
      }}
    >
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <ambientLight intensity={0.45} />
        <directionalLight position={[5, 5, 5]} intensity={0.9} />

        <Suspense fallback={null}>
          <StarField />
          <GlobeBall />
        </Suspense>

        <CameraRig />
      </Canvas>

      {/* Soft bottom fade only — let the Mars/star scene breathe */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '12rem',
          background:
            'linear-gradient(to top, rgba(7,11,20,0.6), transparent)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
