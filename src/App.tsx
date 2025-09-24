import './App.css'
import { useState } from 'react'
import Scene from './components/scene'

function App() {
  const [customImage, setCustomImage] = useState<string | null>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setCustomImage(url)
    }
  }

  const resetImage = () => {
    setCustomImage(null)
  }

  return (
    <div className='w-screen h-screen bg-black relative'> 
      {/* 上传控制面板 */}
      <div className="absolute top-4 left-4 z-50 flex flex-col gap-3">
        <label className="bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-white/20 transition-colors text-sm font-medium">
          📱 上传壁纸
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>
        
        {customImage && (
          <button
            onClick={resetImage}
            className="bg-red-500/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-medium"
          >
            🔄 重置
          </button>
        )}
      </div>

      <Scene customImage={customImage} />
    </div>
  )
}

export default App