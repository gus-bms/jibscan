import type { ApartmentTrade, ApartmentRent } from '@jibscan/types'
import type { IRealEstateDataPort } from '../ports/real-estate-data.port'
import type { McpToolResult } from '../types'
import type { RealEstateMcpClient } from '../real-estate.client'

/**
 * MCP 기반 부동산 데이터 어댑터
 * IRealEstateDataPort를 구현하며, 내부적으로 real-estate-mcp 툴을 호출합니다.
 * 추후 HTTP 직접 호출 어댑터(HttpRealEstateAdapter)로 교체 가능합니다.
 */
export class McpRealEstateAdapter implements IRealEstateDataPort {
  constructor(private readonly client: RealEstateMcpClient) {}

  getApartmentTrades(
    regionCode: string,
    yearMonth: string,
  ): Promise<McpToolResult<ApartmentTrade[]>> {
    return this.client.getApartmentTrades(regionCode, yearMonth)
  }

  getApartmentRent(
    regionCode: string,
    yearMonth: string,
  ): Promise<McpToolResult<ApartmentRent[]>> {
    return this.client.getApartmentRent(regionCode, yearMonth)
  }

  getAuctions(regionCode: string, yearMonth: string): Promise<McpToolResult<unknown[]>> {
    return this.client.getAuctions(regionCode, yearMonth)
  }

  getSubscriptions(yearMonth: string): Promise<McpToolResult<unknown[]>> {
    return this.client.getSubscriptions(yearMonth)
  }
}
