import { registerAs } from '@nestjs/config'

export default registerAs('app', () => ({
  port: parseInt(process.env['API_PORT'] ?? '3001', 10),
  nodeEnv: process.env['NODE_ENV'] ?? 'development',
  database: {
    url: process.env['DATABASE_URL'],
  },
  redis: {
    host: process.env['REDIS_HOST'] ?? 'localhost',
    port: parseInt(process.env['REDIS_PORT'] ?? '6379', 10),
  },
  jwt: {
    secret: process.env['JWT_SECRET'] ?? 'change-me',
    refreshSecret: process.env['JWT_REFRESH_SECRET'] ?? 'change-me-refresh',
    accessTokenTtl: '15m',
    refreshTokenTtl: '7d',
  },
  anthropic: {
    apiKey: process.env['ANTHROPIC_API_KEY'],
  },
  molit: {
    apiKey: process.env['DATA_GO_KR_API_KEY'],
  },
  mcp: {
    serverScriptPath:
      process.env['MCP_SERVER_SCRIPT_PATH'] ??
      '../../../mcp-server/real-estate-mcp/src/real_estate/mcp_server/server.py',
  },
}))
