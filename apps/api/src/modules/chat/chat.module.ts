import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ChatController } from './chat.controller'
import { ChatService } from './chat.service'
import { AI_ANALYSIS_PORT } from './ports/ai-analysis.port'
import { ClaudeAiAdapter } from './adapters/claude-ai.adapter'
import { StubAiAdapter } from './adapters/stub-ai.adapter'

@Module({
  imports: [ConfigModule],
  controllers: [ChatController],
  providers: [
    {
      provide: AI_ANALYSIS_PORT,
      useFactory: (config: ConfigService) => {
        const apiKey = config.get<string>('app.anthropic.apiKey')
        return apiKey ? new ClaudeAiAdapter(config) : new StubAiAdapter()
      },
      inject: [ConfigService],
    },
    ChatService,
  ],
})
export class ChatModule {}
