import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Player } from '../models/player.model';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/players`;

  getPlayerRankings(filters?: {
    rankingType?: string;
    week?: number;
    season?: number;
    format?: string;
    position?: string;
  }): Observable<any> {
    let params = new HttpParams();
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = (filters as any)[key];
        if (value !== undefined && value !== null) {
          params = params.set(key, value.toString());
        }
      });
    }
    
    return this.http.get(`${this.apiUrl}/rankings`, { params });
  }

  searchPlayers(query: string, position?: string): Observable<{ players: Player[] }> {
    let params = new HttpParams().set('query', query);
    if (position) {
      params = params.set('position', position);
    }
    return this.http.get<{ players: Player[] }>(`${this.apiUrl}/search`, { params });
  }

  getBestPerformers(limit: number = 10, week?: number): Observable<any> {
    let params = new HttpParams().set('limit', limit.toString());
    if (week) {
      params = params.set('week', week.toString());
    }
    return this.http.get(`${this.apiUrl}/best-performers`, { params });
  }

  getWorstPerformers(limit: number = 10, week?: number): Observable<any> {
    let params = new HttpParams().set('limit', limit.toString());
    if (week) {
      params = params.set('week', week.toString());
    }
    return this.http.get(`${this.apiUrl}/worst-performers`, { params });
  }
}