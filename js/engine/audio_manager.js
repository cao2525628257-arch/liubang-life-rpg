import { audioGen } from './audio_generator.js';
import { CONFIG } from '../data/config.js';

/**
 * 音效管理器 — BGM 切换 + SFX 触发 + 音量/静音控制
 * 内部委托给 AudioGenerator（Web Audio API 程序化合成）
 */
class AudioManager {
  constructor() {
    this._gen = audioGen;
    this._currentBGM = null;
    this._initialized = false;
  }

  /** 初始化 AudioContext（首次用户交互时调用） */
  init() {
    if (this._initialized) return;
    this._gen.init();
    this._initialized = true;
    if (CONFIG.DEBUG) console.log('[Audio] 音频引擎已初始化');
  }

  /**
   * 播放/切换 BGM
   * @param {string} key — town/field/palace/battle/title
   */
  playBGM(key) {
    if (!this._initialized) return;
    if (this._currentBGM === key) return;
    this._currentBGM = key;
    this._gen.playBGM(key);
  }

  /** 停止 BGM */
  stopBGM() {
    this._currentBGM = null;
    this._gen.stopBGM();
  }

  /**
   * 播放音效
   * @param {string} key
   */
  playSFX(key) {
    if (!this._initialized) return;
    this._gen.playSFX(key);
  }

  /**
   * 播放角色语气音
   * @param {string} type — default/female/warrior/scholar/elder/king/soldier/mystic/merchant/brute
   */
  playVoice(type) {
    if (!this._initialized) return;
    this._gen.voiceBlip(type);
  }

  /** BGM 音量 0.0–1.0 */
  setBGMVolume(v) { this._gen.setBGMVolume(v); }

  /** SFX 音量 0.0–1.0 */
  setSFXVolume(v) { this._gen.setSFXVolume(v); }

  /** 切换静音，返回当前状态 */
  toggleMute() { return this._gen.toggleMute(); }

  get muted() { return this._gen.muted; }
  get initialized() { return this._initialized; }
}

export const audio = new AudioManager();
export default AudioManager;
