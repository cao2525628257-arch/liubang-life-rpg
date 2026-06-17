import { CONFIG } from '../data/config.js';

/**
 * 音效管理器 — BGM 循环播放 + SFX 短音效
 */
class AudioManager {
  constructor() {
    /** @type {Map<string, HTMLAudioElement>} BGM 缓存 */
    this._bgmCache = new Map();
    /** @type {Map<string, HTMLAudioElement>} SFX 缓存 */
    this._sfxCache = new Map();

    /** 当前播放的 BGM key */
    this._currentBGM = null;

    /** 音量 0.0 — 1.0 */
    this._bgmVolume = 0.7;
    this._sfxVolume = 1.0;
    this._muted = false;
  }

  /**
   * 注册 BGM 音频
   * @param {string} key
   * @param {HTMLAudioElement} audio
   */
  registerBGM(key, audio) {
    audio.loop = true;
    audio.volume = this._bgmVolume;
    this._bgmCache.set(key, audio);
  }

  /**
   * 注册 SFX 音频
   * @param {string} key
   * @param {HTMLAudioElement} audio
   */
  registerSFX(key, audio) {
    audio.loop = false;
    audio.volume = this._sfxVolume;
    this._sfxCache.set(key, audio);
  }

  /** 播放/切换 BGM */
  playBGM(key) {
    if (this._currentBGM === key) return;

    // 停止当前 BGM
    this.stopBGM();

    const bgm = this._bgmCache.get(key);
    if (bgm) {
      bgm.currentTime = 0;
      bgm.volume = this._muted ? 0 : this._bgmVolume;
      bgm.play().catch((e) => {
        if (CONFIG.DEBUG) console.warn('[Audio] BGM 播放失败:', key, e.message);
      });
      this._currentBGM = key;
    }
  }

  /** 停止 BGM */
  stopBGM() {
    if (this._currentBGM) {
      const bgm = this._bgmCache.get(this._currentBGM);
      if (bgm) {
        bgm.pause();
        bgm.currentTime = 0;
      }
      this._currentBGM = null;
    }
  }

  /** 播放音效（支持同时多个） */
  playSFX(key) {
    const sfx = this._sfxCache.get(key);
    if (sfx) {
      sfx.volume = this._muted ? 0 : this._sfxVolume;
      sfx.currentTime = 0;
      sfx.play().catch((e) => {
        if (CONFIG.DEBUG) console.warn('[Audio] SFX 播放失败:', key, e.message);
      });
    }
  }

  /** 设置 BGM 音量 */
  setBGMVolume(v) {
    this._bgmVolume = Math.max(0, Math.min(1, v));
    if (this._currentBGM && !this._muted) {
      const bgm = this._bgmCache.get(this._currentBGM);
      if (bgm) bgm.volume = this._bgmVolume;
    }
  }

  /** 设置 SFX 音量 */
  setSFXVolume(v) {
    this._sfxVolume = Math.max(0, Math.min(1, v));
  }

  /** 切换静音 */
  toggleMute() {
    this._muted = !this._muted;
    if (this._currentBGM) {
      const bgm = this._bgmCache.get(this._currentBGM);
      if (bgm) bgm.volume = this._muted ? 0 : this._bgmVolume;
    }
    return this._muted;
  }

  /** 是否静音中 */
  get muted() {
    return this._muted;
  }
}

export const audio = new AudioManager();
export default AudioManager;
