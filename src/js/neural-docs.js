/**
 * Neural Documentation System - Interactive AI Knowledge Base
 * Provides comprehensive documentation without external dependencies
 */

class NeuralDocs {
    constructor() {
        this.isActive = false;
        this.currentSection = 'overview';
        this.searchIndex = [];
        
        this.init();
    }
    
    init() {
        this.modal = document.getElementById('neural-docs-modal');
        this.content = document.getElementById('neural-docs-content');
        this.searchInput = document.getElementById('neural-search');
        this.closeBtn = document.getElementById('neural-docs-close');
        
        this.setupEventListeners();
        this.initializeContent();
        this.buildSearchIndex();
    }
    
    setupEventListeners() {
        // Close button
        this.closeBtn.addEventListener('click', () => {
            this.closeDocs();
        });
        
        // Modal backdrop click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeDocs();
            }
        });
        
        // Navigation buttons
        document.querySelectorAll('.neural-nav-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.currentTarget.getAttribute('data-section');
                this.navigateToSection(section);
            });
        });
        
        // Search functionality
        this.searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });
        
        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isActive) {
                this.closeDocs();
            }
        });
    }
    
    /**
     * Open the Neural Docs system
     */
    async openDocs() {
        if (this.isActive) return;
        
        this.isActive = true;
        this.modal.classList.add('active');
        
        // Play neural activation sound
        this.playNeuralSound('activation');
        
        // Load initial content
        this.showSection(this.currentSection);
        
        // Focus search input
        setTimeout(() => {
            this.searchInput.focus();
        }, 500);
        
        console.log('🧠 Neural Documentation System activated');
    }
    
    /**
     * Close the Neural Docs system
     */
    closeDocs() {
        if (!this.isActive) return;
        
        this.isActive = false;
        this.modal.classList.remove('active');
        
        // Clear search
        this.searchInput.value = '';
        
        console.log('🧠 Neural Documentation System deactivated');
    }
    
    /**
     * Navigate to a specific documentation section  
     * (Sound effect version is defined later with full audio implementation)
     */
    
    /**
     * Display content for a specific section
     */
    showSection(section) {
        const sectionContent = this.getContent(section);
        this.content.innerHTML = sectionContent;
        
        // Add fade-in animation
        this.content.style.opacity = '0';
        setTimeout(() => {
            this.content.style.opacity = '1';
        }, 100);
    }
    
    /**
     * Initialize all documentation content
     */
    initializeContent() {
        this.contentData = {
            overview: {
                title: '🎯 System Overview',
                content: `
                    <h3 class="neural-highlight mb-4">Claude MCP Showcase Architecture</h3>
                    <p class="mb-4">This showcase demonstrates the integration of multiple cutting-edge AI technologies:</p>
                    
                    <div class="neural-code-block">
📊 <span class="neural-highlight">System Components:</span>
├── 🧠 Claude Code (AI Assistant)
├── 🔗 Model Context Protocol (MCP)
├── 🎵 ElevenLabs (Text-to-Speech)
├── ⚛️ Quantum Physics Simulator
├── 💊 Matrix Rain Effects
└── 📡 Real-time Audio Synthesis
                    </div>
                    
                    <h4 class="neural-highlight mt-6 mb-3">Key Features:</h4>
                    <ul class="list-disc list-inside space-y-2 mb-4">
                        <li><strong>Interactive 3D Visualizations</strong> - Three.js quantum simulations</li>
                        <li><strong>Real-time Audio Processing</strong> - Web Audio API integration</li>
                        <li><strong>Matrix-style Effects</strong> - Cinematic digital rain</li>
                        <li><strong>Progressive Enhancement</strong> - Layered complexity architecture</li>
                        <li><strong>Performance Optimized</strong> - 60fps animations on all devices</li>
                    </ul>
                    
                    <div class="neural-code-block">
<span class="neural-highlight">🚀 Performance Metrics:</span>
• First Contentful Paint: <1.5s
• Time to Interactive: <3.5s  
• Frame Rate: 60fps (desktop), 30fps (mobile)
• Bundle Size: Optimized for rapid loading
                    </div>
                `
            },
            mcp: {
                title: '🔗 Model Context Protocol',
                content: `
                    <h3 class="neural-highlight mb-4">MCP Integration Architecture</h3>
                    <p class="mb-4">Model Context Protocol enables seamless communication between Claude and external services.</p>
                    
                    <div class="neural-code-block">
<span class="neural-highlight">🔄 MCP Flow:</span>
Claude ←→ MCP Server ←→ ElevenLabs API

1. User types text in interface
2. Claude processes request via MCP
3. ElevenLabs synthesizes speech
4. Audio streams back to client
                    </div>
                    
                    <h4 class="neural-highlight mt-6 mb-3">Server Configuration:</h4>
                    <div class="neural-code-block">
{
  "name": "elevenlabs-mcp-server",
  "version": "1.0.0",
  "type": "module",
  "main": "index.js",
  "dependencies": {
    "node-fetch": "^3.0.0",
    "dotenv": "^16.0.0"
  }
}
                    </div>
                    
                    <h4 class="neural-highlight mt-6 mb-3">Key Benefits:</h4>
                    <ul class="list-disc list-inside space-y-2 mb-4">
                        <li><strong>Standardized Protocol</strong> - Consistent API across services</li>
                        <li><strong>Real-time Communication</strong> - Low-latency data exchange</li>
                        <li><strong>Extensible Architecture</strong> - Easy to add new integrations</li>
                        <li><strong>Security First</strong> - Secure token handling</li>
                    </ul>
                `
            },
            claude: {
                title: '🤖 Claude Code Integration',
                content: `
                    <h3 class="neural-highlight mb-4">Claude Code Framework</h3>
                    <p class="mb-4">Claude Code provides the intelligent backbone for this showcase application.</p>
                    
                    <div class="neural-code-block">
<span class="neural-highlight">🧠 Claude Capabilities:</span>
• Natural Language Processing
• Code Generation & Analysis  
• Real-time Problem Solving
• Multi-modal Understanding
• Context-aware Responses
                    </div>
                    
                    <h4 class="neural-highlight mt-6 mb-3">Implementation Patterns:</h4>
                    <div class="neural-code-block">
// Claude-powered interaction example
async function processUserInput(input) {
  const response = await claude.analyze({
    text: input,
    context: 'elevenlabs-integration',
    format: 'structured'
  });
  
  return {
    intent: response.intent,
    parameters: response.parameters,
    confidence: response.confidence
  };
}
                    </div>
                    
                    <h4 class="neural-highlight mt-6 mb-3">Advanced Features:</h4>
                    <ul class="list-disc list-inside space-y-2 mb-4">
                        <li><strong>Context Preservation</strong> - Maintains conversation history</li>
                        <li><strong>Multi-step Reasoning</strong> - Complex problem decomposition</li>
                        <li><strong>Code Understanding</strong> - Analyzes and explains code</li>
                        <li><strong>Adaptive Learning</strong> - Improves over time</li>
                    </ul>
                    
                    <div class="neural-code-block">
<span class="neural-highlight">🎯 Use Cases in This Project:</span>
✓ Text preprocessing for TTS
✓ Parameter optimization  
✓ Error handling & recovery
✓ User intent recognition
✓ Performance monitoring
                    </div>
                `
            },
            elevenlabs: {
                title: '🎵 ElevenLabs Integration',
                content: `
                    <h3 class="neural-highlight mb-4">Advanced Text-to-Speech System</h3>
                    <p class="mb-4">ElevenLabs provides state-of-the-art voice synthesis with emotional intelligence.</p>
                    
                    <div class="neural-code-block">
<span class="neural-highlight">🎤 Voice Models Available:</span>
├── Rachel (Natural, Calm)
├── Drew (Deep, Authoritative) 
├── Clyde (Warm, Friendly)
├── Paul (Professional, Clear)
└── Antoni (Expressive, Dynamic)
                    </div>
                    
                    <h4 class="neural-highlight mt-6 mb-3">API Implementation:</h4>
                    <div class="neural-code-block">
// ElevenLabs synthesis request
const synthesizeText = async (text, voiceId, settings) => {
  const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/' + voiceId, {
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': process.env.ELEVENLABS_API_KEY
    },
    body: JSON.stringify({
      text: text,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: settings.stability || 0.75,
        similarity_boost: settings.similarity || 0.85,
        style: settings.style || 0.5,
        use_speaker_boost: true
      }
    })
  });
  
  return response.arrayBuffer();
};
                    </div>
                    
                    <h4 class="neural-highlight mt-6 mb-3">Advanced Features:</h4>
                    <ul class="list-disc list-inside space-y-2 mb-4">
                        <li><strong>Emotional Intelligence</strong> - Context-aware tone adjustment</li>
                        <li><strong>Multi-language Support</strong> - 29 languages supported</li>
                        <li><strong>Voice Cloning</strong> - Custom voice creation</li>
                        <li><strong>Real-time Processing</strong> - Low-latency synthesis</li>
                        <li><strong>SSML Support</strong> - Advanced speech markup</li>
                    </ul>
                    
                    <div class="neural-code-block">
<span class="neural-highlight">⚡ Performance Optimization:</span>
• Streaming audio delivery
• Intelligent caching system
• Adaptive quality based on connection
• Preloading for common phrases
• Error recovery with fallbacks
                    </div>
                `
            },
            quantum: {
                title: '⚛️ Quantum Physics Simulator',
                content: `
                    <h3 class="neural-highlight mb-4">Interactive Quantum Laboratory</h3>
                    <p class="mb-4">Real-time quantum mechanics simulation using Three.js and advanced shaders.</p>
                    
                    <div class="neural-code-block">
<span class="neural-highlight">⚛️ Quantum Systems:</span>
├── 🔵 Particle Entanglement
├── 🌊 Wave Function Collapse  
├── ⚡ Quantum Field Theory
├── 🎯 Superposition States
└── 🔗 Observer Effect
                    </div>
                    
                    <h4 class="neural-highlight mt-6 mb-3">Physics Implementation:</h4>
                    <div class="neural-code-block">
// Quantum particle update loop
updateQuantumParticle(particle, deltaTime) {
  // Apply quantum uncertainty principle
  const uncertainty = this.calculateHeisenbergUncertainty(particle);
  
  // Update position with wave function
  particle.position.add(
    particle.velocity.clone().multiplyScalar(deltaTime)
  );
  
  // Apply quantum tunneling effect
  if (particle.position.length() > this.boundaryRadius) {
    this.applyQuantumTunneling(particle);
  }
  
  // Handle entangled pairs
  if (particle.entangled) {
    this.updateEntangledPair(particle);
  }
}
                    </div>
                    
                    <h4 class="neural-highlight mt-6 mb-3">Shader-based Field Generation:</h4>
                    <div class="neural-code-block">
// GLSL quantum field vertex shader
uniform float time;
uniform float coherence;
varying vec3 vPosition;

void main() {
  vPosition = position;
  vec3 pos = position;
  
  // Multi-dimensional wave interference
  pos.z += sin(pos.x * 0.1 + time) * coherence * 2.0;
  pos.z += cos(pos.y * 0.1 + time * 0.7) * coherence * 1.5;
  
  // Quantum uncertainty distortion
  pos.z += sin(length(pos.xy) * 0.05 + time * 2.0) * 0.3;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
                    </div>
                    
                    <h4 class="neural-highlight mt-6 mb-3">Interactive Controls:</h4>
                    <ul class="list-disc list-inside space-y-2 mb-4">
                        <li><strong>Spawn Particles</strong> - Create quantum matter</li>
                        <li><strong>Generate Waves</strong> - Interference patterns</li>
                        <li><strong>Field Layers</strong> - Multi-dimensional fields</li>
                        <li><strong>Reset System</strong> - Return to ground state</li>
                        <li><strong>Save Signatures</strong> - Quantum state persistence</li>
                    </ul>
                `
            },
            matrix: {
                title: '💊 Matrix Digital Effects',
                content: `
                    <h3 class="neural-highlight mb-4">Cinematic Matrix Rain System</h3>
                    <p class="mb-4">Authentic Matrix-style digital rain with console interface and sound effects.</p>
                    
                    <div class="neural-code-block">
<span class="neural-highlight">💚 Matrix Components:</span>
├── 🌧️ Digital Rain Animation
├── 💻 Terminal Console Interface
├── 🔊 Synthesized Sound Effects  
├── ⌨️ Konami Code Easter Egg
└── 📱 Responsive Design
                    </div>
                    
                    <h4 class="neural-highlight mt-6 mb-3">Rain Generation Algorithm:</h4>
                    <div class="neural-code-block">
// Matrix rain column creation
createMatrixColumn(xPosition) {
  const column = document.createElement('div');
  const charCount = Math.floor(Math.random() * 20) + 10;
  const matrixChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ';
  
  // Generate random character sequence
  let charString = '';
  for (let i = 0; i < charCount; i++) {
    const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
    const brightness = i === 0 ? 'bright' : '';
    charString += \`<span class="matrix-char \${brightness}">\${char}</span>\`;
  }
  
  column.innerHTML = charString;
  column.className = 'matrix-rain';
  column.style.left = xPosition + 'px';
  column.style.animationDuration = (Math.random() * 3 + 2) + 's';
  
  return column;
}
                    </div>
                    
                    <h4 class="neural-highlight mt-6 mb-3">Console Typewriter Effect:</h4>
                    <div class="neural-code-block">
// Authentic terminal typing simulation
async function typeMessage(text, element) {
  element.innerHTML = '';
  
  for (let i = 0; i < text.length; i++) {
    element.innerHTML = text.slice(0, i + 1);
    
    // Variable typing speed for authenticity
    const delay = 50 + Math.random() * 50;
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  
  element.innerHTML += '<br>';
}

const messages = [
  'Initializing neural pathways...',
  'Connecting to quantum matrix...',
  'Bypassing firewall protocols...',
  'Accessing MCP bridge systems...',
  'ElevenLabs synthesis engine online...',
  'Claude AI consciousness detected...',
  'Neural interface ready...',
  '> WELCOME TO THE MATRIX <'
];
                    </div>
                    
                    <h4 class="neural-highlight mt-6 mb-3">Audio Synthesis:</h4>
                    <ul class="list-disc list-inside space-y-2 mb-4">
                        <li><strong>Entrance Sweep</strong> - Dramatic frequency sweep</li>
                        <li><strong>Typing Clicks</strong> - Mechanical keyboard sounds</li>
                        <li><strong>Success Beeps</strong> - Confirmation tones</li>
                        <li><strong>Web Audio API</strong> - Real-time synthesis</li>
                    </ul>
                `
            },
            api: {
                title: '📡 API Reference Guide',
                content: `
                    <h3 class="neural-highlight mb-4">Complete API Documentation</h3>
                    <p class="mb-4">Comprehensive reference for all system APIs and integration points.</p>
                    
                    <h4 class="neural-highlight mt-6 mb-3">Audio Manager API:</h4>
                    <div class="neural-code-block">
// AudioManager class methods
const audioManager = new AudioManager({
  visualizations: true,
  scrollSync: true,
  autoPlay: false,
  volume: 0.7
});

// Core methods
audioManager.play()           // Start playback
audioManager.pause()          // Pause playback  
audioManager.stop()           // Stop and reset
audioManager.seekTo(timeMs)   // Jump to timestamp
audioManager.setVolume(0.8)   // Adjust volume
audioManager.switchLanguage('hebrew') // Change audio track

// Scroll synchronization
audioManager.enableScrollSync()   // Enable scroll-audio sync
audioManager.disableScrollSync()  // Disable sync temporarily
                    </div>
                    
                    <h4 class="neural-highlight mt-6 mb-3">Matrix Effects API:</h4>
                    <div class="neural-code-block">
// Matrix effect system
const matrixEffect = new MatrixEffect();

// Control methods
matrixEffect.startEffect()    // Begin Matrix sequence
matrixEffect.stopEffect()     // End Matrix sequence
matrixEffect.createRain()     // Generate new rain columns
matrixEffect.handleResize()   // Responsive adjustment

// Sound effects
const matrixSounds = new MatrixSounds();
matrixSounds.play('entrance') // Play entrance sweep
matrixSounds.play('type')     // Typewriter click
matrixSounds.play('success')  // Success beep
                    </div>
                    
                    <h4 class="neural-highlight mt-6 mb-3">Quantum Realm API:</h4>
                    <div class="neural-code-block">
// Quantum physics simulator
const quantumRealm = new QuantumRealm();

// Core methods
await quantumRealm.openRealm()     // Activate quantum lab
quantumRealm.closeRealm()          // Deactivate lab
quantumRealm.spawnParticles()      // Add quantum particles
quantumRealm.createQuantumWaves()  // Generate wave patterns
quantumRealm.generateField()       // Create field layers
quantumRealm.resetField()          // Reset to ground state

// State management
quantumRealm.saveSignature()       // Save quantum signature
quantumRealm.sharePortal()         // Generate shareable URL

// Properties
quantumRealm.quantumState          // Current quantum state
quantumRealm.quantumSignature      // Unique signature
quantumRealm.interactionCount      // User interaction count
                    </div>
                    
                    <h4 class="neural-highlight mt-6 mb-3">Neural Docs API:</h4>
                    <div class="neural-code-block">
// Documentation system
const neuralDocs = new NeuralDocs();

// Navigation methods
await neuralDocs.openDocs()           // Open docs modal
neuralDocs.closeDocs()               // Close docs modal
neuralDocs.navigateToSection(id)     // Switch sections
neuralDocs.handleSearch(query)       // Search functionality

// Content management  
neuralDocs.showSection(section)      // Display section
neuralDocs.buildSearchIndex()        // Index all content
neuralDocs.getContent(section)       // Retrieve content
                    </div>
                    
                    <h4 class="neural-highlight mt-6 mb-3">Performance Optimizer API:</h4>
                    <div class="neural-code-block">
// System performance optimization
const optimizer = new PerformanceOptimizer();

// Monitoring methods
optimizer.startMonitoring()          // Begin performance tracking
optimizer.logMetrics()              // Output current metrics
optimizer.optimizeForDevice()       // Device-specific optimization
optimizer.enableAdaptiveQuality()   // Auto-adjust quality

// Resource management
optimizer.cleanupResources()        // Free unused resources
optimizer.preloadAssets()           // Smart asset preloading
                    </div>
                `
            }
        };
    }
    
    /**
     * Get content for a specific section
     */
    getContent(section) {
        const data = this.contentData[section];
        if (!data) return '<p>Section not found</p>';
        
        return `
            <div class="neural-section active">
                <h2 style="color: #7c3aed; margin-bottom: 20px; font-size: 24px;">${data.title}</h2>
                ${data.content}
            </div>
        `;
    }
    
    /**
     * Build search index for fast content searching
     */
    buildSearchIndex() {
        this.searchIndex = [];
        
        Object.keys(this.contentData).forEach(section => {
            const data = this.contentData[section];
            const content = data.content.replace(/<[^>]*>/g, ' ').toLowerCase();
            
            this.searchIndex.push({
                section: section,
                title: data.title,
                content: content,
                keywords: content.split(/\s+/)
            });
        });
    }
    
    /**
     * Handle search functionality
     * (Audio-enhanced version is defined later with full audio implementation)
     */
    
    /**
     * Display search results
     */
    showSearchResults(results, query) {
        if (results.length === 0) {
            this.content.innerHTML = `
                <div class="neural-section active">
                    <h2 style="color: #7c3aed; margin-bottom: 20px;">🔍 Search Results</h2>
                    <p>No results found for "<span class="neural-highlight">${query}</span>"</p>
                    <p class="mt-4">Try searching for:</p>
                    <ul class="list-disc list-inside mt-2 space-y-1">
                        <li>MCP protocol</li>
                        <li>Quantum physics</li>
                        <li>Matrix effects</li>
                        <li>ElevenLabs API</li>
                        <li>Claude integration</li>
                    </ul>
                </div>
            `;
            return;
        }
        
        const resultsHTML = results.map(result => `
            <div class="p-4 border border-gray-700 rounded-lg mb-4 hover:border-purple-500 transition-colors cursor-pointer" 
                 onclick="window.neuralDocs.navigateToSection('${result.section}')">
                <h3 class="neural-highlight text-lg mb-2">${result.title}</h3>
                <p class="text-sm opacity-80">Score: ${result.score} | Section: ${result.section}</p>
            </div>
        `).join('');
        
        this.content.innerHTML = `
            <div class="neural-section active">
                <h2 style="color: #7c3aed; margin-bottom: 20px;">🔍 Search Results</h2>
                <p class="mb-4">Found ${results.length} result(s) for "<span class="neural-highlight">${query}</span>"</p>
                ${resultsHTML}
            </div>
        `;
    }
    
    /**
     * Play neural-themed sound effects
     */
    playNeuralSound(type) {
        if (!window.AudioContext && !window.webkitAudioContext) return;
        
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            switch (type) {
                case 'activation':
                    // Neural network activation sound (rising harmonics)
                    this.createNeuralTone(audioContext, [220, 330, 440], 1.5, 'activation');
                    break;
                case 'navigation':
                    // Page navigation sound
                    this.createNeuralTone(audioContext, [880, 1100], 0.3, 'navigation');
                    break;
                case 'search':
                    // Search sound
                    this.createNeuralTone(audioContext, [660, 880], 0.2, 'search');
                    break;
            }
        } catch (error) {
            console.warn('Neural audio unavailable:', error);
        }
    }
    
    /**
     * Create complex neural-themed tones
     */
    createNeuralTone(audioContext, frequencies, duration, type) {
        const gainNode = audioContext.createGain();
        gainNode.connect(audioContext.destination);
        
        // Create multiple oscillators for rich harmonic content
        const oscillators = frequencies.map((freq, index) => {
            const oscillator = audioContext.createOscillator();
            const oscGain = audioContext.createGain();
            
            oscillator.connect(oscGain);
            oscGain.connect(gainNode);
            
            // Different waveforms for complexity
            oscillator.type = ['sine', 'triangle', 'sawtooth'][index % 3];
            oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
            
            // Individual oscillator envelope
            const oscVolume = 0.1 / frequencies.length;
            oscGain.gain.setValueAtTime(0, audioContext.currentTime);
            oscGain.gain.linearRampToValueAtTime(oscVolume, audioContext.currentTime + 0.1);
            
            if (type === 'activation') {
                // Sweep frequency for activation sound
                oscillator.frequency.exponentialRampToValueAtTime(freq * 1.5, audioContext.currentTime + duration);
                oscGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
            } else {
                // Quick decay for navigation/search
                oscGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
            }
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + duration);
            
            return oscillator;
        });
        
        // Master gain envelope
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
    }
    
    /**
     * Navigate to section with sound effect
     */
    navigateToSection(section) {
        // Play navigation sound
        this.playNeuralSound('navigation');
        
        // Update active nav button
        document.querySelectorAll('.neural-nav-item').forEach(btn => {
            btn.classList.remove('active');
        });
        
        document.querySelector(`[data-section="${section}"]`).classList.add('active');
        
        this.currentSection = section;
        this.showSection(section);
    }
    
    /**
     * Handle search with sound feedback
     */
    handleSearch(query) {
        // Play search sound on input
        if (query.trim()) {
            this.playNeuralSound('search');
        }
        
        if (!query.trim()) {
            this.showSection(this.currentSection);
            return;
        }
        
        query = query.toLowerCase();
        const results = [];
        
        this.searchIndex.forEach(item => {
            let score = 0;
            
            // Title match (high score)
            if (item.title.toLowerCase().includes(query)) {
                score += 10;
            }
            
            // Content match (medium score)
            if (item.content.includes(query)) {
                score += 5;
            }
            
            // Keyword match (lower score)
            item.keywords.forEach(keyword => {
                if (keyword.includes(query)) {
                    score += 1;
                }
            });
            
            if (score > 0) {
                results.push({ ...item, score });
            }
        });
        
        // Sort by relevance score
        results.sort((a, b) => b.score - a.score);
        
        this.showSearchResults(results, query);
    }
}

// Export for global use
export default NeuralDocs;