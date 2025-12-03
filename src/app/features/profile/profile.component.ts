// ===== src/app/features/profile/profile.component.ts =====
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { RosterService } from '../../core/services/roster.service';
import { PlayerService } from '../../core/services/player.service';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';
import { Roster } from '../../core/models/roster.model';
import { Player } from '../../core/models/player.model';
import { RosterWithPositions, RosterPosition, RosterSlotConfig } from '../../core/models/roster.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  userService = inject(UserService);
  rosterService = inject(RosterService);
  playerService = inject(PlayerService);
  authService = inject(AuthService);

  user: User | null = null;
  rosters: Roster[] = [];
  selectedRoster: Roster | null = null;
  rosterPositions: RosterPosition[] = [];       
  rosterStructure: RosterSlotConfig[] = [];
  
  // R-0012, R-0013: Edit account info
  isEditingAccount = false;
  editFirstName = '';
  editLastName = '';
  editEmail = '';
  
  // R-0014, R-0015: Edit profile icon
  isEditingIcon = false;
  availableIcons = [
    '/assets/avatars/avatar1.png',
    '/assets/avatars/avatar2.jpg',
    '/assets/default-avatar.svg'
  ];
  selectedIcon = '';

  // R-0009, R-0010, R-0011: Edit roster
  isEditingRoster = false;
  editingRosterId: number | null = null;
  playerSearchQuery = '';
  searchResults: Player[] = [];
  isSearching = false;

  isCreatingRoster = false;
  newRosterName = '';
  newRosterFormat: 'PPR' | 'Half-PPR' | 'Standard' = 'Half-PPR';
  selectedSlot: string | null = null;

  ngOnInit(): void {
    this.loadProfile();
    this.loadRosterStructure();
  }

  loadProfile(): void {
    this.userService.getProfile().subscribe({
      next: (response) => {
        this.user = response.user;
        this.rosters = response.rosters || [];
      },
      error: (err) => console.error('Error loading profile:', err)
    });
  }

  // R-0012: Start editing account info
  startEditAccount(): void {
    this.isEditingAccount = true;
    this.editFirstName = this.user?.firstName || '';
    this.editLastName = this.user?.lastName || '';
    this.editEmail = this.user?.email || '';
  }

  // R-0013: Save account changes
  saveAccountChanges(): void {
    this.userService.updateProfile({
      firstName: this.editFirstName,
      lastName: this.editLastName,
      email: this.editEmail
    }).subscribe({
      next: () => {
        this.isEditingAccount = false;
        this.loadProfile();
      },
      error: (err) => console.error('Error updating profile:', err)
    });
  }

  // R-0013: Undo account changes
  cancelAccountEdit(): void {
    this.isEditingAccount = false;
  }

  // R-0014: Show icon selector on hover (implemented in template)
  startEditIcon(): void {
    this.isEditingIcon = true;
    this.selectedIcon = this.user?.profileIcon || '/assets/default-avatar.svg';
  }

  // R-0015: Save icon change
  saveIconChange(): void {
    this.userService.updateProfileIcon(this.selectedIcon).subscribe({
      next: () => {
        this.isEditingIcon = false;
        this.loadProfile();
      },
      error: (err) => console.error('Error updating icon:', err)
    });
  }

  // R-0015: Undo icon change
  cancelIconEdit(): void {
    this.isEditingIcon = false;
  }

  // R-0009: Start editing roster
  startEditRoster(roster: Roster): void {
    this.isEditingRoster = true;
    this.editingRosterId = roster.roster_id || roster.rosterId || null;
    this.selectedRoster = roster;
    this.loadRosterWithPositions(this.editingRosterId!);
  }

  loadRosterWithPositions(rosterId: number): void {
    this.rosterService.getRosterById(rosterId).subscribe({
      next: (response: RosterWithPositions) => {
        this.rosterPositions = response.positions || [];
      },
      error: (err) => console.error('Error loading roster positions:', err)
    });
  }

  // R-0010: Search for players to add
  searchPlayers(): void {
    if (this.playerSearchQuery.length < 2) {
      this.searchResults = [];
      return;
    }

    this.isSearching = true;
    this.playerService.searchPlayers(this.playerSearchQuery).subscribe({
      next: (response) => {
        this.searchResults = response.players || [];
        this.isSearching = false;
      },
      error: (err) => {
        console.error('Error searching players:', err);
        this.isSearching = false;
      }
    });
  }

  // R-0011: Save roster changes
  saveRosterChanges(): void {
    this.isEditingRoster = false;
    this.editingRosterId = null;
    this.selectedRoster = null;
    this.rosterPositions = [];
    this.loadProfile();
  }

  getPlayerName(player: Player): string {
    return player.playerName || player.player_name || 'Unknown';
  }

  getTeamName(player: Player): string {
    return player.teamName || player.team_name || '';
  }

  getRosterName(roster: Roster): string {
    return roster.rosterName || roster.roster_name || 'Roster';
  }

  getLeagueFormat(roster: Roster): string {
    return roster.leagueFormat || roster.league_format || 'Half-PPR';
  }

  loadRosterStructure(): void {
    this.rosterService.getRosterStructure().subscribe({
      next: (response) => {
        this.rosterStructure = response.structure;
      },
      error: (err) => console.error('Error loading roster structure:', err)
    });
  }

  // Open create roster modal
  openCreateRoster(): void {
    if (this.rosters.length >= 5) {
      alert('Maximum of 5 rosters allowed');
      return;
    }
    this.isCreatingRoster = true;
    this.newRosterName = '';
    this.newRosterFormat = 'Half-PPR';
  }

  // Close create roster modal
  closeCreateRoster(): void {
    this.isCreatingRoster = false;
  }

  // Create new roster
  createRoster(): void {
    if (!this.newRosterName.trim()) {
      alert('Please enter a roster name');
      return;
    }

    this.rosterService.createRoster({
      rosterName: this.newRosterName,
      leagueFormat: this.newRosterFormat
    }).subscribe({
      next: () => {
        this.isCreatingRoster = false;
        this.loadProfile();
      },
      error: (err) => console.error('Error creating roster:', err)
    });
  }

  // Delete roster
  deleteRoster(roster: Roster): void {
    const rosterId = roster.roster_id || roster.rosterId;
    const rosterName = this.getRosterName(roster);
    
    if (!confirm(`Are you sure you want to delete "${rosterName}"?`)) {
      return;
    }

    this.rosterService.deleteRoster(rosterId!).subscribe({
      next: () => {
        this.loadProfile();
      },
      error: (err) => console.error('Error deleting roster:', err)
    });
  }
  // Select a slot to add a player
  selectSlot(slot: string): void {
    this.selectedSlot = slot;
    this.playerSearchQuery = '';
    this.searchResults = [];
  }

  // Get slot configuration
  getSlotConfig(slot: string): RosterSlotConfig | undefined {
    return this.rosterStructure.find((s: RosterSlotConfig) => s.slot === slot);
  }

  // Get player in slot
  getPlayerInSlot(slot: string): RosterPosition | undefined {
    return this.rosterPositions.find((p: RosterPosition) => p.position_slot === slot);
  }

  // Add player to selected slot
  addPlayerToSelectedSlot(player: Player): void {
    if (!this.selectedSlot || !this.editingRosterId) return;

    const playerId = player.player_id || player.playerId;
    if (!playerId) return;

    this.rosterService.addPlayerToSlot(this.editingRosterId, this.selectedSlot, playerId).subscribe({
      next: () => {
        this.loadRosterWithPositions(this.editingRosterId!);
        this.selectedSlot = null;
        this.playerSearchQuery = '';
        this.searchResults = [];
      },
      error: (err) => {
        console.error('Error adding player:', err);
        alert(err.error?.error || 'Failed to add player to slot');
      }
    });
  }

  // Remove player from slot
  removePlayerFromSelectedSlot(slot: string): void {
    if (!this.editingRosterId) return;

    this.rosterService.removePlayerFromSlot(this.editingRosterId, slot).subscribe({
      next: () => {
        this.loadRosterWithPositions(this.editingRosterId!);
      },
      error: (err) => console.error('Error removing player:', err)
    });
  }

  // Filter search results by slot position
  getFilteredSearchResults(): Player[] {
    if (!this.selectedSlot) return [];

    const slotConfig = this.getSlotConfig(this.selectedSlot);
    if (!slotConfig) return [];

    if (slotConfig.position === 'FLEX') {
      // FLEX can be RB, WR, or TE
      return this.searchResults.filter(p => ['RB', 'WR', 'TE'].includes(p.position));
    } else if (slotConfig.position === 'DEF') {
      // For defense, filter by team defenses
      return this.searchResults.filter(p => p.position === 'DEF');
    } else {
      // Regular position matching
      return this.searchResults.filter(p => p.position === slotConfig.position);
    }
  }
}