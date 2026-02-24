export interface McpClientConfig {
  /** real-estate-mcp Python 서버 경로 */
  serverScriptPath: string
  /** 공공데이터포털 API 키 */
  apiKey: string
  /** 연결 타임아웃 (ms) */
  connectTimeoutMs?: number
}

export interface McpToolResult<T = unknown> {
  success: boolean
  data?: T
  error?: string
}
