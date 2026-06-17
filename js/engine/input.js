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

    // 让 canvas 可聚焦，才能接收键盘事件
    canvas.tabIndex = 0;
    canvas.focus();
    // 点击 canvas 时自动聚焦
    canvas.addEventListener('click', () => canvas.focus());
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
