# 📜 NerdList

**NerdList** é uma plataforma completa de gerenciamento e catalogação de mídias, inspirada no Letterboxd, mas expandida para cobrir todo o universo geek: **Filmes, Séries, Animes, Mangás e Jogos**.

O projeto utiliza uma arquitetura de busca híbrida sincronizada entre três grandes provedores de dados, garantindo um catálogo vasto e informações detalhadas em tempo real.

## 🚀 Principais Recursos

  - **Cofre Nerd (Vault):** Sistema de perfil personalizado onde usuários podem gerenciar suas listas por status (Em Andamento, Concluídos, Interesse, Pausados e Dropados).
  - **Favoritos Absolutos (Pins):** Vitrine de destaque no perfil que permite fixar uma mídia favorita de cada categoria.
  - **Busca Híbrida Inteligente:** Integração em tempo real com **TMDB**, **Jikan (MyAnimeList)** e **RAWG**.
  - **Source Tracking:** Tecnologia implementada no backend para evitar colisões de IDs entre diferentes provedores, garantindo a integridade dos dados.
  - **Localização Inteligente:** Busca e descrições otimizadas para PT-BR através de regras de interceptação no fluxo de dados do TMDB.
  - **Gamificação:** Sistema de Nível e XP baseado na interação do usuário com o catálogo (mockado).
  - **Interface Premium:** Design responsivo com suporte a carrosséis infinitos, grids dinâmicos e temas de cores por categoria de mídia.

## 🛠️ Tecnologias Utilizadas

### Frontend

  - **Framework:** Next.js 15 (App Router)
  - **Estilização:** Tailwind CSS v4 (utilizando novos padrões de gradientes lineares)
  - **Ícones:** Lucide React
  - **Gerenciamento de Estado:** Hooks customizados e LocalStorage API

### Backend

  - **Framework:** NestJS
  - **Comunicação:** Axios + RxJS Observables
  - **APIs Integradas:** - **TMDB API:** Filmes, Séries e localização de Animes populares.
      - **Jikan API:** Base de dados exaustiva para Animes e Mangás.
      - **RAWG API:** Banco de dados de Games.

## 📡 Arquitetura de Dados

O NerdList utiliza uma estratégia de **Rastreamento de Fonte**, onde o ID de cada mídia é vinculado à sua API de origem durante o tráfego entre Cliente e Servidor. Isso permite:

1.  Pesquisar animes no TMDB para obter descrições em português.
2.  Utilizar o Jikan como fallback para animes de nicho ou mangás.
3.  Evitar que um ID do TMDB carregue acidentalmente uma mídia diferente do MyAnimeList.

## ⚙️ Configuração do Projeto

### Pré-requisitos

  - Node.js (v18+)
  - Chaves de API para TMDB, RAWG e MyAnimeList (Jikan).

### Instalação

1.  Clone o repositório:

<!-- end list -->

```bash
git clone https://github.com/seu-usuario/nerdlist.git
```

2.  Configure as variáveis de ambiente:
    Crie um arquivo `.env` na raiz do `/backend` e `/frontend`.

<!-- end list -->

```env
# Backend
TMDB_API_KEY=sua_chave
RAWG_API_KEY=sua_chave
TMDB_API_URL=https://api.themoviedb.org/3

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001
```

3.  Instale as dependências e inicie:

<!-- end list -->

```bash
# No Backend
npm install
npm run start:dev

# No Frontend
npm install
npm run dev
```

## 😜 Autor

Desenvolvido por **Bryan Souza**. Projeto focado em demonstrar habilidades em arquitetura de APIs, Next.js moderno e design de experiência do usuário.