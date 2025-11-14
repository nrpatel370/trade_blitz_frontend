export interface Roster {
  roster_id?: number;
  rosterId?: number;
  roster_name?: string;
  rosterName?: string;
  league_format?: 'PPR' | 'Half-PPR' | 'Standard';
  leagueFormat?: 'PPR' | 'Half-PPR' | 'Standard';
  created_at?: Date;
  createdAt?: Date;
  updated_at?: Date;
  updatedAt?: Date;
}

export interface CreateRosterRequest {
  rosterName: string;
  leagueFormat?: 'PPR' | 'Half-PPR' | 'Standard';
}
