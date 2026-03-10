import { useState } from "react";

/**
 * Progressive image with blur-up effect: starts blurred and low opacity,
 * then transitions to sharp and full opacity on load.
 */
export default function BlurUpImage({
  src,
  srcSet,
  alt = "",
  type,
  className = "",
  ...props
}) {
  const [loaded, setLoaded] = useState(false);

  const imageClass = [
    "transition-all duration-200",
    loaded ? "blur-0 opacity-100" : "blur-md opacity-50",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (type === "source") {
    return <source srcSet={srcSet} type={type} {...props} />;
  }

  return (
    <img
      src={src}
      srcSet={srcSet}
      alt={alt}
      className={imageClass}
      onLoad={() => setLoaded(true)}
      {...props}
    />
  );
}
