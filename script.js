class Timer {
    constructor() {
        this.totalSeconds = 0;
        this.remainingSeconds = 0;
        this.intervalId = null;
        this.isRunning = false;
        
        this.minutesInput = document.getElementById('minutes');
        this.secondsInput = document.getElementById('seconds');
        this.timeDisplay = document.getElementById('timeDisplay');
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.progressCircle = document.querySelector('.progress-ring-circle');
        
        this.setupEventListeners();
        this.updateCircle();
    }
    
    setupEventListeners() {
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());
        
        this.minutesInput.addEventListener('input', () => this.validateInputs());
        this.secondsInput.addEventListener('input', () => this.validateInputs());
    }
    
    validateInputs() {
        const minutes = parseInt(this.minutesInput.value) || 0;
        const seconds = parseInt(this.secondsInput.value) || 0;
        
        if (minutes < 0) this.minutesInput.value = 0;
        if (seconds < 0) this.secondsInput.value = 0;
        if (seconds > 59) this.secondsInput.value = 59;
        
        if (!this.isRunning) {
            this.updateDisplay();
        }
    }
    
    getTotalSeconds() {
        const minutes = parseInt(this.minutesInput.value) || 0;
        const seconds = parseInt(this.secondsInput.value) || 0;
        return minutes * 60 + seconds;
    }
    
    start() {
        if (this.isRunning) return;
        
        if (this.remainingSeconds === 0) {
            this.totalSeconds = this.getTotalSeconds();
            this.remainingSeconds = this.totalSeconds;
        }
        
        if (this.totalSeconds === 0) {
            alert('Please set a time first!');
            return;
        }
        
        this.isRunning = true;
        this.startBtn.style.display = 'none';
        this.pauseBtn.style.display = 'inline-block';
        this.minutesInput.disabled = true;
        this.secondsInput.disabled = true;
        
        this.intervalId = setInterval(() => {
            this.remainingSeconds--;
            this.updateDisplay();
            this.updateCircle();
            
            if (this.remainingSeconds <= 0) {
                this.complete();
            }
        }, 1000);
    }
    
    pause() {
        if (!this.isRunning) return;
        
        this.isRunning = false;
        this.startBtn.style.display = 'inline-block';
        this.pauseBtn.style.display = 'none';
        
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
    
    reset() {
        this.pause();
        this.remainingSeconds = 0;
        this.totalSeconds = 0;
        this.minutesInput.disabled = false;
        this.secondsInput.disabled = false;
        this.updateDisplay();
        this.updateCircle();
    }
    
    complete() {
        this.pause();
        this.remainingSeconds = 0;
        this.updateDisplay();
        this.updateCircle();
        
        // Visual feedback
        this.progressCircle.style.stroke = '#f44336';
        setTimeout(() => {
            this.progressCircle.style.stroke = '#4CAF50';
        }, 500);
        
        // Audio notification (optional - browser may block autoplay)
        try {
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZUA4PSK3k8L1pIQUrgs3y2Ik3CBxou+3nn00QDE+n4/C2YxwGOJLX8sx5LAUkd8fw3ZBACxRes+nrqFUUCkaf4PK+bCEFMYfR89OCMwYebsDv45lQDg9IreTwvWkhBSuCzfLYiTcIHGi77eefTRAMT6fj8LZjHAY4ktfy');
            audio.play().catch(() => {});
        } catch (e) {}
    }
    
    updateDisplay() {
        const minutes = Math.floor(this.remainingSeconds / 60);
        const seconds = this.remainingSeconds % 60;
        this.timeDisplay.textContent = 
            `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    
    updateCircle() {
        if (this.totalSeconds === 0) {
            this.progressCircle.style.strokeDasharray = '0 879.65';
            this.progressCircle.style.strokeDashoffset = '0';
            return;
        }
        
        const circumference = 2 * Math.PI * 140; // radius = 140
        const progress = this.remainingSeconds / this.totalSeconds;
        const offset = circumference * (1 - progress);
        
        this.progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
        this.progressCircle.style.strokeDashoffset = offset;
        
        // Change color based on progress
        if (progress < 0.25) {
            this.progressCircle.style.stroke = '#f44336';
        } else if (progress < 0.5) {
            this.progressCircle.style.stroke = '#ff9800';
        } else {
            this.progressCircle.style.stroke = '#4CAF50';
        }
    }
}

// Initialize timer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Timer();
});

