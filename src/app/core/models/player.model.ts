export interface Player {
  player_id?: number;
  playerId?: number;
  player_name?: string;
  playerName?: string;
  team_name?: string;
  teamName?: string;
  position: 'QB' | 'RB' | 'WR' | 'TE' | 'K' | 'DEF';
  rank_position?: number;
  rankPosition?: number;
  projected_points?: number;
  projectedPoints?: number;
  actual_points?: number;
  actualPoints?: number;
  added_at?: Date;
  addedAt?: Date;
}