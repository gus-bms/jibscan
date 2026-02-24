export const AI_ANALYSIS_PORT = Symbol('IAiAnalysisPort')

export interface IAiAnalysisPort {
  streamAnalysis(message: string): AsyncGenerator<string>
}
