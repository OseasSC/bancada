export function Figure({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption?: string;
}) {
  return (
    <figure className="border border-line bg-white">
      {/* Diagrams are SVG; next/image does not optimize them. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="h-auto w-full" width={800} height={450} />
      {caption ? (
        <figcaption className="border-t border-line px-3 py-2 text-sm text-muted">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
