<div align="center">

# PonForge

**Crie landing pages profissionais sem escrever uma linha de código.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)

</div>

---

## O que é o PonForge?

PonForge é um SaaS de criação de landing pages focado em design premium e velocidade de publicação. A proposta é simples: você monta sua página por seções, personaliza no editor visual e publica com um clique — sem lidar com código, hospedagem ou configuração.

O produto é construído para criadores, freelancers e agências que precisam de resultado profissional sem o overhead de uma ferramenta complexa.

---

## O que está pronto

- **Autenticação completa** — login com e-mail/senha e Google OAuth, recuperação de senha, cadastro com confirmação por e-mail
- **Dashboard** — área autenticada com sidebar de navegação, topbar e menu do usuário
- **Perfil de usuário** — criado automaticamente no primeiro login (inclusive via OAuth), com dados do Google sincronizados
- **Sistema de planos** — Trial, Starter, Pro e Agency com controle de acesso por perfil
- **Proteção de rotas** — middleware server-side que bloqueia acesso não autenticado ao dashboard
- **Design system próprio** — paleta, tipografia e componentes consistentes em toda a interface

---

## O que está sendo construído

- **Editor visual por seções** — monte páginas combinando blocos prontos: Hero, Features, CTA, Testimonial, Footer. Cada seção tem props editáveis (textos, cores, imagens)
- **Templates premium** — designs prontos para clonar e adaptar em minutos
- **Publicação com URL pública** — cada projeto gera uma URL pública acessível em `/p/[slug]`
- **Brand Kit** — salve logo, paleta e fonte da sua marca para aplicar em todos os projetos
- **Planos e billing** — integração com Stripe para gestão de assinaturas

---

## Pon AI *(em desenvolvimento)*

A inteligência artificial do PonForge vai além de gerar copy.

O diferencial planejado é a análise de sites por URL: você cola o link de qualquer site que te inspira e a Pon AI extrai o estilo visual dele — paleta de cores, tipografia, espaçamentos, tom de voz — e aplica como ponto de partida para a sua página.

A ideia é eliminar o tempo gasto tentando replicar manualmente uma referência visual. Você indica a inspiração, a IA traduz em estrutura editável.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router) |
| Linguagem | TypeScript 5 |
| Estilização | Tailwind CSS v4 + shadcn/ui |
| Banco de dados | Supabase (PostgreSQL) |
| Autenticação | Supabase Auth — Email + Google OAuth |
| Storage | Supabase Storage |
| Estado global | Zustand |
| Deploy | Vercel |

---

## Planos

| Plano | Perfil |
|---|---|
| **Trial** | 7 dias com acesso completo, sem cartão |
| **Starter** | Para criadores e freelancers |
| **Pro** | Para times em crescimento |
| **Agency** | Acesso total, projetos ilimitados |

---

<div align="center">
  <sub>PonForge — design premium, publicação simples.</sub>
</div>
