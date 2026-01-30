import React, { Suspense } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { TextureLoader } from 'three';
import GlobeBall from './GlobeBall';
import * as THREE from 'three';
function CameraRig() {
  useFrame((state, delta) => {
    // 3. 核心邏輯：將「像素」轉換為「0~1 的進度」
    
    // 取得目前捲動的像素值
    const scrollY = window.scrollY;
    // 取得視窗高度
    const viewportHeight = window.innerHeight;

    // 計算進度：
    // 當 scrollY = 0, progress = 0
    // 當 scrollY = viewportHeight (捲了一屏), progress = 1
    // Math.min 確保進度不會超過 1 (即鎖定動畫)
    const progress = Math.min(scrollY / viewportHeight, 1);

    // 根據進度更新相機 Z 軸
    const startZ = 5;
    const endZ = 1.1;
    const currentZ = startZ - (progress * (startZ - endZ));

  state.camera.position.z = THREE.MathUtils.lerp(
      state.camera.position.z, 
      currentZ,
      5 * delta
    );  });

  return null;
}

function Globg(){
  const { scene } = useThree()
  const bg = useLoader(TextureLoader, '/knog.png')
  bg.colorSpace = THREE.SRGBColorSpace; // Optional: for correct color rendering
  // This makes the texture fill the background while maintaining aspect ratio or covering based on your specific needs, 
  // but scene.background typically takes the texture as is. 
  // If "FULL size" means mapping the texture to the environment (equirectangular) or just fixing encoding issues:
  // For a static 2D background covering the canvas, scene.background with a Texture repeats or stretches depending on mapping.
  // However, often users want:
  // scene.background = bg; 
  // To ensure it's not distorted, sometimes encoding helps.
  scene.background = bg
  return null
}

export default function Globe(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props} style={{ width: '100%', height: '100vh', position: 'fixed', top: 0, left: 0, ...props.style }}>
      <Canvas>
        
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} />

        <Suspense fallback={null}>
          <Globg />
          <GlobeBall />
        </Suspense>

        <CameraRig />
      </Canvas>
    </div>
  );
}
