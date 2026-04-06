
import Phaser from 'phaser';
import { TOWER_TYPES, TowerTypeConfig } from '../config/gameConfig';
import { Enemy } from './Enemy';

export class Tower {
  public sprite: Phaser.GameObjects.Arc;
  private scene: Phaser.Scene;
  private type: string;
  private config: TowerTypeConfig;
  private level: number = 1;
  private fireTimer: number = 0;
  private rangeCircle: Phaser.GameObjects.Arc;

  constructor(scene: Phaser.Scene, x: number, y: number, type: string) {
    this.scene = scene;
    this.type = type;
    this.config = TOWER_TYPES[type];

    this.sprite = scene.add.circle(x, y, 20, this.config.color);
    this.sprite.setStrokeStyle(2, 0xffffff);

    // Range indicator
    this.rangeCircle = scene.add.circle(x, y, this.config.range, 0xffffff, 0.05);
    this.rangeCircle.setStrokeStyle(1, 0xffffff, 0.2);
    this.rangeCircle.setVisible(false);

    // Label
    scene.add.text(x, y, this.config.emoji, {
      fontSize: '20px', fontFamily: 'Arial'
    }).setOrigin(0.5);
  }

  update(dt: number, enemies: Enemy[]): void {
    this.fireTimer -= dt;
    if (this.fireTimer > 0) return;

    // Find target in range
    const range = this.getRange();
    let target: Enemy | null = null;
    let minDist = Infinity;

    for (const enemy of enemies) {
      if (enemy.isDead) continue;
      const d = Phaser.Math.Distance.Between(
        this.sprite.x, this.sprite.y, enemy.sprite.x, enemy.sprite.y
      );
      if (d <= range && d < minDist) {
        minDist = d;
        target = enemy;
      }
    }

    if (target) {
      this.fire(target, enemies);
      this.fireTimer = this.config.fireRate / this.level;
    }
  }

  private fire(target: Enemy, allEnemies: Enemy[]): void {
    const dmg = this.config.damage * this.level;

    // Visual projectile
    const bullet = this.scene.add.circle(this.sprite.x, this.sprite.y, 4, this.config.color);
    this.scene.tweens.add({
      targets: bullet,
      x: target.sprite.x,
      y: target.sprite.y,
      duration: 150,
      onComplete: () => bullet.destroy()
    });

    // Apply damage based on type
    switch (this.config.effect) {
      case 'aoe':
        // Cannon: splash damage
        for (const e of allEnemies) {
          const d = Phaser.Math.Distance.Between(target.sprite.x, target.sprite.y, e.sprite.x, e.sprite.y);
          if (d <= 60) e.takeDamage(dmg * 0.6);
        }
        target.takeDamage(dmg);
        break;
      case 'slow':
        // Ice: slow
        target.takeDamage(dmg);
        target.applySlow(0.5, 2);
        break;
      case 'dot':
        // Poison: damage over time
        target.takeDamage(dmg * 0.3);
        target.applyPoison(dmg * 0.7, 3);
        break;
      case 'chain':
        // Electric: chain lightning
        target.takeDamage(dmg);
        let prev = target;
        for (let c = 0; c < 2; c++) {
          let next: Enemy | null = null;
          let nd = 80;
          for (const e of allEnemies) {
            if (e === target || e === prev || e.isDead) continue;
            const d = Phaser.Math.Distance.Between(prev.sprite.x, prev.sprite.y, e.sprite.x, e.sprite.y);
            if (d < nd) { nd = d; next = e; }
          }
          if (next) {
            next.takeDamage(dmg * 0.5);
            prev = next;
          }
        }
        break;
      default:
        target.takeDamage(dmg);
    }
  }

  private getRange(): number {
    return this.config.range + (this.level - 1) * 10;
  }

  upgrade(): number {
    if (this.level >= 3) return 0;
    this.level++;
    return Math.floor(this.config.cost * 0.5 * (this.level - 1));
  }

  getSellValue(): number {
    return Math.floor(this.config.cost * 0.6);
  }

  destroy(): void {
    this.sprite.destroy();
    this.rangeCircle.destroy();
  }
}
