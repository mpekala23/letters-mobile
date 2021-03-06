/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default ({ config }) => {
  return {
    ...config,
    hooks: {
      postPublish: [
        {
          file: 'sentry-expo/upload-sourcemaps',
          config: {
            organization: process.env.SENTRY_ORGANIZATION,
            project: process.env.SENTRY_PROJECT,
            authToken: process.env.SENTRY_AUTH_TOKEN,
            setCommits: true,
            release: process.env.APP_VERSION,
          },
        },
      ],
    },
  };
};
