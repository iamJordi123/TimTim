class TimTimTimer {
    constructor() {
        this.totalSeconds = 0;
        this.remainingSeconds = 0;
        this.intervalId = null;
        this.isRunning = false;
        this.departureTime = null;
        
        this.timeDisplay = document.getElementById('timeDisplay');
        this.currentTimeDisplay = document.getElementById('currentTime');
        this.departureTimeDisplay = document.getElementById('departureTime');
        this.progressRing = document.getElementById('progressRing');
        this.progressRingBg = document.getElementById('progressRingBg');
        this.resetBtn = document.getElementById('resetBtn');
        
        this.setupEventListeners();
        this.setupGauge();
        this.updateCurrentTime();
        this.startCountdown();
        
        // Update current time every second
        setInterval(() => this.updateCurrentTime(), 1000);
    }
    
    setupEventListeners() {
        this.resetBtn.addEventListener('click', () => this.reset());
    }
    
    setupGauge() {
        // Set up the C-shaped arc path
        // The arc goes from bottom-left, up left side, over top, down right side to bottom-right
        // This creates a C-shape open at the bottom
        const centerX = 200;
        const centerY = 200;
        const radius = 140;
        
        // Create C-shape: from bottom-left (210 degrees) to bottom-right (330 degrees)
        // This is 240 degrees of arc, leaving bottom center open
        const startAngle = 210; // Bottom-left (7 o'clock)
        const endAngle = 330; // Bottom-right (5 o'clock)
        
        const path = this.createArcPath(centerX, centerY, radius, startAngle, endAngle, true);
        this.progressRing.setAttribute('d', path);
        this.progressRingBg.setAttribute('d', path);
        
        // Set stroke-dasharray for animation
        // Arc is 240 degrees
        const arcAngle = 240; // degrees
        const circumference = (arcAngle * Math.PI * radius) / 180;
        this.progressRing.style.strokeDasharray = `${circumference} ${circumference}`;
        this.progressRing.style.strokeDashoffset = circumference;
    }
    
    createArcPath(centerX, centerY, radius, startAngle, endAngle, clockwise) {
        const start = this.polarToCartesian(centerX, centerY, radius, endAngle);
        const end = this.polarToCartesian(centerX, centerY, radius, startAngle);
        const largeArcFlag = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;
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
        // Set departure time (14:30:00)
        const now = new Date();
        const departure = new Date(now);
        departure.setHours(14, 30, 0, 0);
        
        // If departure time has passed today, set it for tomorrow
        if (departure < now) {
            departure.setDate(departure.getDate() + 1);
        }
        
        this.departureTime = departure;
        this.updateDepartureDisplay();
        
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
    
    updateDepartureDisplay() {
        if (!this.departureTime) return;
        
        const hours = String(this.departureTime.getHours()).padStart(2, '0');
        const minutes = String(this.departureTime.getMinutes()).padStart(2, '0');
        const seconds = String(this.departureTime.getSeconds()).padStart(2, '0');
        this.departureTimeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
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
    
    reset() {
        // Reset to a new 15-minute countdown from now
        const now = new Date();
        const newDeparture = new Date(now.getTime() + 15 * 60 * 1000);
        this.departureTime = newDeparture;
        this.updateDepartureDisplay();
        this.updateCountdown();
        
        if (!this.isRunning) {
            this.isRunning = true;
            this.intervalId = setInterval(() => {
                this.updateCountdown();
            }, 1000);
        }
    }
    
    updateDisplay() {
        const total = Math.abs(this.remainingSeconds);
        const minutes = Math.floor(total / 60);
        const seconds = total % 60;
        
        this.timeDisplay.textContent = 
            `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    
    updateProgressRing() {
        if (!this.departureTime) return;
        
        // For demo: assume 15 minute window (from 15 min before departure to departure)
        const totalSeconds = 15 * 60;
        const progress = Math.max(0, Math.min(1, this.remainingSeconds / totalSeconds));
        
        const radius = 140;
        const arcAngle = 240; // degrees (C-shape arc)
        const circumference = (arcAngle * Math.PI * radius) / 180;
        const offset = circumference * (1 - progress);
        
        this.progressRing.style.strokeDashoffset = offset;
    }
}

// Initialize timer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TimTimTimer();
});
