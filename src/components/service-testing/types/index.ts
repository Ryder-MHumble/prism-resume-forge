export interface ExtractedFile {
  file: File;
  extractedText: string;
  status: 'extracting' | 'success' | 'error';
  error?: string;
}

export type ServiceHealthStatus = 'unknown' | 'healthy' | 'error';
export type EvaluationMode = 'gentle' | 'mean';

export interface ServiceTestingState {
  activeServiceType: 'llm' | 'custom' | 'pdf' | 'crucible';
  evaluationMode: EvaluationMode;
  llmServiceHealth: ServiceHealthStatus;
  activeRequestsCount: number;
  customPrompt: string;
  customContent: string;
  expandedResultId: string | null;
  copiedText: string | null;
  expandedSections: {[key: string]: Set<string>};
}
