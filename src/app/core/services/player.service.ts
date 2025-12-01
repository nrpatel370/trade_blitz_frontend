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

  getPlayerRankings(
    week: number = 10, 
    season: number = 2025, 
    scoringType: string = 'standard',
    sortBy: string = 'points',
    sortOrder: string = 'desc',
    team: string | null = null
  ): Observable<any> {
    let params = new HttpParams()
      .set('week', week.toString())
      .set('season', season.toString())
      .set('scoringType', scoringType)
      .set('sortBy', sortBy)
      .set('sortOrder', sortOrder);
    
    if (team) {
      params = params.set('team', team);
    }
    
    return this.http.get(`${environment.apiUrl}/rankings`, { params });
  }

  // Sync rankings from API
  syncRankings(week: number, seasonType: string = 'REG'): Observable<any> {
    return this.http.post(`${environment.apiUrl}/rankings/sync`, { week, seasonType });
  }

  // Sync projections from API
  syncProjections(week: number, seasonType: string = 'REG'): Observable<any> {
    return this.http.post(`${environment.apiUrl}/rankings/sync-future-week`, { week, seasonType });
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

  // Sync future week projections
  syncFutureWeek(week: number, seasonType: string = 'REG'): Observable<any> {
    return this.http.post(`${environment.apiUrl}/rankings/sync-future-week`, { week, seasonType });
  }
}