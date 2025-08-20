/**
 * Matrix Effect Manager - Creates the iconic Matrix rain effect
 * Inspired by the legendary Matrix digital rain from the movies
 */
class MatrixEffect {
    constructor() {
        this.isActive = false;
        this.rainColumns = [];
        this.matrixChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ';
        this.overlay = null;
        this.console = null;
        this.typewriter = null;
        this.rainContainer = null;
        
        this.init();
    }
    
    init() {
        // Get DOM elements
        this.overlay = document.getElementById('matrix-overlay');
        this.console = document.getElementById('matrix-console');
        this.typewriter = document.getElementById('matrix-typewriter');
        this.rainContainer = document.getElementById('matrix-rain-container');
        
        // Bind methods
        this.createRain = this.createRain.bind(this);
        this.typeMessage = this.typeMessage.bind(this);
        this.stopEffect = this.stopEffect.bind(this);
    }
    
    /**
     * Start the Matrix effect with dramatic entrance
     */
    async startEffect() {
        if (this.isActive) return;
        
        this.isActive = true;
        
        // Show overlay
        this.overlay.classList.add('active');
        
        // Start Matrix rain
        this.createRain();
        
        // Show console after a delay
        setTimeout(() => {
            this.console.classList.add('visible');
            this.startTypewriter();
        }, 1000);
        
        // Auto-scroll to neural network section after the show
        setTimeout(() => {
            this.scrollToNeuralNetwork();
        }, 5000);
        
        // Auto-hide after 7 seconds
        setTimeout(() => {
            this.stopEffect();
        }, 7000);
    }
    
    /**
     * Create Matrix rain columns across the screen
     */
    createRain() {
        const screenWidth = window.innerWidth;
        const columnWidth = 20;
        const numColumns = Math.floor(screenWidth / columnWidth);
        
        // Clear existing rain
        this.rainContainer.innerHTML = '';
        this.rainColumns = [];
        
        for (let i = 0; i < numColumns; i++) {
            this.createColumn(i * columnWidth);
        }
    }
    
    /**
     * Create a single column of falling Matrix characters
     */
    createColumn(x) {
        const column = document.createElement('div');
        column.className = 'matrix-rain';
        column.style.left = x + 'px';
        column.style.animationDuration = (Math.random() * 3 + 2) + 's';
        column.style.animationDelay = Math.random() * 2 + 's';
        
        // Create character string
        const numChars = Math.floor(Math.random() * 20) + 10;
        let charString = '';
        
        for (let i = 0; i < numChars; i++) {
            const char = this.matrixChars[Math.floor(Math.random() * this.matrixChars.length)];
            const brightness = i === 0 ? 'bright' : '';
            charString += `<span class="matrix-char ${brightness}">${char}</span>`;
        }
        
        column.innerHTML = charString;
        this.rainContainer.appendChild(column);
        
        // Randomize characters periodically
        setInterval(() => {
            if (this.isActive) {
                this.randomizeColumn(column);
            }
        }, 100);
    }
    
    /**
     * Randomize characters in a column for dynamic effect
     */
    randomizeColumn(column) {
        const chars = column.querySelectorAll('.matrix-char');
        chars.forEach((char, index) => {
            if (Math.random() < 0.1) { // 10% chance to change
                const newChar = this.matrixChars[Math.floor(Math.random() * this.matrixChars.length)];
                char.textContent = newChar;
            }
        });
    }
    
    /**
     * Start the typewriter effect in the console
     */
    async startTypewriter() {
        const messages = [
            'Initializing neural pathways...',
            'Connecting to quantum matrix...',
            'Bypassing firewall protocols...',
            'Accessing MCP bridge systems...',
            'ElevenLabs synthesis engine online...',
            'Claude AI consciousness detected...',
            'Neural interface ready...',
            '> WELCOME TO THE MATRIX <',
            '',
            'Initiating quantum descent...'
        ];
        
        for (const message of messages) {
            if (!this.isActive) break;
            await this.typeMessage(message);
            await this.sleep(500);
        }
    }
    
    /**
     * Type a single message with typewriter effect
     */
    async typeMessage(text) {
        this.typewriter.innerHTML = '';
        
        for (let i = 0; i < text.length; i++) {
            if (!this.isActive) break;
            
            this.typewriter.innerHTML = text.slice(0, i + 1);
            await this.sleep(50 + Math.random() * 50); // Vary typing speed
        }
        
        // Add new line
        this.typewriter.innerHTML += '<br>';
    }
    
