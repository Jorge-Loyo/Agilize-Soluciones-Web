# Tipografía - Clash Display

## Instrucciones

1. Ir a https://www.fontshare.com/fonts/clash-display
2. Click en "Download" → "Download Font Files"
3. Del ZIP descargado, extraer los archivos `.woff2` de estos pesos:
   - `ClashDisplay-Medium.woff2` (500)
   - `ClashDisplay-Semibold.woff2` (600)
   - `ClashDisplay-Bold.woff2` (700)
4. Colocarlos en esta carpeta (`public/fonts/`)

## Después de colocar los archivos

En `src/app/layout.tsx`, reemplazar:

```typescript
// ACTUAL (Syne como fallback):
import { Inter, Syne } from "next/font/google";

const displayFont = Syne({
  subsets: ["latin"],
  variable: "--font-clash-display",
  display: "swap",
  weight: ["500", "600", "700", "800"],
});
```

Por:

```typescript
// DEFINITIVO (Clash Display local):
import { Inter } from "next/font/google";
import localFont from "next/font/local";

const displayFont = localFont({
  src: [
    { path: "../../public/fonts/ClashDisplay-Medium.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/ClashDisplay-Semibold.woff2", weight: "600", style: "normal" },
    { path: "../../public/fonts/ClashDisplay-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-clash-display",
  display: "swap",
});
```

Eso es todo. El resto del código ya referencia `--font-clash-display`.
