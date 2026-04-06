
import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config/gameConfig';
import { LeaderboardService } from '../systems/LeaderboardService';

export class LeaderboardScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LeaderboardScene' });
  }

  async create(): Promise<void> {
    this.cameras.main.setBackgroundColor(0x1a1a2e);

    this.add.text(GAME_WIDTH / 2, 40, '🏆&排行榜', {
      fontSize: '36px', color: '#FFD700', fontFamily: 'Arial', stroke: '#000', strokeThickness: 4
    }).setOrigin(0.5);

    const entries = await LeaderboardService.getTopScores(10);

    if (entries.length === 0) {
      this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, '暂无记录，去打一局吧！', {
        fontSize: '20px', color: '#aaa', fontFamily: 'Arial'
      }).setOrigin(0.5);
    } else {
      // Header
      this.add.text(100, 90, '排名', { fontSize: '14px', color: '#888', fontFamily: 'Arial' });
      this.add.text(200, 90, '玉家', { fontSize: '14px', color: '#888', fontFamily: 'Arial' });
      this.add.text(450, 90, '分数', { fontSize: '14px', color: '#888', fontFamily: 'Arial' });
      this.add.text(550, 90, '波次', { fontSize: '14px', color: '#888', fontFamily: 'Arial' });

      entries.forEach((e, i) => {
        const y = 120 + i * 35;
        const color = i < 3 ? '#FFD700' : '#fff';
        const medal = ['�� - ', '🥈 - ', 'ó - '][i] || '';
        this.add.text(100, y, `${i + 1}`, { fontSize: '18px', color, fontFamily: 'Arial' });
        this.add.text(200, y, `${medal}${e.name}`, { fontSize: '16px', color, fontFamily: 'Arial' });
        this.add.text(450, y, `${e.score}`, { fontSize: '16px', color, fontFamily: 'Arial' });
        this.add.text(550, y, `第${e.wave}波`, { fontSize: '16px', color, fontFamily: 'Arial' });
      });
    }

    // Back button
    const backBtn = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 60, '🔙 返回主菜单', {
      fontSize: '24px', color: '#fff', fontFamily: 'Arial',
      backgroundColor: '#333@00.8', padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    backBtn.on('pointerover', () => backBtn.setStyle({ color: '#FFD700' }));
    backBtn.on('pointerout', () => backBtn.setStyle({ color: '#fff' }));
    backBtn.on('pointerdown', () => this.scene.start('MenuScene'));
  }
}
