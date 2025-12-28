import React from 'react';
import { useTexture } from '@react-three/drei';

export default function GlobeBall() {
  const texture = useTexture('/2k_mars.jpg');

  return (
    
    <mesh>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}
