import { CONFIG } from '../data/config.js';

/**
 * 场景基类 — 所有游戏场景继承此类
 */
class Scene {
  constructor(name = 'Scene') {
    this.name = name;
  }

  /** 场景被推入栈时调用 */
  enter() {}

  /** 场景被移除时调用 */
  exit() {}

  /** 每帧更新 @param {number} dt 秒 */
  update(dt) {}

  /** 每帧渲染 @param {CanvasRenderingContext2D} ctx */
  render(ctx) {}
}

/**
 * 场景管理器 — 场景栈 push/pop/switch
 */
class SceneManager {
  constructor() {
    /** @type {Scene[]} */
    this.stack = [];
  }

  /** 推入新场景（覆盖在当前之上） */
  push(scene) {
    this.stack.push(scene);
    scene.enter();
    if (CONFIG.DEBUG) {
      console.log('[SceneManager] push:', scene.name);
    }
  }

  /** 移除栈顶场景 */
  pop() {
    const scene = this.stack.pop();
    if (scene) {
      scene.exit();
      if (CONFIG.DEBUG) {
        console.log('[SceneManager] pop:', scene.name);
      }
    }
    return scene;
  }

  /** 切换场景（清空栈，推入新场景） */
  switch(scene) {
    while (this.stack.length > 0) {
      this.pop();
    }
    this.push(scene);
  }

  /** 获取栈顶场景 */
  get current() {
    return this.stack[this.stack.length - 1] || null;
  }

  /** 更新栈中所有场景 */
  update(dt) {
    for (const scene of this.stack) {
      scene.update(dt);
    }
  }

  /** 渲染栈中所有场景 */
  render(ctx) {
    for (const scene of this.stack) {
      scene.render(ctx);
    }
  }
}

export const sceneManager = new SceneManager();
export { Scene, SceneManager };
