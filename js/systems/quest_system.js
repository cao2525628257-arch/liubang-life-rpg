/**
 * 任务系统 — 接任务 / 推进进度 / 完成领奖
 */

/** 任务状态 */
export const QUEST_STATE = {
  AVAILABLE: 'available',   // 可接取
  ACTIVE: 'active',         // 进行中
  COMPLETED: 'completed',   // 已完成
};

/**
 * 任务定义
 */
export class Quest {
  /**
   * @param {object} opts
   * @param {string} opts.id
   * @param {string} opts.title — 任务名
   * @param {string} opts.desc — 描述
   * @param {string} opts.objectiveType — 'kill' | 'collect' | 'talk'
   * @param {string} opts.objectiveTarget — 目标ID (如 'slime' / 'herb' / 'npc_id')
   * @param {number} opts.objectiveCount — 需要数量
   * @param {Array<{type:string, id:string, count:number}>} [opts.rewards] — 奖励
   */
  constructor(opts) {
    this.id = opts.id;
    this.title = opts.title;
    this.desc = opts.desc;
    this.objectiveType = opts.objectiveType;
    this.objectiveTarget = opts.objectiveTarget;
    this.objectiveCount = opts.objectiveCount;
    this.rewards = opts.rewards || [];
    this.progress = 0;
    this.state = QUEST_STATE.AVAILABLE;
  }

  /** 是否已完成目标 */
  get isObjectiveDone() {
    return this.progress >= this.objectiveCount;
  }

  /** 推进进度 */
  advance(amount = 1) {
    this.progress = Math.min(this.objectiveCount, this.progress + amount);
  }

  /** 领取奖励（返回奖励列表） */
  claim() {
    if (this.state !== QUEST_STATE.COMPLETED) return [];
    this.state = 'claimed';
    return this.rewards;
  }
}

/**
 * 任务管理器
 */
export class QuestManager {
  constructor() {
    /** @type {Map<string, Quest>} */
    this._quests = new Map();
  }

  /** 注册任务定义 */
  register(questDef) {
    this._quests.set(questDef.id, new Quest(questDef));
  }

  /** 接取任务 */
  accept(questId) {
    const q = this._quests.get(questId);
    if (q && q.state === QUEST_STATE.AVAILABLE) {
      q.state = QUEST_STATE.ACTIVE;
      return true;
    }
    return false;
  }

  /** 完成任务目标 */
  complete(questId) {
    const q = this._quests.get(questId);
    if (q && q.state === QUEST_STATE.ACTIVE && q.isObjectiveDone) {
      q.state = QUEST_STATE.COMPLETED;
      return true;
    }
    return false;
  }

  /** 根据目标类型推进所有相关任务 */
  advanceBy(objectiveType, target, amount = 1) {
    for (const q of this._quests.values()) {
      if (q.state === QUEST_STATE.ACTIVE &&
          q.objectiveType === objectiveType &&
          q.objectiveTarget === target) {
        q.advance(amount);
        if (q.isObjectiveDone) {
          this.complete(q.id);
        }
      }
    }
  }

  /** 领取任务奖励 */
  claimRewards(questId) {
    const q = this._quests.get(questId);
    return q ? q.claim() : [];
  }

  /** 获取所有任务 */
  getAll() {
    return Array.from(this._quests.values());
  }

  /** 获取进行中/已完成的任务 */
  getActive() {
    return this.getAll().filter(q => q.state === QUEST_STATE.ACTIVE);
  }

  getCompleted() {
    return this.getAll().filter(q => q.state === QUEST_STATE.COMPLETED || q.state === 'claimed');
  }

  /** 序列化（存档用） */
  serialize() {
    const data = {};
    for (const q of this._quests.values()) {
      data[q.id] = { progress: q.progress, state: q.state };
    }
    return data;
  }

  /** 反序列化 */
  deserialize(data) {
    for (const [id, saved] of Object.entries(data)) {
      const q = this._quests.get(id);
      if (q) {
        q.progress = saved.progress;
        q.state = saved.state;
      }
    }
  }
}
