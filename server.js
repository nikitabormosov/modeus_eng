const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from src directory for module imports
app.use('/src', express.static(path.join(__dirname, 'src')));
app.use('/data', express.static(path.join(__dirname, 'data')));

// Read database file
let db = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'database.json'), 'utf8'));

// API endpoint to get user by email and password
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    
    const user = db.users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Remove password from response
        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// API endpoint to get schedule for a user
app.get('/api/schedule/:userId', (req, res) => {
    const userId = parseInt(req.params.userId);
    const user = db.users.find(u => u.id === userId);
    
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    let schedule = [];
    
    if (user.role === 'student' && user.groupId) {
        // Get schedule for student's group
        schedule = db.schedule.filter(s => {
            const group = db.groups.find(g => g.id === s.groupId);
            return group && group.name === user.groupId;
        });
    } else if (user.role === 'teacher') {
        // Get schedule for teacher
        schedule = db.schedule.filter(s => s.teacherId === user.id);
    } else {
        // Admin gets all schedule
        schedule = db.schedule;
    }
    
    // Add subject and teacher names to schedule
    const scheduleWithDetails = schedule.map(s => {
        const subject = db.subjects.find(sub => sub.id === s.subjectId);
        const teacher = db.users.find(u => u.id === s.teacherId);
        const group = db.groups.find(g => g.id === s.groupId);
        
        return {
            ...s,
            subject: subject ? subject.name : 'Unknown',
            teacher: teacher ? teacher.name : 'Unknown',
            group: group ? group.name : 'Unknown'
        };
    });
    
    // Group by day
    const groupedSchedule = {};
    ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].forEach(day => {
        groupedSchedule[day] = scheduleWithDetails.filter(s => s.day === day);
    });
    
    res.json(groupedSchedule);
});

// API endpoint to get all users (for admin)
app.get('/api/users', (req, res) => {
    const usersWithoutPasswords = db.users.map(u => {
        const { password, ...user } = u;
        return user;
    });
    res.json(usersWithoutPasswords);
});

// Route to serve the main HTML file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});