/**
 * NPC 对话映射 — 将 maps.js NPC 连接到 dialogues.js 章节节点
 *
 * 键格式: "mapId:npcId"
 * 值: { chapter, node } — 对应 DIALOGUES[chapter][node]
 */
import { DIALOGUES } from './dialogues.js';

export const NPC_DIALOGUE_MAP = {
  // Ch1 — 平民时代
  'liu_home:lvzhi':            { chapter: 1, node: 'lvshi_advice' },

  // Ch2 — 反秦起义
  'xianya:xiao_he':            { chapter: 2, node: 'escort' },
  'mangdang:follower1':        { chapter: 2, node: 'release' },
  'mangdang:white_snake':      { chapter: 2, node: 'snake' },

  // Ch3 — 灭秦战争
  'xianyang:zhang_liang':      { chapter: 3, node: 'meeting_zhangliang' },
  'xianyang:villager2':        { chapter: 3, node: 'three_rules' },
  'xianyang_palace:ziying':    { chapter: 3, node: 'qin_surrender' },
  'xianyang_palace:fan_kuai2': { chapter: 3, node: 'enter_xianyang' },

  // Ch4 — 鸿门宴
  'hongmen:xiang_bo':           { chapter: 4, node: 'xiangbo_warning' },
  'hongmen:soldier1':           { chapter: 4, node: 'xiangyu_anger' },
  'hongmen_tent:xiang_yu':      { chapter: 4, node: 'feast_arrival' },
  'hongmen_tent:xiang_zhuang':  { chapter: 4, node: 'sword_dance' },
  'hongmen_tent:fan_zeng':      { chapter: 4, node: 'fanzeng_rage' },

  // Ch5 — 汉中蛰伏
  'hanzhong:xiao_he2':          { chapter: 5, node: 'xiaohe_chase' },
  'hanzhong:hanxin':            { chapter: 5, node: 'handui' },
  'chencang:zhang_han':         { chapter: 5, node: 'chencang' },
  'chencang:fan_kuai3':         { chapter: 5, node: 'chencang' },

  // Ch6 — 楚汉争霸
  'pengcheng:chen_ping':        { chapter: 6, node: 'xingyang' },
  'pengcheng:ji_xin':           { chapter: 6, node: 'jixin_sacrifice' },
  'xingyang:peng_yue':          { chapter: 6, node: 'honggou' },

  // Ch7 — 垓下决战
  'gaixia:hanxin2':             { chapter: 7, node: 'gaixia_siege' },
  'gaixia:zhang_liang2':        { chapter: 7, node: 'chu_song' },
  'wujiang:xiang_yu2':          { chapter: 7, node: 'xiangyu_end' },
  'wujiang:boatman':            { chapter: 7, node: 'wujiang' },

  // Ch8 — 建立汉朝
  'changan:hanxin3':            { chapter: 8, node: 'coronation' },
  'changan:lou_jing':           { chapter: 8, node: 'loujing' },
  'changan:zhang_liang3':       { chapter: 8, node: 'changan' },

  // Ch9 — 皇帝时代
  'changle_palace:lvhou':       { chapter: 9, node: 'lvzhi_kills' },
  'changle_palace:liu_bang_old':{ chapter: 9, node: 'refuse_treatment' },
  'changle_palace:shusun_tong': { chapter: 9, node: 'chaoyi' },

  // Ch10 — 大风歌
  'peixian_return:liu_bang_final': { chapter: 10, node: 'wind_song' },
  'peixian_return:elder':          { chapter: 10, node: 'reflection' },
  'peixian_return:liu_bang_last':  { chapter: 10, node: 'ending' },
};

/**
 * 获取某个地图上 NPC 的章节对话文本
 * @param {string} mapId
 * @param {string} npcId
 * @returns {{ speaker: string, text: string } | null}
 */
export function getNPCDialogue(mapId, npcId) {
  var key = mapId + ':' + npcId;
  var entry = NPC_DIALOGUE_MAP[key];
  if (!entry) return null;
  var chapter = DIALOGUES[entry.chapter];
  if (!chapter) return null;
  var node = chapter[entry.node];
  if (!node) return null;
  return { speaker: node.speaker, text: node.lines.join('\n') };
}
