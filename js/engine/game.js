import { CONFIG } from '../data/config.js';
import { renderer } from './renderer.js';
import { input } from './input.js';
import { sceneManager } from './scene_manager.js';
import { TitleScene } from '../scenes/title_scene.js';

/**
 * Game 主类 — 驱动游戏循环，协调各子系统
 */
class Game {
  constructor() {
    this.running = false;
    this.lastTime = 0;
    this.accumulator = 0;
    this.fixedDt = 1000 / CONFIG.TARGET_FPS; // 固定时间步长 (ms)
    this.frameCount = 0;
    this.fpsTimer = 0;
    this.currentFPS = 0;
  }

  /** 启动游戏 */
  start() {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.accumulator = 0;

    // 绑定输入到 canvas
    input.bind(renderer.canvas);

    if (CONFIG.DEBUG) {
      console.log('[Game] 启动引擎 — 分辨率 %dx%d', CONFIG.GAME_WIDTH, CONFIG.GAME_HEIGHT);
    }

    // 进入初始场景
    sceneManager.switch(new TitleScene());

    // 启动游戏循环
    requestAnimationFrame((t) => this._loop(t));
  }

  /** 游戏循环（固定时间步长 + 可变渲染） */
  _loop(now) {
    if (!this.running) return;

    const elapsed = now - this.lastTime;
    this.lastTime = now;

    // 防止大帧跳跃（如切标签页回来）
    const clampedElapsed = Math.min(elapsed, 200);
    this.accumulator += clampedElapsed;

    // 固定步长更新
    while (this.accumulator >= this.fixedDt) {
      input.update(renderer);              // 刷新输入状态
      sceneManager.update(this.fixedDt / 1000); // 秒为单位
      this.accumulator -= this.fixedDt;
    }

    // 渲染
    renderer.clear('#000000');
    try { sceneManager.render(renderer.ctx); }
    catch(e) { renderer.drawUIText('ERR:'+e.message, 10, 30, '#f44', '9px monospace'); }

    // FPS
    this._updateFPS(elapsed);
    renderer.drawUIText(`FPS:${this.currentFPS}`, 4, 10, '#0f0', '9px monospace');

    requestAnimationFrame((t) => this._loop(t));
  }

  _updateFPS(elapsed) {
    this.frameCount++;
    this.fpsTimer += elapsed;
    if (this.fpsTimer >= 1000) {
      this.currentFPS = this.frameCount;
      this.frameCount = 0;
      this.fpsTimer -= 1000;
    }
  }

  /** 停止游戏循环 */
  stop() {
    this.running = false;
  }
}

// 单例导出
export const game = new Game();
export default Game;
