
import Phaser from 'phaser';
import { PATH_POINTS, EnemyConfig } from '../config/gameConfig';

export class Enemy {
  public sprite: Phaser.GameObjects.Arc;
  private hpBar: Phaser.GameObjects.Rectangle;
  private hpBarBg: Phaser.GameObjects.Rectangle;

  private type: string;
  private maxHp: number;
  private hp: number;
  private baseSpeed: number;
  private speed: number;
  public reward: number;
  public damage: number;

  private pathIndex: number = 0;
  public reachedEnd: boolean = false;
  public isDead: boolean = false;

  private slowTimer: number = 0;
  private slowFactor: number = 1;
  private poisonTimer: number = 0;
  private poisonDps: number = 0;

  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, type: string, config: EnemyConfig) {
    this.scene = scene;
    this.type = type;
    this.maxHp = config.hp;
    this.hp = config.hp;
    this.baseSpeed = config.speed;
    this.speed = config.speed;
    this.reward = config.reward;
    this.damage = config.damage;

    const start = PATH_POINTS[0];
    this.sprite = scene.add.circle(start.x, start.y, config.size || 15, config.color);
    this.sprite.setStrokeStyle(2, 0x000000);

    // HP bar
    this.hpBarBg = scene.add.rectangle(start.x, start.y - 25, 30, 4, 0x333333);
    this.hpBar = scene.add.rectangle(start.x, start.y - 25, 30, 4, 0xff0000);

    // Label
    scene.add.text(start.x, start.y, config.emoji || '👾', {
      fontSize: '14px', fontFamily: 'Arial'
    }).setOrigin(0.5);
  }

  update(dt: number): void {
    if (this.isDead || this.reachedEnd) return;

    // Poison
    if (this.poisonTimer > 0) {
      this.poisonTimer -= dt;
      this.hp -= this.poisonDps * dt;
    }

    // Slow
    if (this.slowTimer > 0) {
      this.slowTimer -= dt;
      this.speed = this.baseSpeed * this.slowFactor;
    } else {
      this.speed = this.baseSpeed;
    }

    if (this.hp <= 0) {
      this.isDead = true;
      return;
    }

    // Move along path
    if (this.pathIndex >= PATH_POINTS.length - 1) {
      this.reachedEnd = true;
      return;
    }

    const target = PATH_POINTS[this.pathIndex + 1];
    const dx = target.x - this.sprite.x;
    const dy = target.y - this.sprite.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const move = this.speed * dt;

    if (move >= dist) {
      this.sprite.setPosition(target.x, target.y);
      this.pathIndex++;
    } else {
      this.sprite.x += (dx / dist) * move;
      this.sprite.y += (dy / dist) * move;
    }

    // Update HP bar
    this.hpBarBg.setPosition(this.sprite.x, this.sprite.y - 25);
    this.hpBar.setPosition(this.sprite.x, this.sprite.y - 25);
    this.hpBar.width = 30 * (this.hp / this.maxHp);
  }

  takeDamage(amount: number): void {
    this.hp -= amount;
    if (this.hp <= 0) this.isDead = true;
  }

  applySlow(factor: number, duration: number): void {
    this.slowFactor = factor;
    this.slowTimer = duration;
  }

  applyPoison(dps: number, duration: number): void {
    this.poisonDps = dps;
    this.poisonTimer = duration;
  }

  destroy(): void {
    this.sprite.destroy();
    this.hpBar.destroy();
    this.hpBarBg.destroy();
  }
}
