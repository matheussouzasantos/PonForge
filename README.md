<div align="center">

<img src="public/logo.png" alt="PonForge Logo" width="80" />

# PonForge

**Turn design inspiration into launch-ready landing pages.**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com)
[![License](https://img.shields.io/badge/License-MIT-purple?style=flat-square)](LICENSE)

[Demo](#) · [Roadmap](#roadmap) · [Report Bug](#) · [Request Feature](#)

</div>

---

## ✦ O que é o PonForge?

PonForge é um SaaS para criação de landing pages premium. Escolha um template, personalize no editor visual, publique com um clique.

Sem código. Sem complicação. Resultado profissional.

---

## ✦ Features

- 🎨 **Templates premium** — designs prontos para clonar e editar
- ✏️ **Editor visual por seções** — edite textos, cores e imagens em tempo real
- 🤖 **Pon AI** — gere headlines e copy com inteligência artificial
- 🚀 **Publicação com um clique** — URL pública instantânea
- 🎨 **Design Systems** — presets de fonte + paleta aplicados globalmente
- 🏷️ **Brand Kit** — logo, cor e fonte da sua marca em todos os projetos

---

## ✦ Stack

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript |
| Estilização | Tailwind CSS + shadcn/ui |
| Banco de dados | Supabase (PostgreSQL) |
| Autenticação | Supabase Auth (Email + Google OAuth) |
| Storage | Supabase Storage |
| Estado | Zustand |
| AI | OpenAI API (gpt-4o-mini) |
| Deploy | Vercel |

---

## ✦ Estrutura do projeto
```
ponforge/
├── app/
│   ├── (auth)/          # Login, signup, forgot password
│   ├── (dashboard)/     # Dashboard, editor, templates
│   ├── auth/callback/   # Handler OAuth do Supabase
│   └── p/[slug]/        # Páginas públicas publicadas
├── components/
│   ├── editor/          # Canvas, painéis, lista de seções
│   ├── renderer/        # Componentes de seção (Hero, CTA...)
│   └── ui/              # Componentes compartilhados
├── lib/
│   ├── supabase.ts      # Client singleton
│   ├── types.ts         # Tipos TypeScript
│   └── templates/       # JSONs dos templates
└── hooks/               # useAutoSave, useProject...
```

---

## ✦ Rodando localmente

**Pré-requisitos:** Node.js 18+, conta no Supabase
```bash
# Clone o repositório
git clone https://github.com/seu-usuario/ponforge.git
cd ponforge

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local
# Edite o .env.local com suas chaves do Supabase

# Rode o projeto
npm run dev
```

Acesse `http://localhost:3000`

---

## ✦ Variáveis de ambiente

Crie um arquivo `.env.local` na raiz com:
```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui
```

---

## ✦ Roadmap

- [x] Autenticação (Email + Google)
- [x] Dashboard de projetos
- [ ] Templates premium
- [ ] Editor visual por seções
- [ ] Publicação com URL pública
- [ ] Pon AI — geração de copy
- [ ] Design Systems
- [ ] Brand Kit
- [ ] Domínio customizado
- [ ] Planos e billing (Stripe)

---

## ✦ Planos

| Plano | Descrição |
|---|---|
| **Trial** | 7 dias grátis com acesso completo |
| **Starter** | Para criadores e freelancers |
| **Pro** | Para times e agências em crescimento |
| **Agency** | Acesso total, projetos ilimitados |

---

## ✦ Licença

MIT © [PonForge](https://ponforge.com)

---

<div align="center">
  <sub>Feito com foco em design premium e simplicidade.</sub>
</div>