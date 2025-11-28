export const LOVE = 'girlfriend';

export const STATIC_ROUTES = [
  'about',
  'contact',
  // ... other static routes
];

export const DYNAMIC_ROUTES = {
  iloveyou: [LOVE]
};

export const VALID_ROUTES = [
  ...STATIC_ROUTES,
  'iloveyou',
];

export const EASTER_EGG_ROUTES = [
  '/play',
  '/test',
  '/iloveyou',
  '/b',
]