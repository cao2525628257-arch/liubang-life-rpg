import { Scene } from '../engine/scene_manager.js';
import { sceneManager } from '../engine/scene_manager.js';
import { renderer } from '../engine/renderer.js';
import { CONFIG, COLORS } from '../data/config.js';
import { generateTileset, generateCharacterSprite, generateNPCSprite, generateFemaleSprite, generateWarriorSprite, generateEmperorSprite, generateSnakeSprite, generateQinSoldierSprite, generateChuSoldierSprite, generateXiaoheSprite, generateHanxinSprite, generateZhangliangSprite, generateChenpingSprite, generateEmperorLiuSprite, generateFankuaiSprite, generateFanzengSprite, generatePengyueSprite, generateXiangboSprite, generateJixinSprite, PAL } from '../engine/pixel_art_gen.js';
import { GameScene } from './game_scene.js';
import { t } from '../systems/localization.js';

export class LoadingScene extends Scene {
  constructor() {
    super('LoadingScene');
    this._progress = 0;
    this._status = '';
    this._assets = {};
  }

  enter() {
    this._generateAll();
  }

  async _generateAll() {
    const steps = [
      { key: 'tileset', label: t('loading')+' [1/8]', fn: ()=>generateTileset() },
      { key: 'player', label: t('loading')+' [2/8]', fn: ()=>generateCharacterSprite() },
      { key: 'npc_villager', label: t('loading')+' [3/8]', fn: ()=>generateNPCSprite('#4a7a3a') },
      { key: 'npc_guard', label: t('loading')+' [4/8]', fn: ()=>generateNPCSprite('#3a4a8a') },
      { key: 'npc_female', label: t('loading')+' [5/8]', fn: ()=>generateFemaleSprite() },
      { key: 'npc_warrior', label: t('loading')+' [6/8]', fn: ()=>generateWarriorSprite() },
      { key: 'npc_emperor', label: t('loading')+' [7/8]', fn: ()=>generateEmperorSprite() },
      { key: 'npc_snake', label: t('loading')+' [8/10]', fn: ()=>generateSnakeSprite() },
      { key: 'npc_qin', label: t('loading')+' [9/10]', fn: ()=>generateQinSoldierSprite() },
      { key: 'npc_chu', label: t('loading')+' [10/18]', fn: ()=>generateChuSoldierSprite() },
      { key: 'npc_xiaohe', label: t('loading')+' [11/18]', fn: ()=>generateXiaoheSprite() },
      { key: 'npc_hanxin', label: t('loading')+' [12/18]', fn: ()=>generateHanxinSprite() },
      { key: 'npc_zhangliang', label: t('loading')+' [13/18]', fn: ()=>generateZhangliangSprite() },
      { key: 'npc_chenping', label: t('loading')+' [14/18]', fn: ()=>generateChenpingSprite() },
      { key: 'npc_liuhuang', label: t('loading')+' [15/18]', fn: ()=>generateEmperorLiuSprite() },
      { key: 'npc_fankuai', label: t('loading')+' [16/18]', fn: ()=>generateFankuaiSprite() },
      { key: 'npc_fanzeng', label: t('loading')+' [17/18]', fn: ()=>generateFanzengSprite() },
      { key: 'npc_pengyue', label: t('loading')+' [18/18]', fn: ()=>generatePengyueSprite() },
    ];

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      this._status = step.label;
      this._progress = i / steps.length;
      await new Promise(r => requestAnimationFrame(r));
      this._assets[step.key] = await step.fn();
      this._progress = (i + 1) / steps.length;
    }

    this._status = '✓';
    await new Promise(r => setTimeout(r, 200));

    sceneManager.switch(new GameScene(this._assets));
  }

  update(dt) {}

  render(ctx) {
    renderer.drawUIRect(0, 0, CONFIG.GAME_WIDTH, CONFIG.GAME_HEIGHT, COLORS.DARK_BG);
    renderer.drawUIText(t('title'), CONFIG.GAME_WIDTH / 2 - 96, CONFIG.GAME_HEIGHT / 2 - 55, COLORS.GOLD, 'bold 28px monospace');

    const barW = 280, barH = 14;
    const barX = (CONFIG.GAME_WIDTH - barW) / 2, barY = CONFIG.GAME_HEIGHT / 2;
    renderer.drawUIRect(barX, barY, barW, barH, '#111');
    const fillW = Math.floor(barW * this._progress);
    if (fillW > 2) renderer.drawUIRect(barX + 2, barY + 2, fillW - 4, barH - 4, COLORS.GOLD);
    renderer.drawUIText(this._status, barX, barY + 26, COLORS.PARCHMENT, '10px monospace');
  }
}
