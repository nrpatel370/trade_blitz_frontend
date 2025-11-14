import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Roster, CreateRosterRequest } from '../models/roster.model';
import { Player } from '../models/player.model';

@Injectable({
  providedIn: 'root'
})
export class RosterService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/rosters`;

  getRosters(): Observable<{ rosters: Roster[] }> {
    return this.http.get<{ rosters: Roster[] }>(this.apiUrl);
  }

  getRosterById(id: number): Observable<{ roster: Roster }> {
    return this.http.get<{ roster: Roster }>(`${this.apiUrl}/${id}`);
  }

  createRoster(data: CreateRosterRequest): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  updateRoster(id: number, data: Partial<Roster>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteRoster(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getRosterPlayers(rosterId: number): Observable<{ players: Player[] }> {
    return this.http.get<{ players: Player[] }>(`${this.apiUrl}/${rosterId}/players`);
  }

  addPlayerToRoster(rosterId: number, playerId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${rosterId}/players`, { playerId });
  }

  removePlayerFromRoster(rosterId: number, playerId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${rosterId}/players/${playerId}`);
  }
}
