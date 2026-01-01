class TimTimTimer {
    constructor() {
        this.totalSeconds = 0;
        this.remainingSeconds = 0;
        this.intervalId = null;
        this.isRunning = false;
        this.departureTime = null;
        this.arrivalTime = null;
        this.isDarkMode = true;
        
        this.setupScreen = document.getElementById('setupScreen');
        this.timerScreen = document.getElementById('timerScreen');
        this.setupForm = document.getElementById('setupForm');
        this.timeDisplay = document.getElementById('timeDisplay');
        this.currentTimeDisplay = document.getElementById('currentTime');
        this.progressRing = document.getElementById('progressRing');
        this.progressRingBg = document.getElementById('progressRingBg');
        this.themeToggle = document.getElementById('themeToggle');
        this.body = document.body;
        
        // Load saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            this.isDarkMode = false;
            this.body.classList.remove('dark-mode');
            this.body.classList.add('light-mode');
        }
        
        this.setupEventListeners();
        this.setupGauge();
        this.updateCurrentTime();
        
        // Update current time every second
        setInterval(() => this.updateCurrentTime(), 1000);
    }
    
    setupEventListeners() {
        this.setupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });
        
        this.themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
    }
    
    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        
        if (this.isDarkMode) {
            this.body.classList.remove('light-mode');
            this.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            this.body.classList.remove('dark-mode');
            this.body.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
        }
    }
    
    parseTime(timeString) {
        if (!timeString || !timeString.trim()) {
            return null;
        }
        
        // Remove whitespace
        timeString = timeString.trim();
        
        // Split by colon
        const parts = timeString.split(':');
        
        if (parts.length < 2 || parts.length > 3) {
            return null;
        }
        
        const hours = parseInt(parts[0], 10);
        const minutes = parseInt(parts[1], 10);
        const seconds = parts.length === 3 ? parseInt(parts[2], 10) : 0;
        
        // Validate ranges
        if (isNaN(hours) || isNaN(minutes) || isNaN(seconds) ||
            hours < 0 || hours > 23 ||
            minutes < 0 || minutes > 59 ||
            seconds < 0 || seconds > 59) {
            return null;
        }
        
        return { hours, minutes, seconds };
    }
    
    handleFormSubmit() {
        const aankomsttijdInput = document.getElementById('aankomsttijd').value.trim();
        const vertrektijdInput = document.getElementById('vertrektijd').value.trim();
        
        if (!aankomsttijdInput) {
            alert('Aankomsttijd is verplicht!');
            return;
        }
        
        if (!vertrektijdInput) {
            alert('Vertrektijd is verplicht!');
            return;
        }
        
        // Parse arrival time
        const arrivalTime = this.parseTime(aankomsttijdInput);
        if (!arrivalTime) {
            alert('Ongeldige aankomsttijd. Gebruik formaat HH:MM:SS of HH:MM (bijv. 14:30:20 of 14:30)');
            return;
        }
        
        // Parse departure time
        const departureTime = this.parseTime(vertrektijdInput);
        if (!departureTime) {
            alert('Ongeldige vertrektijd. Gebruik formaat HH:MM:SS of HH:MM (bijv. 14:30:20 of 14:30)');
            return;
        }
        
        const now = new Date();
        
        // Create arrival date
        const arrival = new Date(now);
        arrival.setHours(arrivalTime.hours, arrivalTime.minutes, arrivalTime.seconds, 0);
        
        // Create departure date
        const departure = new Date(now);
        departure.setHours(departureTime.hours, departureTime.minutes, departureTime.seconds, 0);
        
        // If times have passed today, set them for tomorrow
        if (arrival < now) {
            arrival.setDate(arrival.getDate() + 1);
        }
        
        if (departure < now) {
            departure.setDate(departure.getDate() + 1);
        }
        
        // If arrival is after departure, assume arrival is next day
        if (arrival > departure) {
            arrival.setDate(arrival.getDate() + 1);
        }
        
        this.arrivalTime = arrival;
        this.departureTime = departure;
        
        // Switch to timer screen
        this.setupScreen.style.display = 'none';
        this.timerScreen.style.display = 'flex';
        
        // Start countdown
        this.startCountdown();
    }
    
    setupGauge() {
        const centerX = 200;
        const centerY = 200;
        const radius = 160;
        
        // Define the 270-degree arc: open at the bottom (90-degree gap)
        // Start at 225 degrees (bottom-left) and go clockwise to 135 degrees (top-right)
        const startAngle = 225; // 7:30 position
        const endAngle = 135;   // 1:30 position (which is 225 + 270 degrees clockwise)
        
        const path = this.createArcPath(centerX, centerY, radius, startAngle, endAngle, true);
        this.progressRing.setAttribute('d', path);
        this.progressRingBg.setAttribute('d', path);
        
        // Calculate circumference for a 270-degree arc
        const arcAngle = 270; // degrees
        const circumference = (arcAngle * Math.PI * radius) / 180;
        
        this.progressRing.style.strokeDasharray = `${circumference} ${circumference}`;
        this.progressRing.style.strokeDashoffset = circumference;
    }
    
    createArcPath(centerX, centerY, radius, startAngle, endAngle, clockwise) {
        const start = this.polarToCartesian(centerX, centerY, radius, endAngle);
        const end = this.polarToCartesian(centerX, centerY, radius, startAngle);
        
        const largeArcFlag = ((clockwise && (endAngle - startAngle + 360) % 360 > 180) ||
                              (!clockwise && (startAngle - endAngle + 360) % 360 > 180)) ? 1 : 0;
        const sweepFlag = clockwise ? 1 : 0;
        
        return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${end.x} ${end.y}`;
    }
    
    polarToCartesian(centerX, centerY, radius, angleInDegrees) {
        const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    }
    
    startCountdown() {
        if (!this.departureTime) return;
        
        // Calculate initial countdown
        this.updateCountdown();
        
        this.isRunning = true;
        this.intervalId = setInterval(() => {
            this.updateCountdown();
        }, 1000);
    }
    
    updateCurrentTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        this.currentTimeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
    }
    
    updateCountdown() {
        if (!this.departureTime) return;
        
        const now = new Date();
        const diff = Math.floor((this.departureTime - now) / 1000);
        
        this.remainingSeconds = diff;
        
        if (diff <= 0) {
            this.remainingSeconds = 0;
            this.complete();
        }
        
        this.updateDisplay();
        this.updateProgressRing();
    }
    
    complete() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.isRunning = false;
    }
    
    updateDisplay() {
        const total = Math.abs(this.remainingSeconds);
        const minutes = Math.floor(total / 60);
        const seconds = total % 60;
        
        this.timeDisplay.textContent = 
            `${String(minutes).padStart(1, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    
    updateProgressRing() {
        if (!this.departureTime) return;
        
        // Calculate progress based on time until departure
        // Assume 15 minute window for the progress ring
        const now = new Date();
        const windowStart = new Date(this.departureTime.getTime() - 15 * 60 * 1000);
        const totalWindow = 15 * 60; // 15 minutes in seconds
        
        if (now < windowStart) {
            // Before the window, ring is empty
            const radius = 160;
            const arcAngle = 270; // degrees
            const circumference = (arcAngle * Math.PI * radius) / 180;
            this.progressRing.style.strokeDashoffset = circumference;
            return;
        }
        
        const elapsed = Math.floor((now - windowStart) / 1000);
        const progress = Math.max(0, Math.min(1, elapsed / totalWindow));
        
        const radius = 160;
        const arcAngle = 270; // degrees
        const circumference = (arcAngle * Math.PI * radius) / 180;
        const offset = circumference * (1 - progress);
        
        this.progressRing.style.strokeDashoffset = offset;
    }
}

// Initialize timer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TimTimTimer();
});
