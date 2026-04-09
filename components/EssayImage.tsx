import Image from "next/image";

type EssayImageProps = {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
};

export default function EssayImage({
  src,
  alt,
  caption,
  width = 1600,
  height = 900,
}: EssayImageProps) {
  return (
    <figure className="my-12">
      <div className="overflow-hidden border border-[#1f1f1f] bg-[#111111]">
        <Image
          className="h-auto w-full object-cover"
          src={src}
          alt={alt}
          width={width}
          height={height}
        />
      </div>
      {caption ? (
        <figcaption className="mt-3 font-sans text-sm tracking-[0.14em] text-[#6f6f6f] uppercase">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
