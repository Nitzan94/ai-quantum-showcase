/**
 * Advanced Three.js Scene Manager for Claude MCP Showcase
 * Creates immersive 3D neural network and quantum visualization
 */

class ThreeSceneManager {
    constructor() {
        this.scenes = {};
        this.renderers = {};
        this.cameras = {};
        this.animationFrames = {};
        this.isInitialized = false;
        
        this.init();
    }
    
    init() {
        try {
            this.createNeuralNetworkScene();
            this.createQuantumFieldScene();
            this.createAudioVisualizerScene();
            this.createNeuralUnderstandingScene(); // New scene for cognitive architecture
            this.setupEventListeners();
            this.startAnimation();
            
            this.isInitialized = true;
            console.log('Three.js scenes initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Three.js scenes:', error);
        }
    }
    
    createNeuralNetworkScene() {
        const container = document.getElementById('neural-network-container');
        if (!container) return;
        
        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        
        renderer.setSize(container.offsetWidth, container.offsetHeight);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);
        
        // Neural network geometry
        const neuralNetwork = this.createNeuralNetwork();
        scene.add(neuralNetwork);
        
        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        const pointLight = new THREE.PointLight(0x00ffff, 1, 100);
        pointLight.position.set(0, 0, 10);
        scene.add(ambientLight);
        scene.add(pointLight);
        
        camera.position.z = 15;
        
