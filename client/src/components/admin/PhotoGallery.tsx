type PhotoGalleryProps = {
  preview?: string;
  previews?: string[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function PhotoGallery({
  preview,
  previews,
  onChange,
}: PhotoGalleryProps) {
  const images = previews?.length ? previews : preview ? [preview] : [];

  return (
    <section>
      <p className="text-[11px] tracking-[0.22em] uppercase text-muted-foreground mb-2">
        Fotos
      </p>

      <p className="text-xs text-muted-foreground mb-5">
        A primeira foto será utilizada automaticamente como foto principal do
        imóvel.
      </p>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {images.map((image, index) => (
          <div
            key={`${image}-${index}`}
            className="overflow-hidden rounded-sm border border-border/20 bg-background"
          >
            <div className="relative h-44 w-full overflow-hidden">
              <img
                src={image}
                alt={`Foto ${index + 1} do imóvel`}
                className="h-full w-full object-cover"
              />

              {index === 0 && (
                <div className="absolute left-3 top-3 bg-background/80 backdrop-blur-sm px-2.5 py-1">
                  <span className="text-[10px] tracking-[0.18em] uppercase text-foreground">
                    Principal
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-border/20 px-4 py-3">
              <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                {index === 0 ? "Capa" : "Galeria"}
              </span>

              <span className="text-[10px] text-muted-foreground">
                Foto {index + 1}
              </span>
            </div>
          </div>
        ))}

        <label className="flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-sm border border-dashed border-border/40 px-6 py-8 text-center transition-colors hover:border-foreground/40 hover:bg-foreground/[0.02]">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={onChange}
            className="sr-only"
          />

          <span className="text-2xl font-light leading-none text-muted-foreground">
            +
          </span>

          <span className="mt-3 text-sm font-light text-foreground">
            Adicionar fotos
          </span>

          <span className="mt-2 max-w-sm text-xs leading-relaxed text-muted-foreground">
            JPG, PNG ou WEBP. Você pode selecionar várias imagens de uma vez.
          </span>
        </label>
      </div>
    </section>
  );
}