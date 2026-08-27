module.exports = {
  extends: ['expo', 'prettier'],
  plugins: ['prettier'],
  ignorePatterns: ['expo-env.d.ts', '.expo/**', 'node_modules/**'],
  rules: {
    'prettier/prettier': 'warn',
  },
};
