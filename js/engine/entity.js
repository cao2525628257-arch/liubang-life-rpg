import { renderer } from './renderer.js';

/**
 * 实体基类 — 所有游戏对象（角色、NPC、道具）继承此类
 */
export class Entity {
  constructor(x = 0, y = 0, width = 16, height = 16) {
    /** 世界坐标 */
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    /** 精灵图（Image 对象） */
    this.sprite = null;
    /** 精灵图在 tileset 中的源坐标 */
    this.spriteX = 0;
    this.spriteY = 0;

    /** 是否可见 */
    this.visible = true;
    /** 是否有碰撞 */
    this.solid = true;
  }

  /** 获取碰撞矩形 */
  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }

  /**
   * AABB 碰撞检测
   * @param {Entity|{x:number, y:number, width:number, height:number}} other
   * @returns {boolean}
   */
  collidesWith(other) {
    return (
      this.x < other.x + other.width &&
      this.x + this.width > other.x &&
      this.y < other.y + other.height &&
      this.y + this.height > other.y
    );
  }

  /** 每帧更新（子类重写） */
  update(dt) {}

  /** 每帧渲染（子类可重写） */
  render(ctx) {
    if (!this.visible) return;

    if (this.sprite) {
      renderer.drawImageCropped(
        this.sprite,
        this.spriteX, this.spriteY,
        this.width, this.height,
        this.x, this.y,
        this.width, this.height
      );
    } else {
      // 无精灵时绘制占位矩形
      renderer.drawRect(this.x, this.y, this.width, this.height, '#ff00ff');
    }
  }
}

/**
 * 玩家实体（简单移动示例）
 */
export class Player extends Entity {
  constructor(x, y) {
    super(x, y, 16, 16);
    this.speed = 80; // 像素/秒
    this.direction = 'down'; // up/down/left/right
    this.moving = false;
  }

  update(dt) {
    // 子类或 GameScene 负责处理输入和移动
  }
}

export default Entity;
