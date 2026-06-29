import { renderer } from './renderer.js';

/**
 * 输入管理器 — 键盘/鼠标状态追踪
 *
 * 每帧调用 update() 刷新按键按下/释放状态
 */
class Input {
  constructor() {
    /** @type {Set<string>} 当前帧按住的键 */
    this._keysDown = new Set();
    /** @type {Set<string>} 本帧刚按下的键（事件线程写入） */
    this._keysJustPressed = new Set();
    /** @type {Set<string>} 上一帧保留的刚按下键（供场景读取） */
    this._keysPressed = new Set();

    /** @type {{x: number, y: number}} 鼠标 client 坐标（原始） */
    this._mouseClient = { x: 0, y: 0 };
    /** @type {{x: number, y: number}} 鼠标游戏坐标（由 Renderer 转换后） */
    this.mouse = { x: 0, y: 0 };
    this._mouseDown = false;
    this._mouseClicked = false;
    this._mousePrev = false;

    /** @type {HTMLCanvasElement | null} */
    this._canvas = null;

    // 触屏虚拟按键
    /** @type {Map<number, string>} touchId → 'dpad'|'a'|'b' */
    this._touchMap = new Map();
    /** @type {{x:number,y:number}} 方向键方向 */
    this._touchDir = { x: 0, y: 0 };
    /** @type {{A:boolean,B:boolean,Menu:boolean}} 按钮状态 */
    this._touchBtn = { A: false, B: false, Menu: false };
    /** 触屏控件区域（游戏坐标） */
    this.dpadCX = 65; this.dpadCY = 275; this.dpadR = 42;
    this.btnAX = 565; this.btnAY = 275; this.btnR = 20;
    this.btnBX = 520; this.btnBY = 310; this.btnR = 18;
    this.btnMenuX = 610; this.btnMenuY = 25; this.btnMenuR = 16;
    this.btnLX = 580; this.btnLY = 15; this.btnLR = 10;
    this.btnMX = 560; this.btnMY = 15; this.btnMR = 10;
  }

  /** 绑定事件到 canvas */
  bind(canvas) {
    this._canvas = canvas;

    canvas.addEventListener('keydown', (e) => {
      this._keysJustPressed.add(e.code);
      this._keysDown.add(e.code);
      e.preventDefault();
    });

    canvas.addEventListener('keyup', (e) => {
      this._keysDown.delete(e.code);
      e.preventDefault();
    });

    canvas.addEventListener('mousemove', (e) => {
      this._mouseClient.x = e.clientX;
      this._mouseClient.y = e.clientY;
    });

    canvas.addEventListener('mousedown', () => { this._mouseDown = true; });
    canvas.addEventListener('mouseup', () => { this._mouseDown = false; });
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());

    // 触屏事件
    var self = this;
    canvas.addEventListener('touchstart', function(e) { e.preventDefault(); self._onTouchStart(e); }, {passive: false});
    canvas.addEventListener('touchmove', function(e) { e.preventDefault(); self._onTouchMove(e); }, {passive: false});
    canvas.addEventListener('touchend', function(e) { self._onTouchEnd(e); });
    canvas.addEventListener('touchcancel', function(e) { self._onTouchEnd(e); });

