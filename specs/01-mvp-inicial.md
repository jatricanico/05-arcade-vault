# 01 — MVP inicial: pantallas de Arcade Vault

**Estado:** Implementado
**Depende de:** —
**Fecha:** 2026-09-18

**Objetivo:** Portar las 5 pantallas del mockup en `references/templates/` (biblioteca, detalle de juego, reproductor, salón de la fama y autenticación) a componentes reales de Next.js App Router con TypeScript, conservando el diseño visual y el comportamiento simulado del mock.

## Alcance

**Incluye:**
- 5 pantallas navegables con rutas reales de Next.js App Router:
  - `/` — Biblioteca (grid de juegos, búsqueda, filtro por categoría).
  - `/juego/[id]` — Detalle de juego (info, tabla de mejores puntuaciones, botón jugar).
  - `/juego/[id]/jugar` — Reproductor (HUD, arena simulada, pausa, fin de juego, guardar puntuación).
  - `/salon-de-la-fama` — Ranking global por juego (podio + tabla, tabs por juego).
  - `/login` — Autenticación simulada (login / registro / invitado).
- Navbar (`Nav`) y footer persistentes en todas las pantallas, con menú móvil.
- Catálogo de 8 juegos hardcodeado (igual a `data.jsx`), sin backend.
- Estado de usuario (`av_user`) y puntuaciones (`av_scores`) persistidos en `localStorage`, igual que el mock.
- Gameplay simulado: el reproductor no ejecuta un juego real, solo el simulador falso del mock (score autoincremental, HUD, arena decorativa).
- Botones decorativos sin funcionalidad real: login con Google/GitHub, contador de "CRÉDITOS".
- Estilos portados casi literal desde `references/templates/styles.css` a `app/globals.css`, coexistiendo con Tailwind (Tailwind no se usa en estas pantallas nuevas).
- Componentes y datos tipados en TypeScript (`strict: true`).

**No incluye (queda para specs futuras):**
- Lógica jugable real de cualquiera de los 8 juegos.
- Autenticación real (contraseñas, backend, OAuth funcional).
- Persistencia en base de datos o backend propio.
- Sistema de créditos/monedas funcional.
- Internacionalización (todo queda en español, como el mock).

## Modelo de datos

Todo vive en el cliente (`localStorage` + módulo estático), sin backend ni base de datos.

```ts
// lib/data.ts
type GameCategory = "ARCADE" | "PUZZLE" | "SHOOTER" | "VERSUS";

interface Game {
  id: string;
  title: string;
  short: string;
  long: string;
  cat: GameCategory;
  cover: string;   // clase CSS del gradiente de portada (ej. "cover-bricks")
  color: "cyan" | "magenta" | "yellow" | "green";
  best: number;
  plays: string;
}

interface LeaderboardRow {
  rank: number;
  name: string;
  score: number;
  date: string; // dd/mm/aaaa
}

// GAMES: Game[] — los 8 juegos del mock, igual id/título/descr.
// CATS: readonly string[] — ["TODOS", "ARCADE", "PUZZLE", "SHOOTER", "VERSUS"]
// seededScores(seed: number, count?: number): LeaderboardRow[] — igual algoritmo pseudoaleatorio del mock, determinístico por seed.
```

```ts
// lib/storage.ts
interface User {
  name: string;
}

interface ScoreEntry {
  game: string;   // Game.id
  name: string;
  score: number;
  at: number;     // Date.now()
}

// localStorage keys: "av_user" (User | null), "av_scores" (ScoreEntry[])
// getUser(), setUser(user: User | null), addScore(entry: Omit<ScoreEntry, "at">)
```

El estado de usuario se comparte entre `Nav` y las páginas mediante un `AuthProvider` (React Context, client component) montado en `app/layout.tsx`, que lee/escribe `av_user` en `localStorage` y expone `user`, `login(user)`, `logout()`.

## Plan de implementación

1. **Datos y utilidades base.** Crear `lib/data.ts` (tipos, `GAMES`, `CATS`, `PLAYERS`, `seededScores`) y `lib/storage.ts` (tipos `User`/`ScoreEntry`, helpers de `localStorage`). Sin UI todavía; el proyecto sigue compilando con la home por defecto de `create-next-app`.
2. **Estilos globales.** Reemplazar `app/globals.css` incorporando el contenido de `references/templates/styles.css` (variables, fondo con grid/scanlines, clases `.av-*`, `.card`, `.crt`, etc.), conservando las directivas de Tailwind existentes al principio del archivo.
3. **Layout, Nav y AuthProvider.** Crear `components/AuthProvider.tsx` (client, Context de usuario) y `components/Nav.tsx` (client, navegación con `next/link` y `usePathname` para el estado activo, menú móvil). Actualizar `app/layout.tsx` para envolver `children` con `AuthProvider`, renderizar `Nav` y el footer fijo. El body ya no muestra la página default de Next.
4. **Biblioteca (`/`).** Crear `components/GameCard.tsx` y reemplazar `app/page.tsx` con la pantalla de biblioteca: hero, buscador, chips de categoría, grid de `GameCard` que navega a `/juego/[id]` con `next/link`.
5. **Detalle de juego (`/juego/[id]`).** Crear `app/juego/[id]/page.tsx`: info del juego, tags, stats, leaderboard vía `seededScores`, botón "Jugar ahora" (`Link` a `/juego/[id]/jugar`) y "Volver al vault".
6. **Reproductor (`/juego/[id]/jugar`).** Crear `app/juego/[id]/jugar/page.tsx` (client component): HUD, arena simulada, ciclo de score, pausa, modal de fin de juego con input de iniciales y botón "Guardar puntuación" que llama a `addScore` de `lib/storage.ts`.
7. **Salón de la fama (`/salon-de-la-fama`).** Crear `app/salon-de-la-fama/page.tsx` (client component, por los tabs): tabs por juego, podio top-3, tabla completa vía `seededScores`, fila destacada con el usuario actual si está logueado (usando `AuthProvider`).
8. **Login (`/login`).** Crear `app/login/page.tsx` (client component): tabs iniciar sesión/crear cuenta, formulario que llama a `login()` del `AuthProvider` y redirige a `/` con `useRouter`, botón "jugar como invitado" (`login(null)`), botones decorativos de Google/GitHub sin acción real.
9. **Verificación final.** Recorrer las 5 pantallas en `npm run dev`, correr `npm run lint` y `npm run build` sin errores.

