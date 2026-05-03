import AssetDownload from "./AssetDownload";

type Variant = {
  id: string;
  name: string;
  description: string;
  svg: string;
  pngs?: { size: number; href: string }[];
};

type Props = {
  variants: Variant[];
  surface?: "light" | "dark";
};

export default function LogoVariantGrid({ variants, surface = "light" }: Props) {
  return (
    <div className={`lv-grid lv-grid--${surface}`}>
      {variants.map((v) => {
        const isDarkSurface = v.id.endsWith("mono-white");
        return (
          <article className={`lv-card lv-card--${isDarkSurface ? "dark" : "light"}`} key={v.id}>
            <div className="lv-card__preview">
              <img src={v.svg} alt={v.name} />
            </div>
            <div className="lv-card__body">
              <h3>{v.name}</h3>
              <p>{v.description}</p>
              <div className="lv-card__downloads">
                <AssetDownload href={v.svg} label="SVG" sublabel="vector" />
                {v.pngs?.map((p) => (
                  <AssetDownload key={p.size} href={p.href} label={`PNG ${p.size}`} sublabel={`${p.size} × ${p.size}`} />
                ))}
              </div>
            </div>
          </article>
        );
      })}
      <style>{`
        .lv-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        .lv-card {
          display: grid;
          grid-template-columns: 220px 1fr;
          gap: 24px;
          padding: 16px;
          border: 1px solid var(--ws-fog);
          border-radius: var(--ws-radius-md);
        }
        .lv-card--light .lv-card__preview { background: var(--ws-paper); }
        .lv-card--dark .lv-card__preview { background: var(--ws-ink); }
        .lv-card__preview {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          border-radius: var(--ws-radius-sm);
          min-height: 160px;
        }
        .lv-card__preview img {
          max-width: 100%;
          max-height: 96px;
          height: auto;
          display: block;
        }
        .lv-card__body h3 {
          margin: 0 0 6px;
          font-size: 17px;
        }
        .lv-card__body p {
          margin: 0 0 12px;
          color: var(--ws-storm);
          font-size: 14px;
        }
        .lv-card__downloads {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        @media (max-width: 720px) {
          .lv-card { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
