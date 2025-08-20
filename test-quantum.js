/**
 * Quick test script to verify Quantum Realm functionality
 * Run this in browser console after page loads
 */

// Test script for Quantum Realm
console.log('🧪 Starting Quantum Realm Tests...');

// Test 1: Check if all components are initialized
setTimeout(() => {
    console.log('📊 Component Status:');
    console.log('- AudioManager:', !!window.audioManager);
    console.log('- ThreeSceneManager:', !!window.threeSceneManager);
    console.log('- QuantumRealm:', !!window.quantumRealm);
    console.log('- MatrixEffect:', !!window.matrixEffect);
    
    // Test 2: Check if Quantum Realm button exists
    const quantumBtn = document.getElementById('enter-quantum-btn');
    console.log('- Quantum Button Found:', !!quantumBtn);
    
    // Test 3: Check if modal HTML exists
    const modal = document.getElementById('quantum-modal');
    console.log('- Quantum Modal Found:', !!modal);
    
    // Test 4: Check Three.js availability
    console.log('- Three.js Available:', !!window.THREE);
    
    // Test 5: Test quantum signature generation
    if (window.quantumRealm) {
        console.log('- Quantum Signature:', window.quantumRealm.quantumSignature);
    }
    
    console.log('🎉 Test Complete! Ready to test Quantum Realm button.');
}, 2000);

// Auto-test function (uncomment to auto-open quantum realm)
// setTimeout(() => {
//     console.log('🚀 Auto-testing Quantum Realm...');
//     window.quantumRealm?.openRealm();
// }, 5000);