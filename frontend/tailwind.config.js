/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', 'system-ui', 'sans-serif'],
      },
      colors: {
        canvas: {
          bg: 'var(--bg-canvas)',
          dot: 'var(--canvas-dot)',
        },
        surface: {
          DEFAULT: 'var(--bg-panel)',
          header: 'var(--bg-panel-header)',
          card: 'var(--bg-card)',
          border: 'var(--border-default)',
        },
        button: {
          dark: 'var(--bg-button-dark)',
        },
        accent: {
          purple: 'var(--node-purple)',
          'purple-dark': 'var(--node-purple-dark)',
          green: 'var(--node-green)',
          center: 'var(--node-center)',
        },
        icon: {
          'green-bg': 'var(--icon-green-bg)',
          'purple-bg': 'var(--icon-purple-bg)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
          'on-dark': 'var(--text-on-dark)',
          accent: 'var(--text-accent)',
        },
        edge: 'var(--edge-color)',
        border: {
          DEFAULT: 'var(--border-default)',
          dashed: 'var(--border-dashed)',
        },
      },
      boxShadow: {
        panel: '0 2px 12px rgba(0,0,0,0.06)',
        node: '0 2px 8px rgba(0,0,0,0.07)',
        'node-hover': '0 6px 20px rgba(0,0,0,0.10)',
        'node-selected': '0 0 0 2px rgba(123,111,196,0.25)',
      },
      borderRadius: {
        node: '12px',
        card: '10px',
        panel: '14px',
      },
      spacing: {
        'node-padding': 'var(--node-padding)',
        'node-gap': 'var(--node-gap)',
      },
      transitionDuration: {
        fast: '150ms',
        normal: '200ms',
      },
      fontSize: {
        'node-xs': ['11px', { lineHeight: '16px' }],
        'node-sm': ['12px', { lineHeight: '18px' }],
        'node-base': ['13px', { lineHeight: '20px' }],
        'node-md': ['14px', { lineHeight: '20px' }],
        'node-lg': ['16px', { lineHeight: '24px' }],
        'node-xl': ['22px', { lineHeight: '28px' }],
        'node-2xl': ['28px', { lineHeight: '34px' }],
      },
      animation: {
        'fade-in': 'fadeIn 0.15s ease-out',
        'slide-up': 'slideUp 0.2s ease-out',
        'handle-pulse': 'handlePulse 1s infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        handlePulse: {
          '0%': { boxShadow: '0 0 0 0 rgba(123,111,196,0.4)' },
          '70%': { boxShadow: '0 0 0 6px rgba(123,111,196,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(123,111,196,0)' },
        },
      },
    },
  },
  plugins: [],
};
