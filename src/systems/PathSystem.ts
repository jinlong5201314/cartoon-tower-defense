
import { PATH_POINTS, PATH_EXCLUSION_ZONE } from '../config/gameConfig';

export class PathSystem {
  points: { x: number; y: number }[];
  totalLength: number;
  segmentLengths: number[];

  constructor() {
    this.points = PATH_POINTS;
    this.segmentLengths = [];
    this.totalLength = 0;
    for (let i = 1; i < this.points.length; i++) {
      const dx = this.points[i].x - this.points[i - 1].x;
      const dy = this.points[i].y - this.points[i - 1].y;
      const len = Math.sqrt(dx * dx + dy * dy);
      this.segmentLengths.push(len);
      this.totalLength += len;
    }
  }

  /** 根据行进距离获取路径上的位置 */
  getPositionAtDistance(distance: number): { x: number; y: number } {
    if (distance <= 0) return { ...this.points[0] };
    if (distance >= this.totalLength) return { ...this.points[this.points.length - 1] };

    let remaining = distance;
    for (let i = 0; i < this.segmentLengths.length; i++) {
      if (remaining <= this.segmentLengths[i]) {
        const t = remaining / this.segmentLengths[i];
        return {
          x: this.points[i].x + (this.points[i + 1].x - this.points[i].x) * t,
          y: this.points[i].y + (this.points[i + 1].y - this.points[i].y) * t,
        };
      }
      remaining -= this.segmentLengths[i];
    }
    return { ...this.points[this.points.length - 1] };
  }

  /** 检测点是否太靠近路径 */
  isNearPath(x: number, y: number, threshold: number = PATH_EXCLUSION_ZONE): boolean {
    for (let i = 0; i < this.points.length - 1; i++) {
      const dist = this.pointToSegmentDistance(x, y, this.points[i], this.points[i + 1]);
      if (dist < threshold) return true;
    }
    return false;
  }

  private pointToSegmentDistance(px: number, py: number, a: { x: number; y: number }, b: { x: number; y: number }): number {
    const dx = b.x - a.x, dy = b.y - a.y;
    const lenSq = dx * dx + dy * dy;
    if (lenSq === 0) return Math.sqrt((px - a.x) ** 2 + (py - a.y) ** 2);
    let t = ((px - a.x) * dx + (py - a.y) * dy) / lenSq;
    t = Math.max(0, Math.min(1, t));
    const projX = a.x + t * dx, projY = a.y + t * dy;
    return Math.sqrt((px - projX) ** 2 + (py - projY) ** 2);
  }

  drawPath(graphics: Phaser.GameObjects.Graphics): void {
    // 路径底色（泥土路）
    graphics.lineStyle(36, 0xd4a574, 1);
    graphics.beginPath();
    graphics.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 1; i < this.points.length; i++) {
      graphics.lineTo(this.points[i].x, this.points[i].y);
    }
    graphics.strokePath();

    // 路径边缘
    graphics.lineStyle(40, 0xb8956a, 0.5);
    graphics.beginPath();
    graphics.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 1; i < this.points.length; i++) {
      graphics.lineTo(this.points[i].x, this.points[i].y);
    }
    graphics.strokePath();

    // 路径虚线（行进方向提示）
    graphics.lineStyle(2, 0xffffff, 0.3);
    for (let d = 0; d < this.totalLength; d += 20) {
      const p1 = this.getPositionAtDistance(d);
      const p2 = this.getPositionAtDistance(d + 10);
      graphics.beginPath();
      graphics.moveTo(p1.x, p1.y);
      graphics.lineTo(p2.x, p2.y);
      graphics.strokePath();
    }
  }
}
