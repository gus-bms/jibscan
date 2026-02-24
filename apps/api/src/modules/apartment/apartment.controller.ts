import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ThrottlerGuard } from '@nestjs/throttler'
import { ApartmentService } from './apartment.service'
import { QueryApartmentDto } from './dto/query-apartment.dto'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'

@ApiTags('apartment')
@ApiBearerAuth()
@UseGuards(ThrottlerGuard, JwtAuthGuard)
@Controller('apartment')
export class ApartmentController {
  constructor(private readonly apartmentService: ApartmentService) {}

  @Get('trades')
  @ApiOperation({ summary: '아파트 매매 실거래가 조회' })
  @ApiResponse({ status: 200, description: '실거래가 목록 반환' })
  @ApiResponse({ status: 400, description: '잘못된 요청 또는 API 오류' })
  getTrades(@Query() query: QueryApartmentDto) {
    return this.apartmentService.getTrades(query.regionCode, query.yearMonth)
  }

  @Get('rent')
  @ApiOperation({ summary: '아파트 전월세 조회' })
  @ApiResponse({ status: 200, description: '전월세 목록 반환' })
  @ApiResponse({ status: 400, description: '잘못된 요청 또는 API 오류' })
  getRent(@Query() query: QueryApartmentDto) {
    return this.apartmentService.getRent(query.regionCode, query.yearMonth)
  }
}
