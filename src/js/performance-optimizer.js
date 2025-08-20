/**
 * Performance Optimization Manager
 * Handles lazy loading, resource management, and performance monitoring
 */

class PerformanceOptimizer {
    constructor() {
        this.isOptimizationEnabled = true;
        this.observers = {};
        this.loadedResources = new Set();
        this.performanceMetrics = {};
        
        this.init();
    }
    
    init() {
        this.setupIntersectionObserver();
        this.optimizeAnimations();
        this.setupResourcePreloading();
        this.monitorPerformance();
        
        // Apply mobile optimizations immediately if on mobile
        if (this.isMobileDevice()) {
            this.applyMobileOptimizations();
            this.startMobilePerformanceMonitoring();
        }
        
        console.log('Performance optimizer initialized');
    }
    
    setupIntersectionObserver() {
        // Lazy load Three.js scenes
        this.observers.scenes = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.loadedResources.has(entry.target.id)) {
                    this.loadScene(entry.target.id);
                    this.loadedResources.add(entry.target.id);
                }
            });
        }, { threshold: 0.1 });
        
        // Observe scene containers
        const sceneContainers = document.querySelectorAll('[id$="-container"]');
        sceneContainers.forEach(container => {
            this.observers.scenes.observe(container);
        });
        
        // Lazy load animations
        this.observers.animations = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerSectionAnimation(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        // Observe sections
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            this.observers.animations.observe(section);
        });
    }
    
    loadScene(sceneId) {
        if (!window.threeSceneManager) return;
        
        const loadStartTime = performance.now();
        
        try {
            // Scene-specific initialization
            switch (sceneId) {
                case 'neural-network-container':
                    this.initializeNeuralNetworkScene();
                    break;
                case 'audio-visualizer-container':
                    this.initializeAudioVisualizerScene();
                    break;
                case 'quantum-field-container':
                    this.initializeQuantumFieldScene();
                    break;
            }
            
            const loadTime = performance.now() - loadStartTime;
            console.log(`Scene ${sceneId} loaded in ${loadTime.toFixed(2)}ms`);
            
        } catch (error) {
            console.error(`Failed to load scene ${sceneId}:`, error);
        }
    }
    
    initializeNeuralNetworkScene() {
        // Neural network specific optimizations
        const container = document.getElementById('neural-network-container');
        if (!container) return;
        
        // Reduce complexity on mobile
        if (this.isMobileDevice()) {
            container.style.opacity = '0.7';
            container.style.filter = 'blur(1px)';
        }
    }
    
    initializeAudioVisualizerScene() {
        // Audio visualizer optimizations
        if (this.isMobileDevice()) {
            // Reduce frame rate on mobile
            const originalAnimate = window.threeSceneManager?.animateAudioVisualizer;
            if (originalAnimate) {
                let frameCounter = 0;
                window.threeSceneManager.animateAudioVisualizer = function(...args) {
                    if (frameCounter % 2 === 0) {
                        originalAnimate.apply(this, args);
                    }
                    frameCounter++;
                };
            }
        }
    }
    
    initializeQuantumFieldScene() {
        // Quantum field optimizations
        const particleCount = this.isMobileDevice() ? 500 : 1000;
        // This would typically modify the particle system
        console.log(`Quantum field initialized with ${particleCount} particles`);
    }
    
    optimizeAnimations() {
        // Reduce motion for users who prefer it
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.disableAnimations();
            return;
        }
        
        // Throttle GSAP animations on mobile
        if (this.isMobileDevice()) {
            this.throttleGSAPAnimations();
        }
        
        // Use CSS animations for simple transitions
        this.preferCSSAnimations();
    }
    
    disableAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
                scroll-behavior: auto !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    throttleGSAPAnimations() {
        // Reduce GSAP ticker frequency on mobile
        if (window.gsap) {
            gsap.ticker.fps(30); // Reduce from 60fps to 30fps
        }
    }
    
    preferCSSAnimations() {
        // Replace simple GSAP animations with CSS where possible
        const simpleAnimations = document.querySelectorAll('.simple-fade, .simple-slide');
        simpleAnimations.forEach(element => {
            element.style.transition = 'all 0.3s ease-out';
        });
    }
    
    setupResourcePreloading() {
        // Preload critical resources
        this.preloadAudioFiles();
        this.preloadFonts();
        
        // Lazy load non-critical resources
        setTimeout(() => {
            this.loadNonCriticalResources();
        }, 2000);
    }
    
    preloadAudioFiles() {
        const criticalAudio = [
            './src/assets/audio/claude_mcp_explanation_english.mp3'
        ];
        
        criticalAudio.forEach(src => {
            const audio = new Audio();
            audio.preload = 'metadata';
            audio.src = src;
        });
    }
    
    preloadFonts() {
        const fonts = [
            'Orbitron',
            'Space Grotesk',
            'JetBrains Mono'
        ];
        
        fonts.forEach(font => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'font';
            link.href = `https://fonts.googleapis.com/css2?family=${font}:wght@400;700&display=swap`;
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });
    }
    
    loadNonCriticalResources() {
        // Load additional Three.js effects
        this.loadAdvancedEffects();
        
        // Initialize additional audio visualizations
        this.initializeAdvancedVisualizations();
    }
    
    loadAdvancedEffects() {
        if (this.isMobileDevice()) return; // Skip on mobile
        
        // Load particle effects, bloom, etc.
        console.log('Loading advanced visual effects...');
    }
    
    initializeAdvancedVisualizations() {
        if (!window.audioManager || this.isMobileDevice()) return;
        
        // Initialize spectrum analyzer, waveform, etc.
        window.audioManager.enableAdvancedVisualizations?.();
    }
    
    monitorPerformance() {
        // Monitor FPS
        this.startFPSMonitoring();
        
        // Monitor memory usage
        this.startMemoryMonitoring();
        
        // Monitor loading times
        this.recordLoadingMetrics();
        
        // Report performance periodically
        setInterval(() => {
            this.reportPerformance();
        }, 30000); // Every 30 seconds
    }
    
    startFPSMonitoring() {
        let lastTime = performance.now();
        let frameCount = 0;
        
        const measureFPS = () => {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                this.performanceMetrics.fps = frameCount;
                frameCount = 0;
                lastTime = currentTime;
                
                // Adjust quality based on FPS
                if (this.performanceMetrics.fps < 30) {
                    this.reduceBrowserLoad();
                } else if (this.performanceMetrics.fps > 55) {
                    this.increaseBrowserLoad();
                }
            }
            
            requestAnimationFrame(measureFPS);
        };
        
        requestAnimationFrame(measureFPS);
    }
    
    startMemoryMonitoring() {
        if (!('memory' in performance)) return;
        
        setInterval(() => {
            const memory = performance.memory;
            this.performanceMetrics.memory = {
                used: memory.usedJSHeapSize,
                total: memory.totalJSHeapSize,
                limit: memory.jsHeapSizeLimit
            };
            
            // Clean up if memory usage is high
            if (memory.usedJSHeapSize / memory.jsHeapSizeLimit > 0.9) {
                this.cleanupMemory();
            }
        }, 5000);
    }
    
    recordLoadingMetrics() {
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            this.performanceMetrics.loadTime = perfData.loadEventEnd - perfData.fetchStart;
            this.performanceMetrics.domContentLoaded = perfData.domContentLoadedEventEnd - perfData.fetchStart;
        });
    }
    
    reduceBrowserLoad() {
        // Reduce Three.js quality
        if (window.threeSceneManager) {
            Object.values(window.threeSceneManager.renderers).forEach(renderer => {
                renderer.setPixelRatio(Math.min(window.devicePixelRatio * 0.5, 1));
            });
        }
        
        // Reduce animation frequency
        if (window.gsap) {
            gsap.ticker.fps(Math.max(gsap.ticker.fps() - 5, 20));
        }
        
        console.log('Performance mode: Reduced quality for better FPS');
    }
    
    increaseBrowserLoad() {
        // Increase Three.js quality
        if (window.threeSceneManager) {
            Object.values(window.threeSceneManager.renderers).forEach(renderer => {
                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            });
        }
        
        // Increase animation frequency
        if (window.gsap) {
            gsap.ticker.fps(Math.min(gsap.ticker.fps() + 5, 60));
        }
    }
    
    cleanupMemory() {
        // Force garbage collection if available
        if (window.gc) {
            window.gc();
        }
        
        // Clean up Three.js objects
        if (window.threeSceneManager) {
            // Clean up unused geometries and materials
            console.log('Cleaning up Three.js memory...');
        }
        
        // Clean up audio buffers
        if (window.audioManager) {
            window.audioManager.cleanup?.();
        }
        
        console.log('Memory cleanup performed');
    }
    
    reportPerformance() {
        const report = {
            timestamp: Date.now(),
            fps: this.performanceMetrics.fps || 0,
            memory: this.performanceMetrics.memory,
            loadTime: this.performanceMetrics.loadTime,
            userAgent: navigator.userAgent,
            connectionType: navigator.connection?.effectiveType || 'unknown'
        };
        
        console.log('Performance Report:', report);
        
        // In production, this would be sent to analytics
        // analytics.track('performance_metrics', report);
    }
    
    triggerSectionAnimation(section) {
        // Custom animation triggers for each section
        const sectionAnimations = {
            'hero': () => this.animateHeroSection(section),
            'mcp': () => this.animateMCPSection(section),
            'claude-code': () => this.animateClaudeCodeSection(section),
            'elevenlabs': () => this.animateElevenLabsSection(section),
            'demo': () => this.animateDemoSection(section)
        };
        
        const animation = sectionAnimations[section.id];
        if (animation) {
            animation();
        }
    }
    
    animateHeroSection(section) {
        if (this.loadedResources.has('hero-animated')) return;
        
        gsap.fromTo('.orbital-element', 
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 1, stagger: 0.2, ease: 'back.out(1.7)' }
        );
        
        this.loadedResources.add('hero-animated');
    }
    
    animateMCPSection(section) {
        if (this.loadedResources.has('mcp-animated')) return;
        
        gsap.fromTo('.holographic-card', 
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.2 }
        );
        
        this.loadedResources.add('mcp-animated');
    }
    
    animateClaudeCodeSection(section) {
        if (this.loadedResources.has('claude-code-animated')) return;
        
        // Typewriter effect for terminal
        const terminalLines = section.querySelectorAll('.space-y-2 div');
        terminalLines.forEach((line, index) => {
            gsap.from(line, {
                opacity: 0,
                delay: index * 0.3,
                duration: 0.5
            });
        });
        
        this.loadedResources.add('claude-code-animated');
    }
    
    animateElevenLabsSection(section) {
        if (this.loadedResources.has('elevenlabs-animated')) return;
        
        // Pulse animation for audio visualizer
        gsap.to('#waveform-canvas, #spectrum-canvas', {
            scale: 1.05,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: 'power2.inOut'
        });
        
        this.loadedResources.add('elevenlabs-animated');
    }
    
    animateDemoSection(section) {
        if (this.loadedResources.has('demo-animated')) return;
        
        // Interactive button hover effect
        const demoButton = section.querySelector('#generate-speech-btn');
        if (demoButton) {
            demoButton.addEventListener('mouseenter', () => {
                gsap.to(demoButton, { scale: 1.05, duration: 0.2 });
            });
            
            demoButton.addEventListener('mouseleave', () => {
                gsap.to(demoButton, { scale: 1, duration: 0.2 });
            });
        }
        
        this.loadedResources.add('demo-animated');
    }
    
    isMobileDevice() {
        return window.innerWidth < 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    // Enhanced mobile device detection with performance characteristics
    getDeviceInfo() {
        const userAgent = navigator.userAgent;
        const devicePixelRatio = window.devicePixelRatio || 1;
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
        const cores = navigator.hardwareConcurrency || 2;
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        
        return {
            isMobile: this.isMobileDevice(),
            isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
            isLowEnd: cores < 4 || (screenWidth * screenHeight < 1000000),
            isHighDensity: devicePixelRatio > 1.5,
            connectionType: connection?.effectiveType || 'unknown',
            isSlowConnection: connection?.effectiveType === 'slow-2g' || connection?.effectiveType === '2g',
            memoryLimit: navigator.deviceMemory || 2,
            isLowMemory: (navigator.deviceMemory || 2) < 4,
            screenSize: { width: screenWidth, height: screenHeight },
            pixelRatio: devicePixelRatio,
            cores: cores
        };
    }
    
    // Mobile-specific optimizations
    applyMobileOptimizations() {
        const deviceInfo = this.getDeviceInfo();
        
        if (!deviceInfo.isMobile) return;
        
        console.log('Applying mobile optimizations:', deviceInfo);
        
        // Reduce particle count for mobile
        this.optimizeParticles(deviceInfo);
        
        // Optimize animations
        this.optimizeAnimationsForMobile(deviceInfo);
        
        // Optimize Three.js settings
        this.optimizeThreeJSForMobile(deviceInfo);
        
        // Set up touch optimizations
        this.setupTouchOptimizations();
        
        // Optimize CSS for mobile
        this.optimizeCSSForMobile(deviceInfo);
    }
    
    optimizeParticles(deviceInfo) {
        const style = document.createElement('style');
        let particleCSS = '';
        
        if (deviceInfo.isLowEnd) {
            // Hide most particles on low-end devices
            particleCSS += `
                .data-particle:nth-child(n+2) { display: none !important; }
                .orbital-element:nth-child(n+2) { display: none !important; }
            `;
        } else if (deviceInfo.isMobile) {
            // Reduce particles on mobile
            particleCSS += `
                .data-particle:nth-child(n+4) { display: none !important; }
                .orbital-element { animation-duration: 30s !important; }
            `;
        }
        
        style.textContent = particleCSS;
        document.head.appendChild(style);
    }
    
    optimizeAnimationsForMobile(deviceInfo) {
        if (window.gsap) {
            // Reduce frame rate for mobile
            gsap.ticker.fps(deviceInfo.isLowEnd ? 20 : 30);
            
            // Simplify animations
            if (deviceInfo.isLowEnd) {
                const style = document.createElement('style');
                style.textContent = `
                    .neon-text { animation: none !important; }
                    .holographic-card { animation: none !important; }
                    .orbital-element { animation-duration: 40s !important; }
                `;
                document.head.appendChild(style);
            }
        }
    }
    
    optimizeThreeJSForMobile(deviceInfo) {
        if (!window.threeSceneManager) return;
        
        // Set mobile-specific renderer settings
        const settings = {
            pixelRatio: Math.min(deviceInfo.pixelRatio, deviceInfo.isLowEnd ? 1 : 2),
            antialias: !deviceInfo.isLowEnd,
            shadowMap: !deviceInfo.isLowEnd,
            particleCount: deviceInfo.isLowEnd ? 100 : 300,
            renderQuality: deviceInfo.isLowEnd ? 'low' : 'medium'
        };
        
        // Apply settings to Three.js scenes
        if (window.threeSceneManager.setMobileSettings) {
            window.threeSceneManager.setMobileSettings(settings);
        }
    }
    
    setupTouchOptimizations() {
        // Prevent zoom on double tap for interactive elements
        const touchElements = document.querySelectorAll('button, .holographic-card, .touch-button');
        
        touchElements.forEach(element => {
            element.addEventListener('touchend', (e) => {
                e.preventDefault();
                const touch = e.changedTouches[0];
                const elem = document.elementFromPoint(touch.clientX, touch.clientY);
                if (elem === element) {
                    element.click();
                }
            }, { passive: false });
        });
        
        // Add touch feedback
        document.addEventListener('touchstart', (e) => {
            e.target.classList.add('touch-active');
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            setTimeout(() => {
                e.target.classList.remove('touch-active');
            }, 150);
        }, { passive: true });
        
        // Add touch styles
        const touchStyle = document.createElement('style');
        touchStyle.textContent = `
            .touch-active {
                transform: scale(0.98) !important;
                opacity: 0.8 !important;
                transition: all 0.1s ease !important;
            }
        `;
        document.head.appendChild(touchStyle);
    }
    
    optimizeCSSForMobile(deviceInfo) {
        const mobileStyle = document.createElement('style');
        let css = `
            @media (max-width: 768px) {
                /* Optimize background effects */
                .quantum-bg {
                    background: radial-gradient(circle at center, #8338ec 0%, #000000 70%) !important;
                }
                
                /* Reduce blur effects */
                .holographic-card {
                    backdrop-filter: blur(${deviceInfo.isLowEnd ? '5px' : '10px'}) !important;
                }
                
                /* Optimize grid backgrounds */
                .cyberpunk-grid {
                    opacity: ${deviceInfo.isLowEnd ? '0.2' : '0.4'} !important;
                    background-size: ${deviceInfo.isLowEnd ? '40px 40px' : '30px 30px'} !important;
                }
            }
        `;
        
        if (deviceInfo.isLowEnd) {
            css += `
                @media (max-width: 768px) {
                    /* Disable expensive effects on low-end devices */
                    .neon-text {
                        text-shadow: 0 0 5px currentColor !important;
                    }
                    
                    .energy-field {
                        background: rgba(0, 255, 255, 0.1) !important;
                    }
                    
                    /* Reduce visual complexity */
                    .data-particle,
                    .floating-shape {
                        display: none !important;
                    }
                }
            `;
        }
        
        mobileStyle.textContent = css;
        document.head.appendChild(mobileStyle);
    }
    
    // Add mobile-specific performance monitoring
    startMobilePerformanceMonitoring() {
        if (!this.isMobileDevice()) return;
        
        const deviceInfo = this.getDeviceInfo();
        
        // Monitor battery level if available
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                this.monitorBattery(battery, deviceInfo);
            });
        }
        
        // Monitor memory pressure
        this.monitorMobileMemory(deviceInfo);
        
        // Monitor network conditions
        this.monitorNetworkConditions(deviceInfo);
    }
    
    monitorBattery(battery, deviceInfo) {
        const checkBattery = () => {
            const level = battery.level;
            const charging = battery.charging;
            
            // Reduce performance when battery is low
            if (level < 0.2 && !charging) {
                this.enableLowPowerMode();
            } else if (level > 0.3 || charging) {
                this.disableLowPowerMode();
            }
            
            this.performanceMetrics.battery = { level, charging };
        };
        
        battery.addEventListener('levelchange', checkBattery);
        battery.addEventListener('chargingchange', checkBattery);
        checkBattery();
    }
    
    enableLowPowerMode() {
        console.log('Enabling low power mode');
        
        // Further reduce frame rate
        if (window.gsap) {
            gsap.ticker.fps(15);
        }
        
        // Disable non-critical animations
        const style = document.createElement('style');
        style.id = 'low-power-mode';
        style.textContent = `
            .orbital-element,
            .data-particle,
            .neon-text {
                animation: none !important;
            }
            
            .holographic-card {
                backdrop-filter: blur(3px) !important;
            }
        `;
        
        const existing = document.getElementById('low-power-mode');
        if (existing) existing.remove();
        document.head.appendChild(style);
    }
    
    disableLowPowerMode() {
        console.log('Disabling low power mode');
        
        const lowPowerStyle = document.getElementById('low-power-mode');
        if (lowPowerStyle) {
            lowPowerStyle.remove();
        }
        
        // Restore normal frame rate
        if (window.gsap) {
            gsap.ticker.fps(30);
        }
    }
    
    monitorMobileMemory(deviceInfo) {
        setInterval(() => {
            if ('memory' in performance) {
                const memory = performance.memory;
                const usageRatio = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
                
                this.performanceMetrics.memoryPressure = usageRatio;
                
                // Aggressive cleanup when memory is high on mobile
                if (usageRatio > 0.7 && deviceInfo.isLowMemory) {
                    this.aggressiveCleanup();
                }
            }
        }, 10000);
    }
    
    aggressiveCleanup() {
        console.log('Performing aggressive mobile cleanup');
        
        // Force garbage collection if available
        if (window.gc) {
            window.gc();
        }
        
        // Clear unused audio buffers
        if (window.audioManager && window.audioManager.clearBuffers) {
            window.audioManager.clearBuffers();
        }
        
        // Reduce Three.js object count
        if (window.threeSceneManager && window.threeSceneManager.cleanup) {
            window.threeSceneManager.cleanup();
        }
    }
    
    monitorNetworkConditions(deviceInfo) {
        if (!navigator.connection) return;
        
        const connection = navigator.connection;
        
        const updateNetworkOptimizations = () => {
            const effectiveType = connection.effectiveType;
            this.performanceMetrics.networkType = effectiveType;
            
            if (effectiveType === 'slow-2g' || effectiveType === '2g') {
                this.enableSlowNetworkMode();
            } else if (effectiveType === '3g') {
                this.enableMediumNetworkMode();
            } else {
                this.disableNetworkOptimizations();
            }
        };
        
        connection.addEventListener('change', updateNetworkOptimizations);
        updateNetworkOptimizations();
    }
    
    enableSlowNetworkMode() {
        console.log('Enabling slow network optimizations');
        
        // Disable non-critical resource loading
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.loading = 'lazy';
        });
        
        // Reduce image quality if possible
        // This would typically involve server-side optimization
    }
    
    enableMediumNetworkMode() {
        console.log('Enabling medium network optimizations');
        // Implement medium network optimizations
    }
    
    disableNetworkOptimizations() {
        console.log('Network optimizations disabled - good connection');
        // Re-enable full quality assets
    }
    
    isSlowDevice() {
        return navigator.hardwareConcurrency < 4 || this.performanceMetrics.fps < 30;
    }
    
    // Public API
    enableOptimization() {
        this.isOptimizationEnabled = true;
    }
    
    disableOptimization() {
        this.isOptimizationEnabled = false;
    }
    
    getPerformanceMetrics() {
        return { ...this.performanceMetrics };
    }
    
    destroy() {
        // Clean up observers
        Object.values(this.observers).forEach(observer => {
            observer.disconnect();
        });
        
        console.log('Performance optimizer destroyed');
    }
}

// Export for module usage
export default PerformanceOptimizer;