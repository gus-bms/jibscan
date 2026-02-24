import { IsString, Length, Matches } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class QueryApartmentDto {
  @ApiProperty({
    description: '시군구코드 (법정동코드 앞 5자리)',
    example: '11110',
  })
  @IsString()
  @Length(5, 5)
  @Matches(/^\d{5}$/)
  regionCode!: string

  @ApiProperty({
    description: '거래 연월 (YYYYMM)',
    example: '202501',
  })
  @IsString()
  @Matches(/^\d{6}$/)
  yearMonth!: string
}
