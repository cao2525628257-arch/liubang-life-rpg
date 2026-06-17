import { CONFIG } from '../data/config.js';
import { renderer } from './renderer.js';

/**
 * 瓦片地图 — 从二维数组 + 瓦片集渲染地图，支持碰撞检测
 */
export class Tilemap {
  /**
   * @param {object} options
   * @param {number[][]} options.data — 二维数组，每个值为瓦片ID（0=空）
   * @param {HTMLImageElement} options.tileset — 瓦片集图片
   * @param {number} [options.tileWidth=16] — 瓦片宽度
   * @param {number} [options.tileHeight=16] — 瓦片高度
   * @param {number} [options.tilesetCols] — 瓦片集每行列数
   * @param {Set<number>} [options.solidTiles] — 有碰撞的瓦片ID集合
   */
  constructor(options) {
    this.data = options.data || [[]];
    this.tileset = options.tileset || null;
    this.tileWidth = options.tileWidth || CONFIG.TILE_SIZE;
    this.tileHeight = options.tileHeight || CONFIG.TILE_SIZE;
    this.tilesetCols = options.tilesetCols || 16;
    this.solidTiles = options.solidTiles || new Set();

    /** 地图世界尺寸（像素） */
    this.rows = this.data.length;
    this.cols = this.data[0] ? this.data[0].length : 0;
    this.worldWidth = this.cols * this.tileWidth;
    this.worldHeight = this.rows * this.tileHeight;
  }

  /** 渲染视口内的瓦片 */
  render(ctx) {
    if (!this.tileset) return;

    // 计算可见瓦片范围
    const startCol = Math.max(0, Math.floor(renderer.cameraX / this.tileWidth));
    const startRow = Math.max(0, Math.floor(renderer.cameraY / this.tileHeight));
    const endCol = Math.min(this.cols, Math.ceil((renderer.cameraX + CONFIG.GAME_WIDTH) / this.tileWidth) + 1);
    const endRow = Math.min(this.rows, Math.ceil((renderer.cameraY + CONFIG.GAME_HEIGHT) / this.tileHeight) + 1);

    for (let row = startRow; row < endRow; row++) {
      for (let col = startCol; col < endCol; col++) {
        const tileId = this.data[row][col];
        if (tileId === 0) continue; // 空瓦片跳过

        // 从瓦片集计算源坐标（瓦片ID从1开始）
        const srcX = ((tileId - 1) % this.tilesetCols) * this.tileWidth;
        const srcY = Math.floor((tileId - 1) / this.tilesetCols) * this.tileHeight;
        const worldX = col * this.tileWidth;
        const worldY = row * this.tileHeight;

        renderer.drawImageCropped(
          this.tileset,
          srcX, srcY,
          this.tileWidth, this.tileHeight,
          worldX, worldY,
          this.tileWidth, this.tileHeight
        );
      }
    }
  }

  /**
   * 世界坐标 → 瓦片坐标
   * @returns {{col: number, row: number}}
   */
  worldToTile(worldX, worldY) {
    return {
      col: Math.floor(worldX / this.tileWidth),
      row: Math.floor(worldY / this.tileHeight),
    };
  }

  /**
   * 瓦片坐标 → 世界坐标（瓦片左上角）
   * @returns {{x: number, y: number}}
   */
  tileToWorld(col, row) {
    return {
      x: col * this.tileWidth,
      y: row * this.tileHeight,
    };
  }

  /**
   * 获取指定瓦片坐标的瓦片ID
   * @returns {number} 0 表示空/越界
   */
  getTile(col, row) {
    if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
      return -1; // 越界视为实心
    }
    return this.data[row][col];
  }

  /**
   * 指定瓦片是否有碰撞
   */
  isSolid(col, row) {
    if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
      return true; // 地图边界视为实心
    }
    return this.solidTiles.has(this.data[row][col]);
  }

  /**
   * 世界坐标点是否有碰撞
   */
  isSolidAt(worldX, worldY) {
    const { col, row } = this.worldToTile(worldX, worldY);
    return this.isSolid(col, row);
  }

  /**
   * 检测矩形是否与实心瓦片碰撞
   * @param {{x:number, y:number, width:number, height:number}} bounds
   * @returns {boolean}
   */
  collidesWith(bounds) {
    const startCol = Math.floor(bounds.x / this.tileWidth);
    const startRow = Math.floor(bounds.y / this.tileHeight);
    const endCol = Math.floor((bounds.x + bounds.width - 1) / this.tileWidth);
    const endRow = Math.floor((bounds.y + bounds.height - 1) / this.tileHeight);

    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        if (this.isSolid(col, row)) return true;
      }
    }
    return false;
  }
}

/**
 * 从 JSON 格式加载地图数据
 * @param {object} mapJSON — 地图 JSON
 * @param {HTMLImageElement} tileset — 瓦片集图片
 * @returns {Tilemap}
 */
export function createTilemapFromJSON(mapJSON, tileset) {
  return new Tilemap({
    data: mapJSON.data,
    tileset: tileset,
    tileWidth: mapJSON.tileWidth || CONFIG.TILE_SIZE,
    tileHeight: mapJSON.tileHeight || CONFIG.TILE_SIZE,
    tilesetCols: mapJSON.tilesetCols || 16,
    solidTiles: new Set(mapJSON.solidTiles || []),
  });
}

export default Tilemap;