    /**
     * Smooth scroll to neural network section with GSAP
     */
    scrollToNeuralNetwork() {
        const mcpSection = document.getElementById('mcp');
        
        // Disable scroll sync temporarily to prevent audio jumping
        if (window.audioManager) {
            window.audioManager.disableScrollSync();
        }
        
        if (mcpSection && window.gsap) {
            gsap.to(window, {
                duration: 2,
                scrollTo: { y: mcpSection, offsetY: 50 },
                ease: "power2.inOut",
                onComplete: () => {
                    // After scroll completes, set audio to MCP section start
                    this.syncAudioToMCP();
                }
            });
        } else {
            // Fallback smooth scroll
            mcpSection?.scrollIntoView({ 
                behavior: 'smooth',
                block: 'center'
            });
            // Sync audio after a delay for fallback scroll
            setTimeout(() => {
                this.syncAudioToMCP();
            }, 1000);
        }
    }
    
    /**
     * Sync audio to MCP section start time
     */
    syncAudioToMCP() {
        if (window.audioManager) {
            // Find the MCP section timing
            const mcpSection = window.audioManager.sections.find(section => section.id === 'mcp');
            if (mcpSection) {
                console.log(`🎵 Matrix: Syncing audio to MCP section - startTime: ${mcpSection.startTime}s`);
                
                // Start from beginning of MCP section
                window.audioManager.seekTo(mcpSection.startTime);
                
                // Start playing if not already playing
                if (!window.audioManager.isPlaying) {
                    console.log('🎵 Matrix: Starting audio playback');
                    window.audioManager.play();
                }
            } else {
                console.warn('🎵 Matrix: MCP section not found in audio sections');
            }
            
            // Re-enable scroll sync after a delay
            setTimeout(() => {
                console.log('🎵 Matrix: Re-enabling scroll sync');
                window.audioManager.enableScrollSync();
            }, 3000);
        } else {
            console.warn('🎵 Matrix: AudioManager not available');
        }
    }
    
    /**
     * Stop the Matrix effect and clean up
     */
    stopEffect() {
        if (!this.isActive) return;
        
        this.isActive = false;
        
        // Hide overlay
        this.overlay.classList.remove('active');
        this.console.classList.remove('visible');
        
        // Clear rain after transition
        setTimeout(() => {
            this.rainContainer.innerHTML = '';
            this.typewriter.innerHTML = 'Initializing neural pathways...';
        }, 1000);
    }
    
    /**
     * Utility sleep function
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    /**
     * Handle window resize to recreate rain columns
     */
    handleResize() {
        if (this.isActive) {
            this.createRain();
        }
    }
}

// Matrix Sound Effects Class
class MatrixSounds {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.init();
    }
    
    async init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.createSounds();
        } catch (error) {
            console.warn('Web Audio API not supported:', error);
        }
    }
    
    createSounds() {
        // Matrix entrance sound (sweep)
        this.sounds.entrance = this.createSweepSound(200, 800, 2.0);
        
        // Typewriter sound
        this.sounds.type = this.createClickSound(800, 0.1);
        
        // Success sound
        this.sounds.success = this.createBeepSound(600, 0.3);
    }
    
    createSweepSound(startFreq, endFreq, duration) {
        return () => {
            if (!this.audioContext) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(startFreq, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(endFreq, this.audioContext.currentTime + duration);
            
            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
            
            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + duration);
        };
    }
    
    createClickSound(frequency, duration) {
        return () => {
            if (!this.audioContext) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.05, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
            
            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + duration);
        };
    }
    
    createBeepSound(frequency, duration) {
        return () => {
            if (!this.audioContext) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
            
            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + duration);
        };
    }
    
    play(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName]();
        }
    }
    
    async resume() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
    }
}

// Konami Code Easter Egg
class KonamiCode {
    constructor(callback) {
        this.sequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 
                        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 
                        'KeyB', 'KeyA'];
        this.userInput = [];
        this.callback = callback;
        
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
    }
    
    handleKeyDown(event) {
        this.userInput.push(event.code);
        
        // Keep only the last 10 keys
        if (this.userInput.length > this.sequence.length) {
            this.userInput.shift();
        }
        
        // Check if sequence matches
        if (this.userInput.length === this.sequence.length &&
            this.userInput.every((key, index) => key === this.sequence[index])) {
            this.callback();
            this.userInput = []; // Reset
        }
    }
}

// Export for global use
export { MatrixEffect, MatrixSounds, KonamiCode };