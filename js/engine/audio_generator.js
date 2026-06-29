/**
 * 音频生成器 — Web Audio API 程序化生成复古芯片风 BGM + SFX
 * 零外部依赖，所有音效均在运行时合成
 *
 * BGM: 五声音阶（宫商角徵羽）旋律，step sequencer 循环播放
 * SFX: 短促振荡器包络，即时触发
 */

// ── 五声音阶（Chinese Pentatonic）频率表 ──
const P = {
  C3: 131, D3: 147, E3: 165, G3: 196, A3: 220,
  C4: 262, D4: 294, E4: 330, G4: 392, A4: 440,
  C5: 523, D5: 587, E5: 659, G5: 784, A5: 880,
  C6: 1047, D6: 1175, E6: 1319,
  R: 0, // 休止符
};

// ── BGM 曲谱定义 [频率, 拍数(四分音符=1)] ──

/** 城镇 BGM — 80 BPM，宁静悠远 */
const TOWN_MELODY = [
  [P.E4, 1], [P.G4, 0.5], [P.A4, 0.5], [P.G4, 1], [P.E4, 0.5], [P.D4, 0.5], [P.C4, 2], [P.R, 0.5],
  [P.D4, 1], [P.E4, 0.5], [P.G4, 0.5], [P.E4, 1], [P.D4, 1], [P.C4, 2], [P.R, 0.5],
  [P.E4, 1], [P.G4, 1], [P.A4, 1], [P.C5, 0.5], [P.A4, 0.5], [P.G4, 1], [P.E4, 2], [P.R, 0.5],
  [P.D4, 0.5], [P.C4, 0.5], [P.D4, 1], [P.E4, 0.5], [P.G4, 0.5], [P.E4, 1], [P.D4, 1], [P.C4, 2],
];

/** 野外 BGM — 100 BPM，冒险探索 */
const FIELD_MELODY = [
  [P.E4, 0.5], [P.G4, 0.5], [P.E5, 0.5], [P.D5, 0.5], [P.C5, 0.5], [P.A4, 0.5], [P.G4, 1], [P.E4, 0.5], [P.R, 0.25],
  [P.C4, 0.5], [P.D4, 0.5], [P.E4, 0.5], [P.G4, 0.5], [P.A4, 1], [P.G4, 0.5], [P.E4, 1], [P.D4, 0.5], [P.R, 0.25],
  [P.E4, 0.5], [P.G4, 0.5], [P.A4, 0.5], [P.C5, 0.5], [P.D5, 0.5], [P.C5, 0.5], [P.A4, 1], [P.G4, 0.5], [P.R, 0.25],
  [P.G4, 0.5], [P.A4, 0.5], [P.G4, 0.5], [P.E4, 0.5], [P.D4, 1.5], [P.C4, 1.5], [P.R, 0.5],
];

/** 宫殿 BGM — 65 BPM，庄重威严 */
const PALACE_MELODY = [
  [P.C4, 2], [P.G4, 1], [P.E4, 1], [P.C5, 2], [P.G4, 1], [P.E4, 1], [P.D4, 2], [P.R, 1],
  [P.C4, 2], [P.D4, 1], [P.E4, 1], [P.G4, 2], [P.A4, 1], [P.G4, 1], [P.E4, 2], [P.R, 1],
  [P.E4, 2], [P.G4, 2], [P.C5, 2], [P.A4, 1], [P.G4, 1], [P.E4, 2], [P.R, 1],
  [P.C5, 1], [P.A4, 1], [P.G4, 1], [P.E4, 1], [P.D4, 3], [P.C4, 3],
];

/** 战斗 BGM — 140 BPM，紧张急促 */
const BATTLE_MELODY = [
  [P.E4, 0.5], [P.E4, 0.5], [P.E4, 1], [P.C4, 1], [P.E4, 1], [P.G4, 0.5], [P.A4, 0.5], [P.G4, 1], [P.R, 0.5],
  [P.E4, 0.5], [P.E4, 0.5], [P.E4, 1], [P.C4, 1], [P.E4, 1], [P.G4, 1], [P.A4, 1], [P.R, 0.5],
  [P.G4, 0.5], [P.G4, 0.5], [P.G4, 1], [P.E4, 1], [P.G4, 1], [P.A4, 0.5], [P.C5, 0.5], [P.A4, 1], [P.R, 0.5],
  [P.A4, 0.5], [P.A4, 0.5], [P.A4, 1], [P.G4, 1], [P.E4, 2.5], [P.R, 0.5],
];

