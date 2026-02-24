import type { ApartmentTrade, ApartmentRent } from '@jibscan/types'
import type { McpToolResult } from '../types'

export const REAL_ESTATE_DATA_PORT = Symbol('IRealEstateDataPort')

export interface IRealEstateDataPort {
  getApartmentTrades(regionCode: string, yearMonth: string): Promise<McpToolResult<ApartmentTrade[]>>
  getApartmentRent(regionCode: string, yearMonth: string): Promise<McpToolResult<ApartmentRent[]>>
  getAuctions(regionCode: string, yearMonth: string): Promise<McpToolResult<unknown[]>>
  getSubscriptions(yearMonth: string): Promise<McpToolResult<unknown[]>>
}
