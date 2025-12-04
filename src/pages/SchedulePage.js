import { LanguageProvider } from '../contexts/LanguageContext.js';

export class SchedulePage {
    constructor(user, onLogout) {
        this.user = user;
        this.onLogout = onLogout;
        this.languageProvider = LanguageProvider;
        this.schedule = {};
        this.loadSchedule();
    }

    async loadSchedule() {
        try {
            const response = await fetch(`/api/schedule/${this.user.id}`);
            if (response.ok) {
                this.schedule = await response.json();
            } else {
                console.error('Failed to load schedule');
                // Fallback to empty schedule
                this.schedule = {
                    'monday': [],
                    'tuesday': [],
                    'wednesday': [],
                    'thursday': [],
                    'friday': [],
                    'saturday': [],
                    'sunday': []
                };
            }
        } catch (error) {
            console.error('Error loading schedule:', error);
            // Fallback to empty schedule
            this.schedule = {
                'monday': [],
                'tuesday': [],
                'wednesday': [],
                'thursday': [],
                'friday': [],
                'saturday': [],
                'sunday': []
            };
        }
        // Re-render the page after schedule is loaded
        if (window.appInstance) {
            window.appInstance.render();
        }
    }

    render() {
        const scheduleText = this.languageProvider.getText('schedule');
        const logoutText = this.languageProvider.getText('logout');
        const homeText = this.languageProvider.getText('home');
        const profileText = this.languageProvider.getText('profile');
        const languageText = this.languageProvider.getText('language');
        const timeText = this.languageProvider.getText('time');
        const subjectText = this.languageProvider.getText('subject');
        const teacherText = this.languageProvider.getText('teacher');
        const roomText = this.languageProvider.getText('room');
        const groupText = this.languageProvider.getText('group');
        const welcomeText = this.languageProvider.getText('welcome');
        const roleText = this.languageProvider.getText(this.user.role);
        const mondayText = this.languageProvider.getText('monday');
        const tuesdayText = this.languageProvider.getText('tuesday');
        const wednesdayText = this.languageProvider.getText('wednesday');
        const thursdayText = this.languageProvider.getText('thursday');
        const fridayText = this.languageProvider.getText('friday');
        const saturdayText = this.languageProvider.getText('saturday');
        const sundayText = this.languageProvider.getText('sunday');

        const dayNames = {
            'monday': mondayText,
            'tuesday': tuesdayText,
            'wednesday': wednesdayText,
            'thursday': thursdayText,
            'friday': fridayText,
            'saturday': saturdayText,
            'sunday': sundayText
        };

        return `
        <div class="container-fluid">
            <!-- Navigation Bar -->
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
                <div class="container-fluid">
                    <a class="navbar-brand" href="#">${scheduleText}</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarNav">
                        <ul class="navbar-nav me-auto">
                            <li class="nav-item">
                                <a class="nav-link" href="#">${homeText}</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link active" href="#">${scheduleText}</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#">${profileText}</a>
                            </li>
                        </ul>
                        <ul class="navbar-nav">
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="#" id="languageDropdown" data-bs-toggle="dropdown">
                                    ${languageText}
                                </a>
                                <ul class="dropdown-menu">
                                    <li><a class="dropdown-item" href="#" data-lang="ru">Русский</a></li>
                                    <li><a class="dropdown-item" href="#" data-lang="en">English</a></li>
                                </ul>
                            </li>
                            <li class="nav-item">
                                <span class="nav-link">(${roleText}) ${this.user.name}</span>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#" id="logoutBtn">${logoutText}</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <!-- Welcome Message -->
            <div class="container mt-4">
                <div class="row">
                    <div class="col-12">
                        <h1>${welcomeText}, ${this.user.name}!</h1>
                        <p class="text-muted">${roleText}</p>
                    </div>
                </div>

                <!-- Schedule Table -->
                <div class="row mt-4">
                    <div class="col-12">
                        <div class="card">
                            <div class="card-header">
                                <h3>${scheduleText}</h3>
                            </div>
                            <div class="card-body">
                                <div class="table-responsive">
                                    <table class="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>${timeText}</th>
                                                <th>${subjectText}</th>
                                                <th>${teacherText}</th>
                                                <th>${roomText}</th>
                                                <th>${groupText}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${this.renderScheduleTable()}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Weekly Schedule View -->
                <div class="row mt-4">
                    ${this.renderWeeklySchedule(dayNames)}
                </div>
            </div>
        </div>
        `;
    }

    renderScheduleTable() {
        let rows = '';
        // Flatten the schedule to show all classes in a single table
        Object.keys(this.schedule).forEach(day => {
            const dayClasses = this.schedule[day];
            dayClasses.forEach(classItem => {
                rows += `
                <tr>
                    <td>${classItem.time}</td>
                    <td>${classItem.subject}</td>
                    <td>${classItem.teacher}</td>
                    <td>${classItem.room}</td>
                    <td>${classItem.group}</td>
                </tr>
                `;
            });
        });

        if (!rows) {
            const noClassesText = this.languageProvider.getText('noClasses');
            return `<tr><td colspan="5" class="text-center">${noClassesText}</td></tr>`;
        }

        return rows;
    }

    renderWeeklySchedule(dayNames) {
        let html = '';
        const noClassesText = this.languageProvider.getText('noClasses');

        Object.keys(this.schedule).forEach(day => {
            const dayClasses = this.schedule[day];
            const dayName = dayNames[day];
            
            let dayContent = '';
            if (dayClasses.length > 0) {
                dayClasses.forEach(classItem => {
                    dayContent += `
                    <div class="card mb-2">
                        <div class="card-body p-2">
                            <div class="d-flex justify-content-between">
                                <div>
                                    <strong>${classItem.subject}</strong><br>
                                    <small>${classItem.time}</small>
                                </div>
                                <div class="text-end">
                                    <div>${classItem.teacher}</div>
                                    <small>${classItem.room}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                    `;
                });
            } else {
                dayContent = `<div class="text-center text-muted p-3">${noClassesText}</div>`;
            }

            html += `
            <div class="col-md-2">
                <div class="card">
                    <div class="card-header text-center">
                        <strong>${dayName}</strong>
                    </div>
                    <div class="card-body p-2">
                        ${dayContent}
                    </div>
                </div>
            </div>
            `;
        });

        return html;
    }

    afterRender() {
        // Add event listeners after the DOM is rendered
        document.getElementById('logoutBtn').addEventListener('click', (e) => {
            e.preventDefault();
            this.onLogout();
        });

        // Language selector event listeners
        document.querySelectorAll('[data-lang]').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = e.target.getAttribute('data-lang');
                this.languageProvider.setLanguage(lang);
            });
        });
    }
}