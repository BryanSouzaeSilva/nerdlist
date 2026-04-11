# 📜 NerdList

**NerdList** é uma plataforma completa de gerenciamento e catalogação de mídias, inspirada no Letterboxd, mas expandida para cobrir todo o universo geek: **Filmes, Séries, Animes, Mangás e Jogos**.

O projeto utiliza uma arquitetura de busca híbrida sincronizada entre três grandes provedores de dados, garantindo um catálogo vasto e informações detalhadas em tempo real.

## 🚀 Recursos Implementados

- **Cofre Nerd (Vault):** Sistema de perfil personalizado integrado ao **Supabase** para gerenciar listas por status (Em Andamento, Concluídos, Interesse, Pausados e Dropados).
- **Autenticação Completa:** Sistema de login seguro utilizando **Auth.js (NextAuth)**, com suporte a recuperação de senha via token.
- **Busca Híbrida Inteligente:** Integração em tempo real com **TMDB**, **Jikan (MyAnimeList)** e **RAWG**.
- **Performance Otimizada:** Implementação de estratégias de **Caching e Revalidação** no Next.js para mitigar o *cold start* de serviços gratuitos.
- **Arquitetura Serverless:** Deploy otimizado na **Vercel** com comunicação via **Connection Pooling (PgBouncer)** para garantir estabilidade nas conexões com o banco de dados.
- **Interface Premium:** Design responsivo com Tailwind CSS v4, suporte a carrosséis infinitos e estados de carregamento (Skeletons).

## 🛠️ Stack Tecnológica

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Autenticação:** Auth.js (NextAuth)
- **Banco de Dados (ORM):** Prisma
- **Estilização:** Tailwind CSS v4
- **Ícones:** Lucide React

### Backend
- **Framework:** NestJS (Hospedado no Render)
- **Banco de Dados:** PostgreSQL (via Supabase)
- **APIs Integradas:** - **TMDB API:** Filmes e Séries.
  - **Jikan API:** Animes e Mangás.
  - **RAWG API:** Games.

## 📡 Arquitetura de Dados

O NerdList utiliza uma estratégia de **Rastreamento de Fonte (Source Tracking)**, onde o ID de cada mídia é vinculado à sua API de origem. Isso evita colisões de dados e permite que o sistema saiba exatamente onde buscar informações detalhadas de cada categoria.

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

Desenvolvido por **Bryan Souza**. Projeto focado em demonstrar habilidades em Engenharia de Software, arquitetura de APIs distribuídas e Next.js moderno.