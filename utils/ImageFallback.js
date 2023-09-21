import React, { useEffect, useState } from 'react';
import Image from 'next/image';

// fallback image setup
const ImageFallback = ({ src, fallbackSrc, alt, ...rest }) => {
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <Image
      {...rest}
      src={imgSrc}
      alt={alt}
      onLoadingComplete={result => {
        if (result.width === 0) {
          // set fallback image
          setImgSrc(fallbackSrc);
        }
      }}
      onError={() => {
        setImgSrc(fallbackSrc);
      }}
      priority
    />
  );
};

export default ImageFallback;
