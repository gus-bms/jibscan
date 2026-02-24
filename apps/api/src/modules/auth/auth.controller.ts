import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { SignupDto } from './dto/signup.dto'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: '회원가입' })
  @ApiResponse({ status: 201, description: '회원가입 성공, JWT 토큰 반환' })
  @ApiResponse({ status: 409, description: '이미 존재하는 이메일' })
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto)
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '로그인' })
  @ApiResponse({ status: 200, description: '로그인 성공, JWT 토큰 반환' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto)
  }
}
