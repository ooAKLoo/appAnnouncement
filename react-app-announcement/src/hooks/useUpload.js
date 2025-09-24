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
      const imageUrl = URL.createObjectURL(compressedFile);
      
      updateAppInfo({ iconImage: imageUrl });
      
      console.log('Icon uploaded successfully');
    } catch (error) {
      console.error('Error uploading icon:', error);
      alert('图标上传失败，请重试');
    }
  };

  const handleScreenUpload = async (event) => {
    const file = event.target.files[0];
    if (!validateImage(file)) return;
    
    try {
      const compressedFile = await compressImage(file, 1200, 0.9);
      const imageUrl = URL.createObjectURL(compressedFile);
      
      setScreenImage(imageUrl);
      
      console.log('Screen image uploaded successfully');
    } catch (error) {
      console.error('Error uploading screen image:', error);
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