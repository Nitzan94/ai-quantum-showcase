/**
 * Audio System Validation Script
 * Run this script to test audio system functionality
 */

// Test Web Audio API support
function testWebAudioSupport() {
    console.log('🔊 Testing Web Audio API Support...');
    
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) {
        console.error('❌ Web Audio API not supported');
        return false;
    }
    
    try {
        const audioContext = new AudioContext();
        console.log('✅ Web Audio API supported');
        console.log(`   Context state: ${audioContext.state}`);
        console.log(`   Sample rate: ${audioContext.sampleRate}Hz`);
        return true;
    } catch (error) {
        console.error('❌ Failed to create AudioContext:', error);
        return false;
    }
}

// Test Canvas support
function testCanvasSupport() {
    console.log('🎨 Testing Canvas Support...');
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
        console.error('❌ Canvas 2D not supported');
        return false;
    }
    
    console.log('✅ Canvas 2D supported');
    
    // Test high DPI support
    const dpr = window.devicePixelRatio || 1;
    console.log(`   Device pixel ratio: ${dpr}`);
    
    return true;
}

// Test Speech Synthesis support
function testSpeechSynthesis() {
    console.log('🗣️ Testing Speech Synthesis...');
    
    if (!('speechSynthesis' in window)) {
        console.error('❌ Speech Synthesis not supported');
        return false;
    }
    
    console.log('✅ Speech Synthesis supported');
    
    const voices = speechSynthesis.getVoices();
    console.log(`   Available voices: ${voices.length}`);
    
    if (voices.length > 0) {
        console.log('   Sample voices:');
        voices.slice(0, 3).forEach(voice => {
            console.log(`     - ${voice.name} (${voice.lang})`);
        });
    }
    
    return true;
}

// Test audio file accessibility
async function testAudioFiles() {
    console.log('📁 Testing Audio File Access...');
    
    const audioFiles = [
        './src/assets/audio/claude_mcp_explanation_english.mp3',
        './src/assets/audio/claude_mcp_explanation.mp3'
    ];
    
    const results = await Promise.allSettled(
        audioFiles.map(async (url) => {
            try {
                const response = await fetch(url, { method: 'HEAD' });
                if (response.ok) {
                    console.log(`✅ ${url} - accessible`);
                    return true;
                } else {
                    console.error(`❌ ${url} - HTTP ${response.status}`);
                    return false;
                }
            } catch (error) {
                console.error(`❌ ${url} - ${error.message}`);
                return false;
            }
        })
    );
    
    return results.every(result => result.status === 'fulfilled' && result.value);
}

// Test audio loading and decoding
async function testAudioLoading() {
    console.log('🎵 Testing Audio Loading and Decoding...');
    
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) {
        console.error('❌ Cannot test without Web Audio API');
        return false;
    }
    
    try {
        const audioContext = new AudioContext();
        const response = await fetch('./src/assets/audio/claude_mcp_explanation_english.mp3');
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const arrayBuffer = await response.arrayBuffer();
        console.log(`   File size: ${(arrayBuffer.byteLength / 1024 / 1024).toFixed(2)} MB`);
        
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        console.log(`✅ Audio decoded successfully`);
        console.log(`   Duration: ${audioBuffer.duration.toFixed(2)} seconds`);
        console.log(`   Channels: ${audioBuffer.numberOfChannels}`);
        console.log(`   Sample rate: ${audioBuffer.sampleRate}Hz`);
        
        return true;
    } catch (error) {
        console.error('❌ Audio loading failed:', error);
        return false;
    }
}

// Test visualization capabilities
function testVisualization() {
    console.log('📊 Testing Visualization Capabilities...');
    
    try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Test gradient support
        const gradient = ctx.createLinearGradient(0, 0, 100, 0);
        gradient.addColorStop(0, '#3b82f6');
        gradient.addColorStop(1, '#8b5cf6');
        
        // Test path drawing
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(100, 50);
        ctx.stroke();
        
        // Test shadow effects
        ctx.shadowColor = '#00ff88';
        ctx.shadowBlur = 10;
        
        console.log('✅ Advanced canvas features supported');
        return true;
    } catch (error) {
        console.error('❌ Visualization test failed:', error);
        return false;
    }
}

// Test module loading
function testModuleLoading() {
    console.log('📦 Testing Module Loading...');
    
    // Check if ES6 modules are supported
    if (typeof module !== 'undefined' && module.exports) {
        console.log('✅ CommonJS modules supported');
    }
    
    if (typeof import !== 'undefined') {
        console.log('✅ ES6 modules supported');
    }
    
    // Check for our specific modules
    setTimeout(() => {
        if (window.audioSystem) {
            console.log('✅ AudioSystem module loaded');
        } else {
            console.log('⚠️ AudioSystem module not found (may still be loading)');
        }
        
        if (window.ttsDemo) {
            console.log('✅ TTSDemo module loaded');
        } else {
            console.log('⚠️ TTSDemo module not found (may still be loading)');
        }
    }, 2000);
    
    return true;
}

// Main test runner
async function runAllTests() {
    console.log('🚀 Starting Audio System Validation...\n');
    
    const tests = [
        { name: 'Web Audio API', fn: testWebAudioSupport },
        { name: 'Canvas Support', fn: testCanvasSupport },
        { name: 'Speech Synthesis', fn: testSpeechSynthesis },
        { name: 'Audio Files', fn: testAudioFiles },
        { name: 'Audio Loading', fn: testAudioLoading },
        { name: 'Visualization', fn: testVisualization },
        { name: 'Module Loading', fn: testModuleLoading }
    ];
    
    const results = [];
    
    for (const test of tests) {
        try {
            const result = await test.fn();
            results.push({ name: test.name, passed: result });
        } catch (error) {
            console.error(`❌ ${test.name} test failed:`, error);
            results.push({ name: test.name, passed: false });
        }
        console.log(''); // Add spacing
    }
    
    // Summary
    console.log('📋 Test Summary:');
    console.log('================');
    
    const passed = results.filter(r => r.passed).length;
    const total = results.length;
    
    results.forEach(result => {
        const icon = result.passed ? '✅' : '❌';
        console.log(`${icon} ${result.name}`);
    });
    
    console.log(`\n🎯 Overall: ${passed}/${total} tests passed`);
    
    if (passed === total) {
        console.log('🎉 All tests passed! Audio system is ready.');
    } else {
        console.log('⚠️ Some tests failed. Check console for details.');
    }
    
    return passed === total;
}

// Auto-run tests when script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runAllTests);
} else {
    runAllTests();
}

// Export for manual testing
window.audioSystemTests = {
    runAllTests,
    testWebAudioSupport,
    testCanvasSupport,
    testSpeechSynthesis,
    testAudioFiles,
    testAudioLoading,
    testVisualization,
    testModuleLoading
};