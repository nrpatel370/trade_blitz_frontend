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
  errorMessage = '';
  successMessage = '';

  // Filters
  currentWeek = 10;
  currentSeason = 2025;
  scoringType: 'standard' | 'ppr' = 'standard';
  selectedPosition = 'ALL';

  positions = ['ALL', 'QB', 'RB', 'WR', 'TE', 'K', 'DEF'];

  ngOnInit(): void {
    this.loadRankings();
  }

  loadRankings(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.playerService.getPlayerRankings(this.currentWeek, this.currentSeason, this.scoringType)
      .subscribe({
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
    if (!confirm(`Sync rankings for week ${this.currentWeek}? This will fetch fresh data from the API.`)) {
      return;
    }

    this.isSyncing = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.playerService.syncRankings(this.currentWeek).subscribe({
      next: (response) => {
        this.successMessage = response.message || 'Rankings synced successfully!';
        this.isSyncing = false;
        // Reload rankings after sync
        setTimeout(() => {
          this.successMessage = '';
          this.loadRankings();
        }, 2000);
      },
      error: (err) => {
        console.error('Error syncing rankings:', err);
        this.errorMessage = 'Failed to sync rankings. Please try again.';
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
    if (this.selectedPosition === 'ALL') {
      this.filteredRankings = [...this.rankings];
    } else {
      this.filteredRankings = this.rankings.filter(
        r => r.position === this.selectedPosition
      );
    }
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
}