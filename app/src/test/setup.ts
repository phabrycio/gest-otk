// Test setup file for Vitest & React Testing Library

if (!navigator.clipboard) {
  Object.assign(navigator, {
    clipboard: {
      writeText: async () => Promise.resolve(),
    },
  });
}

if (!window.alert) {
  window.alert = () => {};
}

// Mock window.scrollTo and scrollIntoView
window.scrollTo = () => {};
if (typeof window !== 'undefined' && window.HTMLElement) {
  window.HTMLElement.prototype.scrollIntoView = () => {};
}

