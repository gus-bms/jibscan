import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import * as bcrypt from 'bcrypt'
import type { JwtPayload, AuthTokens } from '@jibscan/types'
import { PrismaService } from '../../prisma/prisma.service'
import type { LoginDto } from './dto/login.dto'
import type { SignupDto } from './dto/signup.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async signup(dto: SignupDto): Promise<AuthTokens> {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } })
    if (existing) throw new ConflictException('이미 사용 중인 이메일입니다.')

    const hashed = await bcrypt.hash(dto.password, 10)
    const user = await this.prisma.user.create({
      data: { email: dto.email, password: hashed, name: dto.name },
    })

    return this.generateTokens(user.id, user.email)
  }

  async login(dto: LoginDto): Promise<AuthTokens> {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } })
    if (!user) throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.')

    const isValid = await bcrypt.compare(dto.password, user.password)
    if (!isValid) throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.')

    return this.generateTokens(user.id, user.email)
  }

  private generateTokens(userId: string, email: string): AuthTokens {
    const payload: JwtPayload = { sub: userId, email }
    const accessToken = this.jwtService.sign(payload)
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.config.get<string>('app.jwt.refreshSecret'),
      expiresIn: this.config.get<string>('app.jwt.refreshTokenTtl'),
    })
    return { accessToken, refreshToken }
  }
}
