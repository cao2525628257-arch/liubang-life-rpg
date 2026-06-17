import { CONFIG } from '../data/config.js';

/**
 * Canvas 渲染器 — 管理画布缩放、摄像机、基础绘制
 */
class Renderer {
  constructor() {
    /** @type {HTMLCanvasElement} */
    this.canvas = document.getElementById('game');
    /** @type {CanvasRenderingContext2D} */
    this.ctx = this.canvas.getContext('2d', { alpha: false });

    // 设置内部分辨率
    this.canvas.width = CONFIG.GAME_WIDTH;
    this.canvas.height = CONFIG.GAME_HEIGHT;

    // 当前 CSS 缩放比（整数）
    this.scale = 1;

    // 摄像机偏移（世界坐标 → 屏幕坐标）
    this.cameraX = 0;
    this.cameraY = 0;

    this._handleResize();
    window.addEventListener('resize', () => this._handleResize());
  }

  /** 计算并应用整数倍缩放，使画布尽量撑满窗口 */
  _handleResize() {
    const maxW = window.innerWidth;
    const maxH = window.innerHeight;
    const scaleX = Math.floor(maxW / CONFIG.GAME_WIDTH) || 1;
    const scaleY = Math.floor(maxH / CONFIG.GAME_HEIGHT) || 1;
    this.scale = Math.min(scaleX, scaleY);

    this.canvas.style.width = `${CONFIG.GAME_WIDTH * this.scale}px`;
    this.canvas.style.height = `${CONFIG.GAME_HEIGHT * this.scale}px`;
  }

  /** 清空画布 */
  clear(color = '#000000') {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, CONFIG.GAME_WIDTH, CONFIG.GAME_HEIGHT);
  }

  /** 将鼠标/client 坐标转换为游戏内坐标 */
  clientToGame(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: Math.floor((clientX - rect.left) / this.scale),
      y: Math.floor((clientY - rect.top) / this.scale),
    };
  }

  /* ====== 绘制辅助（自动减去摄像机偏移） ====== */

  drawImage(image, x, y, width, height) {
    this.ctx.drawImage(image, x - this.cameraX, y - this.cameraY, width, height);
  }

  drawImageCropped(image, sx, sy, sw, sh, dx, dy, dw, dh) {
    this.ctx.drawImage(image, sx, sy, sw, sh, dx - this.cameraX, dy - this.cameraY, dw, dh);
  }

  drawRect(x, y, w, h, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x - this.cameraX, y - this.cameraY, w, h);
  }

  drawText(text, x, y, color = '#ffffff', font = '12px monospace') {
    this.ctx.fillStyle = color;
    this.ctx.font = font;
    this.ctx.fillText(text, x - this.cameraX, y - this.cameraY);
  }

  /* ====== UI 绘制（不受摄像机影响） ====== */

  drawUIImage(image, x, y, width, height) {
    this.ctx.drawImage(image, x, y, width, height);
  }

  drawUIRect(x, y, w, h, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, w, h);
  }

  drawUIText(text, x, y, color = '#ffffff', font = '12px monospace') {
    this.ctx.fillStyle = color;
    this.ctx.font = font;
    this.ctx.fillText(text, x, y);
  }

  /** 设置摄像机位置 */
  setCamera(x, y) {
    this.cameraX = x;
    this.cameraY = y;
  }

  /** 摄像机平滑跟随目标 */
  follow(targetX, targetY, lerpFactor = 0.1) {
    const targetCamX = targetX - CONFIG.GAME_WIDTH / 2;
    const targetCamY = targetY - CONFIG.GAME_HEIGHT / 2;
    this.cameraX += (targetCamX - this.cameraX) * lerpFactor;
    this.cameraY += (targetCamY - this.cameraY) * lerpFactor;
  }
}

// 单例导出
export const renderer = new Renderer();
export default Renderer;
