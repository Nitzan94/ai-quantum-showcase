/**
 * Claude MCP Showcase - Main Animation Controller
 * Advanced GSAP ScrollTrigger animations with premium effects
 * Version: 2.1.0
 */

// Performance monitoring
const performanceMonitor = {
    frameCount: 0,
    lastTime: performance.now(),
    fps: 60,
    
    update() {
        this.frameCount++;
        const currentTime = performance.now();
        
        if (currentTime >= this.lastTime + 1000) {
            this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
            this.frameCount = 0;
            this.lastTime = currentTime;
            
            // Adaptive quality based on FPS
            if (this.fps < 30) {
                document.body.classList.add('reduced-motion');
            } else {
                document.body.classList.remove('reduced-motion');
            }
        }
    }
};

// Main Application Class
class ClaudeMCPShowcase {
    constructor() {
        this.isLoaded = false;
        this.animations = new Map();
        this.particles = [];
        this.audioContext = null;
        this.audioAnalyser = null;
        this.mouse = { x: 0, y: 0, isMoving: false };
        this.scrollPosition = 0;
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        // Bind methods
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.updateAnimations = this.updateAnimations.bind(this);
        
        this.init();
    }

    async init() {
        try {
            // Show loading screen
            this.showLoading();
            
            // Initialize GSAP plugins
            gsap.registerPlugin(ScrollTrigger);
            
            // Set up performance monitoring
            this.setupPerformanceMonitoring();
            
            // Initialize core systems
            await this.setupEventListeners();
            await this.initializeAudio();
            await this.preloadAssets();
            
            // Initialize animations
            this.initHeroAnimations();
            this.initSectionTransitions();
            this.initInteractiveElements();
            this.initParticleSystem();
            this.initScrollEffects();
            
            // Start animation loop
            this.startAnimationLoop();
            
            // Hide loading screen
            setTimeout(() => this.hideLoading(), 1500);
            
            this.isLoaded = true;
            
        } catch (error) {
            console.error('Failed to initialize Claude MCP Showcase:', error);
            this.handleError(error);
        }
    }

    // ================================
    // INITIALIZATION METHODS
    // ================================

    showLoading() {
        const loadingScreen = document.getElementById('loading-screen');
        const progressBar = loadingScreen.querySelector('.progress-fill-loading');
        const statusText = loadingScreen.querySelector('.loading-status');
        
        gsap.set(loadingScreen, { display: 'flex', opacity: 1 });
        
        // Animate loading progress
        const loadingSteps = [
            { text: 'Loading GSAP animations...', progress: 20 },
            { text: 'Initializing audio context...', progress: 40 },
            { text: 'Setting up particle systems...', progress: 60 },
            { text: 'Preparing scroll triggers...', progress: 80 },
            { text: 'Finalizing experience...', progress: 100 }
        ];
        
        let currentStep = 0;
        const stepInterval = setInterval(() => {
            if (currentStep < loadingSteps.length) {
                const step = loadingSteps[currentStep];
                statusText.textContent = step.text;
                gsap.to(progressBar, { width: `${step.progress}%`, duration: 0.5, ease: "power2.out" });
                currentStep++;
            } else {
                clearInterval(stepInterval);
            }
        }, 300);
    }

    hideLoading() {
        const loadingScreen = document.getElementById('loading-screen');
        
        gsap.to(loadingScreen, {
            opacity: 0,
            duration: 0.8,
            ease: "power2.inOut",
            onComplete: () => {
                gsap.set(loadingScreen, { display: 'none' });
                this.triggerLoadComplete();
            }
        });
    }

