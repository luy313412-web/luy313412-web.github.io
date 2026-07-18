import { defineConfig } from 'vitepress'

const githubUrl = 'https://github.com/luy313412-web'

export default defineConfig({
  lang: 'zh-CN',
  title: 'AI 工程实践',
  description: '记录智能体、知识检索、大模型应用与 AI 系统工程实践。',
  cleanUrls: true,
  lastUpdated: true,

  head: [
    ['meta', { name: 'theme-color', content: '#5b5bd6' }],
    ['meta', { name: 'author', content: 'AI Engineer' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'AI 工程实践' }],
    [
      'meta',
      {
        property: 'og:description',
        content: '智能体、知识检索、大模型应用与 AI 系统工程实践。'
      }
    ]
  ],

  themeConfig: {
    nav: [
      { text: '首页', link: '/' },

      {
        text: '项目',
        items: [
          { text: '工业设备运维 Agent', link: '/projects/industrial-agent' },
          { text: '企业知识检索平台', link: '/projects/enterprise-rag' },
          { text: '知识图谱 Agent', link: '/projects/knowledge-graph-agent' },
          { text: '大模型优化', link: '/projects/llm-optimization' }
        ]
      },

      { text: 'Agent', link: '/agent/' },

      { text: 'RAG', link: '/rag/' },

      { text: 'LLM', link: '/llm/' },

      {
        text: '技术思考',
        items: [
          { text: 'AI趋势', link: '/thinking/ai-trend' },
          { text: '工程理解', link: '/thinking/engineering' },
          { text: '技术观点', link: '/thinking/viewpoints' }
        ]
      },

      {
        text: '更多',
        items: [
          { text: '后端工程', link: '/backend/' },
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
            { text: '工业设备运维 Agent', link: '/projects/industrial-agent' },
            { text: '企业知识检索平台', link: '/projects/enterprise-rag' },
            { text: '知识图谱 Agent', link: '/projects/knowledge-graph-agent' },
            { text: '大模型优化', link: '/projects/llm-optimization' }
          ]
        }
      ],


      '/agent/': [
        {
          text: '智能体工程',
          items: [
            { text: '概览', link: '/agent/' }
          ]
        }
      ],


      '/rag/': [
        {
          text: '知识检索工程',
          items: [
            { text: '概览', link: '/rag/' }
          ]
        }
      ],


      '/llm/': [
        {
          text: '大模型工程',
          items: [
            { text: '概览', link: '/llm/' }
          ]
        }
      ],


      '/thinking/': [
  {
    text: 'AI趋势',
    items: [
      {
        text: 'AI从模型竞争走向工程竞争',
        link: '/thinking/ai-development-direction'
      },
      {
        text: '为什么Agent成为AI应用的重要方向',
        link: '/thinking/agent-trend'
      }
    ]
  },
  {
    text: '工程理解',
    items: [
      {
        text: 'RAG不只是向量搜索',
        link: '/thinking/rag-engineering'
      },
      {
        text: '从Demo到生产级Agent',
        link: '/thinking/agent-engineering'
      }
    ]
  },
  {
    text: '技术观点',
    items: [
      {
        text: '固定流程和自主Agent如何选择',
        link: '/thinking/workflow-vs-agent'
      },
      {
        text: 'AI工程师未来需要哪些能力',
        link: '/thinking/ai-engineer-future'
      }
    ]
  }
],


      '/backend/': [
        {
          text: '后端工程',
          items: [
            { text: '概览', link: '/backend/' }
          ]
        }
      ]

    },


    socialLinks: [
      {
        icon: 'github',
        link: githubUrl
      }
    ],

    search: {
      provider: 'local'
    },

    outline: {
      level: [2, 3],
      label: '本页目录'
    },

    lastUpdated: {
      text: '最后更新于'
    },

    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },

    sidebarMenuLabel: '目录',
    returnToTopLabel: '返回顶部',

    darkModeSwitchLabel: '外观',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',

    footer: {
      message: '专注于可落地、可评估、可演进的 AI 工程实践。',
      copyright: 'Copyright © 2026 AI 工程实践'
    }
  }
})