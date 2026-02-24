import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'
import { ApartmentModule } from './modules/apartment/apartment.module'
import { AuthModule } from './modules/auth/auth.module'
import { ChatModule } from './modules/chat/chat.module'
import { McpModule } from './modules/mcp/mcp.module'
import { PrismaModule } from './prisma/prisma.module'
import { RedisModule } from './common/redis/redis.module'
import appConfig from './config/app.config'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      envFilePath: ['.env'],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,     // 1분
        limit: 100,     // 100 req/min/IP
      },
    ]),
    PrismaModule,
    RedisModule,
    McpModule,
    AuthModule,
    ApartmentModule,
    ChatModule,
  ],
})
export class AppModule {}
