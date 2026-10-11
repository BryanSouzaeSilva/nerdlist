# 📜 NerdList

**NerdList** é uma plataforma completa de gerenciamento e catalogação de mídias, inspirada no Letterboxd, mas expandida para cobrir todo o universo geek: **Filmes, Séries, Animes, Mangás e Jogos**.

O projeto utiliza uma arquitetura de busca híbrida sincronizada entre três grandes provedores de dados, garantindo um catálogo vasto e informações detalhadas em tempo real.

## 🚀 Recursos Implementados

- **Cofre Nerd (Vault):** Sistema de perfil personalizado integrado ao **Supabase** para gerenciar listas por status (Em Andamento, Concluídos, Interesse, Pausados e Dropados).
- **Sistema de Reviews e Notas:** Avaliação interativa (0.5 a 5 estrelas) com feedback em texto, permitindo que os usuários justifiquem suas opiniões sobre as obras e visualizem seus históricos na aba "Reviews" do perfil.
- **Autenticação Completa:** Sistema de login seguro utilizando **Auth.js (NextAuth)**, com suporte a contas sociais (Google/Discord) e recuperação de senha.
- **Busca Híbrida Inteligente:** Integração em tempo real com **TMDB**, **Jikan (MyAnimeList)** e **RAWG**, incluindo sistema de *debounce* para otimização de requisições.
- **Design Adaptativo & Mobile-First:** Interface fluida que substitui a barra de navegação superior por um menu inferior ergonômico em dispositivos móveis.
- **Interface Premium:** Design responsivo com Tailwind CSS v4, suporte a carrosséis, estados de carregamento (Skeletons) e animações suaves via Framer Motion.
- **Changelog Dinâmico:** Modal de notas de atualização (Release Notes) utilizando `localStorage` e `sessionStorage` para manter os usuários informados sem poluição visual repetitiva.

## 🛠️ Stack Tecnológica

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Autenticação:** Auth.js (NextAuth)
- **Banco de Dados (ORM):** Prisma
- **Estilização:** Tailwind CSS v4
- **Animações:** Framer Motion
- **Ícones:** Lucide React

### Backend
- **Framework:** NestJS (Hospedado no Render)
- **Banco de Dados:** PostgreSQL (via Supabase)
- **APIs Integradas:**
  - **TMDB API:** Filmes e Séries.
  - **Jikan API:** Animes e Mangás.
  - **RAWG API:** Games.

## 📡 Arquitetura e Decisões Técnicas

- **Rastreamento de Fonte (Source Tracking):** O ID de cada mídia é vinculado à sua API de origem. Isso evita colisões de dados e permite que o sistema saiba exatamente onde buscar informações detalhadas de cada categoria.
- **Caching no Backend:** O NestJS utiliza estratégias de cache nativo para mitigar limites de taxa (Rate Limit 429), especificamente da API do Jikan, garantindo carregamentos rápidos (de 5.5s para 2.5s) na página inicial.
- **Otimização de Custos (Vercel):** Para contornar os limites de otimização de imagem do plano gratuito da Vercel, o `next.config.ts` utiliza `unoptimized: true` globalmente. Isso previne o bloqueio de requisições por esgotamento da cota, aproveitando a otimização nativa já fornecida pelas APIs do TMDB e RAWG.
- **Connection Pooling:** Comunicação otimizada com o PostgreSQL através do Supabase Session Pooler (porta 6543) com `pgbouncer=true`, garantindo estabilidade nas transações do Prisma ORM no ambiente Serverless da Vercel.

## ⚙️ Configuração do Ambiente

### Variáveis de Ambiente Necessárias

#### Backend (.env)
```env
TMDB_API_KEY=sua_chave
RAWG_API_KEY=sua_chave
# URL do Banco de Dados (Use a porta 5432 para migrações locais)
DATABASE_URL="postgresql://postgres:[SENHA]@db.[ID].supabase.co:5432/postgres"

```

#### Frontend (.env)

```env
NEXT_PUBLIC_API_URL=[https://sua-api-no-render.com](https://sua-api-no-render.com)
# URL do Banco com Pooler (Obrigatório para Deploy na Vercel - Porta 6543)
DATABASE_URL="postgresql://postgres.[ID]:[SENHA]@[aws-0-pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1](https://aws-0-pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1)"
AUTH_SECRET=seu_secret_gerado
NEXTAUTH_URL=[https://seu-dominio.com.br](https://seu-dominio.com.br)

```

## 🚀 Instalação e Execução

1. **Clone o repositório:**
```bash
git clone [https://github.com/BryanSouzaeSilva/nerdlist.git](https://github.com/BryanSouzaeSilva/nerdlist.git)

```


2. **Backend:**
```bash
cd backend
npm install
npm run start:dev

```


3. **Frontend:**
```bash
cd frontend
npm install
npx prisma generate
npm run dev

```



## 😜 Autor

Desenvolvido por **Bryan Souza**. Projeto focado em demonstrar habilidades em Engenharia de Software, arquitetura de APIs distribuídas e desenvolvimento moderno com Next.js e NestJS.