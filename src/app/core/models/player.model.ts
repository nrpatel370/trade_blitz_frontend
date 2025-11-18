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

export interface PlayerRanking {
  ranking_id: number;
  player_name: string;
  position: string;
  team_name: string;
  opponent: string;
  fantasy_points: number;
  fantasy_points_ppr: number;
  is_game_over: boolean;
  age: number | null;
  rank: number;
}

export interface RankingsResponse {
  week: number;
  season: number;
  scoringType: string;
  count: number;
  rankings: PlayerRanking[];
}