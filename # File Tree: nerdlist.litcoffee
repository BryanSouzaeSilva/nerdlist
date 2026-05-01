# File Tree: nerdlist

**Generated:** 01/05/2026, 18:49:40
**Root Path:** `/home/bryan/Documentos/nerdlist`

```
├── 📁 backend
│   ├── 📁 src
│   │   ├── 📁 movies
│   │   │   ├── 📁 dto
│   │   │   │   ├── 📄 create-movie.dto.ts
│   │   │   │   └── 📄 update-movie.dto.ts
│   │   │   ├── 📁 entities
│   │   │   │   └── 📄 movie.entity.ts
│   │   │   ├── 📄 movies.controller.ts
│   │   │   ├── 📄 movies.module.ts
│   │   │   └── 📄 movies.service.ts
│   │   ├── 📁 shared
│   │   │   └── 📁 interfaces
│   │   │       └── 📄 media-item.interface.ts
│   │   ├── 📄 app.controller.spec.ts
│   │   ├── 📄 app.controller.ts
│   │   ├── 📄 app.module.ts
│   │   ├── 📄 app.service.ts
│   │   └── 📄 main.ts
│   ├── 📁 test
│   │   ├── 📄 app.e2e-spec.ts
│   │   └── ⚙️ jest-e2e.json
│   ├── ⚙️ .gitignore
│   ├── ⚙️ .prettierrc
│   ├── 📝 README.md
│   ├── 📄 eslint.config.mjs
│   ├── ⚙️ nest-cli.json
│   ├── ⚙️ package-lock.json
│   ├── ⚙️ package.json
│   └── ⚙️ tsconfig.json
├── 📁 frontend
│   ├── 📁 app
│   │   ├── 📁 actions
│   │   │   ├── 📄 auth.ts
│   │   │   ├── 📄 list.ts
│   │   │   ├── 📄 reset.ts
│   │   │   └── 📄 review.ts
│   │   ├── 📁 animes
│   │   │   ├── 📄 loading.tsx
│   │   │   └── 📄 page.tsx
│   │   ├── 📁 api
│   │   │   └── 📁 auth
│   │   │       └── 📁 [...nextauth]
│   │   │           └── 📄 route.ts
│   │   ├── 📁 cadastro
│   │   │   └── 📄 page.tsx
│   │   ├── 📁 components
│   │   │   ├── 📁 profile
│   │   │   ├── 📄 BackButton.tsx
│   │   │   ├── 📄 CategoryFilters.tsx
│   │   │   ├── 📄 ChangelogModal.tsx
│   │   │   ├── 📄 ConditionalNavbar.tsx
│   │   │   ├── 📄 ListButton.tsx
│   │   │   ├── 📄 ListModal.tsx
│   │   │   ├── 📄 MediaCaroussel.tsx
│   │   │   ├── 📄 MediaGrid.tsx
│   │   │   ├── 📄 MobileHeader.tsx
│   │   │   ├── 📄 MobileNav.tsx
│   │   │   ├── 📄 Navbar.tsx
│   │   │   ├── 📄 ReviewForm.tsx
│   │   │   ├── 📄 SaveBadge.tsx
│   │   │   ├── 📄 SearchBar.tsx
│   │   │   ├── 📄 SearchInput.tsx
│   │   │   ├── 📄 SessionProvider.tsx
│   │   │   ├── 📄 SkeletonCard.tsx
│   │   │   ├── 📄 TrailerPlayer.tsx
│   │   │   └── 📄 UserMenu.tsx
│   │   ├── 📁 esqueci-senha
│   │   │   └── 📄 page.tsx
│   │   ├── 📁 filmes
│   │   │   ├── 📄 loading.tsx
│   │   │   └── 📄 page.tsx
│   │   ├── 📁 jogos
│   │   │   ├── 📄 loading.tsx
│   │   │   └── 📄 page.tsx
│   │   ├── 📁 login
│   │   │   └── 📄 page.tsx
│   │   ├── 📁 mangas
│   │   │   ├── 📄 loading.tsx
│   │   │   └── 📄 page.tsx
│   │   ├── 📁 movie
│   │   │   └── 📁 [id]
│   │   │       ├── 📄 loading.tsx
│   │   │       └── 📄 page.tsx
│   │   ├── 📁 nova-senha
│   │   │   └── 📄 page.tsx
│   │   ├── 📁 perfil
│   │   │   ├── 📁 [status]
│   │   │   │   ├── 📄 ClientStatusContent.tsx
│   │   │   │   └── 📄 page.tsx
│   │   │   ├── 📄 ClientProfileContent.tsx
│   │   │   └── 📄 page.tsx
│   │   ├── 📁 search
│   │   │   ├── 📄 loading.tsx
│   │   │   └── 📄 page.tsx
│   │   ├── 📁 series
│   │   │   ├── 📄 loading.tsx
│   │   │   └── 📄 page.tsx
│   │   ├── 📁 services
│   │   │   └── 📄 api.ts
│   │   ├── 📁 types
│   │   │   └── 📄 media-item.ts
│   │   ├── 📄 favicon.ico
│   │   ├── 🎨 globals.css
│   │   ├── 📄 layout.tsx
│   │   ├── 📄 not-found.tsx
│   │   └── 📄 page.tsx
│   ├── 📁 lib
│   │   └── 📄 prisma.ts
│   ├── 📁 prisma
│   │   └── 📄 schema.prisma
│   ├── 📁 public
│   │   ├── 🖼️ file.svg
│   │   ├── 🖼️ globe.svg
│   │   ├── 🖼️ next.svg
│   │   ├── 🖼️ vercel.svg
│   │   └── 🖼️ window.svg
│   ├── ⚙️ .gitignore
│   ├── 📝 README.md
│   ├── 📄 auth.ts
│   ├── 📄 eslint.config.mjs
│   ├── 📄 next-env.d.ts
│   ├── 📄 next.config.ts
│   ├── ⚙️ package-lock.json
│   ├── ⚙️ package.json
│   ├── 📄 postcss.config.mjs
│   └── ⚙️ tsconfig.json
├── ⚙️ .gitignore
└── 📝 README.md
```

---
*Generated by FileTree Pro Extension*