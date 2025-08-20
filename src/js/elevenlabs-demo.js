/**
 * ElevenLabs TTS Demo Integration
 * Real-time text-to-speech synthesis with quantum interface
 */

class ElevenLabsDemo {
    constructor() {
        this.isGenerating = false;
        this.currentAudio = null;
        this.isDemoReady = false;
        this.voices = [
            { id: 'rachel', name: 'RACHEL_NEURAL_v3.0', description: 'Professional female voice' },
            { id: 'clyde', name: 'CLYDE_QUANTUM_v2.1', description: 'Deep male narrator' },
            { id: 'aria', name: 'ARIA_SYNTHETIC_v1.8', description: 'Youthful female assistant' }
        ];
        
        this.settings = {
            voice: 'rachel',
            speed: 1.0,
            stability: 0.5,
            clarity: 0.75,
            style: 0.0
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateUI();
        this.setupScrollDetection();
        this.shouldRestoreMainAudio = false; // Flag to control main audio restoration
        console.log('ElevenLabs demo initialized');
    }
    
    setupEventListeners() {
        // Main generation button
        const generateBtn = document.getElementById('generate-speech-btn');
        generateBtn?.addEventListener('click', () => this.generateSpeech());
        
        // Voice selection
        const voiceSelect = document.getElementById('voice-select');
        voiceSelect?.addEventListener('change', (e) => {
            this.settings.voice = e.target.value;
            this.updateVoiceInfo();
        });
        
        // Speed slider
        const speedSlider = document.getElementById('speed-slider');
        speedSlider?.addEventListener('input', (e) => {
            this.settings.speed = parseFloat(e.target.value);
            this.updateSpeedDisplay();
        });
        
        // Text input character counter
        const textInput = document.getElementById('demo-text-input');
        textInput?.addEventListener('input', () => this.updateCharacterCount());
        
        // Download button
        const downloadBtn = document.getElementById('download-audio-btn');
        downloadBtn?.addEventListener('click', () => this.downloadAudio());
        
        // Custom play/pause button
        const playPauseBtn = document.getElementById('demo-play-pause');
        playPauseBtn?.addEventListener('click', () => this.togglePlayback());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
    }
    
    updateUI() {
        this.updateVoiceInfo();
        this.updateSpeedDisplay();
        this.updateCharacterCount();
    }
    
    updateVoiceInfo() {
        const voice = this.voices.find(v => v.id === this.settings.voice);
        if (voice) {
            const voiceInfo = document.querySelector('.voice-info');
            if (voiceInfo) {
                voiceInfo.textContent = voice.description;
            }
        }
    }
    
    updateSpeedDisplay() {
        const speedDisplay = document.getElementById('speed-display');
        if (speedDisplay) {
            speedDisplay.textContent = `${this.settings.speed}x QUANTUM`;
        }
    }
    
    updateCharacterCount() {
        const textInput = document.getElementById('demo-text-input');
        const counter = document.querySelector('.character-counter');
        
        if (textInput && counter) {
            const length = textInput.value.length;
            const maxLength = 500;
            counter.textContent = `${length}/${maxLength}`;
            
            // Visual feedback for approaching limit
            if (length > maxLength * 0.8) {
                counter.classList.add('text-yellow-400');
            } else {
                counter.classList.remove('text-yellow-400');
            }
            
            if (length >= maxLength) {
                counter.classList.add('text-red-400');
                textInput.value = textInput.value.substring(0, maxLength);
            } else {
                counter.classList.remove('text-red-400');
            }
        }
    }
    
    handleKeyboardShortcuts(e) {
        // Don't handle if user is typing in an input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        
        switch (e.key.toLowerCase()) {
            case 'g':
                e.preventDefault();
                this.generateSpeech();
                break;
            case 'p':
                e.preventDefault();
                this.togglePlayback();
                break;
            case 'd':
                e.preventDefault();
                this.downloadAudio();
                break;
        }
    }
    
    async generateSpeech() {
        if (this.isGenerating) return;
        
        const textInput = document.getElementById('demo-text-input');
        const text = textInput?.value.trim();
        
        if (!text) {
            this.showToast('Please enter text to synthesize', 'warning');
            return;
        }
        
        if (text.length > 500) {
            this.showToast('Text too long. Maximum 500 characters.', 'error');
            return;
        }
        
        this.isGenerating = true;
        this.showSynthesisProgress();
        
        try {
            // Show realistic loading process
            await this.simulateGenerationProcess();
            
            // For demo purposes, use existing audio
            // In production, this would call the actual ElevenLabs API
            const audioBlob = await this.simulateAudioGeneration(text);
            
            if (audioBlob) {
                await this.displayResult(audioBlob);
                
                // TEMPORARILY DISABLED to test if Toast is causing audio issues
                // this.showToast('Speech synthesis complete!', 'success');
                console.log('✅ Speech synthesis complete! (Toast disabled for testing)');
            }
            
        } catch (error) {
            console.error('Speech generation failed:', error);
            this.showToast('Generation failed. Please try again.', 'error');
        } finally {
            this.isGenerating = false;
            this.hideSynthesisProgress();
        }
    }
    
    async simulateGenerationProcess() {
        const steps = [
            { message: '🧠 Analyzing text semantics...', duration: 800 },
            { message: '🎭 Applying emotional modeling...', duration: 1200 },
            { message: '🎵 Generating neural audio waves...', duration: 1500 },
            { message: '⚡ Quantum synthesis in progress...', duration: 1000 },
            { message: '🔊 Finalizing audio output...', duration: 600 }
        ];
        
        const statusElement = document.querySelector('.synthesis-step');
        const progressBar = document.getElementById('synthesis-progress');
        
        let totalProgress = 0;
        
        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            
            if (statusElement) {
                statusElement.textContent = step.message;
            }
            
            // Animate progress
            const stepProgress = (i + 1) / steps.length * 100;
            if (progressBar) {
                progressBar.style.width = `${stepProgress}%`;
            }
            
            await new Promise(resolve => setTimeout(resolve, step.duration));
        }
    }
    
