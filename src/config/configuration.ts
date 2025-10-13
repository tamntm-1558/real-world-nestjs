export default () => ({
  port: process.env.PORT || 3000,
  apiVersion: process.env.API_VERSION || 'v1',
  nodeEnv: process.env.NODE_ENV || 'development',
});
