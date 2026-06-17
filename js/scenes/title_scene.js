import { Scene } from '../engine/scene_manager.js';
import { sceneManager } from '../engine/scene_manager.js';
import { input } from '../engine/input.js';
import { renderer } from '../engine/renderer.js';
import { CONFIG, COLORS } from '../data/config.js';
import { LoadingScene } from './loading_scene.js';
import { t, lang, initLang } from '../systems/localization.js';

export class TitleScene extends Scene {
  constructor() {
    super('TitleScene');
    this._blink = 0; this._show = true;
  }

  enter() {
    initLang();
    if (CONFIG.DEBUG) console.log('[Title] lang:', lang());
  }

  update(dt) {
    this._blink += dt;
    if (this._blink >= 0.5) { this._blink = 0; this._show = !this._show; }
    if (input.isKeyPressed('KeyL')) { lang(lang() === 'zh' ? 'en' : 'zh'); }
    if (input.isAnyKeyPressed() || input.isMouseClicked()) {
      sceneManager.switch(new LoadingScene());
    }
  }

  render(ctx) {
    renderer.drawUIRect(0, 0, CONFIG.GAME_WIDTH, CONFIG.GAME_HEIGHT, COLORS.DARK_BG);

    // 装饰线
    ctx.strokeStyle = COLORS.GOLD; ctx.lineWidth = 1;
    const topY = CONFIG.GAME_HEIGHT / 2 - 60, botY = CONFIG.GAME_HEIGHT / 2 + 45;
    ctx.beginPath(); ctx.moveTo(100, topY); ctx.lineTo(CONFIG.GAME_WIDTH - 100, topY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(100, botY); ctx.lineTo(CONFIG.GAME_WIDTH - 100, botY); ctx.stroke();

    // 中文标题
    renderer.drawUIText(t('title'), CONFIG.GAME_WIDTH / 2 - 96, CONFIG.GAME_HEIGHT / 2 - 34, COLORS.GOLD, 'bold 32px monospace');

    // 英文副标题
    renderer.drawUIText(t('subtitle'), CONFIG.GAME_WIDTH / 2 - 90, CONFIG.GAME_HEIGHT / 2 + 8, '#6a6a8a', '13px monospace');

    // 版本
    renderer.drawUIText('v0.2 — History RPG', CONFIG.GAME_WIDTH / 2 - 78, CONFIG.GAME_HEIGHT / 2 + 28, '#4a4a6a', '10px monospace');

    // L 切换语言提示
    const ll = lang() === 'zh' ? 'L = English' : 'L = 中文';
    renderer.drawUIText(ll, CONFIG.GAME_WIDTH - 90, CONFIG.GAME_HEIGHT - 16, '#555', '9px monospace');

    if (this._show) {
      renderer.drawUIText(t('press_start'), CONFIG.GAME_WIDTH / 2 - 70, CONFIG.GAME_HEIGHT / 2 + 66, COLORS.WHITE, '12px monospace');
    }
  }
}
