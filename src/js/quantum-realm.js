/**
 * Quantum Realm Laboratory - Interactive Quantum Physics Simulator
 * Experience quantum mechanics through visualization and interaction
 */

class QuantumRealm {
    constructor() {
        this.isActive = false;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = [];
        this.waves = [];
        this.fields = [];
        
        this.quantumSignature = null;
        this.interactionCount = 0;
        
        // Quantum physics parameters
        this.quantumState = {
            entanglement: 0,
            coherence: 1.0,
            superposition: 0.5,
            waveCollapse: false
        };
        
        // Animation parameters
        this.time = 0;
        this.animationId = null;
        
        this.init();
    }
    
    init() {
        this.modal = document.getElementById('quantum-modal');
        this.playground = document.getElementById('quantum-playground');
        this.signature = document.getElementById('quantum-signature');
        this.closeBtn = document.getElementById('quantum-close');
        
        this.setupEventListeners();
        this.generateSignature();
    }
    
    setupEventListeners() {
        // Close button
        this.closeBtn.addEventListener('click', () => {
            this.closeRealm();
        });
        
        // Modal backdrop click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeRealm();
            }
        });
        
        // Control buttons
        document.querySelectorAll('.quantum-control').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.getAttribute('data-action');
                this.handleAction(action, e.currentTarget);
            });
        });
        
        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isActive) {
                this.closeRealm();
            }
        });
    }
    
    /**
     * Open the Quantum Realm laboratory
     */
    async openRealm() {
        if (this.isActive) return;
        
        this.isActive = true;
        this.modal.classList.add('active');
        
        // Initialize Three.js scene
        await this.setupThreeJS();
        this.startQuantumSimulation();
        
        // Play quantum entrance sound
        this.playQuantumSound('entrance');
        
        console.log('🌀 Quantum Realm activated');
    }
    
    /**
     * Close the Quantum Realm
     */
    closeRealm() {
        if (!this.isActive) return;
        
        this.isActive = false;
        this.modal.classList.remove('active');
        
        // Stop animation
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        // Clean up Three.js
        this.cleanup();
        
        console.log('🌀 Quantum Realm deactivated');
    }
    
    /**
     * Setup Three.js scene for quantum visualization
     */
    async setupThreeJS() {
        if (!window.THREE) {
            console.error('Three.js not available');
            return;
        }
        
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);
        
        // Camera setup
        const aspect = this.playground.clientWidth / this.playground.clientHeight;
        this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        this.camera.position.z = 50;
        
        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true 
        });
        this.renderer.setSize(this.playground.clientWidth, this.playground.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Clear playground and add renderer
        this.playground.innerHTML = '';
        this.playground.appendChild(this.renderer.domElement);
        
        // Re-add signature overlay
        const signature = document.createElement('div');
        signature.id = 'quantum-signature';
        signature.className = 'quantum-signature';
        signature.textContent = `QS: ${this.quantumSignature}`;
        this.playground.appendChild(signature);
        this.signature = signature;
        
        // Add quantum ambient lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
        this.scene.add(ambientLight);
        
        const pointLight = new THREE.PointLight(0x8a2be2, 1, 100);
        pointLight.position.set(0, 0, 30);
        this.scene.add(pointLight);
        
        console.log('🌀 Quantum Three.js scene initialized');
    }
    
    /**
     * Start the quantum physics simulation
     */
    startQuantumSimulation() {
        // Create initial quantum field
        this.createQuantumField();
        
        // Start animation loop
        this.animate();
    }
    
    /**
     * Main animation loop
     */
    animate() {
        if (!this.isActive) return;
        
        this.animationId = requestAnimationFrame(() => this.animate());
        
        this.time += 0.016; // ~60fps
        
        // Update quantum state
        this.updateQuantumState();
        
        // Update all quantum objects
        this.updateParticles();
        this.updateWaves();
        this.updateFields();
        
        // Render scene
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
        
        // Update signature
        this.updateSignature();
    }
    
    /**
     * Update quantum state parameters
     */
    updateQuantumState() {
        // Simulate quantum coherence decay
        this.quantumState.coherence = 0.8 + 0.2 * Math.sin(this.time * 0.5);
        
        // Superposition oscillation
        this.quantumState.superposition = 0.5 + 0.3 * Math.cos(this.time * 0.3);
        
        // Entanglement based on interactions
        this.quantumState.entanglement = Math.min(1.0, this.interactionCount * 0.1);
    }
    
    /**
     * Handle control button actions
     */
    handleAction(action, button) {
        // Visual feedback
        button.classList.add('active');
        setTimeout(() => button.classList.remove('active'), 200);
        
        switch (action) {
            case 'particles':
                this.spawnParticles();
                break;
            case 'waves':
                this.createQuantumWaves();
                break;
            case 'field':
                this.generateField();
                break;
            case 'reset':
                this.resetField();
                break;
            case 'save':
                this.saveSignature();
                break;
            case 'share':
                this.sharePortal();
                break;
        }
        
        this.interactionCount++;
        this.playQuantumSound('interaction');
    }
    
    /**
     * Spawn quantum particles
     */
    spawnParticles() {
        const particleCount = 50;
        const geometry = new THREE.SphereGeometry(0.1, 8, 8);
        
        for (let i = 0; i < particleCount; i++) {
            // Random quantum colors
            const colors = [0x8a2be2, 0xff1493, 0x00ffff, 0xff4500];
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            const material = new THREE.MeshBasicMaterial({ 
                color: color,
                transparent: true,
                opacity: 0.8
            });
            
            const particle = new THREE.Mesh(geometry, material);
            
            // Random position in quantum space
            particle.position.set(
                (Math.random() - 0.5) * 40,
                (Math.random() - 0.5) * 30,
                (Math.random() - 0.5) * 20
            );
            
            // Quantum properties
            particle.userData = {
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.2,
                    (Math.random() - 0.5) * 0.2,
                    (Math.random() - 0.5) * 0.1
                ),
                phase: Math.random() * Math.PI * 2,
                spin: (Math.random() - 0.5) * 0.1,
                entangled: Math.random() < 0.3
            };
            
            this.scene.add(particle);
            this.particles.push(particle);
        }
        
        console.log(`🔵 Spawned ${particleCount} quantum particles`);
    }
    
    /**
     * Create quantum wave interference patterns
     */
    createQuantumWaves() {
        const waveCount = 5;
        
        for (let i = 0; i < waveCount; i++) {
            const geometry = new THREE.RingGeometry(1, 1.2, 16);
            const material = new THREE.MeshBasicMaterial({
                color: 0x8a2be2,
                transparent: true,
                opacity: 0.3,
                side: THREE.DoubleSide
            });
            
            const wave = new THREE.Mesh(geometry, material);
            wave.position.set(
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 15,
                (Math.random() - 0.5) * 10
            );
            
            wave.userData = {
                initialScale: 1,
                maxScale: 10 + Math.random() * 10,
                speed: 0.05 + Math.random() * 0.05,
                phase: Math.random() * Math.PI * 2
            };
            
            this.scene.add(wave);
            this.waves.push(wave);
        }
        
        console.log(`🌀 Generated ${waveCount} quantum wave patterns`);
    }
    
    /**
     * Generate additional quantum field layers (adds to existing field)
     */
    generateField() {
        // Add multiple layers of quantum fields with different properties
        const layerCount = 3;
        
        for (let i = 0; i < layerCount; i++) {
            const geometry = new THREE.PlaneGeometry(25 + i * 5, 15 + i * 3, 24 + i * 8, 24 + i * 8);
            const material = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    coherence: { value: this.quantumState.coherence },
                    layer: { value: i }
                },
                vertexShader: `
                    uniform float time;
                    uniform float coherence;
                    uniform float layer;
                    varying vec3 vPosition;
                    
                    void main() {
                        vPosition = position;
                        vec3 pos = position;
                        
                        // Multi-layer quantum interference
                        float layerFreq = 0.05 + layer * 0.03;
                        pos.z += sin(pos.x * layerFreq + time + layer) * coherence * (2.0 + layer);
                        pos.z += cos(pos.y * layerFreq + time * 0.7 + layer * 0.5) * coherence * (1.5 + layer * 0.5);
                        
                        // Add quantum uncertainty
                        pos.z += sin(length(pos.xy) * 0.1 + time * 2.0) * coherence * 0.5;
                        
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform float time;
                    uniform float layer;
                    varying vec3 vPosition;
                    
                    void main() {
                        float intensity = sin(vPosition.x * (0.1 + layer * 0.05) + time) * cos(vPosition.y * (0.1 + layer * 0.03) + time);
                        
                        // Different color per layer
                        vec3 baseColor;
                        if (layer < 1.0) {
                            baseColor = vec3(0.54, 0.17, 0.89); // Purple
                        } else if (layer < 2.0) {
                            baseColor = vec3(0.17, 0.89, 0.54); // Green
                        } else {
                            baseColor = vec3(0.89, 0.54, 0.17); // Orange
                        }
                        
                        vec3 color = baseColor + intensity * 0.4;
                        float alpha = 0.15 + abs(intensity) * 0.15;
                        gl_FragColor = vec4(color, alpha);
                    }
                `,
                transparent: true,
                side: THREE.DoubleSide,
                blending: THREE.AdditiveBlending
            });
            
            const field = new THREE.Mesh(geometry, material);
            field.rotation.x = -Math.PI / 2;
            field.position.y = -8 - i * 2;
            field.position.z = i * 1;
            
            field.userData = { type: 'field', layer: i };
            
            this.scene.add(field);
            this.fields.push(field);
        }
        
        console.log(`⚡ Generated ${layerCount} additional quantum field layers`);
    }
    
    /**
     * Create initial quantum field (basic foundation)
     */
    createQuantumField() {
        // Create a simple base field
        const geometry = new THREE.PlaneGeometry(20, 15, 16, 16);
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                coherence: { value: this.quantumState.coherence }
            },
            vertexShader: `
                uniform float time;
                uniform float coherence;
                varying vec3 vPosition;
                
                void main() {
                    vPosition = position;
                    vec3 pos = position;
                    
                    // Basic quantum field oscillation
                    pos.z += sin(pos.x * 0.08 + time * 0.5) * coherence * 1.0;
                    pos.z += cos(pos.y * 0.08 + time * 0.3) * coherence * 0.8;
                    
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                varying vec3 vPosition;
                
                void main() {
                    float intensity = sin(vPosition.x * 0.08 + time * 0.5) * cos(vPosition.y * 0.08 + time * 0.3);
                    vec3 color = vec3(0.3, 0.1, 0.6) + intensity * 0.2; // Darker purple base
                    gl_FragColor = vec4(color, 0.25 + intensity * 0.15);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });
        
        const field = new THREE.Mesh(geometry, material);
        field.rotation.x = -Math.PI / 2;
        field.position.y = -12;
        
        field.userData = { type: 'baseField' };
        
        this.scene.add(field);
        this.fields.push(field);
        
        console.log('⚛️ Basic quantum field foundation created');
        
        // Add some initial particles after field is ready
        setTimeout(() => this.spawnParticles(), 500);
    }
    
    /**
     * Update particle physics
     */
    updateParticles() {
        this.particles.forEach((particle, index) => {
            if (!particle.userData) return;
            
            const data = particle.userData;
            
            // Update position with quantum uncertainty
            particle.position.add(data.velocity);
            
            // Quantum oscillation
            particle.position.y += Math.sin(this.time + data.phase) * 0.05;
            particle.position.x += Math.cos(this.time * 0.7 + data.phase) * 0.03;
            
            // Spin
            particle.rotation.y += data.spin;
            
            // Boundary conditions (quantum tunneling)
            if (particle.position.length() > 50) {
                particle.position.multiplyScalar(0.1); // Tunnel to center
            }
            
            // Entanglement effects
            if (data.entangled && this.particles.length > 1) {
                const entangledIndex = (index + 1) % this.particles.length;
                const entangledParticle = this.particles[entangledIndex];
                
                if (entangledParticle) {
                    // Quantum correlation
                    const distance = particle.position.distanceTo(entangledParticle.position);
                    if (distance > 20) {
                        const direction = entangledParticle.position.clone().sub(particle.position).normalize();
                        particle.position.add(direction.multiplyScalar(0.1));
                    }
                }
            }
            
            // Update material opacity based on quantum state
            particle.material.opacity = 0.5 + 0.3 * this.quantumState.coherence;
        });
    }
    
    /**
     * Update wave animations
     */
    updateWaves() {
        this.waves.forEach((wave, index) => {
            const data = wave.userData;
            
            // Expand waves
            const currentScale = wave.scale.x;
            const newScale = currentScale + data.speed;
            
            if (newScale > data.maxScale) {
                // Reset wave
                wave.scale.setScalar(data.initialScale);
                wave.material.opacity = 0.3;
            } else {
                wave.scale.setScalar(newScale);
                wave.material.opacity = 0.3 * (1 - newScale / data.maxScale);
            }
            
            // Quantum interference
            wave.rotation.z += 0.01;
        });
    }
    
    /**
     * Update field effects
     */
    updateFields() {
        this.fields.forEach(field => {
            if (field.material.uniforms) {
                field.material.uniforms.time.value = this.time;
                field.material.uniforms.coherence.value = this.quantumState.coherence;
                
                // Update layer-specific uniforms if they exist
                if (field.material.uniforms.layer !== undefined) {
                    // Add subtle rotation to multi-layer fields
                    field.rotation.z += 0.001 * (field.userData.layer + 1);
                }
            }
        });
    }
    
    /**
     * Reset quantum field
     */
    resetField() {
        // Remove all quantum objects
        [...this.particles, ...this.waves, ...this.fields].forEach(obj => {
            this.scene.remove(obj);
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) obj.material.dispose();
        });
        
        this.particles = [];
        this.waves = [];
        this.fields = [];
        this.interactionCount = 0;
        
        // Reset quantum state
        this.quantumState = {
            entanglement: 0,
            coherence: 1.0,
            superposition: 0.5,
            waveCollapse: false
        };
        
        // Recreate basic field
        setTimeout(() => this.createQuantumField(), 100);
        
        console.log('🔄 Quantum field reset');
    }
    
    /**
     * Generate unique quantum signature
     */
    generateSignature() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 0xFFFF).toString(16).toUpperCase();
        const quantum = ['α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ'][Math.floor(Math.random() * 8)];
        
        this.quantumSignature = `${quantum}-${random}-${timestamp.toString(36).toUpperCase()}`;
    }
    
    /**
     * Update quantum signature display
     */
    updateSignature() {
        if (this.signature) {
            const entanglement = Math.floor(this.quantumState.entanglement * 100);
            const coherence = Math.floor(this.quantumState.coherence * 100);
            
            this.signature.textContent = 
                `QS: ${this.quantumSignature} | E:${entanglement}% | C:${coherence}% | I:${this.interactionCount}`;
        }
    }
    
    /**
     * Save quantum signature to localStorage
     */
    saveSignature() {
        const savedSignatures = JSON.parse(localStorage.getItem('quantumSignatures') || '[]');
        
        const signatureData = {
            id: this.quantumSignature,
            timestamp: new Date().toISOString(),
            state: { ...this.quantumState },
            interactions: this.interactionCount,
            particles: this.particles.length,
            waves: this.waves.length,
            fields: this.fields.length
        };
        
        savedSignatures.push(signatureData);
        
        // Keep only last 10 signatures
        if (savedSignatures.length > 10) {
            savedSignatures.shift();
        }
        
        localStorage.setItem('quantumSignatures', JSON.stringify(savedSignatures));
        
        console.log('💾 Quantum signature saved:', this.quantumSignature);
        this.showNotification('Quantum signature saved to local storage!');
    }
    
    /**
     * Share quantum portal via URL
     */
    sharePortal() {
        const url = new URL(window.location.href);
        url.searchParams.set('quantum', this.quantumSignature);
        url.searchParams.set('state', btoa(JSON.stringify(this.quantumState)));
        
        navigator.clipboard.writeText(url.toString()).then(() => {
            console.log('🔗 Quantum portal URL copied to clipboard');
            this.showNotification('Portal URL copied to clipboard! Share with others to replicate this quantum state.');
        }).catch(() => {
            console.log('🔗 Quantum portal URL:', url.toString());
            this.showNotification('Portal URL: ' + url.toString());
        });
    }
    
    /**
     * Show notification message
     */
    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(138, 43, 226, 0.9);
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 10001;
            font-family: 'JetBrains Mono', monospace;
            font-size: 12px;
            border: 1px solid #8a2be2;
            box-shadow: 0 4px 20px rgba(138, 43, 226, 0.3);
            max-width: 300px;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            notification.style.transition = 'all 0.3s ease';
            
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    /**
     * Play quantum sound effects
     */
    playQuantumSound(type) {
        if (!window.matrixSounds) return;
        
        switch (type) {
            case 'entrance':
                // Play sweeping quantum sound
                this.createQuantumTone(440, 880, 1.5);
                break;
            case 'interaction':
                // Play brief quantum blip
                this.createQuantumTone(800, 1200, 0.2);
                break;
        }
    }
    
    /**
     * Create quantum-themed audio tones
     */
    createQuantumTone(startFreq, endFreq, duration) {
        if (!window.AudioContext && !window.webkitAudioContext) return;
        
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(startFreq, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(endFreq, audioContext.currentTime + duration);
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + duration);
        } catch (error) {
            console.warn('Quantum audio unavailable:', error);
        }
    }
    
    /**
     * Handle window resize
     */
    handleResize() {
        if (!this.isActive || !this.renderer || !this.camera) return;
        
        const width = this.playground.clientWidth;
        const height = this.playground.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(width, height);
    }
    
    /**
     * Clean up resources
     */
    cleanup() {
        // Remove all objects and dispose geometries/materials
        [...this.particles, ...this.waves, ...this.fields].forEach(obj => {
            if (this.scene) this.scene.remove(obj);
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) {
                if (obj.material.map) obj.material.map.dispose();
                obj.material.dispose();
            }
        });
        
        this.particles = [];
        this.waves = [];
        this.fields = [];
        
        if (this.renderer) {
            this.renderer.dispose();
            this.renderer = null;
        }
        
        this.scene = null;
        this.camera = null;
    }
}

// Export for global use
export default QuantumRealm;