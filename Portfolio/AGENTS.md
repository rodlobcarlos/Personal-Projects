# AGENTS.md - Portfolio Improvement Plan

## Project Overview
Full-stack portfolio website:
- **Frontend**: Angular 21 (SPA) - `myPortfolioFt/myPortfolioWeb/`
- **Backend**: Spring Boot 4 + MySQL - `myPortfolioBk/myPortfolioBk/`

## Build & Run Commands

### Frontend
```bash
cd myPortfolioFt/myPortfolioWeb
npm install
npm start          # Dev server on localhost:4200
npm run lint       # ESLint
npm test           # Vitest unit tests
npx ng build       # Production build
```

### Backend
```bash
cd myPortfolioBk/myPortfolioBk
./mvnw spring-boot:run    # Run server on localhost:8080
./mvnw test               # Run tests
./mvnw package            # Build JAR
```

## Code Style Conventions
- Angular standalone components with inline templates and styles
- OnPush change detection on all components
- Angular Signals for reactive state
- SCSS with glassmorphism design system (dark space theme)
- Prettier: 100 print width, single quotes
- ESLint with angular-eslint
- Backend: Lombok, Spring Data JPA, Log4j2

## Current State (all improvement phases implemented)

### Resolved fixes
- `about-me.spec.ts` uses `AboutComponent`; broken `<h1>` test removed from `app.spec.ts`
- Footer uses `font-weight: bold`; footer email is a `mailto:` link
- `ProjectService` uses `environment.apiUrl`; `environment.ts` has `production: true`; `environment.development.ts` uses `/api/projects` proxy
- Dead `myPortfolio/` directory removed; unused scaffold `.html`/`.scss` files deleted
- `ProjectService.java` `update()` persists via `projectRepository.save()`; `ProjectController.java` exposes `@PutMapping("/{id}")` and `@DeleteMapping("/{id}")`
- Roots: `{ path: '', redirectTo: 'CRLdev', pathMatch: 'full' }`
- `Welcome` -> `WelcomeComponent`, `Carrier` -> `CarrierComponent` (specs updated)
- Unused `CommonModule` imports and dead `arrowRotate` trigger removed
- `proxyConfig` removed from `angular.json` lint options (invalid for eslint builder)
- `ScrollRevealDirective` uses `inject()` instead of constructor injection

### SEO / Meta (index.html)
- Google Fonts (Karla) preconnected and loaded
- Title: "Carlos Rodriguez Lobato - Portfolio"
- Meta description, Open Graph tags, `theme-color` (#090A0F)
- `public/robots.txt` created

### Accessibility
- Tech logo `alt` attributes describe each tool
- `rel="noopener noreferrer"` on all external links
- `prefers-reduced-motion: reduce` respected in space background and scroll-reveal

## Recent Modifications

### i18n (`@ngx-translate/core`)
- Spanish/English translation via `@ngx-translate/core` + `@ngx-translate/http-loader`
- Loader configured in `app.config.ts` with `prefix: './i18n/'`, `suffix: '.json'`
- Translation files: `public/i18n/es.json` and `public/i18n/en.json`
- Language persisted in `localStorage['lang']`; `<html lang>` synced in `AppComponent`

### Navbar (`navbar.ts`)
`NavbarComponent` (added to `app.ts`, fixed at top, `z-index: 1000`):
- Glassmorphism on scroll: transparent -> blurred dark background (`rgba(9,10,15,0.7)` + `backdrop-filter: blur(12px)`) toggled by `@HostListener('window:scroll')`
- Active section tracked with `IntersectionObserver` (`rootMargin: '-20% 0px -60% 0px'`; retry loop in `observeSections()` since routed content renders async); active item highlighted cyan `#4ae3ff`
- `activeSection` set immediately on link click; smooth scroll via `scrollIntoView({ behavior: 'smooth' })`
- Mobile hamburger menu (slide-in panel, animated bars, Escape to close, `aria-expanded`, `aria-labels`)
- Language switcher (`es`/`en` pill buttons) calling `translate.use()`
- Nav items configured with `labelKey` (`NAV.HOME/ABOUT/TRAJECTORY/PROJECTS`) + `targetId`

### Tech stack by category (`carrier.ts`)
Skill cards replaced by a `techCategories` signal grouped into 5 cards:
- **Languages**: Java, Python, TypeScript, JavaScript
- **Frontend**: Angular, HTML5, CSS3
- **Backend**: Spring Boot, Node.js
- **Databases**: MongoDB, MySQL, Oracle
- **Cloud & DevOps**: Azure, Azure DevOps, Docker, GitHub Actions, Git, GitHub Copilot, CodeQL

Logo sources: local `assets/*.png` where available; devicon CDN (`https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/...`) for missing ones; Simple Icons CDN (`https://cdn.jsdelivr.net/npm/simple-icons@v16/icons/...`) for GitHub Copilot and CodeQL. All images `loading="lazy"` with `object-fit: contain`.

## Roadmap
- Phase 9 (Formatter): run Prettier across `src/` once i18n keys are finalized to avoid churn