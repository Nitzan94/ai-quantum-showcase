/**
 * Advanced Audio Manager for Claude MCP Showcase
 * Handles Web Audio API, scroll synchronization, and visualizations
 */

class AudioManager {
    constructor(options = {}) {
        this.options = {
            visualizations: true,
            scrollSync: true,
            autoPlay: false,
            volume: 0.7,
            ...options
        };
        
        this.audioContext = null;
        this.audioElement = null;
        this.source = null;
        this.analyzer = null;
        this.gainNode = null;
        
        this.isPlaying = false;
        this.currentTime = 0;
        this.duration = 0;
        this.currentLanguage = 'english';
        this.scrollSyncEnabled = true;
        
        this.audioFiles = {
            english: './src/assets/audio/neuroscience_explanation_english.mp3',
            hebrew: './src/assets/audio/claude_mcp_explanation.mp3',
            demo: './src/assets/audio/claude_mcp_explanation_english.mp3'
        };
        
        this.sections = [
            { id: 'hero', startTime: 0, endTime: 18, title: 'Augmented Consciousness' },
            { id: 'neuroscience', startTime: 18, endTime: 40, title: 'Brain Architecture' },
            { id: 'mcp', startTime: 40, endTime: 55, title: 'Neural Synchronization' },
            { id: 'demo', startTime: 55, endTime: 75, title: 'Cognitive Loop' },
            { id: 'conclusion', startTime: 75, endTime: 90, title: 'Future of Thinking' }
        ];
        
        this.init();
    }
    
    async init() {
        try {
            await this.setupAudioContext();
            await this.loadAudio();
            this.setupEventListeners();
            this.createAudioControls();
            this.setupScrollSync();
            console.log('AudioManager initialized successfully');
        } catch (error) {
            console.error('Failed to initialize AudioManager:', error);
        }
    }
    
    async setupAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.gainNode = this.audioContext.createGain();
            this.gainNode.gain.value = this.options.volume;
            
            // Setup analyzer for visualizations
            this.analyzer = this.audioContext.createAnalyser();
            this.analyzer.fftSize = 256;
            this.analyzer.smoothingTimeConstant = 0.8;
            