        this.scenes.neuralNetwork = scene;
        this.cameras.neuralNetwork = camera;
        this.renderers.neuralNetwork = renderer;
    }
    
    createNeuralNetwork() {
        const group = new THREE.Group();
        
        // Create nodes
        const nodeGeometry = new THREE.SphereGeometry(0.2, 16, 16);
        const nodes = [];
        
        // Layer configurations
        const layers = [
            { count: 6, x: -8, color: 0x00ffff },
            { count: 8, x: -4, color: 0x8b5cf6 },
            { count: 8, x: 0, color: 0xff00ff },
            { count: 6, x: 4, color: 0xff6b6b },
            { count: 4, x: 8, color: 0x00ff00 }
        ];
        
        layers.forEach((layer, layerIndex) => {
            for (let i = 0; i < layer.count; i++) {
                const nodeMaterial = new THREE.MeshPhongMaterial({ 
                    color: layer.color,
                    emissive: layer.color,
                    emissiveIntensity: 0.3
                });
                
                const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
                node.position.set(
                    layer.x,
                    (i - layer.count / 2) * 2,
                    Math.random() * 2 - 1
                );
                
                // Add pulsing animation data
                node.userData = {
                    originalScale: 1,
                    pulsePhase: Math.random() * Math.PI * 2,
                    layerIndex: layerIndex
                };
                
                nodes.push(node);
                group.add(node);
            }
        });
        
        // Create connections
        this.createNeuralConnections(group, nodes);
        
        return group;
    }
    
    createNeuralConnections(group, nodes) {
        const lineMaterial = new THREE.LineBasicMaterial({ 
            color: 0x444444,
            transparent: true,
            opacity: 0.3
        });
        
        // Connect adjacent layers
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const node1 = nodes[i];
                const node2 = nodes[j];
                
                // Only connect nodes in adjacent layers
                if (Math.abs(node1.userData.layerIndex - node2.userData.layerIndex) === 1) {
                    const geometry = new THREE.BufferGeometry().setFromPoints([
                        node1.position,
                        node2.position
                    ]);
                    
                    const line = new THREE.Line(geometry, lineMaterial);
                    line.userData = { 
                        startNode: node1, 
                        endNode: node2,
                        pulsePhase: Math.random() * Math.PI * 2
                    };
                    
                    group.add(line);
                }
            }
        }
    }
    
    createQuantumFieldScene() {
        const container = document.getElementById('quantum-field-container');
        if (!container) return;
        
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        
        renderer.setSize(container.offsetWidth, container.offsetHeight);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);
        
        // Quantum particle system
        const particleSystem = this.createQuantumParticles();
        scene.add(particleSystem);
        
        // Quantum field lines
        const fieldLines = this.createQuantumField();
        scene.add(fieldLines);
        
        camera.position.z = 30;
        
        this.scenes.quantumField = scene;
        this.cameras.quantumField = camera;
        this.renderers.quantumField = renderer;
    }
    
    createQuantumParticles() {
        const particleCount = 1000;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Position
            positions[i3] = (Math.random() - 0.5) * 50;
            positions[i3 + 1] = (Math.random() - 0.5) * 50;
            positions[i3 + 2] = (Math.random() - 0.5) * 50;
            
            // Color
            const hue = Math.random();
            const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
            
            // Size
            sizes[i] = Math.random() * 2 + 1;
        }
        
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const material = new THREE.ShaderMaterial({
            vertexShader: `
                attribute float size;
                varying vec3 vColor;
                
                void main() {
                    vColor = color;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                
                void main() {
                    float r = distance(gl_PointCoord, vec2(0.5, 0.5));
                    if (r > 0.5) discard;
                    
                    float alpha = 1.0 - (r / 0.5);
                    gl_FragColor = vec4(vColor, alpha);
                }
            `,
            transparent: true,
            vertexColors: true
        });
        
        return new THREE.Points(geometry, material);
    }
    
    createQuantumField() {
        const group = new THREE.Group();
        const lineCount = 100;
        
        for (let i = 0; i < lineCount; i++) {
            const points = [];
            const segments = 20;
            
            for (let j = 0; j <= segments; j++) {
                const t = j / segments;
                const x = (Math.random() - 0.5) * 40;
                const y = (Math.random() - 0.5) * 40;
                const z = (Math.random() - 0.5) * 40;
                
                points.push(new THREE.Vector3(x, y, z));
            }
            
            const curve = new THREE.CatmullRomCurve3(points);
            const tubeGeometry = new THREE.TubeGeometry(curve, segments, 0.05, 8, false);
            
            const hue = Math.random();
            const tubeMaterial = new THREE.MeshBasicMaterial({
                color: new THREE.Color().setHSL(hue, 0.8, 0.6),
                transparent: true,
                opacity: 0.6
            });
            
            const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
            tube.userData = { rotationSpeed: (Math.random() - 0.5) * 0.02 };
            
            group.add(tube);
        }
        
        return group;
    }
    
    createAudioVisualizerScene() {
        const container = document.getElementById('audio-visualizer-container');
        if (!container) return;
        
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        
        renderer.setSize(container.offsetWidth, container.offsetHeight);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);
        
        // Audio reactive sphere
        const sphereGeometry = new THREE.SphereGeometry(5, 64, 64);
        const sphereMaterial = new THREE.ShaderMaterial({
            vertexShader: `
                uniform float time;
                uniform float audioLevel;
                varying vec3 vPosition;
                varying vec3 vNormal;
                
                void main() {
                    vPosition = position;
                    vNormal = normal;
                    
                    vec3 pos = position;
                    float displacement = sin(pos.x * 2.0 + time) * sin(pos.y * 2.0 + time) * audioLevel;
                    pos += normal * displacement;
                    
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform float audioLevel;
                varying vec3 vPosition;
                varying vec3 vNormal;
                
                void main() {
                    float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
                    vec3 color = vec3(0.0, 1.0, 1.0) + vec3(1.0, 0.0, 1.0) * audioLevel;
                    
                    gl_FragColor = vec4(color * intensity, 1.0);
                }
            `,
            uniforms: {
                time: { value: 0.0 },
                audioLevel: { value: 0.0 }
            }
        });
        
        const audioSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        scene.add(audioSphere);
        
        camera.position.z = 15;
        
        this.scenes.audioVisualizer = scene;
        this.cameras.audioVisualizer = camera;
        this.renderers.audioVisualizer = renderer;
    }
    
    createNeuralUnderstandingScene() {
        const container = document.getElementById('neural-understanding-container');
        if (!container) return;
        
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        
        renderer.setSize(container.offsetWidth, container.offsetHeight);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);
        
        // Create cognitive architecture visualization
        const cognitiveNetwork = this.createCognitiveArchitecture();
        scene.add(cognitiveNetwork);
        
        // Add brain-like lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.2);
        const brainLight1 = new THREE.PointLight(0x00ffff, 0.8, 50);
        const brainLight2 = new THREE.PointLight(0x8a2be2, 0.6, 40);
        const brainLight3 = new THREE.PointLight(0xff1493, 0.7, 45);
        
        brainLight1.position.set(-10, 5, 10);
        brainLight2.position.set(10, -5, 8);
        brainLight3.position.set(0, 10, -10);
        
        scene.add(ambientLight);
        scene.add(brainLight1);
        scene.add(brainLight2);
        scene.add(brainLight3);
        
        camera.position.z = 25;
        camera.position.y = 5;
        
        this.scenes.neuralUnderstanding = scene;
        this.cameras.neuralUnderstanding = camera;
        this.renderers.neuralUnderstanding = renderer;
    }
    
    createCognitiveArchitecture() {
        const group = new THREE.Group();
        
        // Create brain-like structure representing the AI ecosystem
        const brainRegions = [
            // Claude Code (Cortex) - Central processing
            { 
                position: [0, 0, 0], 
                size: 2.5, 
                color: 0x00ffff, 
                segments: 16,
                name: 'claude'
            },
            // ElevenLabs (Broca's Area) - Speech
            { 
                position: [-8, -3, 2], 
                size: 1.8, 
                color: 0x8a2be2, 
                segments: 12,
                name: 'elevenlabs'
            },
            // Three.js (Visual Cortex) - Visual processing
            { 
                position: [8, 4, -1], 
                size: 2.0, 
                color: 0xff1493, 
                segments: 14,
                name: 'threejs'
            },
            // MCP (Neural Pathways) - Communication
            { 
                position: [0, -6, 3], 
                size: 1.5, 
                color: 0x00ff7f, 
                segments: 10,
                name: 'mcp'
            },
            // Web Audio (Auditory Cortex) - Sound processing
            { 
                position: [-5, 6, -2], 
                size: 1.6, 
                color: 0xffa500, 
                segments: 12,
                name: 'audio'
            }
        ];
        
        const regionMeshes = [];
        
        // Create brain regions
        brainRegions.forEach((region, index) => {
            const geometry = new THREE.IcosahedronGeometry(region.size, 2);
            const material = new THREE.MeshPhongMaterial({
                color: region.color,
                emissive: region.color,
                emissiveIntensity: 0.3,
                transparent: true,
                opacity: 0.7,
                wireframe: false
            });
            
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(...region.position);
            
            // Add pulsing data
            mesh.userData = {
                originalScale: 1,
                pulsePhase: Math.random() * Math.PI * 2,
                regionType: region.name,
                originalPosition: new THREE.Vector3(...region.position)
            };
            
            regionMeshes.push(mesh);
            group.add(mesh);
            
            // Add glow effect
            const glowGeometry = new THREE.IcosahedronGeometry(region.size * 1.3, 1);
            const glowMaterial = new THREE.MeshBasicMaterial({
                color: region.color,
                transparent: true,
                opacity: 0.1,
                side: THREE.BackSide
            });
            
            const glow = new THREE.Mesh(glowGeometry, glowMaterial);
            glow.position.set(...region.position);
            glow.userData = { isGlow: true, parentRegion: region.name };
            group.add(glow);
        });
        
        // Create neural connections between regions
        this.createCognitiveConnections(group, regionMeshes);
        
        // Add data flow particles
        this.createCognitiveDataFlow(group, regionMeshes);
        
        return group;
    }
    
    createCognitiveConnections(group, regions) {
        // Define cognitive connections (how AI systems communicate)
        const connections = [
            [0, 1], // Claude ↔ ElevenLabs
            [0, 2], // Claude ↔ Three.js
            [0, 3], // Claude ↔ MCP
            [1, 4], // ElevenLabs ↔ Web Audio
            [2, 4], // Three.js ↔ Web Audio
            [3, 1], // MCP ↔ ElevenLabs
            [3, 2], // MCP ↔ Three.js
            [3, 4], // MCP ↔ Web Audio
        ];
        
        connections.forEach(([startIdx, endIdx]) => {
            const startPos = regions[startIdx].position;
            const endPos = regions[endIdx].position;
            
            // Create curved connection path
            const midPoint = new THREE.Vector3(
                (startPos.x + endPos.x) / 2,
                (startPos.y + endPos.y) / 2 + Math.random() * 4 - 2,
                (startPos.z + endPos.z) / 2 + Math.random() * 4 - 2
            );
            
            const curve = new THREE.QuadraticBezierCurve3(
                new THREE.Vector3(startPos.x, startPos.y, startPos.z),
                midPoint,
                new THREE.Vector3(endPos.x, endPos.y, endPos.z)
            );
            
            const points = curve.getPoints(20);
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            
            // Dynamic connection material
            const material = new THREE.LineBasicMaterial({
                color: 0x444444,
                transparent: true,
                opacity: 0.4,
                linewidth: 2
            });
            
            const connection = new THREE.Line(geometry, material);
            connection.userData = {
                startRegion: regions[startIdx].userData.regionType,
                endRegion: regions[endIdx].userData.regionType,
                pulsePhase: Math.random() * Math.PI * 2,
                curve: curve
            };
            
            group.add(connection);
        });
    }
    
    createCognitiveDataFlow(group, regions) {
        // Create flowing data particles along neural pathways
        for (let i = 0; i < 50; i++) {
            const geometry = new THREE.SphereGeometry(0.1, 8, 8);
            const color = [0x00ffff, 0x8a2be2, 0xff1493, 0x00ff7f, 0xffa500][Math.floor(Math.random() * 5)];
            const material = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.8
            });
            
            const particle = new THREE.Mesh(geometry, material);
            
            // Random position within the brain network
            particle.position.set(
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 15,
                (Math.random() - 0.5) * 10
            );
            
            particle.userData = {
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.1,
                    (Math.random() - 0.5) * 0.1,
                    (Math.random() - 0.5) * 0.05
                ),
                life: Math.random() * 10,
                maxLife: 10,
                targetRegion: Math.floor(Math.random() * regions.length)
            };
            
            group.add(particle);
        }
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Audio integration - use window events instead of AudioManager events
        window.addEventListener('audioLevelUpdate', (event) => {
            this.updateAudioVisualizer(event.detail.level);
        });
    }
    
    onWindowResize() {
        Object.keys(this.cameras).forEach(sceneKey => {
            const container = document.querySelector(`#${sceneKey.replace(/([A-Z])/g, '-$1').toLowerCase()}-container`);
            if (!container) return;
            
            const camera = this.cameras[sceneKey];
            const renderer = this.renderers[sceneKey];
            
            camera.aspect = container.offsetWidth / container.offsetHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.offsetWidth, container.offsetHeight);
        });
    }
    
    updateAudioVisualizer(audioLevel) {
        const scene = this.scenes.audioVisualizer;
        if (!scene) return;
        
        scene.traverse((child) => {
            if (child.material && child.material.uniforms) {
                child.material.uniforms.audioLevel.value = audioLevel;
            }
        });
    }
    
    startAnimation() {
        const animate = () => {
            this.animationFrames.main = requestAnimationFrame(animate);
            
            const time = performance.now() * 0.001;
            
            // Animate neural network
            this.animateNeuralNetwork(time);
            
            // Animate quantum field
            this.animateQuantumField(time);
            
            // Animate audio visualizer
            this.animateAudioVisualizer(time);
            
            // Animate neural understanding
            this.animateNeuralUnderstanding(time);
            
            // Render all scenes
            this.renderScenes();
        };
        
        animate();
    }
    
    animateNeuralNetwork(time) {
        const scene = this.scenes.neuralNetwork;
        if (!scene) return;
        
        scene.traverse((child) => {
            if (child.geometry && child.geometry.type === 'SphereGeometry') {
                // Pulse nodes
                const pulseScale = 1 + Math.sin(time * 2 + child.userData.pulsePhase) * 0.2;
                child.scale.setScalar(pulseScale);
                
                // Rotate group
                if (child.parent.type === 'Group') {
                    child.parent.rotation.y = time * 0.1;
                }
            }
            
            if (child.type === 'Line') {
                // Animate connection opacity
                const opacity = 0.3 + Math.sin(time * 3 + child.userData.pulsePhase) * 0.2;
                child.material.opacity = opacity;
            }
        });
    }
    
    animateQuantumField(time) {
        const scene = this.scenes.quantumField;
        if (!scene) return;
        
        scene.traverse((child) => {
            if (child.type === 'Points') {
                // Rotate particle system
                child.rotation.y = time * 0.05;
                child.rotation.x = time * 0.02;
            }
            
            if (child.userData && child.userData.rotationSpeed) {
                // Rotate field tubes
                child.rotation.x += child.userData.rotationSpeed;
                child.rotation.y += child.userData.rotationSpeed * 0.5;
            }
        });
    }
    
    animateAudioVisualizer(time) {
        const scene = this.scenes.audioVisualizer;
        if (!scene) return;
        
        scene.traverse((child) => {
            if (child.material && child.material.uniforms) {
                child.material.uniforms.time.value = time;
                child.rotation.y = time * 0.1;
            }
        });
    }
    
    animateNeuralUnderstanding(time) {
        const scene = this.scenes.neuralUnderstanding;
        if (!scene) return;
        
        scene.traverse((child) => {
            // Animate brain regions (pulsing like neurons)
            if (child.userData && child.userData.regionType) {
                const pulse = 1 + Math.sin(time * 2 + child.userData.pulsePhase) * 0.15;
                child.scale.setScalar(pulse);
                
                // Subtle floating motion
                const originalPos = child.userData.originalPosition;
                child.position.y = originalPos.y + Math.sin(time + child.userData.pulsePhase) * 0.5;
                
                // Update emissive intensity based on "neural activity"
                if (child.material.emissive) {
                    child.material.emissiveIntensity = 0.2 + Math.sin(time * 3 + child.userData.pulsePhase) * 0.15;
                }
            }
            
            // Animate glow effects
            if (child.userData && child.userData.isGlow) {
                const glowPulse = 1 + Math.sin(time * 1.5 + Math.PI / 4) * 0.2;
                child.scale.setScalar(glowPulse);
                child.material.opacity = 0.05 + Math.sin(time * 2) * 0.05;
            }
            
            // Animate neural connections
            if (child.type === 'Line' && child.userData.startRegion) {
                const connectionActivity = 0.2 + Math.sin(time * 4 + child.userData.pulsePhase) * 0.3;
                child.material.opacity = connectionActivity;
                
                // Create data pulse effect along connections
                const pulsePosition = (time * 0.5 + child.userData.pulsePhase) % (Math.PI * 2);
                child.material.color.setHSL(0.5 + Math.sin(pulsePosition) * 0.3, 0.8, 0.5);
            }
            
            // Animate data flow particles
            if (child.type === 'Mesh' && child.userData.velocity) {
                // Move particle along its velocity
                child.position.add(child.userData.velocity);
                
                // Update particle life and respawn if needed
                child.userData.life -= 0.016;
                if (child.userData.life <= 0) {
                    // Respawn particle at a brain region
                    const respawnRegions = [
                        { pos: [0, 0, 0], color: 0x00ffff },      // Claude
                        { pos: [-8, -3, 2], color: 0x8a2be2 },   // ElevenLabs
                        { pos: [8, 4, -1], color: 0xff1493 },    // Three.js
                        { pos: [0, -6, 3], color: 0x00ff7f },    // MCP
                        { pos: [-5, 6, -2], color: 0xffa500 }    // Audio
                    ];
                    
                    const region = respawnRegions[Math.floor(Math.random() * respawnRegions.length)];
                    child.position.set(...region.pos);
                    child.material.color.setHex(region.color);
                    child.userData.life = child.userData.maxLife;
                    
                    // New random velocity
                    child.userData.velocity.set(
                        (Math.random() - 0.5) * 0.1,
                        (Math.random() - 0.5) * 0.1,
                        (Math.random() - 0.5) * 0.05
                    );
                }
                
                // Fade particle over its lifetime
                const lifeFactor = child.userData.life / child.userData.maxLife;
                child.material.opacity = lifeFactor * 0.8;
                child.scale.setScalar(0.5 + lifeFactor * 0.5);
            }
        });
        
        // Slowly rotate the entire cognitive architecture
        scene.children.forEach(child => {
            if (child.type === 'Group') {
                child.rotation.y = time * 0.02;
                child.rotation.x = Math.sin(time * 0.01) * 0.1;
            }
        });
    }
    
    renderScenes() {
        Object.keys(this.renderers).forEach(sceneKey => {
            const renderer = this.renderers[sceneKey];
            const scene = this.scenes[sceneKey];
            const camera = this.cameras[sceneKey];
            
            if (renderer && scene && camera) {
                renderer.render(scene, camera);
            }
        });
    }
    
    destroy() {
        // Cancel animation frames
        Object.values(this.animationFrames).forEach(frame => {
            cancelAnimationFrame(frame);
        });
        
        // Dispose of Three.js resources
        Object.values(this.renderers).forEach(renderer => {
            renderer.dispose();
        });
        
        Object.values(this.scenes).forEach(scene => {
            scene.traverse((child) => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) child.material.dispose();
            });
        });
        
        console.log('Three.js scenes destroyed');
    }
}

// Export for module usage
export default ThreeSceneManager;