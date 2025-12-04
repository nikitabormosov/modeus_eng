import { LoginPage } from './pages/LoginPage.js';
import { SchedulePage } from './pages/SchedulePage.js';
import { LanguageProvider } from './contexts/LanguageContext.js';

export class App {
    constructor(container) {
        this.container = container;
        this.currentUser = null;
        this.currentPage = 'login'; // Default to login page
        this.languageProvider = LanguageProvider;
        
        // Make app instance accessible globally for re-rendering
        window.appInstance = this;
        
        // Listen for language changes
        this.unsubscribeLanguage = this.languageProvider.subscribe(() => {
            this.render();
        });
    }

    render() {
        // Check if user is logged in
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            this.currentUser = JSON.parse(storedUser);
            this.currentPage = 'schedule';
        } else {
            this.currentUser = null;
            this.currentPage = 'login';
        }

        let pageComponent;
        if (this.currentPage === 'login') {
            pageComponent = new LoginPage(this.handleLogin.bind(this));
        } else if (this.currentPage === 'schedule') {
            pageComponent = new SchedulePage(this.currentUser, this.handleLogout.bind(this));
        }

        this.container.innerHTML = pageComponent.render();
        pageComponent.afterRender && pageComponent.afterRender();
    }

    handleLogin(user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUser = user;
        this.currentPage = 'schedule';
        this.render();
    }

    handleLogout() {
        localStorage.removeItem('currentUser');
        this.currentUser = null;
        this.currentPage = 'login';
        this.render();
    }
}