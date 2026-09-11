// Typed enumeration of the brand assets surfaced by /media-kit pages.
// The actual files live under brand/ at the repo root and are mirrored
// into web/public/brand/ at build time by scripts/sync-brand.mjs.
// We don't read the filesystem from here — we maintain the enumeration
// explicitly so the build stays static and the media-kit pages can
// render at compile time without any runtime asset enumeration.

export type LogoVariant = {
  id: string;
  name: string;
  description: string;
  svg: string;
  pngs?: { size: number; href: string }[];
};

export type LogoGroup = {
  id: "mark" | "wordmark" | "lockup";
  title: string;
  blurb: string;
  variants: LogoVariant[];
};

export const LOGO_GROUPS: LogoGroup[] = [
  {
    id: "mark",
    title: "Mark",
    blurb:
      "The icon-only mark. A horizon line crossed by a sun-triangle (sail) above and a sea-triangle (hull) below. Built on a 24×24 grid for crisp rendering at 16, 32, and 48 px.",
    variants: [
      {
        id: "mark-color",
        name: "Full color",
        description:
          "Two-tone primary. --ws-sun for the sail, --ws-sea for the waterline and hull.",
        svg: "/brand/logo/mark/mark.svg",
        pngs: [
          { size: 16, href: "/brand/logo/mark/mark-16.png" },
          { size: 32, href: "/brand/logo/mark/mark-32.png" },
          { size: 48, href: "/brand/logo/mark/mark-48.png" },
          { size: 192, href: "/brand/logo/mark/mark-192.png" },
          { size: 512, href: "/brand/logo/mark/mark-512.png" },
        ],
      },
      {
        id: "mark-mono-black",
        name: "Mono — ink",
        description:
          "Single-color rendering for print, embossing, or any single-color context on a light surface.",
        svg: "/brand/logo/mark/mark-mono-black.svg",
      },
      {
        id: "mark-mono-white",
        name: "Mono — paper",
        description:
          "For dark or photographic backgrounds. Pair with a tinted scrim if the underlying contrast is unstable.",
        svg: "/brand/logo/mark/mark-mono-white.svg",
      },
    ],
  },
  {
    id: "wordmark",
    title: "Wordmark",
    blurb:
      "Lowercase 'weathership' in Inter 600 with custom kerning. Use when the mark would be redundant alongside running text.",
    variants: [
      {
        id: "wordmark-color",
        name: "Default (ink)",
        description: "--ws-ink on light surfaces.",
        svg: "/brand/logo/wordmark/wordmark.svg",
      },
      {
        id: "wordmark-mono-black",
        name: "Mono — ink",
        description: "Identical fill, kept as a separate file for symmetry with the mono lockups.",
        svg: "/brand/logo/wordmark/wordmark-mono-black.svg",
      },
      {
        id: "wordmark-mono-white",
        name: "Mono — paper",
        description: "For dark or photographic backgrounds.",
        svg: "/brand/logo/wordmark/wordmark-mono-white.svg",
      },
    ],
  },
  {
    id: "lockup",
    title: "Lockup",
    blurb:
      "Mark + wordmark combined. The horizontal lockup is the default; the stacked lockup fits square placements (avatars, app tiles, stickers).",
    variants: [
      {
        id: "lockup-horizontal",
        name: "Horizontal",
        description: "Mark left, wordmark right, baselines aligned.",
        svg: "/brand/logo/lockup/lockup-horizontal.svg",
      },
      {
        id: "lockup-stacked",
        name: "Stacked",
        description: "Mark above, wordmark centered below. Use for square placements.",
        svg: "/brand/logo/lockup/lockup-stacked.svg",
      },
      {
        id: "lockup-mono-black",
        name: "Horizontal — mono ink",
        description: "Single-color horizontal lockup on light surfaces.",
        svg: "/brand/logo/lockup/lockup-mono-black.svg",
      },
      {
        id: "lockup-mono-white",
        name: "Horizontal — mono paper",
        description: "Single-color horizontal lockup on dark surfaces.",
        svg: "/brand/logo/lockup/lockup-mono-white.svg",
      },
    ],
  },
];

