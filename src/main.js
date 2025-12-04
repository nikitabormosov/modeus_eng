import { App } from './App.js';
import { LanguageProvider } from './contexts/LanguageContext.js';

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const root = document.getElementById('root');
    const app = new App(root);
    app.render();
});