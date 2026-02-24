import {
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common'
import type { Response } from 'express'
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ThrottlerGuard } from '@nestjs/throttler'
import { IsString, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { ChatService } from './chat.service'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'

class ChatRequestDto {
  @ApiProperty({ description: '사용자 메시지', example: '강남구 아파트 최근 시세 알려줘' })
  @IsString()
  @MinLength(1)
  message!: string
}

@ApiTags('chat')
@ApiBearerAuth()
@UseGuards(ThrottlerGuard, JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('stream')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'AI 챗봇 SSE 스트리밍 응답' })
  @ApiResponse({ status: 200, description: 'text/event-stream 형식으로 스트리밍' })
  async stream(@Body() dto: ChatRequestDto, @Res() res: Response) {
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.flushHeaders()

    try {
      for await (const text of this.chatService.streamAnalysis(dto.message)) {
        res.write(`data: ${JSON.stringify({ type: 'delta', text })}\n\n`)
      }
      res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`)
    } catch (error) {
      const message = error instanceof Error ? error.message : '분석 중 오류가 발생했습니다.'
      res.write(`data: ${JSON.stringify({ type: 'error', message })}\n\n`)
    } finally {
      res.end()
    }
  }
}
