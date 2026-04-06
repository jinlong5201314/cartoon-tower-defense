
import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, PATH_POINTS, TOWER_TYPES, ENEMY_TYPES, WAVES, PATH_EXCLUSION_RADIUS
 } from '../config/gameConfig';
import { PathSystem } from '../systems/PathSystem';
import { Tower } from '../entities/Tower';
import { Enemy } from '../entities/Enemy';
import { WaveManager } from '../entities/WaveManager';
import { LeaderboardService } from '../systems/LeaderboardService';

export class GameScene extends Phaser.Scene {
  private gold: number = 200;
  private lives: number = 20;
  private score: number = 0;
  private speedMultiplier: number = 1;
  private isPaused: boolean = false;

  private towers: Tower[] = [];
  private enemies: Enemy[] = [];
  private projectiles: Phaser.GameObjects.Arc [] = [];

  private pathSystem!: PathSystem;
  private waveManager!: WaveManager;

  private selectedTowerType: string | null = null;
  private selectedTower: Tower | null = null;
  private placementPreview!: Phaser.GameObjects.Arc;

  private goldText!: Phaser.GameObjects.Text;
  private livesText!: Phaser.GameObjects.Text;
  private waveText!: Phaser.GameObjects.Text;
  private scoreText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'GameScene' });
  }

  create(): void {
    this.gold = 200;
    this.lives = 20;
    this.score = 0;
    this.speedMultiplier = 1;
    this.isPaused = false;
    this.towers = [];
    this.enemies = [];
    this.projectiles = [];
    this.selectedTowerType = null;
    this.selectedTower = null;

    this.cameras.main.setBackgroundColor(0x4aba4a);

    this.pathSystem = new PathSystem(this);
    this.pathSystem.drawPath();

    this.waveManager = new WaveManager(this, (ey: Enemy) => {
      this.enemies.push(ey);
    });

    this.createHUD();
    this.createTowerButtons();
    this.setupInput();

    // Placement preview
    this.placementPreview = this.add.circle(0, 0, 20, 0x00ff00, 0.3);
    this.placementPreview.setVisible(false);
  }

  private createHUD(): void {
    const style = { fontSize: '18px', color: '#fff', fontFamily: 'Arial', stroke: '#000', strokeThickness: 3 };
    this.goldText = this.add.text(10, 10, `💰 ${this.gold}`, style);
    this.livesText = this.add.text(150, 10, `❤ ${this.lives}`, style);
    this.waveText = this.add.text(280, 10, `🌊 Wave: 0`, style);
    this.scoreText = this.add.text(450, 10, `⭐️ ${this.score}`, style);

    // Speed buttons
    [1, 2, 3].forEach((spd, i) => {
      const btn = this.add.text(650 + i * 60, 10, `x${spd}`, {
        fontSize: '16px', color: spd === this.speedMultiplier ? '#FFD700' : '#fff',
        fontFamily: 'Arial', backgroundColor: '#333', padding: { x: 8, y: 4 }
      }).setInteractive({ useHandCursor: true });
      btn.on('pointerdown', () => { this.speedMultiplier = spd; });
    });
  }

  private createTowerButtons(): void {
    const types = Object.keys(TOWER_TYPES);
    types.forEach((type, i) => {
      const t = TOWER_TYPES[type];
      const y = 50 + i * 70;
      const btn = this.add.text(GAME_WIDTH - 160, y, `${t.emoji} ${t.name}\n${t.cost}g`, {
        fontSize: '13px', color: '#fff', fontFamily: 'Arial',
        backgroundColor: '#2228', padding: { x: 10, y: 6 }
      }).setInteractive({ useHandCursor: true });
      btn.on('pointerdown', () => {
        this.selectedTowerType = type;
        this.selectedTower = null;
      });
    });
  }

  private setupInput(): void {
    this.input.on('pointermove', (p: Phaser.Input.Pointer) => {
      if (this.selectedTowerType) {
        this.placementPreview.setPosition(p.x, p.y);
        this.placementPreview.setVisible(true);
        const canPlace = this.canPlaceTower(p.x, p.y);
        this.placementPreview.setFillStyle(canPlace ? 0x00ff00 : 0xff0000, 0.3);
      } else {
        this.placementPreview.setVisible(false);
      }
    });

    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => {
      if (this.selectedTowerType) {
        this.tryPlaceTower(p.x, p.y);
      } else {
        this.trySelectTower(p.x, p.y);
      }
    });

    this.input.keyboard!.on('keydown-SPACE', () => {
      this.isPaused = !this.isPaused;
    });
    this.input.keyboard!.on('keydown-ESC', () => {
      this.selectedTowerType = null;
      this.selectedTower = null;
    });
  }

  private canPlaceTower(x: number, y: number): boolean {
    if (this.pathSystem.isOnPath(x, y)) return false;
    for (const t of this.towers) {
      const d = Phaser.Math.Distance.Between(x, y, t.sprite.x, t.sprite.y);
      if (d < 50) return false;
    }
    return true;
  }

  private tryPlaceTower(x: number, y: number): void {
    if (!this.selectedTowerType) return;
    const type = TOWER_TYPES[this.selectedTowerType];
    if (this.gold < type.cost) return;
    if (!this.canPlaceTower(x, y)) return;

    this.gold -= type.cost;
    const tower = new Tower(this, x, y, this.selectedTowerType);
    this.towers.push(tower);
  }

  private trySelectTower(x: number, y: number): void {
    this.selectedTower = null;
    for (const t of this.towers) {
      const d = Phaser.Math.Distance.Between(x, y, t.sprite.x, t.sprite.y);
      if (d < 30) {
        this.selectedTower = t;
        break;
      }
    }
  }

  update(time: number, delta: number): void {
    if (this.isPaused) return;

    const dt = (delta / 1000) * this.speedMultiplier;

    // Update wave manager
    this.waveManager.update(dt);

    // Update enemies
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      enemy.update(dt);

      if (enemy.reachedEnd) {
        this.lives -= enemy.damage;
        enemy.destroy();
        this.enemies.splice(i, 1);
        if (this.lives <= 0) {
          this.gameOver();
          return;
        }
        continue;
      }

      if (enemy.isDead) {
        this.gold += enemy.reward;
        this.score += enemy.reward * 10;
        enemy.destroy();
        this.enemies.splice(i, 1);
      }
    }

    // Update towers
    for (const tower of this.towers) {
      tower.update(dt, this.enemies);
    }

    // Check wave complete
    if (this.waveManager.isWaveComplete() && this.enemies.length === 0) {
      if (this.waveManager.currentWave >= WAVES.length) {
        this.victory();
        return;
      }
    }

    // Update HUD
    this.goldText.setText(`💰${this.gold}`);
    this.livesText.setText(`❤‍${this.lives}`);
    this.waveText.setText(`🌊 Wave: ${this.waveManager.currentWave}/${WAVES.length}`);
    this.scoreText.setText(`⭐️ ${this.score}`);
  }

  private async gameOver(): Promise<void> {
    this.isPaused = true;
    const name = prompt('游戏结束！输入姓名:') || '匿名';
    await LeaderboardService.submitScore(name, this.score, this.waveManager.currentWave);
    this.scene.start('LeaderboardScene');
  }

  private async victory(): Promise<void> {
    this.isPaused = true;
    const name = prompt('🎉恭喜过关！输入姓名:') || '匿名';
    await LeaderboardService.submitScore(name, this.score, this.waveManager.currentWave);
    this.scene.start('LeaderboardScene');
  }
}
