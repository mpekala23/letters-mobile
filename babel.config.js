module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    'inline-dotenv',
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
          types: './src/types',
          '@api': './src/api',
          '@assets': './src/assets',
          '@components': './src/components',
          '@i18n': './src/i18n',
          '@navigations': './src/navigations',
          '@notifications': './src/notifications',
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
