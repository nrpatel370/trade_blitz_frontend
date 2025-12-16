import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Roster, CreateRosterRequest, RosterWithPositions, RosterSlotConfig } from '../models/roster.model';

@Injectable({
  providedIn: 'root'
})
export class RosterService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/rosters`;

  getRosters(): Observable<{ rosters: Roster[] }> {
    return this.http.get<{ rosters: Roster[] }>(this.apiUrl);
  }

  getRosterById(id: number): Observable<RosterWithPositions> {
    return this.http.get<RosterWithPositions>(`${this.apiUrl}/${id}`);
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

  getRosterStructure(): Observable<{ structure: RosterSlotConfig[] }> {
    return this.http.get<{ structure: RosterSlotConfig[] }>(`${this.apiUrl}/structure`);
  }

  addPlayerToSlot(rosterId: number, positionSlot: string, playerId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${rosterId}/add-player`, { positionSlot, playerId });
  }

  removePlayerFromSlot(rosterId: number, positionSlot: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${rosterId}/remove-player`, { positionSlot });
  }
}