            this.gainNode.connect(this.analyzer);
            this.analyzer.connect(this.audioContext.destination);
        } catch (error) {
            console.error('Failed to setup audio context:', error);
        }
    }
    
    async loadAudio() {
        const audioFile = this.audioFiles[this.currentLanguage];
        
        try {
            this.audioElement = new Audio(audioFile);
            this.audioElement.crossOrigin = 'anonymous';
            this.audioElement.preload = 'auto';
            
            // Wait for metadata to load
            await new Promise((resolve, reject) => {
                this.audioElement.addEventListener('loadedmetadata', resolve);
                this.audioElement.addEventListener('error', reject);
                this.audioElement.load();
            });
            
            this.duration = this.audioElement.duration * 1000; // Convert to ms
            
            // Connect to Web Audio API
            if (this.audioContext && !this.source) {
                this.source = this.audioContext.createMediaElementSource(this.audioElement);
                this.source.connect(this.gainNode);
            }
            
        } catch (error) {
            console.error('Failed to load audio:', error);
        }
    }
    
    setupEventListeners() {
        if (!this.audioElement) return;
        
        this.audioElement.addEventListener('timeupdate', () => {
            this.currentTime = this.audioElement.currentTime * 1000;
            this.updateProgressBar();
            
            if (this.options.visualizations) {
                this.updateVisualizations();
            }
        });
        
        this.audioElement.addEventListener('play', () => {
            this.isPlaying = true;
            this.resumeAudioContext();
        });
        
        this.audioElement.addEventListener('pause', () => {
            this.isPlaying = false;
        });
        
        this.audioElement.addEventListener('ended', () => {
            this.isPlaying = false;
            this.currentTime = 0;
        });
    }
    
    createAudioControls() {
        const controls = document.createElement('div');
        controls.className = 'audio-controls fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300';
        controls.id = 'audio-controls';
        controls.innerHTML = `
            <div class="bg-black/80 backdrop-blur-lg border-2 border-cyan-400/60 rounded-3xl px-6 py-4 flex items-center gap-4 shadow-2xl shadow-cyan-400/20 holographic-card">
                <button id="play-pause-btn" class="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center text-white font-bold hover:scale-110 transition-all duration-300 shadow-lg">
                    ▶
                </button>
                <div class="flex items-center gap-3 min-w-[150px]">
                    <span class="text-sm text-cyan-300 font-mono w-10 font-bold">0:00</span>
                    <div class="w-24 h-2 bg-gray-800/80 rounded-full cursor-pointer border border-cyan-400/30" id="progress-bar">
                        <div class="h-full bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full transition-all" id="progress-fill" style="width: 0%"></div>
                    </div>
                    <span class="text-sm text-cyan-300 font-mono w-10 font-bold">2:02</span>
                </div>
                <button id="language-btn" class="text-sm text-gray-200 hover:text-cyan-300 transition-colors bg-purple-600/30 px-3 py-2 rounded-xl border border-purple-400/40 hover:border-cyan-400/60 font-bold">
                    EN
                </button>
                <button id="volume-btn" class="text-gray-200 hover:text-cyan-300 transition-colors text-lg hover:scale-110 transition-transform">
                    🔊
                </button>
                <button id="minimize-controls" class="text-purple-400 hover:text-cyan-300 transition-colors text-sm ml-2 hover:scale-110 transition-transform" title="Minimize">
                    ⌄
                </button>
            </div>
        `;
        
        document.body.appendChild(controls);
        this.bindControlEvents();
        this.setupControlsAutoHide();
    }
    
    bindControlEvents() {
        const playPauseBtn = document.getElementById('play-pause-btn');
        const progressBar = document.getElementById('progress-bar');
        const languageBtn = document.getElementById('language-btn');
        const volumeBtn = document.getElementById('volume-btn');
        const minimizeBtn = document.getElementById('minimize-controls');
        
        playPauseBtn?.addEventListener('click', () => this.togglePlayback());
        
        progressBar?.addEventListener('click', (e) => {
            const rect = e.target.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            this.seekTo(percent * this.duration);
        });
        
        languageBtn?.addEventListener('click', () => {
            const newLang = this.currentLanguage === 'english' ? 'hebrew' : 'english';
            this.switchLanguage(newLang);
        });
        
        volumeBtn?.addEventListener('click', () => this.toggleMute());
        
        minimizeBtn?.addEventListener('click', () => this.toggleControlsVisibility());
    }
    
    setupControlsAutoHide() {
        const controls = document.getElementById('audio-controls');
        if (!controls) return;
        
        let hideTimeout;
        
        // Auto-hide after inactivity
        const resetHideTimer = () => {
            clearTimeout(hideTimeout);
            controls.style.opacity = '1';
            
            if (!this.isPlaying) {
                hideTimeout = setTimeout(() => {
                    controls.style.opacity = '0.3';
                }, 5000); // Hide after 5 seconds of inactivity
            }
        };
        
        // Show on hover
        controls.addEventListener('mouseenter', () => {
            clearTimeout(hideTimeout);
            controls.style.opacity = '1';
        });
        
        // Start hide timer on mouse leave
        controls.addEventListener('mouseleave', resetHideTimer);
        
        // Reset timer on any interaction
        controls.addEventListener('click', resetHideTimer);
        
        // Start the initial timer
        resetHideTimer();
    }
    
    toggleControlsVisibility() {
        const controls = document.getElementById('audio-controls');
        const minimizeBtn = document.getElementById('minimize-controls');
        
        if (controls.classList.contains('minimized')) {
            // Expand
            controls.classList.remove('minimized');
            controls.style.transform = 'scale(1)';
            minimizeBtn.textContent = '⌄';
            minimizeBtn.title = 'Minimize';
        } else {
            // Minimize  
            controls.classList.add('minimized');
            controls.style.transform = 'scale(0.7)';
            minimizeBtn.textContent = '⌃';
            minimizeBtn.title = 'Expand';
        }
    }
    
    async togglePlayback() {
        if (!this.audioElement) return;
        
        try {
            if (this.isPlaying) {
                this.audioElement.pause();
                document.getElementById('play-pause-btn').textContent = '▶';
            } else {
                // Ensure audio context is resumed
                await this.resumeAudioContext();
                
                // Stop any demo audio if playing (check multiple references)
                if (window.demoAudioManager && window.demoAudioManager.isPlaying()) {
                    console.log('🔵 Main AudioManager: Stopping demo audio to start main');
                    console.log('Stopping demo audio (demoAudioManager) to start main audio');
                    window.demoAudioManager.stop();
                } else if (window.elevenLabsDemo && window.elevenLabsDemo.isPlaying()) {
                    console.log('Stopping demo audio (elevenLabsDemo) to start main audio');
                    window.elevenLabsDemo.stop();
                }
                
                await this.audioElement.play();
                document.getElementById('play-pause-btn').textContent = '⏸';
            }
        } catch (error) {
            console.error('Playback error:', error);
            // Try again after a small delay for browser restrictions
            setTimeout(async () => {
                try {
                    await this.resumeAudioContext();
                    await this.audioElement.play();
                    document.getElementById('play-pause-btn').textContent = '⏸';
                } catch (retryError) {
                    console.error('Retry playback error:', retryError);
                }
            }, 100);
        }
    }
    
    seekTo(timeInMs) {
        if (!this.audioElement) return;
        
        this.audioElement.currentTime = Math.max(0, Math.min(timeInMs / 1000, this.audioElement.duration));
    }
    
    async switchLanguage(language) {
        if (!this.audioFiles[language]) return;
        
        const wasPlaying = this.isPlaying;
        const currentTime = this.currentTime;
        
        if (wasPlaying) {
            this.audioElement.pause();
        }
        
        this.currentLanguage = language;
        await this.loadAudio();
        
        if (wasPlaying) {
            this.seekTo(currentTime);
            await this.audioElement.play();
        }
        
        // Update language button
        const languageBtn = document.getElementById('language-btn');
        if (languageBtn) {
            languageBtn.textContent = language === 'english' ? 'EN' : 'עב';
        }
    }
    
    toggleMute() {
        if (!this.gainNode) return;
        
        const currentVolume = this.gainNode.gain.value;
        if (currentVolume > 0) {
            this.gainNode.gain.value = 0;
            document.getElementById('volume-btn').textContent = '🔇';
        } else {
            this.gainNode.gain.value = this.options.volume;
            document.getElementById('volume-btn').textContent = '🔊';
        }
    }
    
    updateProgressBar() {
        const progressFill = document.getElementById('progress-fill');
        if (progressFill && this.duration > 0) {
            const percent = (this.currentTime / this.duration) * 100;
            progressFill.style.width = `${percent}%`;
        }
        this.updateTimeDisplay();
    }
    
    updateTimeDisplay() {
        const timeSpans = document.querySelectorAll('#audio-controls span');
        if (timeSpans.length >= 2) {
            timeSpans[0].textContent = this.formatTime(this.currentTime / 1000);
            timeSpans[1].textContent = this.formatTime(this.duration / 1000);
        }
    }
    
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    setupScrollSync() {
        if (!this.options.scrollSync) return;
        
        let isScrolling = false;
        
        window.addEventListener('scroll', () => {
            if (this.isPlaying || isScrolling || !this.scrollSyncEnabled) return;
            
            isScrolling = true;
            
            // Calculate scroll progress
            const scrollTop = window.pageYOffset;
            const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = scrollTop / documentHeight;
            
            // Sync audio to scroll position
            const targetTime = scrollPercent * this.duration;
            this.seekTo(targetTime);
            
            setTimeout(() => {
                isScrolling = false;
            }, 100);
        });
    }
    
    updateVisualizations() {
        if (!this.analyzer) return;
        
        const bufferLength = this.analyzer.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        this.analyzer.getByteFrequencyData(dataArray);
        
        // Update existing visualizers
        this.updateWaveformVisualizer(dataArray);
        this.updateSpectrumAnalyzer(dataArray);
    }
    
    updateWaveformVisualizer(dataArray) {
        const canvas = document.getElementById('waveform-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        ctx.clearRect(0, 0, width, height);
        
        // Create gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#8b5cf6');
        gradient.addColorStop(1, '#ec4899');
        
        ctx.fillStyle = gradient;
        
        const barWidth = width / dataArray.length;
        let x = 0;
        
        for (let i = 0; i < dataArray.length; i++) {
            const barHeight = (dataArray[i] / 255) * height;
            ctx.fillRect(x, height - barHeight, barWidth, barHeight);
            x += barWidth;
        }
    }
    
    updateSpectrumAnalyzer(dataArray) {
        const canvas = document.getElementById('spectrum-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        ctx.clearRect(0, 0, width, height);
        
        // Draw circular spectrum
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 3;
        
        for (let i = 0; i < dataArray.length; i++) {
            const angle = (i / dataArray.length) * Math.PI * 2;
            const amplitude = dataArray[i] / 255;
            
            const x1 = centerX + Math.cos(angle) * radius;
            const y1 = centerY + Math.sin(angle) * radius;
            const x2 = centerX + Math.cos(angle) * (radius + amplitude * 50);
            const y2 = centerY + Math.sin(angle) * (radius + amplitude * 50);
            
            ctx.strokeStyle = `hsl(${(i / dataArray.length) * 360}, 70%, 60%)`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
    }
    
    async resumeAudioContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            try {
                await this.audioContext.resume();
            } catch (error) {
                console.error('Failed to resume audio context:', error);
            }
        }
    }
    
    // Public API
    play() {
        return this.togglePlayback();
    }
    
    pause() {
        console.log('🔵 Main AudioManager: pause() called - isPlaying:', this.isPlaying);
        if (this.audioElement && this.isPlaying) {
            console.log('🔵 Main AudioManager: Actually pausing main audio element');
            this.audioElement.pause();
        }
    }
    
    stop() {
        if (this.audioElement) {
            this.audioElement.pause();
            this.audioElement.currentTime = 0;
        }
    }
    
    setVolume(volume) {
        this.options.volume = Math.max(0, Math.min(1, volume));
        if (this.gainNode) {
            this.gainNode.gain.value = this.options.volume;
        }
    }
    
    destroy() {
        if (this.audioElement) {
            this.audioElement.pause();
            this.audioElement.src = '';
        }
        
        if (this.audioContext) {
            this.audioContext.close();
        }
        
        // Remove controls
        const controls = document.querySelector('.audio-controls');
        if (controls) {
            controls.remove();
        }
    }
    
    /**
     * Disable scroll synchronization
     */
    disableScrollSync() {
        this.scrollSyncEnabled = false;
        console.log('Scroll sync disabled');
    }
    
    /**
     * Enable scroll synchronization
     */
    enableScrollSync() {
        this.scrollSyncEnabled = true;
        console.log('Scroll sync enabled');
    }
}

// Export for module usage
export default AudioManager;