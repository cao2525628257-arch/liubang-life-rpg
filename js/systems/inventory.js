/**
 * 背包系统 — 物品管理
 */

/** 物品定义 */
export const ITEMS = {
  herb:      { id: 'herb', name: '草药', desc: '山中采集的药草', stackable: true, icon: '🌿' },
  sword:     { id: 'sword', name: '赤霄剑', desc: '斩白蛇之宝剑，赤帝之兆', stackable: false, icon: '⚔️' },
  token:     { id: 'token', name: '秦军令牌', desc: '击败秦兵缴获的令牌', stackable: true, icon: '🎖️' },
  blood:     { id: 'blood', name: '赤帝之证', desc: '斩白蛇所得，赤帝血脉之证', stackable: false, icon: '🔴' },
};

/**
 * 背包类
 */
export class Inventory {
  constructor(maxSlots = 20) {
    this.maxSlots = maxSlots;
    /** @type {Array<{itemId: string, count: number}>} */
    this.slots = [];
  }

  /** 添加物品 */
  add(itemId, count = 1) {
    const def = ITEMS[itemId];
    if (!def) return false;

    // 可堆叠的先找已有槽位
    if (def.stackable) {
      const existing = this.slots.find(s => s.itemId === itemId);
      if (existing) {
        existing.count += count;
        return true;
      }
    }

    // 新槽位
    if (this.slots.length >= this.maxSlots) return false;
    this.slots.push({ itemId, count });
    return true;
  }

  /** 移除物品 */
  remove(itemId, count = 1) {
    const idx = this.slots.findIndex(s => s.itemId === itemId);
    if (idx === -1) return false;

    this.slots[idx].count -= count;
    if (this.slots[idx].count <= 0) {
      this.slots.splice(idx, 1);
    }
    return true;
  }

  /** 统计某物品数量 */
  count(itemId) {
    const slot = this.slots.find(s => s.itemId === itemId);
    return slot ? slot.count : 0;
  }

  /** 是否有某物品 */
  has(itemId, count = 1) {
    return this.count(itemId) >= count;
  }

  /** 所有物品列表 */
  list() {
    return this.slots.map(s => ({ ...ITEMS[s.itemId], count: s.count }));
  }

  /** 序列化 */
  serialize() {
    return this.slots.map(s => ({ itemId: s.itemId, count: s.count }));
  }

  /** 反序列化 */
  deserialize(data) {
    this.slots = (data || []).map(s => ({ itemId: s.itemId, count: s.count }));
  }
}
