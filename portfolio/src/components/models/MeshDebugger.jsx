import { useState } from 'react'
import { Text } from '@react-three/drei'

export default function MeshDebugger({ node, nodeName, showLabels = true }) {
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  if (!showLabels && !hovered && !clicked) return null

  // Get mesh center position
  const position = node.position || [0, 0, 0]
  const bbox = node.geometry?.boundingBox

  return (
    <group>
      {/* Show label on hover or click */}
      {(hovered || clicked) && (
        <Text
          position={[position[0], position[1] + 0.5, position[2]]}
          fontSize={0.2}
          color={clicked ? 'yellow' : 'white'}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="black"
        >
          {nodeName}
        </Text>
      )}
      
      {/* Highlight mesh on hover */}
      {hovered && (
        <mesh geometry={node.geometry} position={position} rotation={node.rotation}>
          <meshStandardMaterial 
            color="yellow" 
            transparent 
            opacity={0.3}
            wireframe
          />
        </mesh>
      )}
    </group>
  )
}

