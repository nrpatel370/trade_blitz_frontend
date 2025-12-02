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

export interface RosterPosition {
  roster_position_id: number;
  position_slot: string;
  player_id: number | null;
  player_name: string | null;
  team_name: string | null;
  position: string | null;
  age: number | null;
}

export interface RosterWithPositions {
  roster: Roster;
  positions: RosterPosition[];
}

export interface RosterSlotConfig {
  slot: string;
  position: string;
  label: string;
}