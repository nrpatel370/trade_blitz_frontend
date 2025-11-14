// ===== src/app/features/home/home.component.ts =====
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PlayerService } from '../../core/services/player.service';
import { Player } from '../../core/models/player.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  playerService = inject(PlayerService);
  
  bestPerformers: Player[] = [];
  worstPerformers: Player[] = [];
  isLoadingBest = false;
  isLoadingWorst = false;

  ngOnInit(): void {
    this.loadPerformers();
  }

  loadPerformers(): void {
    // R-0004: Load best performers
    this.isLoadingBest = true;
    this.playerService.getBestPerformers(10).subscribe({
      next: (response) => {
        this.bestPerformers = response.bestPerformers || [];
        this.isLoadingBest = false;
      },
      error: (err) => {
        console.error('Error loading best performers:', err);
        this.isLoadingBest = false;
      }
    });

    // R-0005: Load worst performers
    this.isLoadingWorst = true;
    this.playerService.getWorstPerformers(10).subscribe({
      next: (response) => {
        this.worstPerformers = response.worstPerformers || [];
        this.isLoadingWorst = false;
      },
      error: (err) => {
        console.error('Error loading worst performers:', err);
        this.isLoadingWorst = false;
      }
    });
  }

  getPlayerName(player: Player): string {
    return player.playerName || player.player_name || 'Unknown Player';
  }

  getTeamName(player: Player): string {
    return player.teamName || player.team_name || '';
  }

  getActualPoints(player: Player): number {
    return player.actualPoints || player.actual_points || 0;
  }
}
