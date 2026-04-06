
export const GAME_WIDTH = 960;
export const GAME_HEIGHT = 640;

export const PATH_POINTS: { x: number; y: number }[] = [
  { x: 0, y: 300 },
  { x: 150, y: 300 },
  { x: 150, y: 150 },
  { x: 400, y: 150 },
  { x: 400, y: 450 },
  { x: 650, y: 450 },
  { x: 650, y: 250 },
  { x: 960, y: 250 },
];

export interface TowerConfig {
  key: string;
  name: string;
  cost: number;
  damage: number;
  range: number;
  fireRate: number; // shots per second
  color: number;
  emoji: string;
  description: string;
  upgrades: { damage: number; range: number; cost: number }[];
}

export const TOWERS: Record<string, TowerConfig> = {
  arrow: {
    key: 'arrow', name: '箭塔', cost: 50, damage: 15, range: 120, fireRate: 2,
    color: 0x4CAF50, emoji: '🏹', description: '快速单体攻击',
    upgrades: [
      { damage: 25, range: 140, cost: 40 },
      { damage: 40, range: 160, cost: 80 },
    ]
  },
  cannon: {
    key: 'cannon', name: '炮塔', cost: 80, damage: 40, range: 100, fireRate: 0.8,
    color: 0xFF5722, emoji: '💣', description: 'AOE范围伤害',
    upgrades: [
      { damage: 60, range: 120, cost: 60 },
      { damage: 90, range: 140, cost: 120 },
    ]
  },
  ice: {
    key: 'ice', name: '冰塔', cost: 60, damage: 8, range: 110, fireRate: 1.5,
    color: 0x03A9F4, emoji: '❄️', description: '减速敌人',
    upgrades: [
      { damage: 12, range: 130, cost: 50 },
      { damage: 18, range: 150, cost: 100 },
    ]
  },
  poison: {
    key: 'poison', name: '毒塔', cost: 70, damage: 5, range: 100, fireRate: 1,
    color: 0x9C27B0, emoji: '☠️', description: '持续毒伤',
    upgrades: [
      { damage: 8, range: 120, cost: 55 },
      { damage: 12, range: 140, cost: 110 },
    ]
  },
  lightning: {
    key: 'lightning', name: '电塔', cost: 100, damage: 30, range: 130, fireRate: 0.6,
    color: 0xFFEB3B, emoji: '⚡', description: '链式闪电',
    upgrades: [
      { damage: 45, range: 150, cost: 80 },
      { damage: 65, range: 170, cost: 150 },
    ]
  },
};

export interface EnemyConfig {
  key: string;
  name: string;
  hp: number;
  speed: number; // pixels per second
  reward: number;
  color: number;
  size: number;
}

export const ENEMIES: Record<string, EnemyConfig> = {
  normal: { key: 'normal', name: '小兵', hp: 80, speed: 60, reward: 10, color: 0xe74c3c, size: 14 },
  fast: { key: 'fast', name: '飞毛腿', hp: 50, speed: 120, reward: 15, color: 0xf39c12, size: 10 },
  tank: { key: 'tank', name: '重甲兵', hp: 250, speed: 35, reward: 25, color: 0x7f8c8d, size: 20 },
  flying: { key: 'flying', name: '飞行怪', hp: 60, speed: 80, reward: 20, color: 0x3498db, size: 12 },
  boss: { key: 'boss', name: 'BOSS', hp: 800, speed: 30, reward: 100, color: 0x8e44ad, size: 28 },
};

export interface WaveConfig {
  enemies: { type: string; count: number; interval: number }[];
}

export const WAVES: WaveConfig[] = [
  { enemies: [{ type: 'normal', count: 8, interval: 1000 }] },
  { enemies: [{ type: 'normal', count: 10, interval: 900 }, { type: 'fast', count: 3, interval: 800 }] },
  { enemies: [{ type: 'normal', count: 8, interval: 800 }, { type: 'fast', count: 5, interval: 700 }] },
  { enemies: [{ type: 'tank', count: 3, interval: 2000 }, { type: 'normal', count: 10, interval: 800 }] },
  { enemies: [{ type: 'normal', count: 5, interval: 600 }, { type: 'fast', count: 5, interval: 500 }, { type: 'boss', count: 1, interval: 3000 }] },
  { enemies: [{ type: 'tank', count: 5, interval: 1500 }, { type: 'fast', count: 8, interval: 600 }] },
  { enemies: [{ type: 'flying', count: 8, interval: 800 }, { type: 'normal', count: 10, interval: 700 }] },
  { enemies: [{ type: 'tank', count: 4, interval: 1500 }, { type: 'flying', count: 6, interval: 800 }, { type: 'boss', count: 1, interval: 2000 }] },
  { enemies: [{ type: 'fast', count: 15, interval: 400 }, { type: 'tank', count: 6, interval: 1200 }] },
  { enemies: [{ type: 'normal', count: 15, interval: 500 }, { type: 'tank', count: 5, interval: 1000 }, { type: 'flying', count: 8, interval: 700 }, { type: 'boss', count: 2, interval: 3000 }] },
];

export const INITIAL_GOLD = 200;
export const INITIAL_LIVES = 20;
export const MIN_TOWER_DISTANCE = 40; // min distance between towers
export const PATH_EXCLUSION_ZONE = 30; // can't place tower this close to path
