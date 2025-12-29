// One-time script to clear stale hero-title from localStorage
// Run this in browser console: localStorage.removeItem('hero-title'); location.reload();

console.log('Clearing stale hero-title from localStorage...');
localStorage.removeItem('hero-title');
console.log('Cleared! Reloading page...');
setTimeout(() => location.reload(), 500);
