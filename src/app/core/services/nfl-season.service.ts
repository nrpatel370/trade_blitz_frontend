import { Injectable } from '@angular/core';

interface WeekSchedule {
  week: number;
  startDate: Date;
  endDate: Date;
}

@Injectable({
  providedIn: 'root'
})
export class NflSeasonService {
  // 2025 NFL Regular Season Schedule
  private readonly SEASON_2025_STARTS = [
    { week: 1, startDate: new Date(2025, 8, 4) },
    { week: 2, startDate: new Date(2025, 8, 11) },
    { week: 3, startDate: new Date(2025, 8, 18) },
    { week: 4, startDate: new Date(2025, 8, 25) },
    { week: 5, startDate: new Date(2025, 9, 2) },
    { week: 6, startDate: new Date(2025, 9, 9) },
    { week: 7, startDate: new Date(2025, 9, 16) },
    { week: 8, startDate: new Date(2025, 9, 23) },
    { week: 9, startDate: new Date(2025, 9, 30) },
    { week: 10, startDate: new Date(2025, 10, 6) },
    { week: 11, startDate: new Date(2025, 10, 13) },
    { week: 12, startDate: new Date(2025, 10, 20) },
    { week: 13, startDate: new Date(2025, 10, 27) },
    { week: 14, startDate: new Date(2025, 11, 4) },
    { week: 15, startDate: new Date(2025, 11, 11) },
    { week: 16, startDate: new Date(2025, 11, 18) },
    { week: 17, startDate: new Date(2025, 11, 25) },
    { week: 18, startDate: new Date(2026, 0, 1) },
  ] as const;

  // Build Thu->Mon ranges automatically
  private readonly SEASON_2025: WeekSchedule[] = this.SEASON_2025_STARTS.map(w => {
    const start = this.startOfDay(w.startDate);       // Thu 00:00
    const end = this.endOfDay(this.addDays(start, 4)); // Mon 23:59:59.999
    return { week: w.week, startDate: start, endDate: end };
  });

  private startOfDay(d: Date): Date {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  private endOfDay(d: Date): Date {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
  }

  private addDays(d: Date, days: number): Date {
    const copy = new Date(d);
    copy.setDate(copy.getDate() + days);
    return copy;
  }

  getCurrentWeek(): number {
    const now = new Date();
    const today = this.startOfDay(now);

    // If we're inside Thu->Mon window, return it
    const current = this.SEASON_2025.find(w => today >= w.startDate && today <= w.endDate);
    if (current) return current.week;

    // Before season
    if (today < this.SEASON_2025[0].startDate) return 1;

    // Tue/Wed gap: return the most recent week that started (last Thursday)
    for (let i = this.SEASON_2025.length - 1; i >= 0; i--) {
      if (today >= this.SEASON_2025[i].startDate) return this.SEASON_2025[i].week;
    }

    return 1;
  }


  getCurrentSeason(): number {
    return 2025;
  }

   getWeekDates(week: number): { startDate: Date; endDate: Date } | null {
    const w = this.SEASON_2025.find(x => x.week === week);
    return w ? { startDate: w.startDate, endDate: w.endDate } : null;
  }

   isWeekCompleted(week: number): boolean {
    const now = new Date();
    const w = this.SEASON_2025.find(x => x.week === week);
    return w ? now > w.endDate : false; // endDate already end-of-day Monday
  }

  getLastCompletedWeek(): number {
    const now = new Date();
    for (let i = this.SEASON_2025.length - 1; i >= 0; i--) {
      if (now > this.SEASON_2025[i].endDate) return this.SEASON_2025[i].week;
    }
    return 0; // none completed yet
  }
  
}