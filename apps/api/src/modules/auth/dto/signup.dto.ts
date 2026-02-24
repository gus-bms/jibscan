import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class SignupDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email!: string

  @ApiProperty({ example: 'password123', minLength: 8 })
  @IsString()
  @MinLength(8)
  password!: string

  @ApiPropertyOptional({ example: '홍길동' })
  @IsString()
  @MaxLength(50)
  @IsOptional()
  name?: string
}
