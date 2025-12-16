import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FAQItem {
  question: string;
  answer: string;
  open?: boolean;
}

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './help.component.html',
  styleUrl: './help.component.css'
})
export class HelpComponent {
  faqs: FAQItem[] = [
    {
      question: 'How does the Trade Analyzer work?',
      answer: 'The Trade Analyzer evaluates trades by analyzing the last 3 weeks of actual fantasy performance (60% weight) combined with next week\'s projected points (40% weight). It also considers position scarcity to give you an accurate trade grade from A+ to F.',
      open: false
    },
    {
      question: 'What do the trade grades mean?',
      answer: 'A+ means you\'re gaining 20%+ value (excellent trade). A means 10-20% gain (great trade). B means 0-10% gain (fair trade). C means 0-10% loss (slight loss). D means 10-20% loss (not recommended). F means 20%+ loss (poor trade).',
      open: false
    },
    {
      question: 'How are Player Rankings calculated?',
      answer: 'Player Rankings show both actual fantasy points from completed games and projected points for upcoming games. You can filter by week, position, team, and scoring format (Standard or PPR). Rankings are synced from official NFL data.',
      open: false
    },
    {
      question: 'Can I have multiple rosters?',
      answer: 'Yes! You can create up to 5 rosters per account. Each roster follows standard fantasy football positions: 1 QB, 2 RBs, 2 WRs, 1 TE, 1 FLEX (RB/WR/TE), 1 K, and 1 DEF.',
      open: false
    },
    {
      question: 'What is PPR vs Standard scoring?',
      answer: 'PPR (Points Per Reception) gives players 1 point for each catch, making pass-catching running backs and wide receivers more valuable. Standard scoring doesn\'t award points for receptions. Half-PPR gives 0.5 points per reception.',
      open: false
    },
    {
      question: 'How often is player data updated?',
      answer: 'Player rankings and stats are synced from the SportsData.io API. You can manually sync data using the "Sync Latest Data" button on the Player Rankings page. Projections are updated weekly.',
      open: false
    },
    {
      question: 'What are "Buy Low Candidates"?',
      answer: 'Buy Low Candidates are players who underperformed last week but have strong projected points for upcoming games. These are potential trade targets who might be available at a discount.',
      open: false
    },
    {
      question: 'Can I analyze trades without creating a roster?',
      answer: 'No, you need to create at least one roster to use the Trade Analyzer. This allows the system to consider your team\'s specific needs and roster composition when evaluating trades.',
      open: false
    },
    {
      question: 'How do I edit my roster?',
      answer: 'Go to your Profile page and click "Edit Roster" on any of your rosters. You can then add or remove players from specific position slots. Click "Done Editing" when finished.',
      open: false
    },
    {
      question: 'Is my data saved if I close the browser?',
      answer: 'Yes! Your login session is saved for 7 days, so you won\'t need to sign in again unless you explicitly log out or clear your browser data.',
      open: false
    }
  ];

  toggleFAQ(faq: FAQItem): void {
    faq.open = !faq.open;
  }
}