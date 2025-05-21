// tailwind.config.js
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  safelist: [
    'bg-blue-400',
    'bg-orange-500',
    'bg-lime-900',
    'bg-cyan-500',
    'bg-green-200',
    'bg-zinc-400',
    'bg-yellow-500',
    'bg-yellow-700',
    'bg-zinc-900',
    'bg-blue-700',
    'bg-gray-300',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
