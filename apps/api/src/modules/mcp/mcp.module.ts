import { Global, Module, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  McpClientManager,
  McpRealEstateAdapter,
  RealEstateMcpClient,
  REAL_ESTATE_DATA_PORT,
} from '@jibscan/mcp-client'

@Global()
@Module({
  providers: [
    {
      provide: McpClientManager,
      useFactory: (configService: ConfigService) => {
        return new McpClientManager({
          serverScriptPath: configService.get<string>('app.mcp.serverScriptPath') ?? '',
          apiKey: configService.get<string>('app.molit.apiKey') ?? '',
        })
      },
      inject: [ConfigService],
    },
    {
      provide: RealEstateMcpClient,
      useFactory: (manager: McpClientManager) => new RealEstateMcpClient(manager),
      inject: [McpClientManager],
    },
    {
      provide: REAL_ESTATE_DATA_PORT,
      useFactory: (client: RealEstateMcpClient) => new McpRealEstateAdapter(client),
      inject: [RealEstateMcpClient],
    },
  ],
  exports: [McpClientManager, RealEstateMcpClient, REAL_ESTATE_DATA_PORT],
})
export class McpModule implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly mcpManager: McpClientManager) {}

  async onModuleInit() {
    await this.mcpManager.connect()
    console.warn('✅ MCP 클라이언트 연결 완료')
  }

  async onModuleDestroy() {
    await this.mcpManager.disconnect()
  }
}
