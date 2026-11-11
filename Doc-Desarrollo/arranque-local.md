# Arranque Local — Agilize Soluciones Web

## Requisitos

- **Node.js** v20+ (recomendado: v20 LTS)
- **npm** v10+

Verificar:

```bash
node -v   # v20.x.x
npm -v    # 10.x.x
```

---

## Instalación (primera vez)

```bash
cd /c/Desarrollo/Agilize-Soluciones-Web/frontend
npm install
```

---

## Arrancar servidor de desarrollo

```bash
cd /c/Desarrollo/Agilize-Soluciones-Web/frontend
npm run dev
```

Abre en el navegador: **http://localhost:3000**

Si el puerto 3000 está ocupado, usar otro:

```bash
npm run dev -- --port 3001
```

---

## Variables de entorno

El proyecto funciona sin variables de entorno (formulario se envía pero no manda emails).

Para habilitar emails, crear `.env.local`:

```bash
cp .env.example .env.local
```

Editar `.env.local` con tus valores:

```env
# Resend (obtener en resend.com)
RESEND_API_KEY=re_tu_api_key
NOTIFICATION_EMAIL=tu-email@dominio.com

# Google Analytics 4 (opcional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## Comandos útiles

| Comando         | Qué hace                                                       |
| --------------- | -------------------------------------------------------------- |
| `npm run dev`   | Servidor de desarrollo (hot reload)                            |
| `npm run build` | Build de producción                                            |
| `npm start`     | Inicia el build de producción (requiere `npm run build` antes) |
| `npm run lint`  | Ejecuta ESLint                                                 |

---

## Build de producción (simular deploy)

```bash
cd /c/Desarrollo/Agilize-Soluciones-Web/frontend
npm run build
npm start
```

Abre: **http://localhost:3000**

---

## Matar procesos de desarrollo

Si el puerto queda ocupado:

```bash
# Encontrar y matar proceso en puerto 3000
npx kill-port 3000

# O manualmente:
netstat -ano | grep :3000
taskkill //F //PID XXXX
```

---

## Estructura del proyecto

```
frontend/
├── src/
│   ├── app/          → Páginas, layout, API routes, SEO
│   ├── components/
│   │   ├── sections/ → Hero, Solutions, Portfolio, Process, Contact, Stats, Navbar, Footer
│   │   ├── three/    → ParticleBackground (WebGL)
│   │   └── ui/       → CustomCursor, Lenis, Analytics, SplitText, StructuredData
│   ├── hooks/        → useSafeAnimation, useMagnetic, useResizeRefresh
│   └── lib/          → utils, globalRAF, leadRetry
├── public/
│   ├── fonts/        → Clash Display (.woff2) — descargar de fontshare.com
│   ├── images/       → Mockups de proyectos (.webp)
│   └── icons/        → PWA icons
├── .env.local        → Variables de entorno (no se sube a git)
└── .env.example      → Plantilla de variables
```

---

## Deploy (Vercel)

El sitio se despliega solo en Vercel: cada `git push` a `main` genera un deploy de producción.

- **Repo:** `Jorge-Loyo/Agilize-Soluciones-Web` (rama `main`)
- **Root Directory en Vercel:** `frontend`
- **Variables de entorno:** se configuran en Vercel → Settings → Environment Variables (`RESEND_API_KEY`, `NOTIFICATION_EMAIL`, `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_DOMAIN`). `.env.local` no se sube a git.
- **Dominio y DNS:** `agilizesoluciones.uk` está registrado en Cloudflare, que gestiona el DNS. Los registros que apuntan a Vercel van en modo **DNS only** (nube gris). No dejar registros del antiguo túnel (`*.cfargotunnel.com`).
- **Logs (incluye los `[LEAD]`):** Vercel → proyecto → Logs
- **Rollback:** Deployments → deploy anterior → Instant Rollback

Antes de subir, conviene verificar que el build pase en local con `npm run build`.

---

## Notas

- La tipografía display usa **Syne** (Google Fonts) como fallback. Para usar **Clash Display** descargar los `.woff2` de [fontshare.com/fonts/clash-display](https://www.fontshare.com/fonts/clash-display) y seguir las instrucciones en `public/fonts/README.md`.
- Las partículas WebGL se adaptan automáticamente al rendimiento del dispositivo.
- El formulario guarda los datos en localStorage si falla el envío y reintenta automáticamente en la próxima visita.