/** 标题 BGM — 60 BPM，史诗开场 */
const TITLE_MELODY = [
  [P.C4, 3], [P.R, 0.5], [P.G4, 2], [P.E4, 1.5], [P.C5, 3], [P.R, 0.5],
  [P.A4, 2], [P.G4, 1.5], [P.E4, 3], [P.R, 1],
  [P.D4, 2], [P.E4, 1.5], [P.G4, 2], [P.E4, 1.5], [P.A4, 3], [P.R, 0.5],
  [P.G4, 2], [P.E4, 2], [P.D4, 2], [P.C4, 3], [P.R, 0.5],
  [P.G3, 3], [P.C4, 2], [P.D4, 1.5], [P.E4, 3], [P.R, 1],
  [P.G4, 3], [P.A4, 2], [P.C5, 3], [P.R, 1],
];

// BGM 配置表
const BGM_DEFS = {
  town:   { melody: TOWN_MELODY,   bpm: 80,  wave: 'square', vol: 0.10 },
  field:  { melody: FIELD_MELODY,  bpm: 100, wave: 'square', vol: 0.09 },
  palace: { melody: PALACE_MELODY, bpm: 65,  wave: 'triangle', vol: 0.11 },
  battle: { melody: BATTLE_MELODY, bpm: 140, wave: 'square', vol: 0.08 },
  title:  { melody: TITLE_MELODY,  bpm: 60,  wave: 'triangle', vol: 0.12 },
};

// SFX 定义 { freq, dur(秒), type, sweep?, vol }
const SFX_DEFS = {
  menu_open:   { f1: P.C5, f2: P.G5, dur: 0.10, type: 'square', vol: 0.15 },
  menu_select: { f1: P.G5, f2: P.G5, dur: 0.06, type: 'square', vol: 0.18 },
  menu_move:   { f1: P.C6, f2: P.C6, dur: 0.03, type: 'square', vol: 0.10 },
  dialogue:    { f1: P.C5, f2: P.E5, dur: 0.10, type: 'sine',   vol: 0.10 },
  hit:         { f1: 100,  f2: 60,   dur: 0.15, type: 'sawtooth', vol: 0.18 },
  miss:        { f1: P.A4, f2: P.E4, dur: 0.20, type: 'triangle', vol: 0.12 },
  win:         { f1: P.C5, f2: P.C6, dur: 0.50, type: 'square', vol: 0.20, arp: true },
  lose:        { f1: P.G4, f2: P.C4, dur: 0.40, type: 'triangle', vol: 0.15 },
  quest:       { f1: P.G4, f2: P.G5, dur: 0.30, type: 'square', vol: 0.18, arp: true },
  item:        { f1: P.E5, f2: P.G5, dur: 0.10, type: 'sine',   vol: 0.12 },
  portal:      { f1: P.A3, f2: P.A5, dur: 0.30, type: 'sawtooth', vol: 0.10 },
  enemy:       { f1: P.G4, f2: P.E4, dur: 0.18, type: 'square', vol: 0.15 },
};

export class AudioGenerator {
  constructor() {
    /** @type {AudioContext|null} */
    this.ctx = null;
    /** @type {GainNode} 主音量 */
    this._masterGain = null;
    /** @type {Object<string, {timer:number, osc:OscillatorNode|null, gain:GainNode|null, step:number, playing:boolean}>} */
    this._bgmNodes = {};
    this._bgmVolume = 0.7;
    this._sfxVolume = 1.0;
    this._muted = false;
  }

