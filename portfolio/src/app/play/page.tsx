
// Easter Egg Page - Secret route (not in navigation)
// Inspired by Bruno Simon's interactive 3D portfolio: https://bruno-simon.com
// Access via: /play (not linked in navigation)

export default function PlayPage() {
  return (
    <div className="w-full h-screen bg-black text-white flex items-center justify-center relative overflow-hidden">
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
    </div>
  )
}

