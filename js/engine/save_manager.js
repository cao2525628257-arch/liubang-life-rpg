import { CONFIG } from '../data/config.js';

/**
 * 存档管理器 — localStorage 持久化
 */
class SaveManager {
  constructor() {
    this._prefix = 'rpg_save_';
    this._version = 1;
    this._maxSlots = 5;
  }

  /**
   * 保存游戏状态到指定槽位
   * @param {number} slot — 槽位 0~4
   * @param {object} data — 游戏状态
   * @returns {boolean}
   */
  save(slot, data) {
    if (slot < 0 || slot >= this._maxSlots) {
      console.error(`[Save] 无效槽位: ${slot}`);
      return false;
    }

    const saveData = {
      version: this._version,
      timestamp: Date.now(),
      slot: slot,
      data: data,
    };

    try {
      const json = JSON.stringify(saveData);
      localStorage.setItem(this._prefix + slot, json);
      if (CONFIG.DEBUG) {
        console.log(`[Save] 槽位 ${slot} 保存成功 (${json.length} bytes)`);
      }
      return true;
    } catch (e) {
      console.error('[Save] 保存失败:', e.message);
      return false;
    }
  }

  /**
   * 读取存档
   * @param {number} slot
   * @returns {object|null} 存档数据或 null
   */
  load(slot) {
    if (slot < 0 || slot >= this._maxSlots) {
      console.error(`[Save] 无效槽位: ${slot}`);
      return null;
    }

    try {
      const json = localStorage.getItem(this._prefix + slot);
      if (!json) return null;

      const saveData = JSON.parse(json);
      if (saveData.version !== this._version) {
        console.warn(`[Save] 槽位 ${slot} 版本不匹配 (存档:${saveData.version}, 当前:${this._version})`);
      }

      return saveData;
    } catch (e) {
      console.error('[Save] 读取失败:', e.message);
      return null;
    }
  }

  /**
   * 删除存档
   * @param {number} slot
   */
  delete(slot) {
    localStorage.removeItem(this._prefix + slot);
    if (CONFIG.DEBUG) {
      console.log(`[Save] 槽位 ${slot} 已删除`);
    }
  }

  /**
   * 列出所有存档槽位信息
   * @returns {Array<{slot: number, timestamp: number, empty: boolean}>}
   */
  listSlots() {
    const slots = [];
    for (let i = 0; i < this._maxSlots; i++) {
      const saveData = this.load(i);
      slots.push({
        slot: i,
        timestamp: saveData ? saveData.timestamp : 0,
        empty: !saveData,
      });
    }
    return slots;
  }

  /**
   * 检查槽位是否有存档
   * @param {number} slot
   * @returns {boolean}
   */
  hasSlot(slot) {
    return localStorage.getItem(this._prefix + slot) !== null;
  }
}

export const saveManager = new SaveManager();
export default SaveManager;
