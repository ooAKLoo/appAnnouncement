import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useApp } from '../context/AppContext';

export function useDownload() {
  const { state, toggleDownloadMenu } = useApp();

  const hideUIElements = () => {
    const elementsToHide = [
      '.top-toolbar',
      '.left-config-panel',
      '.config-panel',
      '.image-preview',
      '.download-menu'
    ];
    
    elementsToHide.forEach(selector => {
      const element = document.querySelector(selector);
      if (element) {
        element.style.display = 'none';
      }
    });
  };

  const showUIElements = () => {
    const elementsToShow = [
      '.top-toolbar',
      '.left-config-panel'
    ];
    
    elementsToShow.forEach(selector => {
      const element = document.querySelector(selector);
      if (element) {
        element.style.display = '';
      }
    });
  };

  const downloadAs = async (format) => {
    try {
      toggleDownloadMenu(); // Close the menu
      
      // Hide UI elements for clean capture
      hideUIElements();
      
      // Wait a bit for UI to update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const container = document.querySelector('.container');
      if (!container) {
        throw new Error('Container not found');
      }

      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false
      });

      const link = document.createElement('a');
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const filename = `app-announcement-${timestamp}`;

      if (format === 'png') {
        link.download = `${filename}.png`;
        link.href = canvas.toDataURL('image/png');
      } else if (format === 'jpg') {
        link.download = `${filename}.jpg`;
        link.href = canvas.toDataURL('image/jpeg', 0.9);
      } else if (format === 'pdf') {
        const imgData = canvas.toDataURL('image/jpeg', 0.9);
        const pdf = new jsPDF();
        const imgWidth = 210;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;

        let position = 0;

        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save(`${filename}.pdf`);
        showUIElements();
        return;
      }

      link.click();
      
      console.log(`Downloaded as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Download failed:', error);
      alert('下载失败，请重试');
    } finally {
      showUIElements();
    }
  };

  return {
    downloadAs
  };
}