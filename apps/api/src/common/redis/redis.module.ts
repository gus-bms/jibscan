import { Global, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { RedisService } from './redis.service'

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: async (configService: ConfigService) => {
        const { default: Redis } = await import('ioredis')
        return new Redis({
          host: configService.get<string>('app.redis.host') ?? 'localhost',
          port: configService.get<number>('app.redis.port') ?? 6379,
          lazyConnect: true,
        })
      },
      inject: [ConfigService],
    },
    RedisService,
  ],
  exports: ['REDIS_CLIENT', RedisService],
})
export class RedisModule {}
