import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RosterService } from '../../core/services/roster.service';
import { PlayerService } from '../../core/services/player.service';
import { Roster, RosterWithPositions } from '../../core/models/roster.model';
import { Player } from '../../core/models/player.model';

interface TradePlayer {
  player: Player;
  slot?: string;
}

@Component({
  selector: 'app-trade-analyzer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trade-analyzer.component.html',
  styleUrl: './trade-analyzer.component.css'
})
export class TradeAnalyzerComponent implements OnInit {
  rosterService = inject(RosterService);
  playerService = inject(PlayerService);

  // R-0026, R-0028: User's rosters
  rosters: Roster[] = [];
  selectedRoster: Roster | null = null;
  rosterDetails: RosterWithPositions | null = null;

  // R-0029: Trade boxes
  playersGivingAway: TradePlayer[] = [];
  playersReceiving: TradePlayer[] = [];

  // R-0030: Player search
  isSearchingGiving = false;
  isSearchingReceiving = false;
  searchQueryGiving = '';
  searchQueryReceiving = '';
  searchResultsGiving: Player[] = [];
  searchResultsReceiving: Player[] = [];

  // Trade evaluation
  tradeEvaluated = false;
  tradeGrade = '';
  tradeAnalysis = '';
  isEvaluating = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadRosters();
  }

  // Load user's rosters
  loadRosters(): void {
    this.rosterService.getRosters().subscribe({
      next: (response) => {
        this.rosters = response.rosters || [];
        // Auto-select first roster if available
        if (this.rosters.length > 0) {
          this.selectRoster(this.rosters[0]);
        }
      },
      error: (err: any) => console.error('Error loading rosters:', err)
    });
  }

  // R-0028: Select roster for trade analysis
  selectRoster(roster: Roster): void {
    this.selectedRoster = roster;
    const rosterId = roster.roster_id || roster.rosterId;
    
    if (rosterId) {
      this.rosterService.getRosterById(rosterId).subscribe({
        next: (response: RosterWithPositions) => {
          this.rosterDetails = response;
        },
        error: (err: any) => console.error('Error loading roster details:', err)
      });
    }
  }

  getRosterName(roster: Roster): string {
    return roster.rosterName || roster.roster_name || 'Unnamed Roster';
  }

  // R-0030: Search players for giving away
  searchPlayersGiving(): void {
    if (this.searchQueryGiving.length < 2) {
      this.searchResultsGiving = [];
      return;
    }

    this.isSearchingGiving = true;
    this.playerService.searchPlayers(this.searchQueryGiving).subscribe({
      next: (response) => {
        this.searchResultsGiving = response.players || [];
        this.isSearchingGiving = false;
      },
      error: (err: any) => {
        console.error('Error searching players:', err);
        this.isSearchingGiving = false;
      }
    });
  }

  // R-0030: Search players for receiving
  searchPlayersReceiving(): void {
    if (this.searchQueryReceiving.length < 2) {
      this.searchResultsReceiving = [];
      return;
    }

    this.isSearchingReceiving = true;
    this.playerService.searchPlayers(this.searchQueryReceiving).subscribe({
      next: (response) => {
        this.searchResultsReceiving = response.players || [];
        this.isSearchingReceiving = false;
      },
      error: (err: any) => {
        console.error('Error searching players:', err);
        this.isSearchingReceiving = false;
      }
    });
  }

  // R-0031: Add player to giving away list
  addPlayerGiving(player: Player): void {
    // Check if player already added
    const playerId = player.player_id || player.playerId;
    if (this.playersGivingAway.some(p => (p.player.player_id || p.player.playerId) === playerId)) {
      return;
    }

    this.playersGivingAway.push({ player });
    this.searchQueryGiving = '';
    this.searchResultsGiving = [];
    this.tradeEvaluated = false; // Reset evaluation when trade changes
  }

  // R-0031: Add player to receiving list
  addPlayerReceiving(player: Player): void {
    const playerId = player.player_id || player.playerId;
    if (this.playersReceiving.some(p => (p.player.player_id || p.player.playerId) === playerId)) {
      return;
    }

    this.playersReceiving.push({ player });
    this.searchQueryReceiving = '';
    this.searchResultsReceiving = [];
    this.tradeEvaluated = false;
  }

  // R-0032: Remove player from giving away list
  removePlayerGiving(index: number): void {
    this.playersGivingAway.splice(index, 1);
    this.tradeEvaluated = false;
  }

  // R-0032: Remove player from receiving list
  removePlayerReceiving(index: number): void {
    this.playersReceiving.splice(index, 1);
    this.tradeEvaluated = false;
  }

  // R-0034: Clear trade
  clearTrade(): void {
    this.playersGivingAway = [];
    this.playersReceiving = [];
    this.tradeEvaluated = false;
    this.tradeGrade = '';
    this.tradeAnalysis = '';
    this.searchQueryGiving = '';
    this.searchQueryReceiving = '';
    this.searchResultsGiving = [];
    this.searchResultsReceiving = [];
  }

  // R-0035: Validate trade before evaluation
  isTradeValid(): boolean {
    return this.playersGivingAway.length > 0 && this.playersReceiving.length > 0 && this.selectedRoster !== null;
  }

  // R-0033: Evaluate trade
  evaluateTrade(): void {
    // R-0035: Validate input
    if (!this.isTradeValid()) {
      this.errorMessage = 'Please select a roster and add players to both sides of the trade';
      return;
    }

    this.isEvaluating = true;
    this.errorMessage = '';

    // For now, we'll do a simple client-side evaluation
    // In the future, you can call a backend API for AI-powered analysis
    this.performTradeEvaluation();
  }

  performTradeEvaluation(): void {
    // Calculate total fantasy points for players giving away
    let givingValue = 0;
    this.playersGivingAway.forEach(tp => {
      // You could fetch actual fantasy points from rankings here
      // For now, using a simple placeholder
      givingValue += this.getPlayerValue(tp.player);
    });

    // Calculate total fantasy points for players receiving
    let receivingValue = 0;
    this.playersReceiving.forEach(tp => {
      receivingValue += this.getPlayerValue(tp.player);
    });

    // Determine trade grade
    const difference = receivingValue - givingValue;
    const percentDiff = (difference / givingValue) * 100;

    if (percentDiff > 15) {
      this.tradeGrade = 'A+';
      this.tradeAnalysis = 'Excellent trade! You\'re receiving significantly more value than you\'re giving up. This trade would greatly strengthen your roster.';
    } else if (percentDiff > 5) {
      this.tradeGrade = 'A';
      this.tradeAnalysis = 'Great trade! You\'re getting good value in return. This should improve your team\'s overall performance.';
    } else if (percentDiff > -5) {
      this.tradeGrade = 'B';
      this.tradeAnalysis = 'Fair trade. Both sides are getting relatively equal value. Consider your team needs and roster composition.';
    } else if (percentDiff > -15) {
      this.tradeGrade = 'C';
      this.tradeAnalysis = 'Not recommended. You\'re giving up more value than you\'re receiving. Consider negotiating for better players or additional assets.';
    } else {
      this.tradeGrade = 'D';
      this.tradeAnalysis = 'Poor trade! You\'re losing significant value. It\'s strongly recommended to reject this trade or ask for more in return.';
    }

    this.tradeEvaluated = true;
    this.isEvaluating = false;
  }

  // Helper to get player value (placeholder - can be enhanced with real data)
  getPlayerValue(player: Player): number {
    // This is a simplified calculation
    // In production, you'd fetch this from player_rankings table
    const positionValues: { [key: string]: number } = {
      'QB': 20,
      'RB': 18,
      'WR': 16,
      'TE': 14,
      'K': 8,
      'DEF': 10
    };
    return positionValues[player.position] || 10;
  }

  getPlayerName(player: Player): string {
    return player.playerName || player.player_name || 'Unknown Player';
  }

  getTeamName(player: Player): string {
    return player.teamName || player.team_name || '';
  }

  getTradeGradeClass(): string {
    switch(this.tradeGrade) {
      case 'A+':
      case 'A':
        return 'grade-excellent';
      case 'B':
        return 'grade-good';
      case 'C':
        return 'grade-fair';
      case 'D':
        return 'grade-poor';
      default:
        return '';
    }
  }
}