    // 让 canvas 可聚焦，才能接收键盘事件
    canvas.tabIndex = 0;
    canvas.focus();
    // 点击 canvas 时自动聚焦
    canvas.addEventListener('click', () => canvas.focus());
  }

  _touchHitTest(gx, gy) {
    // 方向键
    var ddx = gx - this.dpadCX, ddy = gy - this.dpadCY;
    if (Math.hypot(ddx, ddy) < this.dpadR) return 'dpad';
    // A按钮
    if (Math.hypot(gx - this.btnAX, gy - this.btnAY) < this.btnR) return 'a';
    // B按钮
    if (Math.hypot(gx - this.btnBX, gy - this.btnBY) < this.btnR) return 'b';
    // 菜单按钮
    if (Math.hypot(gx - this.btnMenuX, gy - this.btnMenuY) < this.btnMenuR) return 'menu';
    // L语言
    if (Math.hypot(gx - this.btnLX, gy - this.btnLY) < this.btnLR) return 'l';
    // M静音
    if (Math.hypot(gx - this.btnMX, gy - this.btnMY) < this.btnMR) return 'm';
    return null;
  }

  _updateTouchDir(gx, gy) {
    var dx = gx - this.dpadCX, dy = gy - this.dpadCY;
    var dist = Math.hypot(dx, dy);
    if (dist < 12) { this._touchDir.x = 0; this._touchDir.y = 0; return; }
    var angle = Math.atan2(dy, dx);
    if (angle > -Math.PI*0.75 && angle <= -Math.PI*0.25) this._touchDir = {x:0,y:-1};
    else if (angle > -Math.PI*0.25 && angle <= Math.PI*0.25) this._touchDir = {x:1,y:0};
    else if (angle > Math.PI*0.25 && angle <= Math.PI*0.75) this._touchDir = {x:0,y:1};
    else this._touchDir = {x:-1,y:0};
  }

  _onTouchStart(e) {
    var touches = e.changedTouches;
    for (var i = 0; i < touches.length; i++) {
      var t = touches[i];
      var gx = t.clientX, gy = t.clientY;
      if (this._canvas) {
        var rect = this._canvas.getBoundingClientRect();
        var s = renderer.scale || 1;
        gx = (t.clientX - rect.left) / s;
        gy = (t.clientY - rect.top) / s;
      }
      var type = this._touchHitTest(gx, gy);
      if (!type) {
        // 未命中按钮 → 记录为自由触摸（松手时模拟点击）
        this._touchMap.set(t.identifier, 'free');
        continue;
      }
      this._touchMap.set(t.identifier, type);
      if (type === 'dpad') { this._updateTouchDir(gx, gy); this._injectDirKeys(); }
      else if (type === 'a') { this._touchBtn.A = true; this._keysJustPressed.add('KeyT'); this._keysDown.add('KeyT'); }
      else if (type === 'b') { this._touchBtn.B = true; this._keysJustPressed.add('Enter'); this._keysDown.add('Enter'); }
      else if (type === 'menu') { this._touchBtn.Menu = true; this._keysJustPressed.add('Escape'); this._keysDown.add('Escape'); }
      else if (type === 'l') { this._keysJustPressed.add('KeyL'); }
      else if (type === 'm') { this._keysJustPressed.add('KeyM'); }
    }
  }

  _onTouchMove(e) {
    var touches = e.changedTouches;
    for (var i = 0; i < touches.length; i++) {
      var t = touches[i];
      var type = this._touchMap.get(t.identifier);
      if (!type) continue;
      var gx = t.clientX, gy = t.clientY;
      if (this._canvas) {
        var rect = this._canvas.getBoundingClientRect();
        var s = renderer.scale || 1;
        gx = (t.clientX - rect.left) / s;
        gy = (t.clientY - rect.top) / s;
      }
      if (type === 'dpad') { this._updateTouchDir(gx, gy); this._injectDirKeys(); }
      else if (type === 'a') {
        var inA = Math.hypot(gx - this.btnAX, gy - this.btnAY) < this.btnR + 8;
        if (!inA && this._touchBtn.A) { this._touchBtn.A = false; this._keysDown.delete('KeyT'); }
      }
      else if (type === 'b') {
        var inB = Math.hypot(gx - this.btnBX, gy - this.btnBY) < this.btnR + 8;
        if (!inB && this._touchBtn.B) { this._touchBtn.B = false; this._keysDown.delete('Enter'); }
      }
    }
  }

  _onTouchEnd(e) {
    var touches = e.changedTouches;
    for (var i = 0; i < touches.length; i++) {
      var t = touches[i];
      var type = this._touchMap.get(t.identifier);
      if (!type) continue;
      if (type === 'dpad') { this._touchDir.x = 0; this._touchDir.y = 0; this._clearDirKeys(); }
      else if (type === 'a') { this._touchBtn.A = false; this._keysDown.delete('KeyT'); }
      else if (type === 'b') { this._touchBtn.B = false; this._keysDown.delete('Enter'); }
      else if (type === 'menu') { this._touchBtn.Menu = false; this._keysDown.delete('Escape'); }
      else if (type === 'free') {
        // 空白区域轻点 → 模拟确认键（标题画面、对话框等场景通用）
        this._keysJustPressed.add('KeyT');
        this._keysJustPressed.add('Enter');
      }
      this._touchMap.delete(t.identifier);
    }
  }

  _injectDirKeys() {
    this._clearDirKeys();
    if (this._touchDir.y === -1) { this._keysDown.add('ArrowUp'); this._keysJustPressed.add('ArrowUp'); }
    if (this._touchDir.y === 1) { this._keysDown.add('ArrowDown'); this._keysJustPressed.add('ArrowDown'); }
    if (this._touchDir.x === -1) { this._keysDown.add('ArrowLeft'); this._keysJustPressed.add('ArrowLeft'); }
    if (this._touchDir.x === 1) { this._keysDown.add('ArrowRight'); this._keysJustPressed.add('ArrowRight'); }
  }

  _clearDirKeys() {
    this._keysDown.delete('ArrowUp'); this._keysDown.delete('ArrowDown');
    this._keysDown.delete('ArrowLeft'); this._keysDown.delete('ArrowRight');
  }

  /** 每帧开始时调用，刷新 transient 状态，更新鼠标游戏坐标 */
  update(renderer) {
    // 保存"刚按下"到上一帧缓冲（供场景读取）
    this._keysPressed = new Set(this._keysJustPressed);
    this._keysJustPressed.clear();

    // 转换鼠标坐标
    if (this._canvas && renderer) {
      const gamePos = renderer.clientToGame(this._mouseClient.x, this._mouseClient.y);
      this.mouse.x = gamePos.x;
      this.mouse.y = gamePos.y;
    }

    this._mouseClicked = this._mouseDown && !this._mousePrev;
    this._mousePrev = this._mouseDown;
  }

  /** 按键是否持续按住 */
  isKeyDown(code) {
    return this._keysDown.has(code);
  }

  /** 按键是否刚按下（仅本帧为 true） */
  isKeyPressed(code) {
    return this._keysPressed.has(code);
  }

  /** 是否有任意键刚按下 */
  isAnyKeyPressed() {
    return this._keysPressed.size > 0;
  }

  /** 鼠标是否刚点击（本帧按下） */
  isMouseClicked() {
    return this._mouseClicked;
  }

  /** 鼠标是否按住 */
  isMouseDown() {
    return this._mouseDown;
  }
}

export const input = new Input();
export default Input;
