
export interface LeaderboardEntry {
  playerName: string;
  score: number;
  wave: number;
  timestamp: number;
}

// 排行榜服务接口 - 当前使用 localStorage，后期替换为 Supabase
export class LeaderboardService {
  private static STORAGE_KEY = 'td_leaderboard';

  static async submitScore(entry: LeaderboardEntry): Promise<void> {
    // TODO: 替换为 Supabase
    // const { data, error } = await supabase.from('leaderboard').insert(entry);
    const entries = this.getLocal();
    entries.push(entry);
    entries.sort((a, b) => b.score - a.score);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(entries.slice(0, 100)));
  }

  static async getTopScores(limit: number = 10): Promise<LeaderboardEntry[]> {
    // TODO: 替换为 Supabase
    // const { data } = await supabase.from('leaderboard').select('*').order('score', { ascending: false }).limit(limit);
    return this.getLocal().slice(0, limit);
  }

  private static getLocal(): LeaderboardEntry[] {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    } catch { return []; }
  }
}
