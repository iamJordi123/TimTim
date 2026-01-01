class TimTimTimer {
    constructor() {
        this.totalSeconds = 0;
        this.remainingSeconds = 0;
        this.intervalId = null;
        this.isRunning = false;
        
        this.timeDisplay = document.getElementById('timeDisplay');
        this.needle = document.getElementById('needle');
        this.tickMarks = document.getElementById('tickMarks');
        
        this.setupGauge();
        this.startCountdown();
    }
    
    setupGauge() {
        // Create tick marks around the circle
        const centerX = 200;
        const centerY = 200;
        const radius = 140;
        const numTicks = 60; // 60 ticks for seconds
        
        for (let i = 0; i < numTicks; i++) {
            const angle = (i / numTicks) * 360 - 90; // Start at top (-90 degrees)
            const radian = (angle * Math.PI) / 180;
            
            const isMajor = i % 5 === 0; // Major tick every 5 seconds
            const tickLength = isMajor ? 20 : 12;
            const innerRadius = radius - tickLength;
            
            const x1 = centerX + radius * Math.cos(radian);
            const y1 = centerY + radius * Math.sin(radian);
            const x2 = centerX + innerRadius * Math.cos(radian);
            const y2 = centerY + innerRadius * Math.sin(radian);
            
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', x1);
            line.setAttribute('y1', y1);
            line.setAttribute('x2', x2);
            line.setAttribute('y2', y2);
            if (isMajor) {
                line.classList.add('major');
            }
            
            this.tickMarks.appendChild(line);
        }
    }
    
    startCountdown() {
        // Start with 5 minutes for demo
        this.totalSeconds = 5 * 60;
        this.remainingSeconds = this.totalSeconds;
        
        this.isRunning = true;
        this.updateDisplay();
        this.updateNeedle();
        
        this.intervalId = setInterval(() => {
            this.remainingSeconds--;
            this.updateDisplay();
            this.updateNeedle();
            
            if (this.remainingSeconds <= 0) {
                this.complete();
            }
        }, 1000);
    }
    
    complete() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.isRunning = false;
        this.remainingSeconds = 0;
        this.updateDisplay();
        this.updateNeedle();
    }
    
    updateDisplay() {
        const total = Math.abs(this.remainingSeconds);
        const minutes = Math.floor(total / 60);
        const seconds = total % 60;
        
        // Format like "-0:16" for negative or "0:16" for positive
        const sign = this.remainingSeconds < 0 ? '-' : '';
        this.timeDisplay.textContent = 
            `${sign}${minutes}:${String(seconds).padStart(2, '0')}`;
    }
    
    updateNeedle() {
        if (this.totalSeconds === 0) {
            this.needle.style.transform = 'rotate(0deg)';
            return;
        }
        
        // Calculate angle: 0% = -90deg (top), 100% = 270deg (full circle)
        // Needle starts at top and rotates clockwise
        const progress = this.remainingSeconds / this.totalSeconds;
        const angle = -90 + (1 - progress) * 360;
        
        this.needle.style.transform = `rotate(${angle}deg)`;
    }
}

// Initialize timer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TimTimTimer();
});
