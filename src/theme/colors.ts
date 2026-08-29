export const Colors = {
  bg: '#090916',
  bg2: '#0f0f28',
  card: '#141430',
  card2: '#1a1a40',
  card3: '#0e0e22',

  gold: '#e8c86a',
  gold2: '#f5d98a',
  gold3: '#c9a84c',
  goldDim: 'rgba(232,200,106,0.13)',
  goldDim2: 'rgba(232,200,106,0.06)',

  text: '#ffffff',
  t2: '#8888bb',
  t3: '#44446a',
  t4: '#2a2a50',

  green: '#34d399',
  greenDim: 'rgba(52,211,153,0.13)',
  red: '#f87171',
  redDim: 'rgba(248,113,113,0.13)',
  blue: '#60a5fa',
  blueDim: 'rgba(96,165,250,0.13)',
  purple: '#a78bfa',
  purpleDim: 'rgba(167,139,250,0.13)',

  border: 'rgba(232,200,106,0.14)',
  border2: 'rgba(255,255,255,0.09)',
  border3: 'rgba(255,255,255,0.04)',

  transparent: 'transparent',
} as const;

export type ColorKey = keyof typeof Colors;
