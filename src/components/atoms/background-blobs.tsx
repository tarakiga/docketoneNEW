export function BackgroundBlobs() {
  return (
    <div className="absolute top-0 left-0 w-full h-[800px] overflow-hidden -z-20 pointer-events-none user-select-none">
      {/* Blob 1 - Indigo/Blue Mix */}
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-indigo-500/40 rounded-full blur-[100px] animate-blob-1" />
      
      {/* Blob 2 - Purple/Pink Mix */}
      <div className="absolute top-[0%] right-[-10%] w-[600px] h-[600px] bg-purple-500/40 rounded-full blur-[100px] animate-blob-2" />

      {/* Blob 3 - Cyan Accent */}
      <div className="absolute top-[10%] left-[30%] w-[500px] h-[500px] bg-cyan-400/30 rounded-full blur-[80px] animate-blob-3" />
    </div>
  )
}
