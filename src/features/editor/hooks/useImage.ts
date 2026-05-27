import { useEffect, useState } from "react";

export function useImage(src: string) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new window.Image();

    img.src = src;

    img.onload = () => {
      setImage(img);
    };
  }, [src]);

  return image;
}
