import React, { useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Image, Upload, Trash2, RotateCcw } from 'lucide-react';

function AssetsPanel({ isActive }) {
  const { state, setScreenImage, hideImagePreview } = useApp();
  const fileInputRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = React.useState('全部');

  if (!isActive) return null;

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setScreenImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => {
    setScreenImage(null);
    hideImagePreview();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 预设图片素材（实际项目中应该从服务器获取）
  const stockImages = [
    { id: 1, url: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=600&fit=crop', category: '商务' },
    { id: 2, url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=300&h=600&fit=crop', category: '科技' },
    { id: 3, url: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=300&h=600&fit=crop', category: '生活' },
    { id: 4, url: 'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=300&h=600&fit=crop', category: '购物' },
    { id: 5, url: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=300&h=600&fit=crop', category: '社交' },
    { id: 6, url: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=600&fit=crop', category: '教育' },
  ];

  const categories = ['全部', '商务', '科技', '生活', '购物', '社交', '教育'];

  const filteredImages = selectedCategory === '全部' 
    ? stockImages 
    : stockImages.filter(img => img.category === selectedCategory);

  return (
    <div className="fixed left-4 top-20 bottom-4 w-80 bg-white rounded-xl shadow-xl border border-gray-200/50 flex flex-col overflow-hidden z-50">
      {/* Panel Header */}
      <div className="sticky top-0 bg-white px-6 pt-6 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
            <Image size={20} className="text-green-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">图片素材</h2>
            <p className="text-sm text-gray-500">上传或选择背景图片</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        
        {/* 当前图片 */}
        <section>
          <h3 className="font-medium text-gray-900 mb-3">当前背景</h3>
          {state.screenImage ? (
            <div className="relative group">
              <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={state.screenImage} 
                  alt="当前背景" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 rounded-lg transition-all flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 flex gap-2">
                  <button
                    onClick={handleImageRemove}
                    className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 bg-white rounded-full text-blue-600 hover:bg-blue-50"
                  >
                    <RotateCcw size={16} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-32 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400">
              <div className="text-center">
                <Image size={24} className="mx-auto mb-2" />
                <p className="text-sm">暂无背景图片</p>
              </div>
            </div>
          )}
        </section>

        {/* 上传图片 */}
        <section>
          <h3 className="font-medium text-gray-900 mb-3">上传图片</h3>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full p-4 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-all group"
          >
            <Upload size={24} className="mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-medium">点击上传图片</p>
            <p className="text-xs text-blue-500 mt-1">支持 JPG、PNG 格式</p>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </section>

        {/* 预设素材 */}
        <section>
          <h3 className="font-medium text-gray-900 mb-3">预设素材</h3>
          
          {/* 分类筛选 */}
          <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* 图片网格 */}
          <div className="grid grid-cols-2 gap-3">
            {filteredImages.map((image) => (
              <button
                key={image.id}
                className="group relative w-full h-24 bg-gray-100 rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all"
                onClick={() => setScreenImage(image.url)}
              >
                <img 
                  src={image.url} 
                  alt={image.category}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all"></div>
                <div className="absolute bottom-1 left-1 right-1">
                  <span className="text-xs text-white bg-black/60 px-2 py-1 rounded backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all">
                    {image.category}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

export default AssetsPanel;