
import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config/gameConfig';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create(): void {
    this.cameras.main.setBackgroundColor(0x1a1a2e);

    // Title
    this.add.text(GAME_WIDTH / 2, 120, '🏰 卡通塔防', {
      fontSize: '48px',
      color: '#FFD700',
      fontFamily: 'Arial',
      stroke: '#000',
      strokeThickness: 6
    }).setOrigin(0.5);

    // Subtitle
    this.add.text(GAME_WIDTH / 2, 180, 'Cartoon Tower Defense', {
      fontSize: '20px',
      color: '#888',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Buttons
    const buttons = [
      { text: '🎮 开始游戏', scene: 'GameScene' },
      { text: '🏆 排行榜', scene: 'LeaderboardScene' },
    ];

    buttons.forEach((b, i) => {
      const y = 280 + i * 70;
      const btn = this.add.text(GAME_WIDTH / 2, y, b.text, {
        fontSize: '28px',
        color: '#fff',
        fontFamily: 'Arial',
        backgroundColor: '#344c64',
        padding: { x: 30, y: 12 }
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });

      btn.on('pointerover', () => btn.setStyle({ color: '#FFD700' }));
      btn.on('pointerout', () => btn.setStyle({ color: '#fff' }));
      btn.on('pointerdown', () => this.scene.start(b.scene));
    });

    // Credits
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 30, 'Phaser 3 | Cartoon Style', {
      fontSize: '12px',
      color: '#555',
      fontFamily: 'Arial'
    }).setOrigin(0.5);
  }
}
