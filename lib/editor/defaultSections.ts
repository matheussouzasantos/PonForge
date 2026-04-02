import type { Section, SectionType } from '@/lib/types'

export function createDefaultSection(type: SectionType): Section {
  const id = crypto.randomUUID()

  switch (type) {
    case 'navbar':
      return {
        id, type,
        props: {
          logo: 'Minha Marca',
          links: [
            { label: 'Início', href: '#' },
            { label: 'Sobre', href: '#' },
            { label: 'Contato', href: '#' },
          ],
          ctaText: 'Começar',
          ctaUrl: '#',
        },
      }

    case 'hero':
      return {
        id, type,
        props: {
          variant: 'centered',
          headline: 'Título principal da sua página',
          subheadline: 'Uma descrição clara e objetiva do que você oferece e por que vale a pena.',
          primaryCtaText: 'Começar agora',
          primaryCtaUrl: '#',
          secondaryCtaText: 'Saiba mais',
          secondaryCtaUrl: '#',
        },
      }

    case 'logos':
      return {
        id, type,
        props: {
          title: 'Empresas que confiam em nós',
          items: [],
        },
      }

    case 'features':
      return {
        id, type,
        props: {
          variant: 'grid-3',
          label: 'Funcionalidades',
          title: 'Tudo que você precisa',
          subtitle: 'Recursos poderosos para acelerar o seu negócio.',
          items: [
            { icon: '⚡', title: 'Rápido', description: 'Performance otimizada para a melhor experiência.' },
            { icon: '🔒', title: 'Seguro', description: 'Seus dados protegidos com a melhor tecnologia.' },
            { icon: '🎯', title: 'Preciso', description: 'Resultados exatos para as suas necessidades.' },
          ],
        },
      }

    case 'benefits':
      return {
        id, type,
        props: {
          variant: 'image-left',
          label: 'Por que escolher',
          title: 'Diferenciais que fazem a diferença',
          items: [
            { title: 'Economia de tempo', description: 'Automatize tarefas e foque no que importa.' },
            { title: 'Fácil de usar', description: 'Interface intuitiva, sem necessidade de treinamento.' },
            { title: 'Suporte dedicado', description: 'Atendimento rápido sempre que precisar.' },
          ],
          ctaText: 'Ver mais',
          ctaUrl: '#',
        },
      }

    case 'steps':
      return {
        id, type,
        props: {
          label: 'Como funciona',
          title: 'Em 3 passos simples',
          steps: [
            { title: 'Crie sua conta', description: 'Cadastre-se gratuitamente em menos de 1 minuto.' },
            { title: 'Configure seu projeto', description: 'Personalize de acordo com a sua necessidade.' },
            { title: 'Publique e cresça', description: 'Lance seu projeto e comece a ver resultados.' },
          ],
        },
      }

    case 'testimonials':
      return {
        id, type,
        props: {
          variant: 'grid',
          label: 'Depoimentos',
          title: 'O que nossos clientes dizem',
          items: [
            { quote: 'Produto incrível! Transformou completamente a forma como trabalhamos.', authorName: 'Ana Silva', authorRole: 'CEO', authorCompany: 'Empresa X', rating: 5 },
            { quote: 'Atendimento excepcional e resultado acima do esperado.', authorName: 'Carlos Souza', authorRole: 'Diretor', authorCompany: 'Startup Y', rating: 5 },
          ],
        },
      }

    case 'pricing':
      return {
        id, type,
        props: {
          label: 'Planos',
          title: 'Escolha o plano ideal',
          subtitle: 'Comece gratuitamente e escale conforme crescer.',
          plans: [
            {
              name: 'Starter',
              price: 'Grátis',
              description: 'Perfeito para começar',
              features: ['1 projeto', '5 páginas', 'Suporte por email'],
              ctaText: 'Começar grátis',
              ctaUrl: '#',
            },
            {
              name: 'Pro',
              price: 'R$ 97',
              period: '/mês',
              description: 'Para quem quer crescer',
              features: ['Projetos ilimitados', 'Páginas ilimitadas', 'Suporte prioritário', 'Domínio próprio'],
              ctaText: 'Assinar Pro',
              ctaUrl: '#',
              highlighted: true,
              badge: 'Popular',
            },
          ],
        },
      }

    case 'faq':
      return {
        id, type,
        props: {
          label: 'FAQ',
          title: 'Perguntas frequentes',
          items: [
            { question: 'Como funciona o período de teste?', answer: 'Você tem 14 dias grátis com acesso completo, sem precisar de cartão de crédito.' },
            { question: 'Posso cancelar a qualquer momento?', answer: 'Sim, sem taxas ou burocracia. Cancele quando quiser diretamente no painel.' },
            { question: 'Preciso saber programar?', answer: 'Não. Nossa plataforma foi criada para qualquer pessoa usar com facilidade.' },
          ],
        },
      }

    case 'cta':
      return {
        id, type,
        props: {
          variant: 'centered',
          headline: 'Pronto para começar?',
          subheadline: 'Junte-se a milhares de pessoas que já transformaram seus negócios.',
          primaryCtaText: 'Começar agora',
          primaryCtaUrl: '#',
          secondaryCtaText: 'Falar com vendas',
          secondaryCtaUrl: '#',
        },
      }

    case 'footer':
      return {
        id, type,
        props: {
          logo: 'Minha Marca',
          tagline: 'Construindo o futuro, hoje.',
          columns: [
            { title: 'Produto', links: [{ label: 'Funcionalidades', href: '#' }, { label: 'Preços', href: '#' }] },
            { title: 'Empresa', links: [{ label: 'Sobre', href: '#' }, { label: 'Contato', href: '#' }] },
          ],
          copyright: `© ${new Date().getFullYear()} Minha Empresa. Todos os direitos reservados.`,
        },
      }
  }
}
