module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: [
            '.ios.ts',
            '.android.ts',
            '.ts',
            '.ios.tsx',
            '.android.tsx',
            '.tsx',
            '.jsx',
            '.js',
            '.json',
          ],
          alias: {
            '@api': './src/api',
            '@assets': './src/assets',
            '@components': './src/components',
            '@i18n': './src/i18n',
            '@navigations': './src/navigations',
            '@src': './src',
            '@store': './src/store',
            '@styles': './src/styles',
            '@utils': './src/utils',
            '@views': './src/views',
          },
        },
      ],
    ],
  };
};
