import { LanguageProvider } from '../contexts/LanguageContext.js';

export class LoginPage {
    constructor(onLogin) {
        this.onLogin = onLogin;
        this.languageProvider = LanguageProvider;
    }

    render() {
        const loginText = this.languageProvider.getText('login');
        const emailText = this.languageProvider.getText('email');
        const passwordText = this.languageProvider.getText('password');
        const rememberMeText = this.languageProvider.getText('rememberMe');
        const signInText = this.languageProvider.getText('signIn');
        const languageText = this.languageProvider.getText('language');

        return `
        <div class="container-fluid">
            <div class="row min-vh-100">
                <!-- Language Selector -->
                <div class="col-12 d-flex justify-content-end p-3">
                    <div class="dropdown">
                        <button class="btn btn-outline-secondary dropdown-toggle" type="button" id="languageDropdown" data-bs-toggle="dropdown">
                            ${languageText}
                        </button>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="#" data-lang="ru">Русский</a></li>
                            <li><a class="dropdown-item" href="#" data-lang="en">English</a></li>
                        </ul>
                    </div>
                </div>
                
                <!-- Login Form -->
                <div class="col-12 d-flex justify-content-center align-items-center">
                    <div class="col-md-6 col-lg-4">
                        <div class="card shadow">
                            <div class="card-body p-5">
                                <h2 class="text-center mb-4">${loginText}</h2>
                                <form id="loginForm">
                                    <div class="mb-3">
                                        <label for="email" class="form-label">${emailText}</label>
                                        <input type="email" class="form-control" id="email" required>
                                    </div>
                                    <div class="mb-3">
                                        <label for="password" class="form-label">${passwordText}</label>
                                        <input type="password" class="form-control" id="password" required>
                                    </div>
                                    <div class="mb-3 form-check">
                                        <input type="checkbox" class="form-check-input" id="remember">
                                        <label class="form-check-label" for="remember">${rememberMeText}</label>
                                    </div>
                                    <button type="submit" class="btn btn-primary w-100">${signInText}</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    afterRender() {
        // Add event listeners after the DOM is rendered
        document.getElementById('loginForm').addEventListener('submit', this.handleLogin.bind(this));
        
        // Language selector event listeners
        document.querySelectorAll('[data-lang]').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = e.target.getAttribute('data-lang');
                this.languageProvider.setLanguage(lang);
            });
        });
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;
        
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            if (response.ok) {
                const user = await response.json();
                this.onLogin(user);
            } else {
                const error = await response.json();
                alert(error.error || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('An error occurred during login');
        }
    }
}