  /** 确保 AudioContext 已初始化（需在用户交互后调用） */
  init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this._masterGain = this.ctx.createGain();
    this._masterGain.gain.value = 1.0;
    this._masterGain.connect(this.ctx.destination);
  }

  _resume() {
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();
  }

  // ═══════════════ BGM ═══════════════

  /**
   * 播放 BGM（循环）
   * @param {string} key — town/field/palace/battle/title
   */
  playBGM(key) {
    this._resume();
    if (!this.ctx) return;
    const def = BGM_DEFS[key];
    if (!def) return;

    // 停止当前 BGM
    this.stopBGM();

    const node = { timer: null, osc: null, gain: null, step: 0, playing: true };
    this._bgmNodes[key] = node;

    const beatSec = 60 / def.bpm;
    const schedule = () => {
      if (!node.playing) return;
      const [freq, beats] = def.melody[node.step];
      const noteSec = beats * beatSec;
      if (freq > 0) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = def.wave;
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(this._muted ? 0 : def.vol * this._bgmVolume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + noteSec * 0.85);
        osc.connect(gain);
        gain.connect(this._masterGain);
        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + noteSec);
        node.osc = osc;
        node.gain = gain;
      }
      node.step = (node.step + 1) % def.melody.length;
      node.timer = setTimeout(schedule, noteSec * 1000);
    };
    schedule();
  }

  /** 停止当前 BGM */
  stopBGM() {
    Object.keys(this._bgmNodes).forEach(k => {
      const n = this._bgmNodes[k];
      n.playing = false;
      if (n.timer) clearTimeout(n.timer);
      try { if (n.osc) n.osc.stop(); } catch (e) { /* 已停止 */ }
      delete this._bgmNodes[k];
    });
  }

  // ═══════════════ SFX ═══════════════

  /**
   * 播放音效
   * @param {string} key — menu_open/menu_select/menu_move/dialogue/hit/miss/win/lose/quest/item/portal/enemy
   */
  playSFX(key) {
    this._resume();
    if (!this.ctx) return;
    const def = SFX_DEFS[key];
    if (!def) return;

    const vol = this._muted ? 0 : def.vol * this._sfxVolume;

    if (def.arp) {
      // 琶音：快速连奏多个音
      this._playArp(def, vol);
    } else {
      this._playTone(def.f1, def.f2, def.dur, def.type, vol);
    }
  }

  /** 单音/滑音 */
  _playTone(f1, f2, dur, type, vol) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(f1, this.ctx.currentTime);
    if (f1 !== f2) {
      osc.frequency.linearRampToValueAtTime(f2, this.ctx.currentTime + dur * 0.5);
    }
    gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);
    osc.connect(gain);
    gain.connect(this._masterGain);
    osc.start(this.ctx.currentTime);
    osc.stop(this.ctx.currentTime + dur);
  }

  /** 琶音 */
  _playArp(def, vol) {
    const notes = def.f1 < def.f2
      ? [P.C5, P.E5, P.G5, P.C6]
      : [P.G5, P.E5, P.C5, P.G4, P.E4, P.C4];
    const stepDur = def.dur / notes.length;
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = def.type;
      osc.frequency.value = freq;
      const start = this.ctx.currentTime + i * stepDur;
      gain.gain.setValueAtTime(vol, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + stepDur * 0.8);
      osc.connect(gain);
      gain.connect(this._masterGain);
      osc.start(start);
      osc.stop(start + stepDur);
    });
  }

  // ═══════════════ 语气音（Undertale 风格字音） ═══════════════

  // 角色声音类型: { freq, wave, dur, vol }
  // 极短促音，打字时每个字符触发，模拟 NPC "说话声"
  _VOICE_TYPES = {
    default:  { freq: P.A4, wave: 'sine',     dur: 0.04, vol: 0.08 },
    female:   { freq: P.C5, wave: 'sine',     dur: 0.05, vol: 0.10 },
    warrior:  { freq: P.G3, wave: 'sawtooth', dur: 0.06, vol: 0.10 },
    scholar:  { freq: P.E4, wave: 'triangle', dur: 0.05, vol: 0.09 },
    elder:    { freq: P.C4, wave: 'triangle', dur: 0.06, vol: 0.08 },
    king:     { freq: P.G4, wave: 'square',   dur: 0.06, vol: 0.10 },
    soldier:  { freq: P.A4, wave: 'square',   dur: 0.04, vol: 0.09 },
    mystic:   { freq: P.E5, wave: 'sine',     dur: 0.06, vol: 0.08 },
    merchant: { freq: P.D5, wave: 'triangle', dur: 0.04, vol: 0.09 },
    brute:    { freq: P.A3, wave: 'sawtooth', dur: 0.05, vol: 0.11 },
  };

  /**
   * 播放语气短音
   * @param {string} type — 角色类型: default/female/warrior/scholar/elder/king/soldier/mystic/merchant/brute
   */
  voiceBlip(type) {
    this._resume();
    if (!this.ctx) return;
    const v = this._VOICE_TYPES[type] || this._VOICE_TYPES.default;
    const vol = this._muted ? 0 : v.vol * this._sfxVolume;
    // 随机微调频率，让连续播时听起来更自然
    const freqJitter = v.freq * (1 + (Math.random() - 0.5) * 0.06);

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = v.wave;
    osc.frequency.value = freqJitter;
    gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + v.dur);
    osc.connect(gain);
    gain.connect(this._masterGain);
    osc.start(this.ctx.currentTime);
    osc.stop(this.ctx.currentTime + v.dur);
  }

  // ═══════════════ 音量控制 ═══════════════

  setBGMVolume(v) {
    this._bgmVolume = Math.max(0, Math.min(1, v));
  }

  setSFXVolume(v) {
    this._sfxVolume = Math.max(0, Math.min(1, v));
  }

  toggleMute() {
    this._muted = !this._muted;
    return this._muted;
  }

  get muted() { return this._muted; }

  /** 销毁，清理资源 */
  destroy() {
    this.stopBGM();
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
      this._masterGain = null;
    }
  }
}

// 单例
export const audioGen = new AudioGenerator();
