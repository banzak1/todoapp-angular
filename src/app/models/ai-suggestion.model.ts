export interface AiSuggestRequest {
  title: string;
  description?: string;
}

export interface AiSuggestion {
  suggestedPriority: 'LOW' | 'MEDIUM' | 'HIGH';
  refinedDescription: string;
  suggestedSubtasks: string[];
}
