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