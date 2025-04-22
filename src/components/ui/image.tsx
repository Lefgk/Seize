import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

interface ImageProps extends React.ComponentProps<"img"> {
  skeletonClassName?: string;
  containerClassName?: string;
  imgClassName?: string;
}

const Image = ({
  skeletonClassName = "",
  containerClassName = "",
  imgClassName,
  ...props
}: ImageProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  useEffect(() => {
    if (inView) {
      setImageSrc(props.src)
    }
  }, [inView, props.src]);

  return (
    <div
      className={`${containerClassName || props.className} overflow-hidden`}
      ref={ref}
    >
      {!imageLoaded && (
        <div className={`animate-pulse bg-default-800 w-full h-full z-[2] ${skeletonClassName}`} />
      )}
      {imageSrc && (
        <img
          {...props}
          src={imageSrc}
          className={`${imgClassName}`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(false)}
          style={{
            display: imageLoaded ? "block" : "none",
          }}
        />
      )}
    </div>
  );
}

export default Image;