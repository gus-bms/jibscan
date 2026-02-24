import { Injectable } from '@nestjs/common'
import Anthropic from '@anthropic-ai/sdk'
import { ConfigService } from '@nestjs/config'
import { createHash } from 'crypto'
import { RedisService } from '../../common/redis/redis.service'

const ANALYSIS_CACHE_TTL = 60 * 60 * 24 // 24시간

const JIBSCAN_SYSTEM_PROMPT = `당신은 한국 부동산 전문 AI 어시스턴트 '집스캔'입니다.
국토교통부 실거래가 데이터를 기반으로 정확하고 유용한 부동산 정보를 제공합니다.

원칙:
- 데이터에 근거한 객관적인 정보를 제공합니다.
- 투자 수익을 보장하는 발언은 절대 하지 않습니다.
- 복잡한 부동산 용어는 쉽게 설명합니다.
- 법적·세무 조언이 필요한 경우 전문가 상담을 권장합니다.
- 답변은 한국어로 작성합니다.`

@Injectable()
export class ChatService {
  private readonly anthropic: Anthropic

  constructor(
    private readonly config: ConfigService,
    private readonly redis: RedisService,
  ) {
    this.anthropic = new Anthropic({
      apiKey: config.get<string>('app.anthropic.apiKey'),
    })
  }

  /** 캐시된 분석 결과 조회 후 없으면 Claude API 호출 (SSE 스트리밍) */
  async *streamAnalysis(message: string): AsyncGenerator<string> {
    const cacheKey = `analysis:${createHash('sha256').update(message).digest('hex')}`
    const cached = await this.redis.get<string>(cacheKey)

    if (cached) {
      yield cached
      return
    }

    let fullResponse = ''

    const stream = this.anthropic.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      system: JIBSCAN_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: message }],
    })

    for await (const chunk of stream) {
      if (
        chunk.type === 'content_block_delta' &&
        chunk.delta.type === 'text_delta'
      ) {
        fullResponse += chunk.delta.text
        yield chunk.delta.text
      }
    }

    // 분석 결과 캐싱
    if (fullResponse) {
      await this.redis.set(cacheKey, fullResponse, ANALYSIS_CACHE_TTL)
    }
  }
}
