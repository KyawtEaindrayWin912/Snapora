export default function getCroppedImg(imageSrc, crop) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
  
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = imageSrc;
      image.crossOrigin = "anonymous";
  
      image.onload = () => {
        canvas.width = crop.width;
        canvas.height = crop.height;
  
        ctx.drawImage(
          image,
          crop.x,
          crop.y,
          crop.width,
          crop.height,
          0,
          0,
          crop.width,
          crop.height
        );
  
        canvas.toBlob((blob) => {
          if (!blob) return reject(new Error("Canvas is empty"));
          resolve(blob);
        }, "image/jpeg");
      };
  
      image.onerror = () => reject(new Error("Failed to load image"));
    });
  }
  