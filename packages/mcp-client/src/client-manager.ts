import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import type { McpClientConfig } from './types'

/**
 * MCP 클라이언트 싱글턴 관리자
 * NestJS의 OnModuleInit / OnModuleDestroy 생명주기와 연동
 */
export class McpClientManager {
  private client: Client | null = null
  private transport: StdioClientTransport | null = null

  constructor(private readonly config: McpClientConfig) {}

  async connect(): Promise<void> {
    this.transport = new StdioClientTransport({
      command: 'uv',
      args: ['run', 'python', this.config.serverScriptPath],
      env: {
        DATA_GO_KR_API_KEY: this.config.apiKey,
        PATH: process.env['PATH'] ?? '',
      },
    })

    this.client = new Client(
      { name: 'jibscan-mcp-client', version: '0.0.1' },
      { capabilities: { tools: {} } },
    )

    await this.client.connect(this.transport)
  }

  async disconnect(): Promise<void> {
    await this.client?.close()
    this.client = null
    this.transport = null
  }

  getClient(): Client {
    if (!this.client) {
      throw new Error('MCP 클라이언트가 연결되지 않았습니다. connect()를 먼저 호출하세요.')
    }
    return this.client
  }

  isConnected(): boolean {
    return this.client !== null
  }
}
