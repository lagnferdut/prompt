
export interface OptimizedSegment {
  segment: string;
  isChanged: boolean;
  reason: string;
}

export interface PromptHistoryItem {
  id: string;
  originalPrompt: string;
  optimizedPrompt: OptimizedSegment[];
}
