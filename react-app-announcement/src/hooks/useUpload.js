import { useApp } from '../context/AppContext';

export function useUpload() {
  const { updateAppInfo, setScreenImage } = useApp();

  const validateImage = (file) => {
    if (!file) return false;
    
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件');
      return false;
    }
    
    if (file.size > 20 * 1024 * 1024) { // 20MB limit
      alert('图片文件不能超过20MB');
      return false;
    }
    
    return true;
  };

  const compressImage = (file, maxWidth = 800, quality = 0.8) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob(resolve, 'image/jpeg', quality);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleIconUpload = async (event) => {
    const file = event.target.files[0];
    if (!validateImage(file)) return;

    try {
      const compressedFile = await compressImage(file, 200, 0.9);

      // 🔧 使用 FileReader 转换为 data URL，与 ImageSidebar 保持一致
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        console.log('🖼️ Icon 上传完成，更新 iconImage:', imageUrl.substring(0, 50) + '...');

        // 统一更新到 appInfo，所有模板都从这里读取
        updateAppInfo({ iconImage: imageUrl });

        console.log('✅ Icon uploaded successfully');
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error('❌ Error uploading icon:', error);
      alert('图标上传失败，请重试');
    }
  };

  const handleScreenUpload = async (event) => {
    const file = event.target.files[0];
    if (!validateImage(file)) return;

    try {
      const compressedFile = await compressImage(file, 1200, 0.9);

      // 🔧 使用 FileReader 转换为 data URL，与 ImageSidebar 保持一致
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        console.log('🖼️ Screen 上传完成:', imageUrl.substring(0, 50) + '...');

        setScreenImage(imageUrl);

        console.log('✅ Screen image uploaded successfully');
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error('❌ Error uploading screen image:', error);
      alert('截图上传失败，请重试');
    }
  };

  const useDefaultScreen = () => {
    setScreenImage(null);
    console.log('Using default screen content');
  };

  return {
    handleIconUpload,
    handleScreenUpload,
    useDefaultScreen
  };
}