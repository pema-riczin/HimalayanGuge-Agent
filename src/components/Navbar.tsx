@import "tailwindcss";

:root {
  --md-sys-color-primary: #6750a4;
  --md-sys-color-on-primary: #ffffff;
  --md-sys-color-primary-container: #eaddff;
  --md-sys-color-on-primary-container: #21005d;
  --md-sys-color-secondary: #625b71;
  --md-sys-color-on-secondary: #ffffff;
  --md-sys-color-secondary-container: #e8def8;
  --md-sys-color-on-secondary-container: #1d192b;
  --md-sys-color-tertiary: #7d5260;
  --md-sys-color-on-tertiary: #ffffff;
  --md-sys-color-tertiary-container: #ffd8e4;
  --md-sys-color-on-tertiary-container: #31111d;
  --md-sys-color-error: #ba1a1a;
  --md-sys-color-on-error: #ffffff;
  --md-sys-color-error-container: #ffdad6;
  --md-sys-color-on-error-container: #410002;
  --md-sys-color-background: #fef7ff;
  --md-sys-color-on-background: #1d1b20;
  --md-sys-color-surface: #fffbff;
  --md-sys-color-on-surface: #1d1b20;
  --md-sys-color-surface-variant: #e7e0ec;
  --md-sys-color-on-surface-variant: #49454f;
  --md-sys-color-outline: #79747e;
  --md-sys-color-outline-variant: #cac4d0;
  --md-sys-color-shadow: #000000;
  --md-sys-color-scrim: #000000;
  --md-sys-color-surface-container-low: #f7f2fa;
  --md-sys-color-surface-container: #f3edf7;
  --md-sys-color-surface-container-high: #ece6f0;
  --md-sys-color-inverse-surface: #322f35;
  --md-sys-color-inverse-on-surface: #f5eff7;
  --md-sys-color-inverse-primary: #d0bcff;
}

@theme {
  --color-primary: var(--md-sys-color-primary);
  --color-on-primary: var(--md-sys-color-on-primary);
  --color-primary-container: var(--md-sys-color-primary-container);
  --color-on-primary-container: var(--md-sys-color-on-primary-container);
  --color-secondary: var(--md-sys-color-secondary);
  --color-on-secondary: var(--md-sys-color-on-secondary);
  --color-secondary-container: var(--md-sys-color-secondary-container);
  --color-on-secondary-container: var(--md-sys-color-on-secondary-container);
  --color-tertiary: var(--md-sys-color-tertiary);
  --color-on-tertiary: var(--md-sys-color-on-tertiary);
  --color-tertiary-container: var(--md-sys-color-tertiary-container);
  --color-on-tertiary-container: var(--md-sys-color-on-tertiary-container);
  --color-error: var(--md-sys-color-error);
  --color-on-error: var(--md-sys-color-on-error);
  --color-error-container: var(--md-sys-color-error-container);
  --color-on-error-container: var(--md-sys-color-on-error-container);
  --color-background: var(--md-sys-color-background);
  --color-on-background: var(--md-sys-color-on-background);
  --color-surface: var(--md-sys-color-surface);
  --color-on-surface: var(--md-sys-color-on-surface);
  --color-surface-variant: var(--md-sys-color-surface-variant);
  --color-on-surface-variant: var(--md-sys-color-on-surface-variant);
  --color-outline: var(--md-sys-color-outline);
  --color-outline-variant: var(--md-sys-color-outline-variant);
  --color-surface-container-low: var(--md-sys-color-surface-container-low);
  --color-surface-container: var(--md-sys-color-surface-container);
  --color-surface-container-high: var(--md-sys-color-surface-container-high);
}

@layer base {
  * {
    box-sizing: border-box;
  }

  html {
    background: var(--md-sys-color-background);
    color: var(--md-sys-color-on-background);
  }

  body {
    margin: 0;
    min-height: 100vh;
    font-family: 'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: linear-gradient(180deg, #f7f2fa 0%, #f3edf7 100%);
    color: var(--md-sys-color-on-background);
  }

  button,
  input,
  textarea,
  select {
    font: inherit;
  }

  .font-cinzel {
    font-family: 'Cinzel', serif;
  }

  .font-tibetan {
    font-family: 'Noto Serif Tibetan', serif, 'Tibetan Machine Uni', 'Microsoft Himalaya';
  }
}

@layer utilities {
  .m3-surface {
    background: var(--md-sys-color-surface);
    color: var(--md-sys-color-on-surface);
  }

  .m3-surface-container {
    background: var(--md-sys-color-surface-container);
    color: var(--md-sys-color-on-surface);
  }

  .m3-outline {
    border: 1px solid var(--md-sys-color-outline);
  }

  .m3-card {
    @apply rounded-xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface)] shadow-sm;
  }

  .m3-elevated {
    @apply rounded-xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface)] shadow-md;
  }

  .m3-button-filled {
    @apply inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-on-primary shadow-sm transition-all duration-200;
  }

  .m3-button-filled:hover {
    filter: brightness(0.98);
  }

  .m3-button-filled:focus-visible {
    @apply outline-none ring-2 ring-primary ring-offset-2 ring-offset-background;
  }

  .m3-button-filled:active {
    filter: brightness(0.96);
  }

  .m3-button-tonal {
    @apply inline-flex items-center justify-center gap-2 rounded-full bg-secondary-container px-4 py-2.5 text-sm font-medium text-on-secondary-container shadow-sm transition-all duration-200;
  }

  .m3-button-outlined {
    @apply inline-flex items-center justify-center gap-2 rounded-full border border-outline bg-transparent px-4 py-2.5 text-sm font-medium text-primary transition-all duration-200;
  }

  .m3-button-text {
    @apply inline-flex items-center justify-center gap-2 rounded-full bg-transparent px-3 py-2 text-sm font-medium text-primary transition-all duration-200;
  }

  .m3-button-filled:hover,
  .m3-button-tonal:hover,
  .m3-button-outlined:hover,
  .m3-button-text:hover {
    background-image: linear-gradient(to bottom, rgba(255,255,255,0.08), rgba(255,255,255,0.08));
  }

  .m3-focus-ring {
    @apply outline-none ring-2 ring-primary ring-offset-2 ring-offset-background;
  }
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(121, 116, 126, 0.12);
}

::-webkit-scrollbar-thumb {
  background: rgba(103, 80, 164, 0.34);
  border-radius: 9999px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(103, 80, 164, 0.5);
}

@media print {
  body {
    background: white !important;
    color: black !important;
  }

  .no-print {
    display: none !important;
  }

  .print-only {
    display: block !important;
  }
}
