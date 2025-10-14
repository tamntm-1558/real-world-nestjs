export default () => ({
  port: process.env.PORT || 3000,
  apiVersion: process.env.API_VERSION || '1',
  nodeEnv: process.env.NODE_ENV || 'development',
  prefixApi : 'api'
});
