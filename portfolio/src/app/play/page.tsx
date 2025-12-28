
// Easter Egg Page - Secret route (not in navigation)
// Inspired by Bruno Simon's interactive 3D portfolio: https://bruno-simon.com
// Access via: /play (not linked in navigation)

function Scene() {

  return (
    <>
      {/* Canvas container for 3D scene - will be replaced with Three.js canvas */}
      <div id="canvas-container" className="absolute inset-0 w-full h-full" />
      
      {/* UI Overlay - can be hidden when 3D is ready */}
      <div className="relative z-10 text-center space-y-4 max-w-2xl px-4">
        <h1 className="text-4xl font-light mb-8">🎮 Play Mode</h1>
        <p className="text-gray-400 mb-4">
          Welcome to the secret page!
        </p>
        <p className="text-sm text-gray-500 mb-8">
          This is where your 3D interactive experience will go.
        </p>
        
        <div className="mt-8 p-6 bg-gray-900/90 backdrop-blur-sm rounded-lg text-left">
          <h2 className="text-lg font-semibold mb-4">Building a 3D Interactive Experience</h2>
          <p className="text-sm text-gray-300 mb-4">
            Inspired by <a href="https://bruno-simon.com" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">Bruno Simon's portfolio</a>, here's how to get started:
          </p>
          
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-gray-400 mb-1">1. Install Three.js (Core 3D library):</p>
              <code className="block bg-gray-800 px-3 py-2 rounded mt-1">npm install three @types/three</code>
            </div>
            
            <div>
              <p className="text-gray-400 mb-1">2. React Three Fiber (React wrapper):</p>
              <code className="block bg-gray-800 px-3 py-2 rounded mt-1">npm install @react-three/fiber @react-three/drei</code>
            </div>
            
            <div>
              <p className="text-gray-400 mb-1">3. Physics engine (Rapier):</p>
              <code className="block bg-gray-800 px-3 py-2 rounded mt-1">npm install @react-three/rapier</code>
            </div>
            
            <div>
              <p className="text-gray-400 mb-1">4. Audio (Howler.js):</p>
              <code className="block bg-gray-800 px-3 py-2 rounded mt-1">npm install howler @types/howler</code>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-700">
            <p className="text-xs text-gray-500">
              💡 <strong>Resources:</strong> Check out Bruno's <a href="https://github.com/brunosimon/portfolio-2024" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">GitHub</a> and <a href="https://threejs-journey.com" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">Three.js Journey</a> course for detailed tutorials!
            </p>
          </div>
        </div>
      </div>
    </>

  )


}


function Box() {
  const clipPath = "M 10, 50 \
                    L 90, 50 \
                    A 10, 10, 0, 0, 0, 100, 40 \
                    L 100, 10 \
                    A 10, 10, 0, 0, 1, 110, 0 \
                    L 190, 0, \
                    A 10, 10, 0, 0, 1, 200, 10 \
                    L 200, 190 \
                    A 10, 10, 0, 0, 1, 190, 200 \
                    L 10, 200 \
                    A 10, 10, 0, 0, 1, 0, 190 \
                    L 0, 60 \
                    A 10, 10, 0, 0, 1, 10, 50 \
                    Z"

  return (
    <div className="w-[200px] h-[200px] bg-red-500" style={{ clipPath: `path("${clipPath}")` }}/> 
  )
}

function Folder(){

  const clipPath = "M 10, 50 \
                    L 80, 50 \
                    L 130, 70 \
                    L 190, 70 \
                    A 10, 10, 0, 0, 1, 200, 80 \
                    L 200, 190 \
                    A 10, 10, 0, 0, 1, 190, 200 \
                    L 10, 200 \
                    A 10, 10, 0, 0, 1, 0, 190 \
                    L 0, 60 \
                    A 10, 10, 0, 0, 1, 10, 50 \
                    Z"

  return (
    <div className="w-[200px] h-[200px] bg-blue-500" style={{ clipPath: `path("${clipPath}")` }}/>
  )

}

function Folder2(){

  const clipPath = "M 10, 50 \
                    L 90, 50 \
                    A 10, 10, 0, 0, 1, 100, 60 \
                    A 10, 10, 0, 0, 0, 110, 70 \
                    L 130, 70 \
                    L 190, 70 \
                    A 10, 10, 0, 0, 1, 200, 80 \
                    L 200, 190 \
                    A 10, 10, 0, 0, 1, 190, 200 \
                    L 10, 200 \
                    A 10, 10, 0, 0, 1, 0, 190 \
                    L 0, 60 \
                    A 10, 10, 0, 0, 1, 10, 50 \
                    Z"

  return (
    <div className="w-[200px] h-[200px] bg-blue-500" style={{ clipPath: `path("${clipPath}")` }}/> 
  
  )

}

function Folder3(){

  const clipPath = "M 10 50 \
                    L 80 50 \
                    Q 90 50 97 57 \
                    L 103 63 \
                    Q 110 70 120 70 \
                    L 190 70 \
                    A 10 10 0 0 1 200 80 \
                    L 200 190 \
                    A 10 10 0 0 1 190 200 \
                    L 10 200 \
                    A 10 10 0 0 1 0 190 \
                    L 0 60 \
                    A 10 10 0 0 1 10 50 \
                    Z"

  return (
    <div className="w-[200px] h-[200px] bg-blue-500" style={{ clipPath: `path("${clipPath}")` }}/> 
  
  )

}





function BoxScalable() {
  
  const path = "M 0.05, 0.25 \
                L 0.45, 0.25 \
                A 0.05, 0.05, 0, 0, 0, 0.5, 0.2 \
                L 0.5, 0.05 \
                A 0.05, 0.05, 0, 0, 1, 0.55, 0 \
                L 0.95, 0 \
                A 0.05, 0.05, 0, 0, 1, 1, 0.05 \
                L 1, 0.95 \
                A 0.05, 0.05, 0, 0, 1, 0.95, 1 \
                L 0.05, 1 \
                A 0.05, 0.05, 0, 0, 1, 0, 0.95 \
                L 0, 0.3 \
                A 0.05, 0.05, 0, 0, 1, 0.05, 0.25 \
                Z" 
  
  return (
    <div className="relative w-[20vw] aspect-square">
      {/* Define clipPath in SVG with relative coordinates */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <clipPath id="custom-shape" clipPathUnits="objectBoundingBox">
            <path d={path}/>
          </clipPath>
        </defs>
      </svg>

      {/* Apply clipPath to div */}
      <div 
        className="w-full h-full bg-red-500"
        style={{ clipPath: 'url(#custom-shape)' }}
      />

    </div>
  )
}

export default function PlayPage() {
  return (
    <div className="w-full h-screen bg-white text-white flex items-center justify-center relative overflow-hidden">
      <div className="flex gap-8 items-center">
        <div className="text-center">
          <h3 className="text-sm text-gray-400 mb-4">Original (CSS path)</h3>
          <Box />
        </div>
        
        <div className="text-center">
          <h3 className="text-sm text-gray-400 mb-4">Scalable (SVG clipPath)</h3>
          <BoxScalable />
        </div>
        <div className="text-center">
          <h3 className="text-sm text-gray-400 mb-4">Folder (SVG clipPath)</h3>
          <Folder/>

          
        </div>
        <div className="text-center">
          <h3 className="text-sm text-gray-400 mb-4">Folder2 (SVG clipPath)</h3>
          <Folder2 />
        </div>
        <div className="text-center">
          <h3 className="text-sm text-gray-400 mb-4">Folder3 (SVG clipPath)</h3>
          <Folder3 />
        </div>
      </div>
    </div>
  )
}

