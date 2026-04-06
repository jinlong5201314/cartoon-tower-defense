
import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from './config/gameConfig';
import { MenuScene } from './scenes/MenuScene';
import { GameScene } from './scenes/GameScene';
import { LeaderboardScene } from './scenes/LeaderboardScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  parent: document.body,
  backgroundColor: '#1a1a2e',
  scene: [MenuScene, GameScene, LeaderboardScene],
  physics: {
    default: 'arcade',
    arcade: { debug: false }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

new Phaser.Game(config);
