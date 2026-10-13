import { useEffect, useRef, useState } from "react";
import { Church } from "lucide-react";

const FALLBACK_BG =
    "bg-[radial-gradient(ellipse_at_top_right,#1B2559_0%,#12183A_40%,#0A0A0C_100%)]";

// Image that fades in once loaded and falls back to a branded gradient
// when there's no URL (or it fails to load). Size it with `className`.
const LandingImage = ({
    src,
    alt = "",
    className = "",
    imgClassName = "",
    priority = false,
    showFallbackIcon = true,
}) => {
    const [failed, setFailed] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const imgRef = useRef(null);
    const hasImage = Boolean(src) && !failed;

    useEffect(() => {
        setFailed(false);
        setLoaded(false);
    }, [src]);

    // Covers images that were already cached and finished loading before React attached onLoad
    useEffect(() => {
        const el = imgRef.current;
        if (el?.complete && el.naturalWidth > 0) setLoaded(true);
    }, [src]);

    return (
        <div className={`relative overflow-hidden ${FALLBACK_BG} ${className}`}>
            {!hasImage && showFallbackIcon && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <Church size={40} className="text-[#2A3470]" aria-hidden="true" />
                </div>
            )}
            {hasImage && (
                <img
                    ref={imgRef}
                    src={src}
                    alt={alt}
                    loading={priority ? "eager" : "lazy"}
                    decoding="async"
                    onLoad={() => setLoaded(true)}
                    onError={() => setFailed(true)}
                    className={`h-full w-full object-cover transition-opacity duration-700 ${
                        loaded ? "opacity-100" : "opacity-0"
                    } ${imgClassName}`}
                />
            )}
        </div>
    );
};

export default LandingImage;