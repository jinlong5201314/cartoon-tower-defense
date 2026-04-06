
import Phaser from 'phaser';
import { WAVES, ENEMIES, WaveConfig, EnemyConfig } from '../config/gameConfig';
import { Enemy } from './Enemy';
import { PathSystem } from '../systems/PathSystem';

export class WaveManager {
  private scene: Phaser.Scene;
  private onSpawn: (enemy: Enemy) => void;
  private spawnTimer: number = 0;
  private spawnedCount: number = 0;
  private waveDelay: number = 3;
  private _waveComplete: boolean = false;

  public currentWave: number = 0;

  constructor(scene: Phaser.Scene, onSpawn: (enemy: Enemy) => void) {
    this.scene = scene;
    this.onSpawn = onSpawn;
  }

  update(dt: number): void {
    if (this.currentWave >= WAVES.length && this._waveComplete) return;

    if (this._waveComplete) {
      this.waveDelay -= dt;
      if (this.waveDelay <= 0) {
        this.startWave();
      }
      return;
    }

    if (this.currentWave === 0) {
      this.startWave();
      return;
    }

    const wave = WAVES[this.currentWave - 1];
    const totalEnemies = wave.enemies.reduce((sum: number, e: any) => sum + e.count, 0);

    if (this.spawnedCount < totalEnemies) {
      this.spawnTimer -= dt;
      if (this.spawnTimer <= 0) {
        this.spawnNextEnemy(wave);
        this.spawnTimer = wave.spawnInterval;
      }
    } else {
      this._waveComplete = true;
      this.waveDelay = 3;
    }
  }

  private startWave(): void {
    this.currentWave++;
    this.spawnedCount = 0;
    this.spawnTimer = 0;
    this._waveComplete = false;
  }

  private spawnNextEnemy(wave: WaveConfig): void {
    let count = 0;
    for (const eg of wave.enemies) {
      count += eg.count;
      if (this.spawnedCount < count) {
        const enemyConfig = ENEMIES[eg.type];
        const enemy = new Enemy(this.scene, eg.type, enemyConfig);
        this.onSpawn(enemy);
        this.spawnedCount++;
        return;
      }
    }
  }

  isWaveComplete(): boolean { return this._waveComplete; }
  isAllWavesDone(): boolean { return this.currentWave >= WAVES.length; }
}
