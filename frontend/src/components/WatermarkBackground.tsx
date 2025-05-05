//frontend\src\components\WatermarkBackground.tsx
import React, { useEffect } from "react";
import { useUserStore } from "@/lib/store";

interface WatermarkBackgroundProps {
  setBackgroundImage: (image: string) => void;
}

const WatermarkBackground: React.FC<WatermarkBackgroundProps> = ({ setBackgroundImage }) => {
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (user && user.email) {
      const email = user.email;
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 600;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'rgba(179, 24, 24, 0.11)'; // Cambiar el color a verde
        ctx.font = '12px Arial';
        ctx.rotate(-20 * Math.PI / 180); // Aplicar una rotación de 20 grados
        for (let x = -canvas.width; x < canvas.width * 2; x += 150) { // Reducir el espacio horizontal
          for (let y = -canvas.height; y < canvas.height * 2; y += 40) { // Reducir el espacio vertical
            ctx.fillText(email, x, y);
          }
        }
        const dataUrl = canvas.toDataURL();
        setBackgroundImage(dataUrl);
      }
    }
  }, [user, setBackgroundImage]);

  return null;
};

export default WatermarkBackground;