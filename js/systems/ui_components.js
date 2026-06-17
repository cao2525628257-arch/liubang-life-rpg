import { renderer } from '../engine/renderer.js';
import { COLORS } from '../data/config.js';

/**
 * UI 组件库 — Button、Panel、ProgressBar
 * 所有组件使用像素风格绘制（无外部图片依赖）
 */

/**
 * 按钮组件
 */
export class Button {
  /**
   * @param {object} options
   * @param {number} options.x
   * @param {number} options.y
   * @param {number} options.width
   * @param {number} options.height
   * @param {string} options.text
   * @param {() => void} [options.onClick]
   */
  constructor(options) {
    this.x = options.x;
    this.y = options.y;
    this.width = options.width || 120;
    this.height = options.height || 28;
    this.text = options.text || '';
    this.onClick = options.onClick || null;
    this.hovered = false;
    this.enabled = true;
  }

  /** 检查鼠标是否在按钮内 */
  containsPoint(mx, my) {
    return mx >= this.x && mx <= this.x + this.width &&
           my >= this.y && my <= this.y + this.height;
  }

  /** @param {import('../engine/input.js').default} input */
  update(input) {
    this.hovered = this.containsPoint(input.mouse.x, input.mouse.y);
    if (this.hovered && input.isMouseClicked() && this.enabled && this.onClick) {
      this.onClick();
    }
  }

  render(ctx) {
    const bgColor = this.hovered ? '#555555' : '#333333';
    const borderColor = this.hovered ? COLORS.GOLD : '#666666';
    const textColor = this.enabled ? COLORS.WHITE : '#666666';

    // 背景
    renderer.drawUIRect(this.x, this.y, this.width, this.height, bgColor);

    // 像素边框
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 1;
    ctx.strokeRect(this.x + 0.5, this.y + 0.5, this.width - 1, this.height - 1);

    // 文字居中
    ctx.fillStyle = textColor;
    ctx.font = '11px monospace';
    const textW = ctx.measureText(this.text).width;
    ctx.fillText(
      this.text,
      this.x + (this.width - textW) / 2,
      this.y + this.height / 2 + 4
    );
  }
}

/**
 * 面板组件（带标题的矩形框）
 */
export class Panel {
  constructor(x, y, width, height, title = '') {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.title = title;
    this.visible = true;
  }

  render(ctx) {
    if (!this.visible) return;

    // 背景
    renderer.drawUIRect(this.x, this.y, this.width, this.height, 'rgba(0,0,0,0.9)');

    // 双线像素边框
    ctx.strokeStyle = COLORS.GOLD;
    ctx.lineWidth = 1;
    ctx.strokeRect(this.x + 0.5, this.y + 0.5, this.width - 1, this.height - 1);
    ctx.strokeStyle = '#666';
    ctx.strokeRect(this.x + 2.5, this.y + 2.5, this.width - 5, this.height - 5);

    // 标题
    if (this.title) {
      renderer.drawUIText(
        this.title,
        this.x + 12,
        this.y + 18,
        COLORS.GOLD,
        'bold 12px monospace'
      );
    }
  }
}

/**
 * 进度条组件（水平）
 */
export class ProgressBar {
  /**
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   * @param {number} maxValue
   * @param {number} [currentValue]
   * @param {string} [fillColor]
   */
  constructor(x, y, width, height, maxValue, currentValue = maxValue, fillColor = '#c13a3a') {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.maxValue = maxValue;
    this.currentValue = currentValue;
    this.fillColor = fillColor;
  }

  get ratio() {
    return Math.max(0, Math.min(1, this.currentValue / this.maxValue));
  }

  render(ctx) {
    // 背景
    renderer.drawUIRect(this.x, this.y, this.width, this.height, '#111111');
    // 填充
    if (this.ratio > 0) {
      renderer.drawUIRect(this.x, this.y, Math.floor(this.width * this.ratio), this.height, this.fillColor);
    }
    // 边框
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 1;
    ctx.strokeRect(this.x + 0.5, this.y + 0.5, this.width - 1, this.height - 1);
  }
}