export type SocialAsset = {
  id: string;
  name: string;
  description: string;
  width: number;
  height: number;
  svg: string;
  png?: string;
};

export const SOCIAL_ASSETS: SocialAsset[] = [
  {
    id: "og",
    name: "OpenGraph card",
    description: "Default OG / Twitter Card image. Used when this site is shared anywhere.",
    width: 1200,
    height: 630,
    svg: "/brand/social/og.svg",
    png: "/brand/social/og.png",
  },
  {
    id: "og-square",
    name: "OG square (1:1)",
    description: "Square crop for LinkedIn, Mastodon, and other 1:1 share contexts.",
    width: 1200,
    height: 1200,
    svg: "/brand/social/og.svg",
    png: "/brand/social/og-square.png",
  },
  {
    id: "twitter-banner",
    name: "Twitter / X banner",
    description: "Profile banner. Mark left, wordmark, tagline; wind chevrons trailing right.",
    width: 1500,
    height: 500,
    svg: "/brand/social/twitter-banner.svg",
    png: "/brand/social/twitter-banner.png",
  },
  {
    id: "avatar",
    name: "Profile avatar",
    description: "Square avatar. Mark on the --ws-ink surface.",
    width: 400,
    height: 400,
    svg: "/brand/social/avatar.svg",
    png: "/brand/social/avatar-400.png",
  },
];

export type ColorToken = {
  name: string;
  role: string;
  hex: string;
  rgb: string;
  hsl: string;
};

export const COLOR_TOKENS: ColorToken[] = [
  { name: "--ws-ink", role: "Primary text on light", hex: "#0E1726", rgb: "14, 23, 38", hsl: "217° 46% 10%" },
  { name: "--ws-paper", role: "Light surface", hex: "#F7F5EE", rgb: "247, 245, 238", hsl: "47° 31% 95%" },
  { name: "--ws-sea", role: "Primary brand accent", hex: "#1E5F7A", rgb: "30, 95, 122", hsl: "198° 61% 30%" },
  { name: "--ws-storm", role: "Secondary accent / meta", hex: "#3A4A5E", rgb: "58, 74, 94", hsl: "213° 24% 30%" },
  { name: "--ws-sun", role: "Highlight / illustrations", hex: "#E8B14A", rgb: "232, 177, 74", hsl: "40° 78% 60%" },
  { name: "--ws-fog", role: "Muted UI surface", hex: "#D6D2C4", rgb: "214, 210, 196", hsl: "47° 16% 80%" },
];

export type TypeRamp = {
  role: string;
  size: string;
  weight: string;
  lineHeight: string;
  tracking: string;
  family: "sans" | "mono";
};

export const TYPE_RAMP: TypeRamp[] = [
  { role: "Display", size: "56 px", weight: "600", lineHeight: "1.05", tracking: "-0.02em", family: "sans" },
  { role: "H1", size: "40 px", weight: "600", lineHeight: "1.15", tracking: "-0.015em", family: "sans" },
  { role: "H2", size: "28 px", weight: "600", lineHeight: "1.20", tracking: "-0.010em", family: "sans" },
  { role: "H3", size: "20 px", weight: "600", lineHeight: "1.30", tracking: "-0.005em", family: "sans" },
  { role: "Body", size: "17 px", weight: "400", lineHeight: "1.60", tracking: "0", family: "sans" },
  { role: "Body small", size: "14 px", weight: "400", lineHeight: "1.55", tracking: "0", family: "sans" },
  { role: "Caption", size: "13 px", weight: "500", lineHeight: "1.40", tracking: "0.01em", family: "sans" },
  { role: "Code (block)", size: "14 px", weight: "400", lineHeight: "1.60", tracking: "0", family: "mono" },
];
