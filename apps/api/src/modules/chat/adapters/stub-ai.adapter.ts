import { Injectable } from '@nestjs/common'
import type { IAiAnalysisPort } from '../ports/ai-analysis.port'

@Injectable()
export class StubAiAdapter implements IAiAnalysisPort {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async *streamAnalysis(_message: string): AsyncGenerator<string> {
    yield 'AI 분석 기능이 현재 비활성화되어 있습니다. ANTHROPIC_API_KEY를 설정하면 사용할 수 있습니다.'
  }
}