    async simulateAudioGeneration(text) {
        // In a real implementation, this would be:
        // const response = await fetch('/api/elevenlabs/text-to-speech', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({
        //         text: text,
        //         voice_id: this.settings.voice,
        //         model_id: 'eleven_monolingual_v1',
        //         voice_settings: {
        //             stability: this.settings.stability,
        //             similarity_boost: this.settings.clarity,
        //             style: this.settings.style,
        //             use_speaker_boost: true
        //         }
        //     })
        // });
        // return response.blob();
        
        // For demo, create a blob from existing audio
        try {
            const response = await fetch('./src/assets/audio/claude_mcp_explanation_english.mp3');
            return await response.blob();
        } catch (error) {
            console.warn('Could not load demo audio, creating placeholder');
            return this.createSilentAudioBlob();
        }
    }
    
    createSilentAudioBlob() {
        // Create a short silent audio file for demo
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const sampleRate = audioContext.sampleRate;
        const duration = 2; // 2 seconds
        const numSamples = sampleRate * duration;
        
        const audioBuffer = audioContext.createBuffer(1, numSamples, sampleRate);
        const channelData = audioBuffer.getChannelData(0);
        
        // Add some gentle white noise for demo
        for (let i = 0; i < numSamples; i++) {
            channelData[i] = (Math.random() - 0.5) * 0.1;
        }
        
        // Convert to WAV blob (simplified)
        const wavData = this.audioBufferToWav(audioBuffer);
        return new Blob([wavData], { type: 'audio/wav' });
    }
    
    audioBufferToWav(buffer) {
        // Simplified WAV encoding
        const length = buffer.length;
        const arrayBuffer = new ArrayBuffer(44 + length * 2);
        const view = new DataView(arrayBuffer);
        
        // WAV header
        const writeString = (offset, string) => {
            for (let i = 0; i < string.length; i++) {
                view.setUint8(offset + i, string.charCodeAt(i));
            }
        };
        
        writeString(0, 'RIFF');
        view.setUint32(4, 36 + length * 2, true);
        writeString(8, 'WAVE');
        writeString(12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, 1, true);
        view.setUint32(24, buffer.sampleRate, true);
        view.setUint32(28, buffer.sampleRate * 2, true);
        view.setUint16(32, 2, true);
        view.setUint16(34, 16, true);
        writeString(36, 'data');
        view.setUint32(40, length * 2, true);
        
        // Convert float samples to 16-bit PCM
        const channelData = buffer.getChannelData(0);
        let offset = 44;
        for (let i = 0; i < length; i++) {
            const sample = Math.max(-1, Math.min(1, channelData[i]));
            view.setInt16(offset, sample * 0x7FFF, true);
            offset += 2;
        }
        
        return arrayBuffer;
    }
    
