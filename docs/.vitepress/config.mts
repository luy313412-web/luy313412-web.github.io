import { defineConfig } from 'vitepress'

const githubUrl = 'https://github.com/your-username'

export default defineConfig({
  lang: 'zh-CN',
  title: 'AI Engineering Portfolio',
  description: '记录 Agent、RAG、LLM Engineering 与 AI 系统工程实践。',
  cleanUrls: true,
  lastUpdated: true,

  head: [
    ['meta', { name: 'theme-color', content: '#5b5bd6' }],
    ['meta', { name: 'author', content: 'Your Name' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'AI Engineering Portfolio' }],
    [
      'meta',
      {
        property: 'og:description',
        content: 'Agent、RAG 与 LLM Engineering 项目和工程笔记。'
      }
    ]
  ],

  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      {
        text: '项目',
        items: [
          { text: '工业智能 Agent', link: '/projects/industrial-agent' },
          { text: '企业级 RAG', link: '/projects/enterprise-rag' },
          { text: '知识图谱 Agent', link: '/projects/knowledge-graph-agent' },
          { text: 'LLM 优化', link: '/projects/llm-optimization' }
        ]
      },
      { text: 'Agent', link: '/agent/' },
      { text: 'RAG', link: '/rag/' },
      { text: 'LLM', link: '/llm/' },
      {
        text: '更多',
        items: [
          { text: 'Backend', link: '/backend/' },
          { text: 'Learning', link: '/learning/' },
          { text: '关于', link: '/about' }
        ]
      },
      { text: 'GitHub', link: githubUrl }
    ],

    sidebar: {
      '/projects/': [
        {
          text: '项目案例',
          items: [
            { text: '工业智能 Agent', link: '/projects/industrial-agent' },
            { text: '企业级 RAG', link: '/projects/enterprise-rag' },
            { text: '知识图谱 Agent', link: '/projects/knowledge-graph-agent' },
            { text: 'LLM 优化', link: '/projects/llm-optimization' }
          ]
        }
      ],
      '/agent/': [
        {
          text: 'Agent Engineering',
          items: [{ text: '概览', link: '/agent/' }]
        }
      ],
      '/rag/': [
        {
          text: 'RAG Engineering',
          items: [{ text: '概览', link: '/rag/' }]
        }
      ],
      '/llm/': [
        {
          text: 'LLM Engineering',
          items: [{ text: '概览', link: '/llm/' }]
        }
      ],
      '/backend/': [
        {
          text: 'Backend',
          items: [{ text: '概览', link: '/backend/' }]
        }
      ],
      '/learning/': [
        {
          text: 'Learning',
          items: [{ text: '概览', link: '/learning/' }]
        }
      ]
    },

    socialLinks: [{ icon: 'github', link: githubUrl }],
    search: { provider: 'local' },
    outline: { level: [2, 3], label: '本页目录' },
    lastUpdated: { text: '最后更新于' },
    docFooter: { prev: '上一篇', next: '下一篇' },
    sidebarMenuLabel: '目录',
    returnToTopLabel: '返回顶部',
    darkModeSwitchLabel: '外观',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    footer: {
      message: '专注于可落地、可评估、可演进的 AI 工程实践。',
      copyright: 'Copyright © 2026 Your Name'
    }
  }
})
