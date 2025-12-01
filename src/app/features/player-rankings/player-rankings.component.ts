import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlayerService } from '../../core/services/player.service';
import { PlayerRanking, RankingsResponse } from '../../core/models/player.model';

@Component({
  selector: 'app-player-rankings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './player-rankings.component.html',
  styleUrl: './player-rankings.component.css'
})
export class PlayerRankingsComponent implements OnInit {
  playerService = inject(PlayerService);

  rankings: PlayerRanking[] = [];
  filteredRankings: PlayerRanking[] = [];
  
  isLoading = false;
  isSyncing = false;
  isSyncingProjections = false;
  errorMessage = '';
  successMessage = '';

  // Filters
  currentWeek = 10;
  currentSeason = 2025;
  scoringType: 'standard' | 'ppr' = 'standard';
  selectedPosition = 'ALL';
  selectedTeam = 'ALL';         
  sortBy = 'points';              
  sortOrder: 'asc' | 'desc' = 'desc';  

  positions = ['ALL', 'QB', 'RB', 'WR', 'TE', 'K', 'DEF'];

  teams = [
    'ALL', 'ARI', 'ATL', 'BAL', 'BUF', 'CAR', 'CHI', 'CIN', 'CLE',
    'DAL', 'DEN', 'DET', 'GB', 'HOU', 'IND', 'JAX', 'KC', 'LAC',
    'LAR', 'LV', 'MIA', 'MIN', 'NE', 'NO', 'NYG', 'NYJ', 'PHI',
    'PIT', 'SEA', 'SF', 'TB', 'TEN', 'WAS'
  ];

  ngOnInit(): void {
    this.loadRankings();
  }

  loadRankings(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const teamFilter = this.selectedTeam === 'ALL' ? null : this.selectedTeam;

    this.playerService.getPlayerRankings(
      this.currentWeek, 
      this.currentSeason, 
      this.scoringType,
      this.sortBy,
      this.sortOrder,
      teamFilter
    ).subscribe({
      next: (response: RankingsResponse) => {
        console.log('Full API Response:', response);
        console.log('Rankings count:', response.rankings?.length);
        this.rankings = response.rankings || [];
        console.log('this.rankings:', this.rankings);
        this.applyPositionFilter();
        console.log('this.filteredRankings:', this.filteredRankings);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading rankings:', err);
        this.errorMessage = 'Failed to load rankings. Please try again.';
        this.isLoading = false;
      }
    });
  }

  syncRankings(): void {
    const isFuture = this.isFutureWeek();
    const syncType = isFuture ? 'future week projections' : 'game statistics';
    
    if (!confirm(`Sync ${syncType} for week ${this.currentWeek}? This will fetch fresh data from the API.`)) {
      return;
    }

    this.isSyncing = true;
    this.errorMessage = '';
    this.successMessage = '';

    const syncObservable = isFuture 
      ? this.playerService.syncFutureWeek(this.currentWeek)
      : this.playerService.syncRankings(this.currentWeek);

    syncObservable.subscribe({
      next: (response) => {
        this.successMessage = response.message || 'Data synced successfully!';
        this.isSyncing = false;
        setTimeout(() => {
          this.successMessage = '';
          this.loadRankings();
        }, 2000);
      },
      error: (err) => {
        console.error('Error syncing:', err);
        this.errorMessage = 'Failed to sync data. Please try again.';
        this.isSyncing = false;
      }
    });
  }

  onScoringTypeChange(): void {
    this.loadRankings();
  }

  onPositionChange(): void {
    this.applyPositionFilter();
  }

  onWeekChange(): void {
    this.loadRankings();
  }

  applyPositionFilter(): void {
     console.log('Applying position filter. Selected position:', this.selectedPosition);
    console.log('Rankings before filter:', this.rankings.length);
    if (this.selectedPosition === 'ALL') {
      this.filteredRankings = [...this.rankings];
    } else {
      this.filteredRankings = this.rankings.filter(
        r => r.position === this.selectedPosition
      );
    }
    console.log('Filtered rankings:', this.filteredRankings.length);
  }

  getFantasyPoints(ranking: PlayerRanking): number {
    const points = this.scoringType === 'ppr' ? ranking.fantasy_points_ppr : ranking.fantasy_points;
    return points || 0;
  }

  getPositionColor(position: string): string {
    const colors: { [key: string]: string } = {
      'QB': '#ef4444',
      'RB': '#3b82f6',
      'WR': '#10b981',
      'TE': '#f59e0b',
      'K': '#8b5cf6',
      'DEF': '#6b7280'
    };
    return colors[position] || '#6b7280';
  }

  syncProjections(): void {
    if (!confirm(`Sync projections for week ${this.currentWeek}? This will fetch fresh projection data from the API.`)) {
      return;
    }

    this.isSyncingProjections = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.playerService.syncProjections(this.currentWeek).subscribe({
      next: (response) => {
        this.successMessage = response.message || 'Projections synced successfully!';
        this.isSyncingProjections = false;
        setTimeout(() => {
          this.successMessage = '';
          this.loadRankings();
        }, 2000);
      },
      error: (err) => {
        console.error('Error syncing projections:', err);
        this.errorMessage = 'Failed to sync projections. Please try again.';
        this.isSyncingProjections = false;
      }
    });
  }

  onTeamChange(): void {
    this.loadRankings();
  }

  onSortChange(sortBy: string): void {
    if (this.sortBy === sortBy) {
      // Toggle sort order if clicking same column
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = sortBy;
      this.sortOrder = 'desc';
    }
    this.loadRankings();
  }

  getProjectedPoints(ranking: PlayerRanking): number {
    const points = this.scoringType === 'ppr' ? ranking.projected_points_ppr : ranking.projected_points;
    return points || 0;
  }

  getCurrentNFLWeek(): number {
    // You can make this dynamic or update it manually
    // For now, let's say we're currently in week 13
    return 13;
  }

  isFutureWeek(): boolean {
    return this.currentWeek > this.getCurrentNFLWeek();
  }
}