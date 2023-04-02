import { useState, useEffect } from 'react';

const useLoadedImage = (src, fallbackSrc) => {
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
      const img = document.createElement('img');
      img.src = src;

      const updateImageState = (srcToUpdate) => {
        setImageSrc(srcToUpdate);
      };

      img.onload = () => updateImageState(src);
      img.onerror = () => updateImageState(fallbackSrc);
  }, [src, fallbackSrc]);

  return imageSrc;
};

export default useLoadedImage;
