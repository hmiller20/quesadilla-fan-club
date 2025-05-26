'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
// @ts-expect-error: No types for perlin-noise-3d
import PerlinNoise3D from 'perlin-noise-3d'

// Cloud field parameters
const NUM_CLOUDS = 8
const CLOUD_AREA_WIDTH = 40
const CLOUD_AREA_HEIGHT = 10
const CLOUD_AREA_DEPTH = 20
const CLOUD_SPEED = 0.5 // Units per minute

// Voxel cloud parameters
const GRID_SIZE = [20, 16, 20] // x, y, z
const VOXEL_SIZE = 0.15 // Smaller voxels
const DENSITY_THRESHOLD = 0.5 // Higher = fewer voxels

// Helper to generate a single voxel cloud as a 3D grid
function generateVoxelCloud(seed: number) {
  const noise = new PerlinNoise3D()
  noise.noiseSeed(seed)
  const [gx, gy, gz] = GRID_SIZE
  const voxels: { position: [number, number, number] }[] = []
  // Center of the grid
  const cx = gx / 2
  const cy = gy / 2
  const cz = gz / 2
  const maxR = Math.min(gx, gy, gz) / 2.1
  for (let x = 0; x < gx; x++) {
    for (let y = 0; y < gy; y++) {
      for (let z = 0; z < gz; z++) {
        // Sphere formula
        const dx = (x - cx) / maxR
        const dy = (y - cy) / maxR
        const dz = (z - cz) / maxR
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
        // Perlin noise for fluffiness
        const n = noise.get(x * 0.2, y * 0.2, z * 0.2)
        if (dist + n * 0.25 < 1 && n > -DENSITY_THRESHOLD) {
          voxels.push({ position: [
            (x - cx) * VOXEL_SIZE,
            (y - cy) * VOXEL_SIZE,
            (z - cz) * VOXEL_SIZE
          ] })
        }
      }
    }
  }
  return voxels
}

// Generate all clouds (positions and their voxel structure)
function useVoxelClouds() {
  return useMemo(() => {
    return Array.from({ length: NUM_CLOUDS }).map((_, i) => {
      // Randomize initial x position across the field
      const x = Math.random() * CLOUD_AREA_WIDTH - CLOUD_AREA_WIDTH / 2
      const y = Math.random() * CLOUD_AREA_HEIGHT - CLOUD_AREA_HEIGHT / 2
      const z = Math.random() * CLOUD_AREA_DEPTH - CLOUD_AREA_DEPTH / 2
      const voxels = generateVoxelCloud(i * 1000 + 42)
      return { basePosition: [x, y, z] as [number, number, number], voxels, id: i }
    })
  }, [])
}

export default function CloudField() {
  const group = useRef<THREE.Group>(null)
  const clouds = useVoxelClouds()
  // Track cloud offsets for animation
  const offsets = useRef(clouds.map(c => c.basePosition[0]))

  useFrame((state, delta) => {
    // Move clouds to the right
    for (let i = 0; i < clouds.length; i++) {
      offsets.current[i] += (CLOUD_SPEED * delta) / 60 // delta is in seconds
      // Wrap around when cloud exits right
      if (offsets.current[i] > CLOUD_AREA_WIDTH / 2 + 5) {
        offsets.current[i] = -CLOUD_AREA_WIDTH / 2 - 5
      }
    }
    // Update group positions
    if (group.current) {
      group.current.children.forEach((cloud, i) => {
        cloud.position.x = offsets.current[i]
      })
    }
  })

  return (
    <group ref={group}>
      {clouds.map((cloud, i) => (
        <group key={cloud.id} position={[offsets.current[i], cloud.basePosition[1], cloud.basePosition[2]]}>
          {cloud.voxels.map((voxel, j) => (
            <mesh key={j} position={voxel.position}>
              <boxGeometry args={[VOXEL_SIZE, VOXEL_SIZE, VOXEL_SIZE]} />
              <meshStandardMaterial
                color="#ffffff"
                roughness={1}
                metalness={0}
                opacity={0.9}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}
