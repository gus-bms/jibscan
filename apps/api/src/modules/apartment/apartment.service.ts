import { Injectable, BadRequestException } from '@nestjs/common'
import { RealEstateMcpClient } from '@jibscan/mcp-client'
import type { ApartmentTrade, ApartmentRent } from '@jibscan/types'
import { RedisService } from '../../common/redis/redis.service'

const CACHE_TTL_SECONDS = 60 * 60 // 1시간

@Injectable()
export class ApartmentService {
  constructor(
    private readonly mcpClient: RealEstateMcpClient,
    private readonly redis: RedisService,
  ) {}

  async getTrades(regionCode: string, yearMonth: string): Promise<ApartmentTrade[]> {
    const cacheKey = `trades:${regionCode}:${yearMonth}`
    const cached = await this.redis.get<ApartmentTrade[]>(cacheKey)
    if (cached) return cached

    const result = await this.mcpClient.getApartmentTrades(regionCode, yearMonth)
    if (!result.success || !result.data) {
      throw new BadRequestException(result.error ?? '실거래가 조회에 실패했습니다.')
    }

    await this.redis.set(cacheKey, result.data, CACHE_TTL_SECONDS)
    return result.data
  }

  async getRent(regionCode: string, yearMonth: string): Promise<ApartmentRent[]> {
    const cacheKey = `rent:${regionCode}:${yearMonth}`
    const cached = await this.redis.get<ApartmentRent[]>(cacheKey)
    if (cached) return cached

    const result = await this.mcpClient.getApartmentRent(regionCode, yearMonth)
    if (!result.success || !result.data) {
      throw new BadRequestException(result.error ?? '전월세 조회에 실패했습니다.')
    }

    await this.redis.set(cacheKey, result.data, CACHE_TTL_SECONDS)
    return result.data
  }
}
