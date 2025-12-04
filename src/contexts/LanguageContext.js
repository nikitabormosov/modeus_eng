// Language Context for managing language selection
class LanguageContext {
    constructor() {
        this.listeners = [];
        // Get initial language from localStorage or default to 'ru'
        this.language = localStorage.getItem('language') || 'ru';
        this.translations = {
            'ru': {
                login: 'Вход',
                email: 'Email',
                password: 'Пароль',
                rememberMe: 'Запомнить меня',
                forgotPassword: 'Забыли пароль?',
                signIn: 'Войти',
                schedule: 'Расписание',
                logout: 'Выйти',
                home: 'Главная',
                profile: 'Профиль',
                language: 'Язык',
                monday: 'Понедельник',
                tuesday: 'Вторник',
                wednesday: 'Среда',
                thursday: 'Четверг',
                friday: 'Пятница',
                saturday: 'Суббота',
                sunday: 'Воскресенье',
                time: 'Время',
                subject: 'Предмет',
                teacher: 'Преподаватель',
                room: 'Аудитория',
                group: 'Группа',
                noClasses: 'Нет занятий',
                welcome: 'Добро пожаловать',
                student: 'Студент',
                teacher: 'Преподаватель',
                admin: 'Администратор'
            },
            'en': {
                login: 'Login',
                email: 'Email',
                password: 'Password',
                rememberMe: 'Remember me',
                forgotPassword: 'Forgot password?',
                signIn: 'Sign In',
                schedule: 'Schedule',
                logout: 'Logout',
                home: 'Home',
                profile: 'Profile',
                language: 'Language',
                monday: 'Monday',
                tuesday: 'Tuesday',
                wednesday: 'Wednesday',
                thursday: 'Thursday',
                friday: 'Friday',
                saturday: 'Saturday',
                sunday: 'Sunday',
                time: 'Time',
                subject: 'Subject',
                teacher: 'Teacher',
                room: 'Room',
                group: 'Group',
                noClasses: 'No classes',
                welcome: 'Welcome',
                student: 'Student',
                teacher: 'Teacher',
                admin: 'Administrator'
            }
        };
    }

    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    getLanguage() {
        return this.language;
    }

    getText(key) {
        const lang = this.translations[this.language];
        return lang && lang[key] ? lang[key] : key;
    }

    setLanguage(lang) {
        this.language = lang;
        localStorage.setItem('language', lang);
        this.notify();
    }

    notify() {
        this.listeners.forEach(listener => listener());
    }
}

// Global instance
export const languageContext = new LanguageContext();

export const LanguageProvider = {
    subscribe: (listener) => languageContext.subscribe(listener),
    getLanguage: () => languageContext.getLanguage(),
    setLanguage: (lang) => languageContext.setLanguage(lang),
    getText: (key) => languageContext.getText(key)
};