import Arena from './Arena.js';

const arena: Arena = new Arena(document.getElementById('game') as HTMLCanvasElement);

window.addEventListener('load', () => {
  arena.start();
});
