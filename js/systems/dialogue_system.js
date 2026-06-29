import { CONFIG, COLORS } from '../data/config.js';
import { renderer } from '../engine/renderer.js';
import { audio } from '../engine/audio_manager.js';

/**
 * 对话框系统 — 打字机效果 + 选项菜单
 */
export class DialogueSystem {
  constructor() {
    /** 对话框位置和尺寸 */
    this.x = 16;
    this.y = CONFIG.GAME_HEIGHT - 120;
    this.width = CONFIG.GAME_WIDTH - 32;
    this.height = 104;

    /** 当前状态 */
    this.active = false;
    this._fullText = '';
    this._displayedText = '';
    this._charIndex = 0;
    this._charTimer = 0;
    this._charSpeed = 0.03;
    this._finished = false;
    this._finishCD = 0; // 刚完成冷却，防止同帧Enter直接关
    this._speaker = '';
    this._voiceType = 'default'; // NPC语气音类型
    this._lastVoiceIdx = -1;     // 上次播放语气音时的charIndex

    /** 选项 */
    this._choices = [];
    this._selectedChoice = 0;

    /** 回调 */
    this._onComplete = null;
    this._onChoice = null;
    this._lastChoiceIdx = -1;
  }

  /**
   * 显示对话框
   * @param {string} text — 对话内容
   * @param {string} [speaker] — 说话人名字
   * @param {string} [voiceType] — 语气音类型: default/female/warrior/scholar/elder/king/soldier/mystic
   * @returns {Promise<void>} 对话完成后 resolve
   */
  show(text, speaker = '', voiceType = 'default') {
    this.active = true;
    this._fullText = text;
    this._displayedText = '';
    this._charIndex = 0;
    this._charTimer = 0;
    this._finished = false;
    this._speaker = speaker;
    this._voiceType = voiceType;
    this._lastVoiceIdx = -1;
    this._choices = [];

    return new Promise((resolve) => {
      this._onComplete = resolve;
    });
  }

  /**
   * 显示选项
   * @param {string[]} choices
   * @returns {Promise<number>} 返回选中的索引
   */
  showChoices(choices) {
    this.active = true;
    this._finished = true;
    this._finishCD = 0;
    this._fullText = '';
    this._displayedText = '';
    this._choices = choices;
    this._selectedChoice = 0;
    return new Promise((resolve) => {
      this._onChoice = resolve;
    });
  }

  /** @param {number} dt */
  update(dt) {
    if (!this.active) return;
    if (this._finishCD > 0) this._finishCD -= dt;

    // 打字机效果
    if (!this._finished && this._charIndex < this._fullText.length) {
      this._charTimer += dt;
      while (this._charTimer >= this._charSpeed && this._charIndex < this._fullText.length) {
        this._charIndex++;
        this._charTimer -= this._charSpeed;
        // 每2~3个可见字播放一次语气音
        var visibleCount = this._fullText.substring(0, this._charIndex).replace(/[\s\n]/g, '').length;
        if (visibleCount > 0 && visibleCount % 3 === 0 && this._lastVoiceIdx !== visibleCount) {
          this._lastVoiceIdx = visibleCount;
          audio.playVoice(this._voiceType);
        }
      }
      this._displayedText = this._fullText.substring(0, this._charIndex);

      if (this._charIndex >= this._fullText.length) {
        this._finished = true;
        this._finishCD = 0.35; // 完成后0.35秒冷却
      }
    }
  }

  /**
   * 处理按键输入
   * @param {import('../engine/input.js').default} input
   */
  handleInput(input) {
    if (!this.active) return;
    const ok = (code) => input.isKeyPressed(code);

    if (this._choices.length > 0) {
      if (ok('ArrowUp')) this._selectedChoice = Math.max(0, this._selectedChoice - 1);
      if (ok('ArrowDown')) this._selectedChoice = Math.min(this._choices.length - 1, this._selectedChoice + 1);
      if (ok('Enter') || ok('Space') || ok('KeyT')) {
        const cb = this._onChoice; this._lastChoiceIdx = this._selectedChoice;
        this._onChoice = null; this._choices = []; this.active = false;
        if (cb) cb(this._selectedChoice);
      }
      return;
    }

    // T/Enter/Space = 跳过或关闭
    if (ok('Enter') || ok('Space') || ok('KeyT')) {
      audio.playSFX('dialogue');
      if (!this._finished) {
        // 还没打完 → 跳到结尾
        this._displayedText = this._fullText;
        this._charIndex = this._fullText.length;
        this._finished = true;
        this._finishCD = 0.35;
      } else if (this._finishCD <= 0) {
        // 打完且冷却过 → 关闭
        this.active = false;
        const cb = this._onComplete; this._onComplete = null;
        if (cb) cb();
      }
      // 冷却中按Enter无效，必须等冷却完
    }
  }

  /** 文字自动换行 */
  _wrapText(ctx, text, maxWidth, fontSize) {
    ctx.font = fontSize;
    const lines = []; let current = '';
    for (const ch of text) {
      if (ch === '\n') { lines.push(current); current = ''; continue; }
      const test = current + ch;
      if (ctx.measureText(test).width > maxWidth && current.length > 0) {
        lines.push(current); current = ch;
      } else { current = test; }
    }
    if (current) lines.push(current);
    return lines;
  }

  /** @param {CanvasRenderingContext2D} ctx */
  render(ctx) {
    if (!this.active) return;

    // 对话框背景
    renderer.drawUIRect(this.x, this.y, this.width, this.height, 'rgba(0,0,0,0.85)');
    ctx.strokeStyle = COLORS.GOLD;
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.width, this.height);

    const fn = '12px "PingFang SC","Microsoft YaHei","Noto Sans SC",monospace';

    // 说话人名字
    if (this._speaker) {
      renderer.drawUIText(this._speaker, this.x + 12, this.y + 18, COLORS.GOLD, 'bold '+fn);
    }

    // 对话文字（自动换行）
    const textX = this.x + 16;
    const textY = this._speaker ? this.y + 40 : this.y + 30;
    const maxW = this.width - 40;
    const lines = this._wrapText(ctx, this._displayedText, maxW, fn);
    lines.forEach((line, i) => {
      if (i < 4) {
        renderer.drawUIText(line, textX, textY + i * 18, COLORS.WHITE, fn);
      }
    });

    // 完成提示三角
    if (this._finished && this._choices.length === 0) {
      ctx.fillStyle = COLORS.GOLD;
      ctx.beginPath();
      ctx.moveTo(this.x + this.width - 20, this.y + this.height - 14);
      ctx.lineTo(this.x + this.width - 12, this.y + this.height - 14);
      ctx.lineTo(this.x + this.width - 16, this.y + this.height - 8);
      ctx.closePath();
      ctx.fill();
    }

    // 选项渲染（在文字区域下方）
    if (this._choices.length > 0) {
      const choiceY = this.y + this.height - 60;
      this._choices.forEach((choice, i) => {
        const cy = choiceY + i * 24;
        const isSelected = i === this._selectedChoice;
        renderer.drawUIText((isSelected ? '▶ ' : '  ') + choice, this.x + 24, cy,
          isSelected ? COLORS.GOLD : COLORS.WHITE, fn);
      });
    }
  }
}