## Criterios de aceptación

- [ x] `npm run build` compila sin errores de TypeScript ni de Next.js.
- [ x] `npm run lint` no reporta errores.
- [ x] `/` muestra el grid de los 8 juegos; el buscador y los chips de categoría filtran correctamente; sin resultados muestra el estado vacío.
- [ x] `/juego/[id]` muestra la info del juego correspondiente al `id` de la URL y una tabla de mejores puntuaciones generada por `seededScores`.
- [ x] `/juego/[id]/jugar` incrementa el score automáticamente mientras no está en pausa ni terminado; pausa detiene el incremento; "Fin" abre el modal con la puntuación final.
- [x ] Guardar la puntuación en el modal del reproductor persiste una entrada nueva en `av_scores` (`localStorage`) y muestra el mensaje de guardado.
- [ x] `/salon-de-la-fama` cambia de tabla al cambiar de tab de juego; muestra podio top-3 y, si hay usuario logueado, resalta su fila.
- [ x] `/login` con "Iniciar sesión"/"Crear cuenta" guarda un usuario en `av_user` (`localStorage`) y redirige a `/`; "Jugar como invitado" navega a `/` sin usuario.
- [ x] El navbar refleja el nombre de usuario logueado (o el botón "Iniciar Sesión" si no hay usuario) en todas las pantallas, incluso después de navegar entre rutas.
- [ x] El menú móvil de la navbar abre/cierra y permite navegar a las mismas rutas.
- [ x] El aspecto visual (colores, tipografías, fondo con grid/scanlines, tarjetas, CRT del reproductor) coincide con `references/templates/`.

## Decisiones tomadas y descartadas

- **Rutas reales de Next.js en vez de router por hash:** se descarta el router custom de `app.jsx` (`location.hash` + un solo componente `App`) a favor de `app/` con rutas de archivo, por ser el patrón nativo de Next.js App Router y dar URLs limpias.
- **Gameplay simulado, no juegos reales:** se mantiene el simulador falso del mock (score autoincremental, arena decorativa) porque programar la lógica jugable de los 8 juegos es un esfuerzo mayor que amerita specs propias, uno por juego (o por lote).
- **`localStorage` en vez de backend:** sin base de datos ni API routes en este MVP; el catálogo de juegos queda hardcodeado en `lib/data.ts` y el estado de usuario/puntuaciones vive en el navegador. Se revisará en una spec futura si se necesita persistencia real multi-dispositivo.
- **Autenticación simulada:** el formulario de login/registro no valida contraseña contra ningún servidor; cualquier nombre de usuario ingresado "loguea". Los botones de Google/GitHub son decorativos. Se deja explícito para no generar falsa sensación de seguridad.
- **CSS plano portado tal cual, sin reescribir a Tailwind:** se prioriza la fidelidad visual con el mock y la velocidad de entrega del MVP; convertir ~1000 líneas de CSS custom a utilidades Tailwind se descarta por alto riesgo de romper el diseño sin beneficio funcional inmediato.
- **Todo el código nuevo en TypeScript estricto:** se descarta portar los `.jsx` como JS suelto para no romper la coherencia con `tsconfig.json` (`strict: true`) del resto del repo.
- **Estado de usuario en Context (`AuthProvider`) en vez de prop-drilling entre páginas:** necesario porque en App Router cada ruta es una página independiente (a diferencia del mock, que tenía un único componente `App` con estado local); el Context permite que `Nav` y las páginas compartan `user` sin recargar `localStorage` en cada componente.

## Riesgos identificados

- **Divergencia visual al portar CSS:** clases como `.crt`, `.podium-slot`, `.cover-bg` dependen de contexto/anidamiento específico del mock; un copy-paste incompleto puede romper el efecto visual (CRT, scanlines, tilt de las cards). Mitigación: portar `styles.css` completo sin recortes y comparar visualmente contra `references/templates/Arcade Vault.html`.
- **Fuga de estado entre rutas del reproductor:** al no haber un componente `App` único, hay que asegurar que el estado del juego (score, vidas, pausa) se resetea correctamente al entrar/salir de `/juego/[id]/jugar` (Next.js remonta el componente de página en cada navegación, lo cual es el comportamiento esperado aquí).
- **Hidratación de `localStorage`:** leer `av_user`/`av_scores` en el primer render de un componente puede causar mismatch de hidratación en SSR; hay que inicializar ese estado en `useEffect` o marcar los componentes que lo usan como cliente puro, igual que hace el mock con `useState(() => ...)`.
