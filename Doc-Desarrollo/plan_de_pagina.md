Para consolidar esta estructura y asegurar que el rendimiento sea impecable (sin tirones o jank de frames), necesitamos trazar el Plan de Refinamiento Cinético.

A continuación, te presento el mapa de ruta específico para pulir cada componente e igualar la experiencia táctil de la referencia, seguido de la acción inmediata que ejecutaremos hoy.

Plan de Refinamiento: De Funcional a Nivel Premium
Para pasar de una página con animaciones comunes a una experiencia inmersiva como la de Ideamos, debemos aplicar ingeniería de movimiento en cuatro frentes:

[Suavizado de Scroll (Lenis)] ──> [Física del Cursor (Lerp)] ──> [Líneas de Tiempo (GSAP)] ──> [Optimización WebGL (60 FPS)]

1. Sistema de Interacción y Feedback Visual
   Custom Cursor con Efecto de Inercia: No es solo un círculo que sigue al mouse; debe usar interpolación lineal (Lerp) para que tenga "peso" y persiga al puntero con un ligero retraso físico. Además, debe expandirse o transformarse (cambiar a texto como "Ver Proyecto") mediante GSAP al hacer hover sobre las tarjetas del portafolio.

Magnetismo en Botones: Los botones principales de llamadas a la acción deben atraer el cursor magnéticamente cuando este se acerque a un radio de 30px, creando una sensación de software de alta gama.

2. Sincronización del Portafolio Dinámico (Section Portfolio)
   Pinned Scroll Horizontal: Es la sección crítica. Mediante ScrollTrigger, debemos bloquear el scroll vertical (pin: true) mientras el usuario desliza el dedo o la rueda, transformando ese movimiento en un desplazamiento horizontal de los contenedores de tus proyectos (AGILIZE-GESTION y CasaDulceOriente).

Efecto Parallax en Imágenes: Las capturas .webp dentro de los mockups deben moverse a una velocidad ligeramente diferente (speed: "auto" o un multiplicador en el eje X) para generar sensación de profundidad tridimensional mientras se desplazan lateralmente.

3. Optimización de Renderizado (Capa WebGL)
   Gestión de Ciclo de Vida en ParticleBackground: Debemos sincronizar el método requestAnimationFrame de Three.js directamente con el "tick" global de Lenis. Si dejas que corran por separado, el navegador ejecutará cálculos redundantes, destruyendo la tasa de refresco en dispositivos móviles.
