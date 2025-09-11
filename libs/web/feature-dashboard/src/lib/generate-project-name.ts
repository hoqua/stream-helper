const adjectives = ['neon', 'crimson', 'silver', 'quantum', 'bright', 'dark', 'fuzzy', 'rapid'];
const nouns = ['lion', 'tiger', 'sparrow', 'ocean', 'mountain', 'echo', 'falcon', 'river'];

export function generateProjectName() {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adj}-${noun}`;
}
