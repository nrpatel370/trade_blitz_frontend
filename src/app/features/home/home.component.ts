// ===== src/app/features/home/home.component.ts =====
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PlayerService } from '../../core/services/player.service';
import { FeedbackService } from '../../core/services/feedback.service';
import { Player } from '../../core/models/player.model';
import { FeedbackRequest } from '../../core/models/feedback.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  playerService = inject(PlayerService);
  feedbackService = inject(FeedbackService);
  
  bestPerformers: Player[] = [];
  worstPerformers: Player[] = [];
  isLoadingBest = false;
  isLoadingWorst = false;

  // Feedback form
  feedbackData: FeedbackRequest = {
    subject: '',
    message: '',
    category: 'general',
    rating: 0
  };
  isSubmittingFeedback = false;
  feedbackSubmitted = false;
  feedbackError = '';
  hoveredRating = 0;

  ngOnInit(): void {
    this.loadPerformers();
  }

  loadPerformers(): void {
    const currentWeek = 15; // Last completed week
    const currentSeason = 2025;

    // R-0004: Load top 5 performers from last week
    this.isLoadingBest = true;
    this.playerService.getPlayerRankings(currentWeek, currentSeason, 'standard', 'points', 'desc', null).subscribe({
      next: (response) => {
        this.bestPerformers = (response.rankings || []).slice(0, 5);
        this.isLoadingBest = false;
      },
      error: (err) => {
        console.error('Error loading best performers:', err);
        this.isLoadingBest = false;
      }
    });

    // R-0005: Load buy low candidates (players who underperformed last week but have good projections)
    this.isLoadingWorst = true;
    this.playerService.getPlayerRankings(currentWeek, currentSeason, 'standard', 'points', 'asc', null).subscribe({
      next: (response) => {
        // Get players with lowest points last week
        const underperformers = (response.rankings || []).slice(0, 20);
        
        // Filter for players who have good projected points (likely to bounce back)
        const buyLowCandidates = underperformers.filter((player: { projected_points: number; fantasy_points: number; }) => {
          const projectedPoints = player.projected_points || 0;
          const actualPoints = player.fantasy_points || 0;
          // Players who scored low but are projected higher (bounce-back candidates)
          return projectedPoints > actualPoints && projectedPoints > 8;
        }).slice(0, 5);
        
        this.worstPerformers = buyLowCandidates.length > 0 ? buyLowCandidates : underperformers.slice(0, 5);
        this.isLoadingWorst = false;
      },
      error: (err) => {
        console.error('Error loading buy low candidates:', err);
        this.isLoadingWorst = false;
      }
    });
  }

  getPlayerName(player: any): string {
    return player.player_name || player.playerName || 'Unknown Player';
  }

  getTeamName(player: any): string {
    return player.team_name || player.teamName || '';
  }

  getActualPoints(player: any): number {
    return player.fantasy_points || player.actualPoints || player.actual_points || 0;
  }

  getProjectedPoints(player: any): number {
    return player.projected_points || player.projectedPoints || 0;
  }

  getPosition(player: any): string {
    return player.position || '';
  }

  // Feedback methods
  setRating(rating: number): void {
    this.feedbackData.rating = rating;
  }

  submitFeedback(): void {
    if (!this.feedbackData.subject || !this.feedbackData.message || this.feedbackData.rating === 0) {
      this.feedbackError = 'Please fill in all fields and select a rating.';
      return;
    }

    this.isSubmittingFeedback = true;
    this.feedbackError = '';

    this.feedbackService.submitFeedback(this.feedbackData).subscribe({
      next: (response) => {
        this.feedbackSubmitted = true;
        this.isSubmittingFeedback = false;
        // Reset form after 3 seconds
        setTimeout(() => {
          this.resetFeedbackForm();
        }, 3000);
      },
      error: (err) => {
        console.error('Error submitting feedback:', err);
        this.feedbackError = 'Failed to submit feedback. Please try again.';
        this.isSubmittingFeedback = false;
      }
    });
  }

  resetFeedbackForm(): void {
    this.feedbackData = {
      subject: '',
      message: '',
      category: 'general',
      rating: 0
    };
    this.feedbackSubmitted = false;
    this.feedbackError = '';
    this.hoveredRating = 0;
  }
}
