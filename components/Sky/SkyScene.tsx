'use client'

import { Canvas } from '@react-three/fiber'
import SkyGradient from './SkyGradient'
import CloudField from './CloudField'

export default function SkyScene({ mode }: { mode: 'full' | 'background' }) {
  return (
    <>
      <SkyGradient />
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
        }}
      >
        <CloudField />
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 10, 10]}
          intensity={1.5}
          castShadow
        />
        {/* We'll add clouds and stars here later */}
      </Canvas>
    </>
  )
}
