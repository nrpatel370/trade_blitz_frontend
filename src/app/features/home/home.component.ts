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
