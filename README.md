# 🤓 NerdList

> **O seu hub definitivo de entretenimento.**
> Uma plataforma unificada para rastrear Filmes, Jogos, Animes e Mangás em um único lugar.

![Project Status](https://img.shields.io/badge/status-in%20development-orange)
![License](https://img.shields.io/badge/license-MIT-blue)

## 🎨 Sobre o Projeto

O **NerdList** é uma aplicação Full Stack desenvolvida para resolver a fragmentação de listas de entretenimento. Inspirado na estética imersiva da **Netflix**, nas funcionalidades sociais do **Letterboxd** e na organização visual de apps como o **Tomato**, o projeto visa centralizar o consumo de mídia.

O diferencial técnico é o uso de uma arquitetura **BFF (Backend for Frontend)**, onde o Backend normaliza dados de múltiplas APIs externas (TMDB, RAWG, Anilist) para entregar uma experiência padronizada ao Frontend.

### 🌟 Destaques de Design
* **Bento Grid Layout:** Organização de conteúdo em mosaicos dinâmicos.
* **Glassmorphism:** UI moderna com transparências e desfoques (blur).
* **Dark Mode Native:** Pensado para consumo noturno de conteúdo.

---

## 🚀 Tecnologias Utilizadas

O projeto segue a estrutura de **Monorepo**, dividindo responsabilidades de forma clara:

### 🖥️ Frontend (Client)
* **Framework:** [Next.js 14+](https://nextjs.org/) (App Router & Server Components)
* **Linguagem:** TypeScript
* **Estilização:** Tailwind CSS v4
* **Ícones:** Lucide React

### ⚙️ Backend (Server)
* **Framework:** [NestJS](https://nestjs.com/)
* **Arquitetura:** REST API com padrão MVC/Service
* **Linguagem:** TypeScript
* **Design Pattern:** DTOs e Interfaces Compartilhadas

---

## 🛠️ Como Rodar o Projeto

Pré-requisitos: Node.js (v18+) e NPM instalados.

### 1. Clone o repositório
```bash
git clone [https://github.com/BryanSouzaeSilva/nerdlist.git](https://github.com/BryanSouzaeSilva/nerdlist.git)
cd nerdlist

```

### 2. Inicie o Backend (Porta 3001)

Em um terminal:

```bash
cd backend
npm install
npm run start:dev

```

*O servidor iniciará em `http://localhost:3001` e a API estará disponível em `/movies`.*

### 3. Inicie o Frontend (Porta 3000)

Em **outro** terminal (na raiz do projeto):

```bash
cd frontend
npm install
npm run dev

```

*Acesse a aplicação no seu navegador em `http://localhost:3000*`

---

## 🧩 Arquitetura de Dados

Para lidar com diferentes tipos de mídia (Jogos vs Filmes), o sistema utiliza uma **Interface Unificada (`MediaItem`)**. O Backend atua como um adaptador:

1. **Entrada:** Dados brutos do TMDB (Filmes) ou RAWG (Jogos).
2. **Processamento:** Normalização no NestJS.
3. **Saída:** Objeto padronizado para o Next.js renderizar os Cards.

Exemplo da Entidade Mestra (TypeScript Interface):

```typescript
export interface MediaItem {
  id: string | number;
  source: 'TMDB' | 'RAWG' | 'ANILIST';
  type: 'MOVIE' | 'GAME' | 'ANIME';
  title: string;
  posterUrl: string;
  // ... outros campos padronizados
}

```

---

## 🗺️ Roadmap

* [x] Configuração do Monorepo (Next.js + NestJS)
* [x] Configuração do Tailwind CSS v4
* [x] Criação da Entidade Mestra (`MediaItem`)
* [x] Listagem de Filmes (Mock Data)
* [ ] **Integração real com API do TMDB** 🚧 *(Em progresso)*
* [ ] Módulo de Jogos (Integração RAWG)
* [ ] Módulo de Animes (Integração Anilist)
* [ ] Banco de Dados PostgreSQL (Salvar favoritos)
* [ ] Autenticação de Usuário

---

## 👨‍💻 Autor

Desenvolvido por **Bryan Souza** - Estudante de Engenharia de Software.

---