import type { ApartmentTrade, ApartmentRent } from '@jibscan/types'
import type { McpClientManager } from './client-manager'
import type { McpToolResult } from './types'

/**
 * real-estate-mcp 툴 호출 클라이언트
 * 규칙: 공공 API 데이터는 반드시 이 클라이언트를 통해서만 접근
 */
export class RealEstateMcpClient {
  constructor(private readonly manager: McpClientManager) {}

  /** 공통 툴 호출 래퍼 */
  private async callTool<T>(
    toolName: string,
    args: Record<string, unknown>,
  ): Promise<McpToolResult<T>> {
    try {
      const client = this.manager.getClient()
      const result = await client.callTool({ name: toolName, arguments: args })

      if (result.isError) {
        return { success: false, error: String(result.content) }
      }

      // MCP 툴 결과는 content 배열로 반환됨
      const content = result.content[0]
      if (content?.type !== 'text') {
        return { success: false, error: '예상치 못한 MCP 응답 형식' }
      }

      const data = JSON.parse(content.text) as T
      return { success: true, data }
    } catch (error) {
      const message = error instanceof Error ? error.message : '알 수 없는 오류'
      return { success: false, error: message }
    }
  }

  /**
   * 아파트 매매 실거래가 조회
   * @param regionCode 법정동코드 앞 5자리 (시군구코드)
   * @param yearMonth YYYYMM 형식
   */
  async getApartmentTrades(
    regionCode: string,
    yearMonth: string,
  ): Promise<McpToolResult<ApartmentTrade[]>> {
    return this.callTool<ApartmentTrade[]>('get_apartment_trades', { regionCode, yearMonth })
  }

  /**
   * 아파트 전월세 조회
   * @param regionCode 법정동코드 앞 5자리
   * @param yearMonth YYYYMM 형식
   */
  async getApartmentRent(
    regionCode: string,
    yearMonth: string,
  ): Promise<McpToolResult<ApartmentRent[]>> {
    return this.callTool<ApartmentRent[]>('get_apartment_rent', { regionCode, yearMonth })
  }

  /**
   * 공매 데이터 조회
   */
  async getAuctions(
    regionCode: string,
    yearMonth: string,
  ): Promise<McpToolResult<unknown[]>> {
    return this.callTool<unknown[]>('get_auctions', { regionCode, yearMonth })
  }

  /**
   * 청약 정보 조회
   */
  async getSubscriptions(yearMonth: string): Promise<McpToolResult<unknown[]>> {
    return this.callTool<unknown[]>('get_subscriptions', { yearMonth })
  }
}
