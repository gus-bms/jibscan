import { Inject, Injectable } from '@nestjs/common'
import { createHash } from 'crypto'
import { RedisService } from '../../common/redis/redis.service'
import { AI_ANALYSIS_PORT, type IAiAnalysisPort } from './ports/ai-analysis.port'

const ANALYSIS_CACHE_TTL = 60 * 60 * 24 // 24시간

@Injectable()
export class ChatService {
  constructor(
    @Inject(AI_ANALYSIS_PORT) private readonly aiAdapter: IAiAnalysisPort,
    private readonly redis: RedisService,
  ) {}

  /** 캐시된 분석 결과 조회 후 없으면 AI 어댑터를 통해 스트리밍 */
  async *streamAnalysis(message: string): AsyncGenerator<string> {
    const cacheKey = `analysis:${createHash('sha256').update(message).digest('hex')}`
    const cached = await this.redis.get<string>(cacheKey)

    if (cached) {
      yield cached
      return
    }

    let fullResponse = ''

    for await (const text of this.aiAdapter.streamAnalysis(message)) {
      fullResponse += text
      yield text
    }

    if (fullResponse) {
      await this.redis.set(cacheKey, fullResponse, ANALYSIS_CACHE_TTL)
    }
  }
}