    triggerLoadComplete() {
        // Trigger entrance animations
        this.playHeroEntranceAnimation();
        
        // Enable scroll
        document.body.style.overflow = 'auto';
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('claudeShowcaseLoaded'));
    }

    setupEventListeners() {
        // Mouse tracking for interactive effects
        window.addEventListener('mousemove', this.handleMouseMove);
        window.addEventListener('resize', this.handleResize);
        
        // Touch events for mobile
        window.addEventListener('touchstart', this.handleTouchStart.bind(this));
        window.addEventListener('touchmove', this.handleTouchMove.bind(this));
        
        // Scroll events (throttled)
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.handleScroll();
            }, 16); // ~60fps
        });
        
        // Navigation events
        this.setupNavigation();
        
        // Demo controls
        this.setupDemoControls();
        
        // Reduced motion preference
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        mediaQuery.addListener((e) => {
            this.isReducedMotion = e.matches;
            this.updateAnimationsForMotionPreference();
        });
    }

    setupPerformanceMonitoring() {
        // Monitor FPS and adjust quality
        setInterval(() => {
            performanceMonitor.update();
        }, 1000);
        
        // Monitor memory usage
        if (performance.memory) {
            setInterval(() => {
                const memoryRatio = performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit;
                if (memoryRatio > 0.8) {
                    this.optimizePerformance();
                }
            }, 5000);
        }
    }

    async initializeAudio() {
        if (!window.AudioContext && !window.webkitAudioContext) {
            console.warn('Web Audio API not supported');
            return;
        }
        
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.audioAnalyser = this.audioContext.createAnalyser();
            this.audioAnalyser.fftSize = 256;
            this.audioAnalyser.connect(this.audioContext.destination);
        } catch (error) {
            console.warn('Failed to initialize audio context:', error);
        }
    }

    async preloadAssets() {
        const assets = [
            './assets/claude-logo.svg',
            './assets/claude-icon.svg',
            './assets/claude-avatar.svg',
            './assets/mcp-diagram.svg'
        ];
        
        const loadPromises = assets.map(src => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = resolve;
                img.onerror = reject;
                img.src = src;
            });
        });
        
        try {
            await Promise.all(loadPromises);
        } catch (error) {
            console.warn('Some assets failed to load:', error);
        }
    }

    // ================================
    // HERO SECTION ANIMATIONS
    // ================================

    initHeroAnimations() {
        this.initFloatingShapes();
        this.initTextRevealAnimations();
        this.initParallaxBackground();
        this.initScrollIndicator();
    }

    initFloatingShapes() {
        const heroContainer = document.querySelector('#hero-canvas-container');
        
        // Create floating geometric shapes
        for (let i = 0; i < 15; i++) {
            const shape = document.createElement('div');
            shape.className = 'floating-shape';
            shape.style.cssText = `
                position: absolute;
                width: ${Math.random() * 60 + 20}px;
                height: ${Math.random() * 60 + 20}px;
                background: linear-gradient(45deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1));
                border-radius: ${Math.random() > 0.5 ? '50%' : '10px'};
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                pointer-events: none;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.1);
            `;
            
            heroContainer.appendChild(shape);
            
            // Animate floating motion
            gsap.to(shape, {
                y: `${Math.random() * 100 - 50}px`,
                x: `${Math.random() * 100 - 50}px`,
                rotation: Math.random() * 360,
                duration: Math.random() * 10 + 5,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: Math.random() * 2
            });
            
            // Mouse interaction
            this.addMouseInteraction(shape);
        }
    }

    initTextRevealAnimations() {
        // Split text for character-by-character animation
        const heroTitle = document.querySelector('.hero-title');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        
        // Split title lines
        const titleLines = heroTitle.querySelectorAll('.hero-title-line');
        titleLines.forEach((line, index) => {
            const text = line.textContent;
            line.innerHTML = '';
            
            [...text].forEach((char, charIndex) => {
                const span = document.createElement('span');
                span.textContent = char === ' ' ? '\u00A0' : char;
                span.style.display = 'inline-block';
                line.appendChild(span);
                
                gsap.set(span, { y: 100, opacity: 0, rotationX: -90 });
            });
        });
        
        // Split subtitle
        this.splitTextForAnimation(heroSubtitle);
    }

    playHeroEntranceAnimation() {
        const tl = gsap.timeline();
        
        // Animate title characters
        const titleLines = document.querySelectorAll('.hero-title-line');
        titleLines.forEach((line, lineIndex) => {
            const chars = line.querySelectorAll('span');
            tl.to(chars, {
                y: 0,
                opacity: 1,
                rotationX: 0,
                duration: 0.8,
                stagger: 0.02,
                ease: "back.out(1.7)"
            }, lineIndex * 0.3);
        });
        
        // Animate subtitle
        tl.to('.hero-subtitle span', {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.01,
            ease: "power2.out"
        }, "-=0.4");
        
        // Animate CTA button
        tl.to('.hero-cta', {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "back.out(1.7)"
        }, "-=0.2");
        
        // Animate scroll indicator
        tl.to('.scroll-indicator', {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out"
        }, "-=0.3");
    }

    initParallaxBackground() {
        const heroBackground = document.querySelector('.hero-background');
        
        gsap.to(heroBackground, {
            yPercent: -50,
            ease: "none",
            scrollTrigger: {
                trigger: "#hero",
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    }

    initScrollIndicator() {
        const scrollIndicator = document.querySelector('.scroll-indicator');
        const scrollWheel = scrollIndicator?.querySelector('.scroll-wheel');
        
        if (scrollWheel) {
            // Continuous scroll animation
            gsap.to(scrollWheel, {
                y: 10,
                duration: 1.5,
                repeat: -1,
                yoyo: true,
                ease: "power2.inOut"
            });
            
            // Hide on scroll
            ScrollTrigger.create({
                trigger: "#hero",
                start: "top top",
                end: "bottom top",
                onUpdate: (self) => {
                    gsap.to(scrollIndicator, {
                        opacity: 1 - self.progress,
                        duration: 0.3
                    });
                }
            });
        }
    }

    // ================================
    // SECTION TRANSITIONS
    // ================================

    initSectionTransitions() {
        this.initSectionReveals();
        this.initBackgroundColorTransitions();
        this.initStaggeredAnimations();
    }

    initSectionReveals() {
        const sections = document.querySelectorAll('section');
        
        sections.forEach((section, index) => {
            // Section entrance animation
            gsap.set(section, { opacity: 0, y: 100 });
            
            ScrollTrigger.create({
                trigger: section,
                start: "top 80%",
                end: "bottom 20%",
                onEnter: () => {
                    gsap.to(section, {
                        opacity: 1,
                        y: 0,
                        duration: 1.2,
                        ease: "power2.out"
                    });
                },
                onLeave: () => {
                    if (!this.isReducedMotion) {
                        gsap.to(section, {
                            opacity: 0.7,
                            duration: 0.6
                        });
                    }
                },
                onEnterBack: () => {
                    gsap.to(section, {
                        opacity: 1,
                        duration: 0.6
                    });
                }
            });
            
            // Animate section content
            this.animateSectionContent(section);
        });
    }

    animateSectionContent(section) {
        const elementsToAnimate = section.querySelectorAll('[data-animation]');
        
        elementsToAnimate.forEach(element => {
            const animationType = element.dataset.animation;
            let animation;
            
            switch (animationType) {
                case 'slide-up':
                    animation = { y: 60, opacity: 0 };
                    break;
                case 'slide-in-left':
                    animation = { x: -100, opacity: 0 };
                    break;
                case 'slide-in-right':
                    animation = { x: 100, opacity: 0 };
                    break;
                case 'fade-in':
                    animation = { opacity: 0 };
                    break;
                case 'scale-in':
                    animation = { scale: 0.8, opacity: 0 };
                    break;
                default:
                    animation = { y: 30, opacity: 0 };
            }
            
            gsap.set(element, animation);
            
            ScrollTrigger.create({
                trigger: element,
                start: "top 85%",
                onEnter: () => {
                    gsap.to(element, {
                        ...Object.keys(animation).reduce((acc, key) => {
                            acc[key] = key === 'opacity' ? 1 : 0;
                            return acc;
                        }, {}),
                        scale: 1,
                        duration: 1,
                        ease: "power2.out",
                        delay: element.dataset.delay ? parseFloat(element.dataset.delay) : 0
                    });
                }
            });
        });
    }

    initBackgroundColorTransitions() {
        const colorMap = {
            'hero': '#0f0f23',
            'mcp-intro': '#1a1a2e',
            'claude-code': '#16213e',
            'claude-desktop': '#0f172a',
            'elevenlabs': '#1e1b4b',
            'demo': '#164e63',
            'cta': '#0f0f23'
        };
        
        Object.entries(colorMap).forEach(([sectionId, color]) => {
            ScrollTrigger.create({
                trigger: `#${sectionId}`,
                start: "top 50%",
                end: "bottom 50%",
                onEnter: () => {
                    gsap.to(document.body, {
                        backgroundColor: color,
                        duration: 1.5,
                        ease: "power2.inOut"
                    });
                }
            });
        });
    }

    initStaggeredAnimations() {
        // Animate card grids
        const cardGrids = document.querySelectorAll('.feature-grid, .feature-showcase');
        
        cardGrids.forEach(grid => {
            const cards = grid.querySelectorAll('.feature-card, .showcase-item, .feature-highlight');
            
            gsap.set(cards, { y: 80, opacity: 0, scale: 0.9 });
            
            ScrollTrigger.create({
                trigger: grid,
                start: "top 70%",
                onEnter: () => {
                    gsap.to(cards, {
                        y: 0,
                        opacity: 1,
                        scale: 1,
                        duration: 0.8,
                        stagger: 0.15,
                        ease: "back.out(1.7)"
                    });
                }
            });
        });
    }

    // ================================
    // INTERACTIVE ELEMENTS
    // ================================

    initInteractiveElements() {
        this.initHoverEffects();
        this.initMouseFollowEffects();
        this.initLoadingAnimations();
        this.initProgressIndicators();
    }

    initHoverEffects() {
        // Enhanced button hover effects
        const buttons = document.querySelectorAll('button, .nav-link, .footer-link');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                if (!this.isReducedMotion) {
                    gsap.to(button, {
                        scale: 1.05,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                    
                    // Add ripple effect
                    this.createRippleEffect(button);
                }
            });
            
            button.addEventListener('mouseleave', () => {
                gsap.to(button, {
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        });
        
        // Card hover effects
        const cards = document.querySelectorAll('.feature-card, .showcase-item');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                if (!this.isReducedMotion) {
                    gsap.to(card, {
                        y: -10,
                        rotationX: 5,
                        duration: 0.4,
                        ease: "power2.out"
                    });
                    
                    // Glow effect
                    gsap.to(card, {
                        boxShadow: '0 20px 40px rgba(99, 102, 241, 0.3)',
                        duration: 0.4,
                        ease: "power2.out"
                    });
                }
            });
            
            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    y: 0,
                    rotationX: 0,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                    duration: 0.4,
                    ease: "power2.out"
                });
            });
        });
    }

    initMouseFollowEffects() {
        // Create cursor follower
        const cursor = document.createElement('div');
        cursor.className = 'cursor-follower';
        cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, rgba(99, 102, 241, 0.6), transparent);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            mix-blend-mode: screen;
            transform: translate(-50%, -50%);
        `;
        document.body.appendChild(cursor);
        
        gsap.set(cursor, { scale: 0 });
        
        // Update cursor position
        let cursorX = 0, cursorY = 0;
        
        window.addEventListener('mousemove', (e) => {
            cursorX = e.clientX;
            cursorY = e.clientY;
        });
        
        // Smooth cursor following
        gsap.ticker.add(() => {
            gsap.to(cursor, {
                x: cursorX,
                y: cursorY,
                duration: 0.1,
                ease: "power2.out"
            });
        });
        
        // Show/hide cursor
        window.addEventListener('mouseenter', () => {
            gsap.to(cursor, { scale: 1, duration: 0.3 });
        });
        
        window.addEventListener('mouseleave', () => {
            gsap.to(cursor, { scale: 0, duration: 0.3 });
        });
    }

    createRippleEffect(element) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            pointer-events: none;
            left: 50%;
            top: 50%;
            width: 20px;
            height: 20px;
            margin-left: -10px;
            margin-top: -10px;
        `;
        
        element.style.position = 'relative';
        element.appendChild(ripple);
        
        gsap.to(ripple, {
            scale: 4,
            opacity: 0,
            duration: 0.6,
            ease: "power2.out",
            onComplete: () => ripple.remove()
        });
    }

    initLoadingAnimations() {
        // Simulate loading states for demo elements
        const loadingElements = document.querySelectorAll('[data-loading]');
        
        loadingElements.forEach(element => {
            const loadingSpinner = document.createElement('div');
            loadingSpinner.className = 'loading-spinner';
            loadingSpinner.style.cssText = `
                width: 20px;
                height: 20px;
                border: 2px solid rgba(99, 102, 241, 0.3);
                border-top: 2px solid #6366f1;
                border-radius: 50%;
                margin: 0 auto;
                display: none;
            `;
            
            element.appendChild(loadingSpinner);
            
            // Animate spinner
            gsap.to(loadingSpinner, {
                rotation: 360,
                duration: 1,
                repeat: -1,
                ease: "none"
            });
        });
    }

    initProgressIndicators() {
        // Reading progress bar
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #6366f1, #a855f7);
            z-index: 1000;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);
        
        // Update progress on scroll
        ScrollTrigger.create({
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            onUpdate: (self) => {
                gsap.to(progressBar, {
                    width: `${self.progress * 100}%`,
                    duration: 0.1
                });
            }
        });
    }

    // ================================
    // PARTICLE SYSTEM
    // ================================

    initParticleSystem() {
        this.createParticles();
        this.animateParticles();
    }

    createParticles() {
        const particleContainer = document.querySelector('.hero-particles');
        
        for (let i = 0; i < 50; i++) {
            const particle = {
                element: document.createElement('div'),
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: Math.random() * 4 + 1,
                opacity: Math.random() * 0.5 + 0.1
            };
            
            particle.element.style.cssText = `
                position: absolute;
                width: ${particle.size}px;
                height: ${particle.size}px;
                background: radial-gradient(circle, rgba(99, 102, 241, ${particle.opacity}), transparent);
                border-radius: 50%;
                pointer-events: none;
                left: ${particle.x}px;
                top: ${particle.y}px;
            `;
            
            particleContainer.appendChild(particle.element);
            this.particles.push(particle);
        }
    }

    animateParticles() {
        const updateParticles = () => {
            this.particles.forEach(particle => {
                // Update position
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                // Boundary checking
                if (particle.x < 0 || particle.x > window.innerWidth) {
                    particle.vx *= -1;
                }
                if (particle.y < 0 || particle.y > window.innerHeight) {
                    particle.vy *= -1;
                }
                
                // Mouse interaction
                const distance = Math.hypot(
                    this.mouse.x - particle.x,
                    this.mouse.y - particle.y
                );
                
                if (distance < 100) {
                    const force = (100 - distance) / 100;
                    const angle = Math.atan2(particle.y - this.mouse.y, particle.x - this.mouse.x);
                    particle.vx += Math.cos(angle) * force * 0.5;
                    particle.vy += Math.sin(angle) * force * 0.5;
                }
                
                // Apply position
                gsap.set(particle.element, {
                    x: particle.x,
                    y: particle.y
                });
                
                // Damping
                particle.vx *= 0.99;
                particle.vy *= 0.99;
            });
        };
        
        gsap.ticker.add(updateParticles);
    }

    // ================================
    // AUDIO INTEGRATION
    // ================================

    initAudioIntegration() {
        this.setupAudioVisualization();
        this.syncAnimationsWithAudio();
    }

    setupAudioVisualization() {
        const visualizers = document.querySelectorAll('#audio-visualizer, #demo-visualizer');
        
        visualizers.forEach(canvas => {
            const ctx = canvas.getContext('2d');
            const width = canvas.width;
            const height = canvas.height;
            
            const drawVisualization = () => {
                if (!this.audioAnalyser) return;
                
                const bufferLength = this.audioAnalyser.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);
                this.audioAnalyser.getByteFrequencyData(dataArray);
                
                ctx.clearRect(0, 0, width, height);
                
                const barWidth = width / bufferLength * 2.5;
                let x = 0;
                
                for (let i = 0; i < bufferLength; i++) {
                    const barHeight = (dataArray[i] / 255) * height * 0.8;
                    
                    const gradient = ctx.createLinearGradient(0, height - barHeight, 0, height);
                    gradient.addColorStop(0, '#6366f1');
                    gradient.addColorStop(1, '#a855f7');
                    
                    ctx.fillStyle = gradient;
                    ctx.fillRect(x, height - barHeight, barWidth, barHeight);
                    
                    x += barWidth + 1;
                }
                
                requestAnimationFrame(drawVisualization);
            };
            
            drawVisualization();
        });
    }

    syncAnimationsWithAudio() {
        // Sync scroll animations with audio timeline
        ScrollTrigger.create({
            trigger: "#elevenlabs",
            start: "top center",
            end: "bottom center",
            onUpdate: (self) => {
                // Simulate audio progress based on scroll
                this.updateAudioVisualization(self.progress);
            }
        });
    }

    updateAudioVisualization(progress) {
        // Update waveform visualization based on scroll progress
        const waveformBars = document.querySelectorAll('.wave-bar');
        
        waveformBars.forEach((bar, index) => {
            const delay = index * 0.1;
            const height = Math.sin((progress * Math.PI * 4) + delay) * 50 + 50;
            
            gsap.to(bar, {
                height: `${height}%`,
                duration: 0.1,
                ease: "power2.out"
            });
        });
    }

    // ================================
    // EVENT HANDLERS
    // ================================

    handleMouseMove(e) {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
        this.mouse.isMoving = true;
        
        clearTimeout(this.mouseTimeout);
        this.mouseTimeout = setTimeout(() => {
            this.mouse.isMoving = false;
        }, 100);
        
        // Update floating shapes based on mouse position
        this.updateFloatingShapes();
    }

    handleTouchStart(e) {
        if (e.touches.length > 0) {
            this.mouse.x = e.touches[0].clientX;
            this.mouse.y = e.touches[0].clientY;
        }
    }

    handleTouchMove(e) {
        if (e.touches.length > 0) {
            this.mouse.x = e.touches[0].clientX;
            this.mouse.y = e.touches[0].clientY;
            this.updateFloatingShapes();
        }
    }

    handleResize() {
        // Debounce resize events
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            this.updateLayoutForResize();
        }, 250);
    }

    handleScroll() {
        this.scrollPosition = window.scrollY;
        this.updateScrollEffects();
    }

    updateFloatingShapes() {
        const shapes = document.querySelectorAll('.floating-shape');
        
        shapes.forEach((shape, index) => {
            const rect = shape.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const distance = Math.hypot(this.mouse.x - centerX, this.mouse.y - centerY);
            const maxDistance = 200;
            
            if (distance < maxDistance) {
                const force = (maxDistance - distance) / maxDistance;
                const angle = Math.atan2(centerY - this.mouse.y, centerX - this.mouse.x);
                
                gsap.to(shape, {
                    x: Math.cos(angle) * force * 30,
                    y: Math.sin(angle) * force * 30,
                    scale: 1 + force * 0.2,
                    duration: 0.3,
                    ease: "power2.out"
                });
            } else {
                gsap.to(shape, {
                    x: 0,
                    y: 0,
                    scale: 1,
                    duration: 0.5,
                    ease: "power2.out"
                });
            }
        });
    }

    updateScrollEffects() {
        // Update parallax effects
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.parallax || 0.5;
            const yPos = -(this.scrollPosition * speed);
            
            gsap.set(element, {
                transform: `translateY(${yPos}px)`
            });
        });
    }

    updateLayoutForResize() {
        // Refresh ScrollTrigger on resize
        ScrollTrigger.refresh();
        
        // Update particle system bounds
        this.particles.forEach(particle => {
            particle.x = Math.min(particle.x, window.innerWidth);
            particle.y = Math.min(particle.y, window.innerHeight);
        });
    }

    // ================================
    // NAVIGATION & DEMO CONTROLS
    // ================================

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const hamburger = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        // Smooth scroll navigation
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    gsap.to(window, {
                        duration: 1.5,
                        scrollTo: { y: targetElement, offsetY: 100 },
                        ease: "power2.inOut"
                    });
                }
            });
        });
        
        // Mobile menu toggle
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                const isOpen = navMenu.classList.contains('nav-open');
                
                if (isOpen) {
                    gsap.to(navMenu, {
                        opacity: 0,
                        y: -20,
                        duration: 0.3,
                        ease: "power2.inOut",
                        onComplete: () => {
                            navMenu.classList.remove('nav-open');
                            navMenu.style.display = 'none';
                        }
                    });
                } else {
                    navMenu.style.display = 'flex';
                    navMenu.classList.add('nav-open');
                    gsap.fromTo(navMenu, 
                        { opacity: 0, y: -20 },
                        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
                    );
                }
                
                hamburger.setAttribute('aria-expanded', !isOpen);
            });
        }
    }

    setupDemoControls() {
        // Example button interactions
        const exampleButtons = document.querySelectorAll('.example-btn');
        const textInput = document.getElementById('demo-text-input');
        
        exampleButtons.forEach(button => {
            button.addEventListener('click', () => {
                const exampleText = button.dataset.example;
                if (textInput && exampleText) {
                    this.animateTextInput(textInput, exampleText);
                }
            });
        });
        
        // Character counter
        if (textInput) {
            const charCount = document.getElementById('char-count');
            textInput.addEventListener('input', () => {
                if (charCount) {
                    charCount.textContent = textInput.value.length;
                }
            });
        }
        
        // Generate speech button
        const generateBtn = document.getElementById('generate-speech-btn');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => {
                this.simulateSpeechGeneration();
            });
        }
    }

    animateTextInput(input, text) {
        // Clear existing text
        input.value = '';
        
        // Animate typing
        let currentIndex = 0;
        const typeInterval = setInterval(() => {
            if (currentIndex < text.length) {
                input.value += text[currentIndex];
                currentIndex++;
                
                // Update character count
                const charCount = document.getElementById('char-count');
                if (charCount) {
                    charCount.textContent = input.value.length;
                }
            } else {
                clearInterval(typeInterval);
            }
        }, 50);
    }

    simulateSpeechGeneration() {
        const statusText = document.querySelector('.status-text');
        const steps = document.querySelectorAll('.step-item');
        const generateBtn = document.getElementById('generate-speech-btn');
        
        // Disable button and show loading
        generateBtn.disabled = true;
        statusText.textContent = 'Processing...';
        
        // Animate processing steps
        steps.forEach((step, index) => {
            setTimeout(() => {
                step.classList.add('active');
                
                if (index === steps.length - 1) {
                    // Enable play button when done
                    setTimeout(() => {
                        const playBtn = document.getElementById('demo-play-button');
                        if (playBtn) {
                            playBtn.disabled = false;
                            statusText.textContent = 'Ready to play';
                        }
                        generateBtn.disabled = false;
                    }, 500);
                }
            }, index * 1000);
        });
        
        // Reset steps after animation
        setTimeout(() => {
            steps.forEach(step => step.classList.remove('active'));
        }, 5000);
    }

    // ================================
    // PERFORMANCE OPTIMIZATION
    // ================================

    optimizePerformance() {
        console.log('Optimizing performance...');
        
        // Reduce particle count
        if (this.particles.length > 25) {
            const excess = this.particles.splice(25);
            excess.forEach(particle => {
                particle.element.remove();
            });
        }
        
        // Simplify animations for low-end devices
        if (performanceMonitor.fps < 30) {
            document.body.classList.add('performance-mode');
            gsap.globalTimeline.timeScale(0.7);
        }
    }

    updateAnimationsForMotionPreference() {
        if (this.isReducedMotion) {
            // Disable complex animations
            gsap.globalTimeline.timeScale(0.1);
            document.body.classList.add('reduced-motion');
        } else {
            gsap.globalTimeline.timeScale(1);
            document.body.classList.remove('reduced-motion');
        }
    }

    startAnimationLoop() {
        const animate = () => {
            performanceMonitor.update();
            
            // Update systems
            if (this.mouse.isMoving) {
                this.updateFloatingShapes();
            }
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }

    // ================================
    // UTILITY METHODS
    // ================================

    splitTextForAnimation(element) {
        const text = element.textContent;
        element.innerHTML = '';
        
        [...text].forEach(char => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.display = 'inline-block';
            element.appendChild(span);
            
            gsap.set(span, { y: 30, opacity: 0 });
        });
    }

    addMouseInteraction(element) {
        element.addEventListener('mouseenter', () => {
            if (!this.isReducedMotion) {
                gsap.to(element, {
                    scale: 1.1,
                    rotation: 5,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        });
        
        element.addEventListener('mouseleave', () => {
            gsap.to(element, {
                scale: 1,
                rotation: 0,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    }

    handleError(error) {
        console.error('Claude MCP Showcase Error:', error);
        
        // Show fallback content
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            const statusText = loadingScreen.querySelector('.loading-status');
            if (statusText) {
                statusText.textContent = 'Error loading experience. Please refresh the page.';
                statusText.style.color = '#ef4444';
            }
        }
    }

    // ================================
    // SCROLL EFFECTS
    // ================================

    initScrollEffects() {
        // Code typing animation
        this.initCodeTypingAnimation();
        
        // Counter animations
        this.initCounterAnimations();
        
        // Morphing shapes
        this.initMorphingShapes();
    }

    initCodeTypingAnimation() {
        const codeBlock = document.getElementById('code-animation-target');
        if (!codeBlock) return;
        
        const codeText = codeBlock.textContent;
        codeBlock.textContent = '';
        
        ScrollTrigger.create({
            trigger: codeBlock,
            start: "top 70%",
            onEnter: () => {
                this.typeCodeAnimation(codeBlock, codeText);
            }
        });
    }

    typeCodeAnimation(element, text) {
        let currentIndex = 0;
        const lines = text.split('\n');
        let currentLine = 0;
        
        const typeInterval = setInterval(() => {
            if (currentLine < lines.length) {
                const line = lines[currentLine];
                
                if (currentIndex < line.length) {
                    element.textContent += line[currentIndex];
                    currentIndex++;
                } else {
                    element.textContent += '\n';
                    currentLine++;
                    currentIndex = 0;
                }
            } else {
                clearInterval(typeInterval);
                
                // Add cursor blink effect
                const cursor = document.querySelector('.code-cursor');
                if (cursor) {
                    gsap.to(cursor, {
                        opacity: 0,
                        duration: 0.5,
                        repeat: -1,
                        yoyo: true
                    });
                }
            }
        }, 30);
    }

    initCounterAnimations() {
        const counters = document.querySelectorAll('[data-count]');
        
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.count);
            const suffix = counter.textContent.replace(/[\d,]/g, '');
            
            gsap.set(counter, { textContent: '0' + suffix });
            
            ScrollTrigger.create({
                trigger: counter,
                start: "top 80%",
                onEnter: () => {
                    gsap.to({ value: 0 }, {
                        value: target,
                        duration: 2,
                        ease: "power2.out",
                        onUpdate: function() {
                            const currentValue = Math.round(this.targets()[0].value);
                            counter.textContent = currentValue.toLocaleString() + suffix;
                        }
                    });
                }
            });
        });
    }

    initMorphingShapes() {
        // Create morphing background shapes
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const morphShape = document.createElement('div');
            morphShape.className = 'morph-shape';
            morphShape.style.cssText = `
                position: absolute;
                top: 20%;
                right: 10%;
                width: 200px;
                height: 200px;
                background: linear-gradient(45deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1));
                border-radius: 50%;
                pointer-events: none;
                z-index: -1;
            `;
            
            section.style.position = 'relative';
            section.appendChild(morphShape);
            
            // Animate morphing
            gsap.to(morphShape, {
                borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
                duration: 8,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
            
            // Parallax effect
            gsap.to(morphShape, {
                y: -100,
                scrollTrigger: {
                    trigger: section,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        });
    }
}

// ================================
// INITIALIZATION
// ================================

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ClaudeMCPShowcase();
    });
} else {
    new ClaudeMCPShowcase();
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ClaudeMCPShowcase;
}