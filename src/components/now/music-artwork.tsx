"use client";

import Image from "next/image";
import { useState } from "react";

export function MusicArtwork({ src, alt, sizes }: { src: string; alt: string; sizes: string }) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (!src || failedSrc === src) {
    return (
      <div
        role="img"
        aria-label={alt ? `${alt} artwork unavailable` : "Artwork unavailable"}
        className="flex h-full items-center justify-center text-xl text-foreground/30"
      >
        <span aria-hidden="true">♪</span>
      </div>
    );
  }

  return <Image src={src} alt={alt} fill className="object-cover" sizes={sizes} onError={() => setFailedSrc(src)} />;
}
