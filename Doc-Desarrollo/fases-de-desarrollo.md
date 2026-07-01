# Plan de Desarrollo por Fases - Agilize Soluciones Web

> **Proyecto:** Landing Page Premium de Captación  
> **Stack:** Next.js 16 + GSAP + Three.js + Lenis + Tailwind v4 + Resend  
> **Directorio:** `C:\Desarrollo\Agilize-Soluciones-Web\frontend\`  
> **Deploy:** VM propia + Túnel (Cloudflare Tunnel / ngrok) → Dominio custom  

---

## Estado Actual ✅

Lo que ya está construido y compilando:

- [x] Proyecto Next.js 16 inicializado (App Router, TypeScript, Tailwind v4)
- [x] Dependencias instaladas (GSAP, Lenis, Three.js, R3F, Resend)
- [x] Paleta de colores definida (negro #0f0f11, dorado #d4af37, slate oscuro)
- [x] Tipografías configuradas (Inter body + Syne display como fallback)
- [x] Estructura de carpetas (sections, three, ui, lib, api)
- [x] LenisProvider (smooth scroll global)
- [x] Navbar con glassmorphism + animación GSAP de entrada
- [x] Hero con timeline GSAP + fondo de partículas WebGL
- [x] Sección Soluciones (2 verticales con tarjetas 3D tilt)
- [x] Sección Portafolio (scroll horizontal pinned con ScrollTrigger)
- [x] Sección Proceso (timeline vertical animada)
- [x] Sección Contacto (formulario multi-step con micro-animaciones)
- [x] Footer
- [x] API Route `/api/leads` (Resend emails, Edge Runtime)
- [x] Build exitoso ✓
- [x] Hook `useSafeAnimation.ts` creado

---

## FASE 1 — Refinamiento Cinético (Experiencia Premium)
> **Objetivo:** Pasar de "funcional con animaciones" a "experiencia inmersiva nivel Ideamos"  
> **Duración estimada:** 2-3 sesiones de trabajo  

### 1.1 Custom Cursor con Física (Lerp)
- [x] Crear componente `CustomCursor.tsx` con interpolación lineal
- [x] Implementar lerp (factor 0.1-0.15) para peso/inercia del cursor
- [x] Estado expandido al hover sobre tarjetas (escala + texto "Ver")
- [x] Estado dot al hover sobre links/botones
- [x] Ocultar cursor nativo (`cursor: none`) solo en desktop
- [x] Transiciones suaves entre estados con GSAP

### 1.2 Magnetismo en Botones CTA
- [x] Crear hook `useMagnetic.ts` 
- [x] Radio de atracción: 30-50px
- [x] Aplicar a botones principales ("Agenda tu consulta", "Solicita auditoría")
- [x] Efecto de retorno elástico al salir del radio
- [x] Solo activar en desktop (no mobile)

### 1.3 Sincronización Lenis + Three.js
- [x] Unificar el RAF loop: Lenis y Three.js en un solo `requestAnimationFrame`
- [x] Crear `globalRAF.ts` manager singleton compartido
- [x] Evitar doble cálculo de frames (Lenis ticker + R3F useFrame)
- [ ] Testear en dispositivos móviles simulados (60fps estable)

### 1.4 Parallax en Portafolio
- [x] Agregar efecto parallax en imágenes de mockups (velocidad 0.8x vs scroll)
- [x] Las imágenes se mueven ligeramente en contra del desplazamiento horizontal
- [x] Efecto de fade-in + scale en cada tarjeta al entrar al viewport

### 1.5 Transiciones de Revelado (Polish)
- [x] Refinar stagger de Hero (split text letra por letra en título)
- [x] Agregar clip-path reveal en secciones (wipe de abajo hacia arriba)
- [x] Micro-animación de las tecnologías/pills en sección Soluciones
- [x] Counter animado si se agrega sección de stats

### 1.6 GSAP Context / MatchMedia — Clean-up de Memoria ⚠️ CRÍTICO
> React y Next.js (con StrictMode) montan y desmontan componentes dos veces en desarrollo.
> Sin aislamiento dentro de `gsap.context()`, se crean instancias duplicadas de ScrollTrigger
> que causan parpadeos (glitches) y fugas de memoria al navegar o redimensionar.

- [x] Crear hook `useSafeAnimation.ts` en `src/hooks/` (wrapper de gsap.context)
- [x] Migrar TODAS las secciones existentes para usar `useSafeAnimation` en lugar de `useEffect` + `gsap.context` manual
- [ ] Verificar que al navegar entre páginas (si se agregan) no quedan triggers zombies
- [x] Implementar `gsap.matchMedia()` para condicionar animaciones por breakpoint
- [ ] Test: montar/desmontar componentes rápidamente → cero instancias huérfanas en memory profiler

### 1.7 Killers de Animación en Resize ⚠️ CRÍTICO
> Si el usuario rota el celular o redimensiona el navegador, los cálculos de posición
> de ScrollTrigger quedan obsoletos y las secciones pinned se desencajan.

- [x] Implementar `ScrollTrigger.refresh()` en evento `resize` con debounce (300ms)
- [x] Recalcular el ancho total del track horizontal en Portafolio on resize
- [x] Agregar `invalidateOnRefresh: true` en todos los ScrollTriggers
- [ ] Test: rotar emulador iOS/Android → la sección pinned se re-alinea correctamente

**Criterio de completitud:** El scroll de la página se siente "pesado y líquido", el cursor tiene personalidad, no hay ningún jank visual a 60fps, y no existen fugas de memoria ni glitches al resize/rotación.

---

## FASE 2 — Contenido y Assets Visuales
> **Objetivo:** Reemplazar placeholders con contenido real y optimizado  
> **Duración estimada:** 1-2 sesiones  

### 2.1 Tipografía Definitiva
- [x] Descargar Clash Display de [Fontshare](https://www.fontshare.com/fonts/clash-display)
- [x] Colocar archivos `.woff2` en `public/fonts/`
- [x] Migrar de Syne (Google Fonts) a `localFont` con Clash Display
- [x] Verificar pesos: Medium (500), Semibold (600), Bold (700)

### 2.2 Imágenes y Mockups
- [x] Crear mockups de Agilize Gestión (capturas del dashboard en dispositivos)
- [x] Crear mockups de Casa Dulce Oriente (tienda en mobile/desktop)
- [x] Crear mockups de Infodets (home + consulta IA)
- [x] Exportar en formato `.webp` con calidad 80-85%
- [x] Crear versiones responsive (640w, 1024w, 1920w)
- [x] Implementar `next/image` con sizes y priority donde corresponda
- [x] CSS device frames (laptop + phone) para presentación premium

### 2.3 Favicon y Branding
- [x] Diseñar/exportar favicon (SVG + PNG 32/192/512 + apple-touch-icon + maskable)
- [x] Open Graph image creada (1200x630 PNG)
- [x] Agregar manifest.json para PWA básica

### 2.4 Copys Finales
- [x] Revisar y pulir todos los textos de cada sección
- [x] Ajustar propuesta de valor del Hero (A/B test ready)
- [x] Verificar CTAs: claridad, urgencia, beneficio

### 2.5 Optimización de Shaders / Texturas WebGL
> Las imágenes usadas en el Canvas de Three.js deben tener dimensiones en potencia de dos
> (1024×1024, 2048×2048) para que la GPU las procese nativamente sin ralentizar el primer render.

- [x] Verificar que todas las texturas cargadas en Three.js sean potencia de 2 (no usamos texturas, solo partículas ✔️)
- [ ] Precargar texturas con `useLoader` o `useTexture` de @react-three/drei (cuando se agreguen)
- [x] Implementar placeholder/fallback mientras las texturas cargan (gradiente de fallback)
- [x] Optimizar rendimiento WebGL para mobile (detección de tier, reducción de partículas)
- [ ] Comprimir texturas con herramientas como `basis_universal` o `ktx2` si el peso supera 500KB

**Criterio de completitud:** No hay placeholders visibles, todas las imágenes cargan en formato optimizado, texturas WebGL se precargan sin bloquear el render, y la identidad visual es coherente.

---

## FASE 3 — Responsividad y Accesibilidad
> **Objetivo:** Experiencia perfecta en todo dispositivo + accesible  
> **Duración estimada:** 1-2 sesiones  

### 3.1 Mobile First Polish
- [x] Hero: ajustar tamaños de tipografía y espaciado para <768px
- [x] Soluciones: stack vertical en mobile, tilt desactivado
- [x] Portafolio: scroll horizontal convertido a scroll vertical en mobile (o swipe)
- [x] Proceso: timeline solo lado izquierdo en mobile (animación desde abajo)
- [x] Contacto: formulario full-width con inputs más grandes (tap-friendly)
- [x] Navbar mobile: animación de apertura con GSAP (slide + fade + stagger)

### 3.2 Tablet / Breakpoints Intermedios
- [x] Verificar 768px-1024px (iPad landscape)
- [x] Cards de soluciones: 2 columnas en tablet (lg:grid-cols-2)
- [x] Portafolio: cards más anchas en tablet (md:w-[60vw])

### 3.3 Performance Mobile
- [x] Reducir partículas WebGL en mobile (de 1500 a 400-800 según tier)
- [x] Desactivar custom cursor en touch devices
- [x] Lazy load de Three.js canvas (dynamic import con ssr:false)
- [ ] Verificar con Lighthouse: target > 90 en Performance

### 3.4 Accesibilidad (a11y)
- [x] `aria-labels` en todos los botones e iconos
- [x] Focus states visibles (focus:ring-2 + :focus-visible global)
- [x] Skip-to-content link
- [x] Verificar contraste de colores (WCAG AA mínimo — dorado sobre negro)
- [x] Prefers-reduced-motion: desactivar animaciones complejas (CSS + WebGL)
- [x] Formulario: mensajes de error accesibles con aria-live + role progressbar

### 3.5 Desconexión Estructural de Lenis en Mobile ⚠️ IMPORTANTE
> En iOS Safari y Android medianos, el smooth scroll por software genera conflictos con la
> inercia nativa del scroll táctil (el "rebote" del dedo). Forzar Lenis en estos dispositivos
> produce una experiencia peor que el scroll nativo.

- [x] Detectar dispositivo touch (`'ontouchstart' in window` + `navigator.maxTouchPoints`)
- [x] Desactivar Lenis completamente en pantallas < 768px (touch + small)
- [x] Alternativa: reducir `duration` de Lenis a 0.5 en mobile (suavizado mínimo sin interferir)
- [ ] Verificar en iPhone real (Safari iOS) que el scroll se siente nativo
- [ ] Verificar que `position: sticky` sigue funcionando sin Lenis en mobile
- [x] Actualizar `LenisProvider.tsx` con condicional de breakpoint

**Criterio de completitud:** Lighthouse > 90 en todas las categorías, funciona perfectamente en iPhone SE hasta 4K, cumple WCAG 2.1 AA, y el scroll táctil en mobile se siente nativo.

---

## FASE 4 — SEO y Meta
> **Objetivo:** Posicionamiento orgánico óptimo desde el día 1  
> **Duración estimada:** 1 sesión  

### 4.1 SEO Técnico
- [x] Verificar metadata en layout.tsx (title, description, OG, Twitter cards)
- [x] Structured Data (JSON-LD): Organization + LocalBusiness
- [x] Sitemap dinámico (`app/sitemap.ts`)
- [x] Robots.txt (`app/robots.ts`)
- [x] Canonical URL: `agilizesoluciones.uk` (redirect 301 www → apex en Cloudflare)

### 4.2 Performance SEO
- [ ] Verificar Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1
- [x] Preload de fuentes críticas (next/font con display:swap)
- [x] Verificar que el contenido principal es renderizado en servidor (SSR/SSG — page.tsx es static)
- [x] Configurar compresión Brotli + Early Hints + Speed Brain en Cloudflare

### 4.3 Analytics
- [x] Integrar Google Analytics 4 (componente Analytics con Script afterInteractive)
- [x] Eventos custom: scroll_depth, form_step_completed, lead_submitted
- [x] Configurar conversiones (formulario enviado = lead_submitted event)

**Criterio de completitud:** PageSpeed Insights > 95, structured data validado, analytics tracking confirmado.

---

## FASE 5 — Integración Backend y Leads
> **Objetivo:** Pipeline de leads funcional end-to-end  
> **Duración estimada:** 1-2 sesiones  

### 5.1 Resend Configuración
- [x] Crear cuenta en Resend + verificar dominio
- [x] Configurar DNS (SPF, DKIM, DMARC)
- [x] Obtener API key y configurar en `.env.local` en la VM
- [x] Testear envío de email de notificación (a ti)
- [x] Testear envío de email de confirmación (al prospecto)

### 5.2 Validación y Seguridad
- [x] Rate limiting en API route (máx 5 requests/minuto por IP)
- [x] Honeypot field anti-spam en formulario
- [x] Sanitización de inputs (prevenir XSS en emails HTML)
- [x] Validación server-side con zod

### 5.3 Monitoreo de Leads
- [x] Log de leads enviados (stdout para PM2 logs)
- [ ] Alerta en Slack/Discord cuando llega un lead (webhook opcional)
- [ ] Dashboard básico de leads (futuro: conectar con Agilize Gestión)

### 5.4 Fail-safe de Almacenamiento Local (Resiliencia de Leads) ⚠️ IMPORTANTE
> Si Resend está caído o la cuota gratuita se agotó, NO podemos perder el lead.
> El frontend debe capturar el error y garantizar el reintento transparente.

- [x] Implementar `try/catch` en el fetch del formulario con detección de error de red
- [x] Si falla: guardar `formData` en `localStorage` con timestamp y flag `pending: true`
- [x] Crear función `retryPendingLeads()` que se ejecute al cargar la página
- [x] Reintentar envío en background (máx 3 intentos con backoff exponencial)
- [x] Si el reintento tiene éxito: limpiar localStorage y loguear
- [x] El usuario SIEMPRE ve "¡Éxito!" — nunca sabe que hubo un fallo de red
- [x] Encriptar datos sensibles en localStorage (email) con ofuscación base64

**Criterio de completitud:** Un prospecto completa el formulario → recibes email al instante → él recibe confirmación → dato queda registrado. Si hay fallo de red, los datos se guardan localmente y se reintentan automáticamente sin que el usuario lo note.

---

## FASE 6 — Testing y QA Final
> **Objetivo:** Cero bugs, cero sorpresas en producción  
> **Duración estimada:** 1 sesión  

### 6.1 Testing Funcional
- [ ] Formulario: flujo completo step 1 → 2 → 3 → envío → confirmación
- [ ] Navegación: todos los anchor links funcionan con smooth scroll
- [ ] Navbar: glassmorphism aparece al scrollear, mobile menu funciona
- [ ] Portafolio: scroll horizontal funciona en Chrome, Firefox, Safari, Edge
- [ ] Animaciones: no hay glitches al resize de ventana

### 6.2 Cross-Browser
- [ ] Chrome (desktop + mobile)
- [ ] Firefox
- [ ] Safari (desktop + iOS)
- [ ] Edge
- [ ] Samsung Internet

### 6.3 Performance Audit
- [ ] Lighthouse: Performance > 90, Accessibility > 90, SEO > 95
- [ ] Bundle size: verificar que Three.js se carga lazy
- [ ] No memory leaks (verificar con Chrome DevTools > Memory)
- [ ] Animaciones estables a 60fps en mid-range Android

### 6.4 Contenido Final
- [ ] Revisar ortografía y gramática
- [ ] Links de redes sociales correctos
- [ ] Email de contacto correcto
- [ ] Política de privacidad (si aplica por analytics)

**Criterio de completitud:** QA manual completo aprobado, cero issues críticos o medios abiertos.

---

## FASE 7 — Deploy en VM y Lanzamiento
> **Objetivo:** Sitio en producción en tu VM, expuesto al mundo vía túnel + dominio propio  
> **Duración estimada:** 1-2 sesiones  

### 7.1 Preparación de Deploy
- [x] Verificar `.gitignore` (no subir `.env.local`, `.env.production`, `.next/`, `node_modules/`)
- [x] Dominio actualizado a `agilizesoluciones.uk` en todo el código
- [x] Crear repositorio en GitHub
- [x] Push inicial con todo el código

### 7.2 Configuración de la VM
- [x] Script `setup-vm.sh` creado (instala Node.js 20, PM2, cloudflared, firewall)
- [x] Instalar Node.js (v20 LTS) en la VM
- [x] Clonar repositorio en la VM
- [x] Instalar dependencias
- [x] Crear `.env.local` con variables reales (RESEND_API_KEY, NOTIFICATION_EMAIL)
- [x] Build de producción: `npm run build`
- [x] Iniciar servidor: via PM2 con ecosystem.config.js

### 7.3 Process Manager (Mantener vivo el servicio)
- [x] `ecosystem.config.js` configurado (restart policy, logs, graceful shutdown)
- [x] Script `deploy.sh` creado (pull + build + copy static + restart PM2)
- [x] Instalar PM2: `npm install -g pm2`
- [x] Configurar: `pm2 start ecosystem.config.js --env production`
- [x] Auto-restart en crash: `pm2 save && pm2 startup`
- [x] Verificar logs: `pm2 logs agilize-web`

### 7.4 Túnel y Dominio
- [x] Script `setup-tunnel.sh` creado (login + create tunnel + DNS + systemd)
- [x] Instalar Cloudflare Tunnel (`cloudflared`)
- [x] Configurar túnel apuntando a `localhost:3000`
- [x] Vincular túnel con dominio agilizesoluciones.uk
- [x] SSL automático vía Cloudflare (Full strict)
- [x] Redirect 301 www → apex configurado
- [x] Compresión Brotli + Early Hints + HTTP/3 activado

### 7.5 Seguridad y Hardening
- [x] Headers de seguridad: X-Frame-Options, CSP, HSTS, Permissions-Policy (en next.config.ts)
- [x] Firewall en VM configurado en setup-vm.sh (solo SSH, puerto 3000 NO expuesto)
- [ ] Rate limiting a nivel de Cloudflare (Bot Fight Mode)
- [ ] Monitorear uptime (UptimeRobot / Hetrix gratuito)

### 7.6 Post-Launch
- [x] Verificar emails funcionan en producción
- [ ] Submit sitemap a Google Search Console
- [ ] Verificar OG tags con [opengraph.xyz](https://www.opengraph.xyz/)
- [ ] Primer test de formulario real en producción
- [ ] Monitorear Core Web Vitals en Search Console (primeros 7 días)

### 7.7 Iteración (Post-Launch)
- [ ] Agregar más proyectos al portafolio según se completen
- [ ] Conectar leads con Agilize Gestión vía API interna
- [ ] Implementar blog (MDX + Next.js) para contenido SEO
- [ ] A/B testing de CTAs y propuesta de valor
- [ ] CI/CD: GitHub Actions → SSH deploy automático a la VM en cada push a main

**Criterio de completitud:** Sitio live en dominio propio vía túnel, PM2 manteniendo el proceso, SSL activo, formulario procesando leads, uptime monitoreado.

---

## Resumen de Esfuerzo Estimado

| Fase | Enfoque | Sesiones |
|------|---------|----------|
| 1 | Refinamiento Cinético + Clean-up + Resize | 3-4 |
| 2 | Contenido, Assets + Texturas WebGL | 1-2 |
| 3 | Responsividad + a11y + Lenis Mobile | 2 |
| 4 | SEO y Meta | 1 |
| 5 | Backend Leads + Resiliencia localStorage | 1-2 |
| 6 | Testing y QA | 1 |
| 7 | Deploy VM + Túnel + Dominio | 1-2 |
| **Total** | | **10-13 sesiones** |

---

## Convenciones de Trabajo

- **Cada sesión** = trabajamos una sub-fase completa (ej: 1.1 + 1.2)
- **Commit por tarea completada** con mensaje descriptivo
- **Marcar [x]** en este documento al completar cada item
- **Probar en dev** (`npm run dev`) después de cada cambio significativo
- **Build check** (`npx next build`) antes de marcar una fase como completa

---

## Archivos Clave de Implementación

Referencia rápida de hooks y utilidades que se crearán en Fase 1:

| Archivo | Propósito |
|---------|----------|
| `src/hooks/useSafeAnimation.ts` | Wrapper de `gsap.context()` para limpieza automática de ScrollTrigger |
| `src/hooks/useMagnetic.ts` | Hook de magnetismo para botones CTA |
| `src/hooks/useGlobalRAF.ts` | Loop unificado de requestAnimationFrame (Lenis + Three.js) |
| `src/components/ui/CustomCursor.tsx` | Cursor con física Lerp + estados |
| `src/lib/leadRetry.ts` | Sistema de reintento con localStorage (Fase 5) |
| `ecosystem.config.js` | Configuración de PM2 para producción en la VM (Fase 7) |

---

*Documento creado: Junio 2025*  
*Última actualización: Junio 2025 — Agregados puntos críticos 1.6, 1.7, 2.5, 3.5, 5.4 | Fase 7 reescrita para deploy en VM + Túnel (sin Vercel)*
