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

## Improvement Plan

### Phase 1: Critical Bugs & Security
1. Fix `about-me.spec.ts` import: `AboutMe` -> `AboutComponent`
2. Remove broken test in `app.spec.ts` (expects `<h1>` that doesn't exist)
3. Fix CSS `font-style: bold` -> `font-weight: bold` in footer
4. Use `environment.apiUrl` in `ProjectService` instead of hardcoded URL
5. Set `production: true` in `environment.ts`
6. Remove dead `myPortfolio/` directory

### Phase 2: Backend Fixes
7. Fix `update()` in `ProjectService.java` to call `projectRepository.save()`
8. Add `@PutMapping` and `@DeleteMapping` endpoints in `ProjectController.java`

### Phase 3: SEO & Meta Tags
9. Load Google Fonts (Karla) in `index.html`
10. Update `<title>` to "Carlos Rodriguez Lobato - Portfolio"
11. Add `<meta name="description">`
12. Add Open Graph meta tags
13. Add `<meta name="theme-color">`
14. Create `robots.txt`

### Phase 4: Accessibility
15. Fix tech logo `alt` attributes (Python, Java, Angular, etc.)
16. Add `rel="noopener noreferrer"` to all external links
17. Change footer email to `mailto:` link
18. Make scroll arrow keyboard accessible
19. Add `prefers-reduced-motion` media query
20. Respect `prefers-reduced-motion` in space background

### Phase 5: Performance
21. Add `loading="lazy"` to tech logo images

### Phase 6: Code Quality
22. Add root route redirect in `app.routes.ts`
23. Rename `Welcome` -> `WelcomeComponent`
24. Rename `Carrier` -> `CarrierComponent`
25. Update imports in `my-portfolio.ts`
26. Remove unused `CommonModule` imports
27. Remove dead `arrowRotate` animation trigger
28. Fix `environment.development.ts` for local proxy
29. Delete unused scaffold `.html` and `.scss` files

### Phase 7: Content & Spelling
30. "My trayectory" -> "My trajectory"
31. "especializing" -> "specializing"
32. "work metodology" -> "work methodology"
33. "practices on Atos" -> "practices at Atos"
34. Improve tech section description text
