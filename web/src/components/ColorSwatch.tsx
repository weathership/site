import { useState } from "react";

type Props = {
  name: string;
  role: string;
  hex: string;
  rgb: string;
  hsl: string;
};

export default function ColorSwatch({ name, role, hex, rgb, hsl }: Props) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      setTimeout(() => setCopied((prev) => (prev === label ? null : prev)), 1500);
    } catch {
      // Clipboard may be unavailable in some embedded contexts; the displayed
      // value is selectable as a fallback.
    }
  };

  return (
    <div className="swatch" aria-label={`${name} — ${role}`}>
      <div
        className="swatch__chip"
        style={{ background: hex }}
        aria-hidden="true"
      />
      <div className="swatch__body">
        <div className="swatch__name">
          <code>{name}</code>
          <span className="swatch__role">{role}</span>
        </div>
        <ul className="swatch__values">
          <li>
            <button type="button" onClick={() => copy("hex", hex)}>
              <span className="swatch__label">HEX</span>
              <code>{hex}</code>
            </button>
            {copied === "hex" && <span className="swatch__copied">copied</span>}
          </li>
          <li>
            <button type="button" onClick={() => copy("rgb", `rgb(${rgb})`)}>
              <span className="swatch__label">RGB</span>
              <code>{rgb}</code>
            </button>
            {copied === "rgb" && <span className="swatch__copied">copied</span>}
          </li>
          <li>
            <button type="button" onClick={() => copy("hsl", `hsl(${hsl})`)}>
              <span className="swatch__label">HSL</span>
              <code>{hsl}</code>
            </button>
            {copied === "hsl" && <span className="swatch__copied">copied</span>}
          </li>
        </ul>
      </div>
      <style>{`
        .swatch {
          display: grid;
          grid-template-columns: 88px 1fr;
          gap: 16px;
          padding: 16px;
          border: 1px solid var(--ws-fog);
          border-radius: var(--ws-radius-md);
          background: var(--ws-paper);
        }
        .swatch__chip {
          width: 88px;
          height: 88px;
          border-radius: var(--ws-radius-sm);
          border: 1px solid color-mix(in oklab, var(--ws-fog) 60%, var(--ws-storm));
        }
        .swatch__name {
          display: flex;
          flex-direction: column;
          gap: 2px;
          margin-bottom: 10px;
        }
        .swatch__name code {
          font-size: 14px;
          font-weight: 600;
          color: var(--ws-ink);
        }
        .swatch__role {
          font-size: 13px;
          color: var(--ws-storm);
        }
        .swatch__values {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(3, max-content);
          gap: 8px 16px;
          align-items: center;
        }
        .swatch__values li {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .swatch__values button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 10px;
          border: 1px solid var(--ws-fog);
          background: transparent;
          border-radius: var(--ws-radius-sm);
          cursor: pointer;
          font-family: inherit;
        }
        .swatch__values button:hover { background: var(--ws-fog); }
        .swatch__label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.06em;
          color: var(--ws-storm);
        }
        .swatch__copied {
          font-size: 12px;
          color: var(--ws-sea);
        }
      `}</style>
    </div>
  );
}