    showSynthesisProgress() {
        const statusElement = document.getElementById('synthesis-status');
        const resultElement = document.getElementById('synthesis-result');
        const generateBtn = document.getElementById('generate-speech-btn');
        
        if (statusElement) statusElement.style.display = 'block';
        if (resultElement) resultElement.style.display = 'none';
        if (generateBtn) {
            generateBtn.disabled = true;
            generateBtn.innerHTML = '⚡ SYNTHESIZING...';
        }
        
        // Add synthesis step indicator
        if (!document.querySelector('.synthesis-step')) {
            const stepElement = document.createElement('div');
            stepElement.className = 'synthesis-step text-cyan-400 text-center mt-4';
            statusElement?.appendChild(stepElement);
        }
    }
    
    hideSynthesisProgress() {
        const statusElement = document.getElementById('synthesis-status');
        const generateBtn = document.getElementById('generate-speech-btn');
        
        if (statusElement) statusElement.style.display = 'none';
        if (generateBtn) {
            generateBtn.disabled = false;
            generateBtn.innerHTML = '🚀 INITIATE SYNTHESIS';
        }
        
        // Remove synthesis step indicator
        const stepElement = document.querySelector('.synthesis-step');
        if (stepElement) stepElement.remove();
    }
    
    async displayResult(audioBlob) {
        const resultElement = document.getElementById('synthesis-result');
        const audioElement = document.getElementById('generated-audio');
        
        if (resultElement) resultElement.style.display = 'block';
        
        if (audioElement && audioBlob) {
            const audioUrl = URL.createObjectURL(audioBlob);
            audioElement.src = audioUrl;
            this.currentAudio = { blob: audioBlob, url: audioUrl, element: audioElement };
            
            // Configure audio element FIRST
            audioElement.preload = 'auto';
            audioElement.muted = false;
            audioElement.volume = 1.0;
            
            // Clean up previous event listeners
            this.removeAudioEventListeners(audioElement);
            
            // Add new event listeners BEFORE loading
            this.setupAudioEventListeners(audioElement);
            
            console.log('Loading demo audio for immediate playback...');
            audioElement.load();
            
            // Wait for the audio to be ready before marking as configured
            try {
                await new Promise((resolve, reject) => {
                    const timeout = setTimeout(() => reject(new Error('Audio load timeout')), 5000);
                    
                    audioElement.addEventListener('canplay', () => {
                        clearTimeout(timeout);
                        console.log('Demo audio is ready for immediate playback');
                        resolve();
                    }, { once: true });
                    
                    audioElement.addEventListener('error', () => {
                        clearTimeout(timeout);
                        reject(new Error('Audio load failed'));
                    }, { once: true });
                });
            } catch (error) {
                console.warn('Demo audio preparation failed:', error);
            }
            
            console.log('Demo audio fully configured and ready for first-click playback');
        }
        
        // Trigger success animation
        gsap.fromTo(resultElement, 
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }
        );
    }
    
    updateAudioInfo(duration) {
        const audioInfo = document.querySelector('.audio-info');
        if (audioInfo) {
            const minutes = Math.floor(duration / 60);
            const seconds = Math.floor(duration % 60);
            audioInfo.textContent = `Duration: ${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    }
    
    async togglePlayback() {
        const audioElement = document.getElementById('generated-audio');
        if (!audioElement || !this.currentAudio) {
            console.log('🎯 No audio element or currentAudio available');
            return;
        }
        
        try {
            if (audioElement.paused) {
                console.log('🎯 STARTING DEMO AUDIO - IMPROVED VERSION');
                
                // Ensure AudioContext is ready
                if (window.audioManager && window.audioManager.audioContext) {
                    if (window.audioManager.audioContext.state === 'suspended') {
                        console.log('🎯 Resuming AudioContext...');
                        await window.audioManager.resumeAudioContext();
                    }
                }
                
                // Stop main audio
                if (window.audioManager && window.audioManager.isPlaying) {
                    window.audioManager.pause();
                    console.log('🎯 Main audio paused');
                }
                
                // Wait for audio to be really ready if needed
                if (audioElement.readyState < 2) {
                    console.log('🎯 Audio not ready, waiting...');
                    await new Promise((resolve) => {
                        const checkReady = () => {
                            if (audioElement.readyState >= 2) {
                                console.log('🎯 Audio now ready for playback');
                                resolve();
                            } else {
                                setTimeout(checkReady, 50);
                            }
                        };
                        checkReady();
                    });
                }
                
                console.log('🎯 Playing demo audio...');
                await audioElement.play();
                console.log('🎯 Demo audio started successfully');
                
            } else {
                console.log('🎯 Pausing demo audio');
                audioElement.pause();
            }
        } catch (error) {
            console.error('Demo playback error:', error);
            this.showToast(`Playback failed: ${error.message}`, 'error');
        }
    }
    
    downloadAudio() {
        if (!this.currentAudio) {
            this.showToast('No audio to download', 'warning');
            return;
        }
        
        const link = document.createElement('a');
        link.href = this.currentAudio.url;
        link.download = `claude-mcp-synthesis-${Date.now()}.mp3`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showToast('Audio download started', 'success');
    }
    
    showToast(message, type = 'info') {
        // Remove existing toast
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) existingToast.remove();
        
        // Create toast
        const toast = document.createElement('div');
        toast.className = `toast-notification fixed top-8 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-full font-bold text-white`;
        
        // Style based on type
        const styles = {
            success: 'bg-green-500 border border-green-400',
            error: 'bg-red-500 border border-red-400',
            warning: 'bg-yellow-500 border border-yellow-400',
            info: 'bg-blue-500 border border-blue-400'
        };
        
        toast.className += ` ${styles[type] || styles.info}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        // Animate in
        gsap.fromTo(toast,
            { y: -100, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' }
        );
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            gsap.to(toast, {
                y: -100,
                opacity: 0,
                duration: 0.3,
                ease: 'back.in(1.7)',
                onComplete: () => toast.remove()
            });
        }, 3000);
    }
    
    removeAudioEventListeners(audioElement) {
        if (this.audioEventListeners) {
            Object.entries(this.audioEventListeners).forEach(([event, handler]) => {
                audioElement.removeEventListener(event, handler);
            });
        }
        this.audioEventListeners = null;
    }
    
    setupAudioEventListeners(audioElement) {
        // Create bound event handlers to prevent memory leaks
        this.audioEventListeners = {
            loadedmetadata: () => this.updateAudioInfo(audioElement.duration),
            loadstart: () => this.onDemoAudioLoadStart(),
            canplay: () => this.onDemoAudioCanPlay(),
            canplaythrough: () => this.onDemoAudioCanPlayThrough(),
            play: () => this.onDemoAudioPlay(),
            pause: () => this.onDemoAudioPause(),
            ended: () => this.onDemoAudioEnded(),
            error: (e) => this.onDemoAudioError(e),
            stalled: () => this.onDemoAudioStalled(),
            waiting: () => this.onDemoAudioWaiting()
        };
        
        // Add event listeners
        Object.entries(this.audioEventListeners).forEach(([event, handler]) => {
            audioElement.addEventListener(event, handler);
        });
    }
    
    async onDemoAudioCanPlay() {
        console.log('Demo audio can play - preparing for smooth playback');
        
        // Pre-prepare audio context when audio becomes ready
        if (window.audioManager && window.audioManager.audioContext) {
            try {
                // Resume audio context proactively when the demo audio is ready
                if (window.audioManager.audioContext.state === 'suspended') {
                    await window.audioManager.resumeAudioContext();
                    console.log('AudioContext pre-resumed for demo in canplay event');
                }
            } catch (error) {
                console.warn('Could not pre-resume AudioContext:', error);
            }
        }
        
        // Also try to create AudioContext if it doesn't exist
        if (!window.audioManager || !window.audioManager.audioContext) {
            console.log('No AudioContext found, this might cause issues');
        }
        
        // Mark that demo audio is ready for playback
        this.isDemoReady = true;
        console.log('Demo audio marked as ready');
    }
    
    onDemoAudioLoadStart() {
        console.log('Demo audio load started');
        this.isDemoReady = false;
    }
    
    onDemoAudioCanPlayThrough() {
        console.log('Demo audio can play through - fully ready');
        this.isDemoReady = true;
    }
    
    onDemoAudioStalled() {
        console.log('Demo audio stalled - network issue');
    }
    
    onDemoAudioWaiting() {
        console.log('Demo audio waiting for more data');
    }
    
    onDemoAudioError(error) {
        console.error('Demo audio error:', error);
        this.showToast('Audio playback error occurred', 'error');
        this.isDemoReady = false;
    }
    
    async onDemoAudioPlay() {
        const currentTime = this.currentAudio?.element?.currentTime;
        console.log('🟢 Demo audio PLAY event triggered - currentTime:', currentTime);
        console.log('🟢 Audio state:', {
            paused: this.currentAudio?.element?.paused,
            ended: this.currentAudio?.element?.ended,
            readyState: this.currentAudio?.element?.readyState,
            networkState: this.currentAudio?.element?.networkState
        });
        
        // Update button to pause icon
        const playPauseBtn = document.getElementById('demo-play-pause');
        if (playPauseBtn) {
            playPauseBtn.textContent = '⏸';
        }
        
        // Ensure audio context is ready for both main and demo audio
        if (window.audioManager && window.audioManager.audioContext) {
            try {
                await window.audioManager.resumeAudioContext();
                console.log('AudioContext resumed for demo playback');
            } catch (error) {
                console.warn('Could not resume AudioContext:', error);
            }
        }
        
        // Stop main audio immediately when demo plays
        if (window.audioManager && window.audioManager.isPlaying) {
            console.log('Stopping main audio for demo playback');
            window.audioManager.pause();
        }
        
        // Start progress tracking
        this.startProgressTracking();
        
        // Create demo audio manager reference for global coordination
        window.demoAudioManager = this;
        this.shouldRestoreMainAudio = false; // Don't auto-restore while demo is playing
    }
    
    onDemoAudioPause() {
        const currentTime = this.currentAudio?.element?.currentTime;
        console.log('🔴 Demo audio PAUSED - currentTime:', currentTime);
        console.log('🔴 Audio state:', {
            paused: this.currentAudio?.element?.paused,
            ended: this.currentAudio?.element?.ended,
            readyState: this.currentAudio?.element?.readyState,
            networkState: this.currentAudio?.element?.networkState
        });
        console.trace('🔴 Audio pause stack trace'); // This will show us what caused the pause
        
        // STOP ALL OTHER PROCESSING IMMEDIATELY WHEN PAUSE HAPPENS
        console.log('🛑 PAUSE EVENT DETECTED - STOPPING ALL OTHER AUDIO LOGIC');
        
        // Update button back to play icon
        const playPauseBtn = document.getElementById('demo-play-pause');
        if (playPauseBtn) {
            playPauseBtn.textContent = '▶';
        }
        
        // Stop progress tracking
        this.stopProgressTracking();
        
        // DISABLE BRUTE FORCE TEMPORARILY - LET'S SEE RAW BEHAVIOR
        console.log('🚀 BRUTE FORCE DISABLED - Raw pause behavior analysis');
        console.log('🚀 No automatic restart - let pause happen and observe')
    }
    
    startProgressTracking() {
        this.stopProgressTracking(); // Clear any existing interval
        
        this.progressInterval = setInterval(() => {
            const audioElement = this.currentAudio?.element;
            if (audioElement && !audioElement.paused) {
                const progress = (audioElement.currentTime / audioElement.duration) * 100;
                const progressBar = document.getElementById('demo-progress');
                if (progressBar) {
                    progressBar.style.width = `${progress}%`;
                }
            }
        }, 100);
    }
    
    stopProgressTracking() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }
    }
    
    onDemoAudioEnded() {
        console.log('🎵 Demo audio playback ended naturally');
        
        // Update button back to play icon
        const playPauseBtn = document.getElementById('demo-play-pause');
        if (playPauseBtn) {
            playPauseBtn.textContent = '▶';
        }
        
        // Reset progress bar
        const progressBar = document.getElementById('demo-progress');
        if (progressBar) {
            progressBar.style.width = '0%';
        }
        
        // Stop progress tracking
        this.stopProgressTracking();
        
        this.shouldRestoreMainAudio = true;
        
        // Restore main audio after demo ends
        if (window.audioManager) {
            setTimeout(() => {
                console.log('🎵 Demo ended naturally - restoring main audio');
                window.audioManager.play();
            }, 500);
        }
    }
    
    // Method to stop demo audio (called from external systems)
    stop() {
        if (this.currentAudio?.element) {
            this.currentAudio.element.pause();
            this.currentAudio.element.currentTime = 0;
        }
    }
    
    // Method to check if demo is currently playing
    isPlaying() {
        return this.currentAudio?.element && !this.currentAudio.element.paused;
    }
    
    setupScrollDetection() {
        // Monitor scroll position to manage audio restoration
        let scrollTimeout;
        let lastKnownScrollPos = 0;
        let ticking = false;

        const handleScroll = () => {
            lastKnownScrollPos = window.scrollY;
            
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.checkDemoVisibility(lastKnownScrollPos);
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
    }
    
    checkDemoVisibility(scrollPos) {
        console.log('🎯 Checking demo visibility - scrollPos:', scrollPos);
        
        const demoSection = document.getElementById('demo');
        if (!demoSection) return;
        
        const rect = demoSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        // If demo is playing and user scrolled significantly away from demo section
        if (this.isPlaying() && !isVisible) {
            const currentTime = this.currentAudio?.element?.currentTime || 0;
            
            // Only stop if demo has been playing for at least 5 seconds AND user scrolled significantly
            // This prevents accidental stops during normal scrolling
            if (currentTime > 5) {
                console.log('🎯 User scrolled significantly away from demo after', currentTime, 'seconds - stopping demo audio');
                this.stop();
                this.shouldRestoreMainAudio = true;
                
                // Restore main audio after scrolling away with a longer delay
                if (window.audioManager) {
                    setTimeout(() => {
                        console.log('🎵 Restoring main audio after leaving demo section');
                        window.audioManager.play();
                    }, 500);
                }
            } else {
                console.log('🎯 Demo playing but not long enough to stop (', currentTime, 's) - continuing');
            }
        } else if (isVisible && this.isPlaying()) {
            // Demo is visible and playing - don't restore main audio
            this.shouldRestoreMainAudio = false;
        }
    }

    // Public API
    generateText(text) {
        const textInput = document.getElementById('demo-text-input');
        if (textInput) {
            textInput.value = text;
            this.updateCharacterCount();
        }
    }
    
    setVoice(voiceId) {
        if (this.voices.find(v => v.id === voiceId)) {
            this.settings.voice = voiceId;
            const voiceSelect = document.getElementById('voice-select');
            if (voiceSelect) voiceSelect.value = voiceId;
            this.updateVoiceInfo();
        }
    }
    
    setSpeed(speed) {
        this.settings.speed = Math.max(0.5, Math.min(2.0, speed));
        const speedSlider = document.getElementById('speed-slider');
        if (speedSlider) speedSlider.value = this.settings.speed;
        this.updateSpeedDisplay();
    }
    
    getStatus() {
        return {
            isGenerating: this.isGenerating,
            hasAudio: !!this.currentAudio,
            settings: { ...this.settings }
        };
    }
    
    destroy() {
        // Clean up audio URLs
        if (this.currentAudio?.url) {
            URL.revokeObjectURL(this.currentAudio.url);
        }
        
        // Clean up audio event listeners
        if (this.currentAudio?.element) {
            this.removeAudioEventListeners(this.currentAudio.element);
        }
        
        // Remove global event listeners
        document.removeEventListener('keydown', this.handleKeyboardShortcuts);
        
        // Clean up global references
        if (window.demoAudioManager === this) {
            window.demoAudioManager = null;
        }
        
        console.log('ElevenLabs demo destroyed');
    }
}

// Export for module usage
export default ElevenLabsDemo;