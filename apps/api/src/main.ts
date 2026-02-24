import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // 전역 ValidationPipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  // CORS — 허용 도메인 명시적 설정 (와일드카드 금지)
  app.enableCors({
    origin: [
      process.env['NEXT_PUBLIC_WEB_URL'] ?? 'http://localhost:3000',
    ],
    credentials: true,
  })

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Jibscan API')
    .setDescription('한국 부동산 AI 분석 플랫폼 API')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs', app, document)

  const port = process.env['API_PORT'] ?? 3001
  await app.listen(port)
  console.warn(`🏠 Jibscan API 서버가 포트 ${port}에서 실행 중입니다.`)
  console.warn(`📚 Swagger 문서: http://localhost:${port}/api/docs`)
}

void bootstrap()
