type Props = {
  href: string;
  label: string;
  sublabel?: string;
};

export default function AssetDownload({ href, label, sublabel }: Props) {
  return (
    <a className="asset-download" href={href} download>
      <span className="asset-download__label">{label}</span>
      {sublabel && <span className="asset-download__sub">{sublabel}</span>}
      <style>{`
        .asset-download {
          display: inline-flex;
          flex-direction: column;
          gap: 2px;
          padding: 8px 12px;
          border: 1px solid var(--ws-fog);
          border-radius: var(--ws-radius-sm);
          background: var(--ws-paper);
          color: var(--ws-ink);
          text-decoration: none;
          min-width: 88px;
          transition: background 120ms ease, border-color 120ms ease;
        }
        .asset-download:hover {
          background: var(--ws-fog);
          border-color: color-mix(in oklab, var(--ws-fog) 60%, var(--ws-storm));
        }
        .asset-download__label {
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.02em;
        }
        .asset-download__sub {
          font-size: 12px;
          color: var(--ws-storm);
        }
      `}</style>
    </a>
  );
}
