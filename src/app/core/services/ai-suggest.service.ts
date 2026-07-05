import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AiSuggestRequest, AiSuggestion } from '../../models/ai-suggestion.model';

@Injectable({ providedIn: 'root' })
export class AiSuggestService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/tasks/ai/suggest`;

  suggest(data: AiSuggestRequest): Observable<AiSuggestion> {
    return this.http.post<AiSuggestion>(this.baseUrl, data);
  }
}
