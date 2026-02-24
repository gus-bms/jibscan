import { Test, type TestingModule } from '@nestjs/testing'
import { BadRequestException } from '@nestjs/common'
import { ApartmentService } from './apartment.service'
import type { RealEstateMcpClient } from '@jibscan/mcp-client'
import type { RedisService } from '../../common/redis/redis.service'

describe('ApartmentService', () => {
  let service: ApartmentService
  let mcpClient: jest.Mocked<RealEstateMcpClient>
  let redis: jest.Mocked<RedisService>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApartmentService,
        {
          provide: RealEstateMcpClient,
          useValue: {
            getApartmentTrades: jest.fn(),
            getApartmentRent: jest.fn(),
          },
        },
        {
          provide: RedisService,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<ApartmentService>(ApartmentService)
    mcpClient = module.get(RealEstateMcpClient)
    redis = module.get(RedisService)
  })

  describe('getTrades', () => {
    it('캐시 히트 시 캐시된 데이터 반환', async () => {
      const cached = [{ apartmentName: '테스트아파트', dealAmount: '100,000' }]
      redis.get.mockResolvedValue(cached)

      const result = await service.getTrades('11110', '202501')

      expect(result).toEqual(cached)
      expect(mcpClient.getApartmentTrades).not.toHaveBeenCalled()
    })

    it('캐시 미스 시 MCP API 호출 후 캐시 저장', async () => {
      const trades = [{ apartmentName: '강남아파트', dealAmount: '200,000' }]
      redis.get.mockResolvedValue(null)
      mcpClient.getApartmentTrades.mockResolvedValue({ success: true, data: trades })

      const result = await service.getTrades('11110', '202501')

      expect(result).toEqual(trades)
      expect(redis.set).toHaveBeenCalledWith('trades:11110:202501', trades, 3600)
    })

    it('MCP API 실패 시 BadRequestException 발생', async () => {
      redis.get.mockResolvedValue(null)
      mcpClient.getApartmentTrades.mockResolvedValue({ success: false, error: 'API 오류' })

      await expect(service.getTrades('11110', '202501')).rejects.toThrow(BadRequestException)
    })
  })
})
