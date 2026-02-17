import { render, h } from 'preact';
import { App } from './App';
import styles from './styles.css?inline';

interface ReleaseDockConfig {
  project?: string;
  selector?: string;
}

interface ReleaseDockAPI {
  open: () => void;
  close: () => void;
  markAsRead: () => void;
}

declare global {
  interface Window {
    releasedock_config?: ReleaseDockConfig;
    ReleaseDock: ReleaseDockAPI;
  }
}

/**
 * Resolve the API key from either:
 * 1. window.releasedock_config.project (two-stage config pattern, like Beamer)
 * 2. data-project attribute on the script tag (single-tag pattern)
 */
function resolveApiKey(): string | null {
  // Config object takes priority (Beamer-style two-stage loader)
  if (window.releasedock_config?.project) {
    return window.releasedock_config.project;
  }

  // Fallback: find the script tag with data-project
  const scripts = document.querySelectorAll('script[data-project]');
  const scriptTag = scripts[scripts.length - 1] as HTMLScriptElement | null;
  return scriptTag?.getAttribute('data-project') || null;
}

function init() {
  const apiKey = resolveApiKey();

  if (!apiKey) {
    console.warn('ReleaseDock: No API key found. Use data-project attribute or window.releasedock_config.');
    return;
  }

  // Create Shadow DOM container for style isolation
  const host = document.createElement('div');
  host.id = 'releasedock-widget';
  document.body.appendChild(host);

  const shadowRoot = host.attachShadow({ mode: 'open' });

  // Inject scoped styles
  const styleEl = document.createElement('style');
  styleEl.textContent = styles;
  shadowRoot.appendChild(styleEl);

  // Mount container inside shadow DOM
  const appContainer = document.createElement('div');
  shadowRoot.appendChild(appContainer);

  // Render Preact app
  render(h(App, { apiKey, container: appContainer }), appContainer);

  // Expose public API — events are dispatched on appContainer,
  // which is exactly where the App component listens
  window.ReleaseDock = {
    open: () => appContainer.dispatchEvent(new CustomEvent('releasedock:open')),
    close: () => appContainer.dispatchEvent(new CustomEvent('releasedock:close')),
    markAsRead: () => appContainer.dispatchEvent(new CustomEvent('releasedock:markAsRead')),
  };

  // Support data-releasedock-changelog attribute on any element
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    if (target.hasAttribute('data-releasedock-changelog') ||
        target.closest('[data-releasedock-changelog]')) {
      event.preventDefault();
      window.ReleaseDock.open();
    }
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
