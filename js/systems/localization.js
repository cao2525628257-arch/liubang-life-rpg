/**
 * 本地化系统 — 中英双语支持
 */

/** @type {'zh'|'en'} */
let _lang = 'zh';

const STRINGS = {
  // ===== 标题 & UI =====
  title:            { zh: '刘邦人生',          en: 'Rise of Liu Bang' },
  subtitle:         { zh: '秦末乱世 · 像素RPG', en: 'Fall of Qin · Pixel RPG' },
  press_start:      { zh: '— 按任意键开始 —',  en: '— Press Any Key —' },
  loading:          { zh: '史册翻动中...',      en: 'Opening the annals...' },
  menu:             { zh: '菜  单',            en: 'M E N U' },
  resume:           { zh: '继续游戏',          en: 'Resume' },
  inventory:        { zh: '背包',              en: 'Inventory' },
  quests:           { zh: '任务',              en: 'Quests' },
  save:             { zh: '存档',              en: 'Save' },
  back_title:       { zh: '返回标题',          en: 'Title Screen' },
  empty_bag:        { zh: '空空如也...',       en: 'Empty...' },
  no_quests:        { zh: '暂无任务',          en: 'No quests' },

  // ===== 地图名 =====
  map_peixian:      { zh: '沛县',              en: 'Pei County' },
  map_liu_home:     { zh: '刘邦家',            en: 'Liu Bang\'s Home' },
  map_xianya:       { zh: '县衙',              en: 'County Office' },
  map_jiusi:        { zh: '王媪酒肆',          en: 'Wang Ao\'s Tavern' },
  map_mangdang:     { zh: '芒砀山',            en: 'Mt. Mangdang' },
  map_mangdang_deep:{ zh: '芒砀山深处',        en: 'Deep Mt. Mangdang' },
  map_xianyang:     { zh: '咸阳城外',          en: 'Outside Xianyang' },
  map_xianyang_palace:{ zh: '秦王宫',          en: 'Qin Palace' },
  map_hongmen:      { zh: '鸿门',              en: 'Hongmen' },
  map_hongmen_tent: { zh: '鸿门宴大帐',        en: 'Hongmen Feast Tent' },
  map_hanzhong:     { zh: '汉中',              en: 'Hanzhong' },
  map_chencang:     { zh: '陈仓',              en: 'Chencang' },
  map_pengcheng:    { zh: '彭城',              en: 'Pengcheng' },
  map_xingyang:     { zh: '荥阳',              en: 'Xingyang' },
  map_gaixia:       { zh: '垓下',              en: 'Gaixia' },
  map_wujiang:      { zh: '乌江',              en: 'Wujiang River' },
  map_changan:      { zh: '定陶·登基',         en: 'Dingtao·Coronation' },
  map_changle_palace:{ zh: '长乐宫',            en: 'Changle Palace' },
  map_peixian_return:{ zh: '沛县·还乡',         en: 'Pei County·Homecoming' },

  // ===== 操作提示 =====
  hint_move:        { zh: '↑↓←→/WASD 移动',  en: '↑↓←→/WASD Move' },
  hint_interact:    { zh: 'T/Enter 互动',      en: 'T/Enter Interact' },
  hint_esc:         { zh: 'Esc 菜单',           en: 'Esc Menu' },
  hint_collect:     { zh: 'T/Enter 采集',      en: 'T/Enter Gather' },

  // ===== NPC 名字 =====
  npc_wangao:       { zh: '王媪',              en: 'Madam Wang' },
  npc_villager:     { zh: '乡民',              en: 'Villager' },
  npc_fan_kuai:     { zh: '樊哙',              en: 'Fan Kuai' },
  npc_lvzhi:        { zh: '吕雉',              en: 'Lü Zhi' },
  npc_xiao_he:      { zh: '萧何',              en: 'Xiao He' },
  npc_cao_shen:     { zh: '曹参',              en: 'Cao Shen' },
  npc_prisoner:     { zh: '刑徒',              en: 'Convict' },
  npc_white_snake:  { zh: '白蛇',              en: 'White Snake' },
  npc_qin_soldier:  { zh: '秦兵',              en: 'Qin Soldier' },
  npc_qin_captain:  { zh: '秦兵什长',         en: 'Qin Sergeant' },
  npc_qin1:         { zh: '秦兵',              en: 'Qin Soldier' },
  npc_qin2:         { zh: '秦兵什长',         en: 'Qin Sergeant' },
  npc_qin3:         { zh: '秦兵',              en: 'Qin Soldier' },
  npc_thief1:       { zh: '地痞',              en: 'Thug' },
  npc_zhang_liang:  { zh: '张良',              en: 'Zhang Liang' },
  npc_villager2:    { zh: '秦民',              en: 'Qin Citizen' },
  npc_ziying:       { zh: '子婴',              en: 'Ziying' },
  npc_fan_kuai2:    { zh: '樊哙',              en: 'Fan Kuai' },
  npc_xiang_bo:     { zh: '项伯',              en: 'Xiang Bo' },
  npc_soldier1:     { zh: '楚兵',              en: 'Chu Soldier' },
  npc_xiang_yu:     { zh: '项羽',              en: 'Xiang Yu' },
  npc_xiang_zhuang: { zh: '项庄',              en: 'Xiang Zhuang' },
  npc_fan_zeng:     { zh: '范增',              en: 'Fan Zeng' },
  npc_qin_guard1:   { zh: '秦兵',              en: 'Qin Guard' },
  npc_qin_guard2:   { zh: '秦兵',              en: 'Qin Guard' },
  npc_chu_guard1:   { zh: '楚兵',              en: 'Chu Guard' },
  npc_xiang_zhuang_enemy:{ zh: '项庄',         en: 'Xiang Zhuang' },
  npc_xiao_he2:     { zh: '萧何',              en: 'Xiao He' },
  npc_hanxin:       { zh: '韩信',              en: 'Han Xin' },
  npc_zhang_han:    { zh: '章邯',              en: 'Zhang Han' },
  npc_fan_kuai3:    { zh: '樊哙',              en: 'Fan Kuai' },
  npc_zhang_han_enemy:{ zh: '章邯',             en: 'Zhang Han' },
  npc_qin_soldier_c1:{ zh: '秦兵',              en: 'Qin Soldier' },
  npc_chen_ping:    { zh: '陈平',              en: 'Chen Ping' },
  npc_ji_xin:       { zh: '纪信',              en: 'Ji Xin' },
  npc_peng_yue:     { zh: '彭越',              en: 'Peng Yue' },
  npc_chu_elite1:   { zh: '楚军精锐',          en: 'Chu Elite' },
  npc_chu_elite2:   { zh: '楚军精锐',          en: 'Chu Elite' },
  npc_chu_captain:  { zh: '楚军守将',          en: 'Chu Captain' },
  npc_hanxin2:      { zh: '韩信',              en: 'Han Xin' },
  npc_zhang_liang2: { zh: '张良',              en: 'Zhang Liang' },
  npc_xiang_yu2:    { zh: '项羽',              en: 'Xiang Yu' },
  npc_boatman:      { zh: '亭长',              en: 'Boatman' },
  npc_hanxin3:      { zh: '韩信',              en: 'Han Xin' },
  npc_lou_jing:     { zh: '娄敬',              en: 'Lou Jing' },
  npc_zhang_liang3: { zh: '张良',              en: 'Zhang Liang' },
  npc_liu_bang_old: { zh: '刘邦',              en: 'Liu Bang' },
  npc_lvhou:        { zh: '吕后',              en: 'Empress Lü' },
  npc_shusun_tong:  { zh: '叔孙通',            en: 'Shusun Tong' },
  npc_liu_bang_final:{ zh: '刘邦',             en: 'Liu Bang' },
  npc_elder:        { zh: '父老',              en: 'Elder' },
  npc_liu_bang_last:{ zh: '刘邦',              en: 'Liu Bang' },
  npc_chu_guard_g1: { zh: '楚军护卫',          en: 'Chu Guard' },
  npc_chu_guard_g2: { zh: '楚军护卫',          en: 'Chu Guard' },

  // ===== 对话 =====
  dlg_wangao:       { zh: '刘季这孩子从小就有大志，\n如今做了亭长，也算出息了。',
                      en: 'Young Liu Bang always had ambition.\nNow he\'s a village chief — not bad.' },
  dlg_villager:     { zh: '听说陈胜吴广在大泽乡起义了！\n天下要乱了…',
                      en: 'Chen Sheng and Wu Guang have risen up!\nThe realm is falling into chaos...' },
  dlg_fan_kuai:     { zh: '刘邦兄弟！我是屠狗的樊哙，\n要干大事记得叫上我！',
                      en: 'Brother Liu! I\'m Fan Kuai the butcher.\nWhen you make your move, count me in!' },
  dlg_lvzhi:        { zh: '夫君，外面世道不太平，\n万事要小心。',
                      en: 'My husband, the world is troubled.\nPlease be careful out there.' },
  dlg_xiao_he_start:{ zh: '刘邦，县令让你押送一批刑徒去骊山修陵。\n这是苦差事，但办好了说不定能升迁。',
                      en: 'Liu Bang, the magistrate orders you\n to escort convicts to Mt. Li.\nDo well and you may rise in rank.' },
  dlg_xiao_he_quest:{ zh: '这一路凶险，到达芒砀山深处\n就算完成任务。去吧！',
                      en: 'The road is dangerous. Reach deep\nMt. Mangdang to complete the mission.' },
  dlg_xiao_he_done: { zh: '你做到了！虽然刑徒逃了大半…\n但乱世之中，这也未必是坏事。',
                      en: 'You made it! Many convicts escaped...\nBut in these times, that may be a blessing.' },
  dlg_cao_shen:     { zh: '刘邦兄！来喝酒！\n我虽是狱掾，但这世道…\n咱们迟早得干一番大事！',
                      en: 'Brother Liu! Drink with me!\nI\'m just a jail warden now, but...\nWe\'re destined for greater things!' },
  dlg_prisoner:     { zh: '亭长仁义，放我们一条生路。\n我等愿追随左右！',
                      en: 'You spared us, chief. We are forever\nin your debt. We will follow you!' },
  dlg_snake:        { zh: '（一条巨大的白蛇挡住了去路！\n此乃白帝之子，斩之可立威！）\n\n📖 典故：刘邦醉酒夜行，路遇白蛇挡道，\n挥剑斩之。后有老妇人哭诉：\n"吾子白帝子也，化为蛇，\n今赤帝子斩之。"\n从此人们传说刘邦乃赤帝之子下凡。',
                      en: '(A giant white snake blocks the path!)\n\n📖 Legend: Liu Bang, drunk at night,\nencountered a giant white snake and slew it.\nLater, an old woman wept: "My son,\nthe White Emperor\'s child, was slain by\nthe Red Emperor\'s son."\nThus, people believed Liu Bang was\ndivinely chosen — the Red Emperor\'s heir.' },
  dlg_white_snake_win:{ zh: '刘邦拔剑斩向白蛇！\n一道白光冲天而起——\n赤帝之子斩白帝之子！\n从此天下皆知刘邦乃天命所归！',
                      en: 'Liu Bang drew his sword!\nA white light shot to heaven —\nThe Red Emperor slays the White!\nFrom this day, all knew:\nHeaven had chosen Liu Bang.' },
  dlg_qin_soldier:  { zh: '站住！你是逃犯刘邦！\n奉旨缉拿归案！',
                      en: 'Halt! You are the fugitive Liu Bang!\nSurrender by imperial order!' },
  dlg_qin_captain:  { zh: '反贼！竟敢私放刑徒！\n拿下他！',
                      en: 'Rebel! You freed the convicts!\nSeize him!' },
  dlg_zhang_liang:  { zh: '沛公！咸阳就在眼前。\n记住——约法三章，得民心者得天下。',
                      en: 'Lord Pei! Xianyang lies ahead.\nRemember — win the people, win the realm.' },
  dlg_qin_citizen:  { zh: '秦法严苛已久，沛公若能\n废除苛法，我等愿效犬马之劳！',
                      en: 'The Qin laws have oppressed us long.\nAbolish them and we will serve you!' },
  dlg_xiang_bo:     { zh: '（低声）张良兄让我来报信——\n项羽明日要攻打汉军！',
                      en: '(Whispering) Zhang Liang sent me —\nXiang Yu attacks tomorrow!' },
  dlg_chu_soldier:  { zh: '项王有令，明日犒赏三军，\n一举击破刘邦！',
                      en: 'The Hegemon-King orders —\n tomorrow we crush Liu Bang!' },
  // ===== 历史典故对话 =====
  dlg_three_laws:   { zh: '📖 约法三章\n刘邦入咸阳后，与关中父老约定：\n"杀人者死，伤人及盗抵罪。"\n其余秦朝严刑峻法全部废除。\n关中百姓大喜，"唯恐沛公不为秦王"。\n——这就是"约法三章"的由来。',
                      en: '📖 Three Articles of Law\nUpon entering Xianyang, Liu Bang declared:\n"Murderers shall be executed;\n assault and theft shall be punished."\nAll other harsh Qin laws were abolished.\nThe people rejoiced — this was how\nLiu Bang won the hearts of Guanzhong.' },
  dlg_hongmen_feast: { zh: '📖 鸿门宴\n公元前206年，项羽在新丰鸿门设宴\n款待刘邦。席间，范增多次举玉玦\n示意项羽动手杀死刘邦。\n项庄借口舞剑助兴，剑锋直指沛公。\n危急关头，项伯起身对舞，以身相护。\n张良急召樊哙闯帐，刘邦借如厕之名\n从小路逃回灞上。\n——"项庄舞剑，意在沛公"流传至今。',
                      en: '📖 The Hongmen Feast\n206 BCE. Xiang Yu hosted Liu Bang\nat Hongmen. Fan Zeng signaled Xiang Yu\nto kill Liu Bang. Xiang Zhuang danced\nwith his sword aimed at Liu Bang.\nXiang Bo shielded him. Fan Kuai burst in.\nLiu Bang escaped through the privy.\n— "Xiang Zhuang dances with his sword,\nhis eyes on Liu Bang" became a proverb.' },
  dlg_chencang:     { zh: '📖 明修栈道，暗度陈仓\n韩信拜将后，一面派樊哙大张旗鼓\n修复烧毁的褒斜道栈道，麻痹关中三王；\n一面亲率主力秘密沿故道绕行，\n突然出现在陈仓城下。\n章邯措手不及，大败而逃。\n——此计被收入三十六计第八计。',
                      en: '📖 Secret March to Chencang\nHan Xin had Fan Kuai loudly repair\nthe burned plank roads — a decoy.\nMeanwhile, he led the main army\nthrough a hidden mountain path\nand ambushed Chencang.\nZhang Han was caught off guard.\n— "Deceive the enemy with a feint,\nstrike where least expected."' },

  // ===== 任务 =====
  quest_escort_title:  { zh: '押送刑徒',          en: 'Escort the Convicts' },
  quest_escort_desc:   { zh: '将刑徒押送至芒砀山深处', en: 'Escort convicts to deep Mt. Mangdang' },
  quest_snake_title:   { zh: '斩蛇立威',          en: 'Slay the White Snake' },
  quest_snake_desc:    { zh: '在芒砀山斩杀白蛇，树立威望', en: 'Slay the white snake to gain renown' },
  quest_three_laws_title:{ zh: '约法三章',        en: 'Three Articles of Law' },
  quest_three_laws_desc: { zh: '进入秦王宫，颁布约法三章', en: 'Enter Qin Palace, declare the Three Laws' },
  quest_feast_title:   { zh: '鸿门脱身',          en: 'Escape Hongmen' },
  quest_feast_desc:    { zh: '从鸿门宴安全抵达汉中', en: 'Escape Hongmen Feast to Hanzhong' },
  quest_chencang_title:{ zh: '暗度陈仓',          en: 'Secret March' },
  quest_chencang_desc: { zh: '抵达陈仓，奇袭三秦', en: 'Reach Chencang, ambush the Three Qin' },
  quest_xingyang_title:{ zh: '攻占荥阳',          en: 'Take Xingyang' },
  quest_xingyang_desc: { zh: '击败荥阳楚军守将',   en: 'Defeat the Chu captain at Xingyang' },
  quest_gaixia_title:  { zh: '垓下决战',          en: 'Battle of Gaixia' },
  quest_gaixia_desc:   { zh: '追击项羽至乌江',     en: 'Pursue Xiang Yu to Wujiang River' },
  quest_coronation_title:{ zh: '登基称帝',        en: 'Coronation' },
  quest_coronation_desc:{ zh: '抵达定陶，登基称帝', en: 'Reach Dingtao for the coronation' },

  // ===== 选择 =====
  choice_accept:    { zh: '接受',        en: 'Accept' },
  choice_decline:   { zh: '再想想',      en: 'Not now' },
  choice_attack:    { zh: '迎战！',      en: 'Fight!' },
  choice_flee:      { zh: '暂避',        en: 'Fall back' },

  // ===== 战斗/结果 =====
  battle_snake_win: { zh: '刘邦拔剑斩向白蛇！\n一道白光冲天而起——\n从此天下皆知刘邦之名！',
                      en: 'Liu Bang drew his sword and struck!\nA white light shot up to heaven —\nFrom this day, all knew his name!' },
  battle_qin_win:   { zh: '击败了秦兵！\n乱世之中，唯有刀剑说话。',
                      en: 'Qin soldier defeated!\nIn chaos, only the blade speaks.' },
  snake_drop:       { zh: '获得了白蛇之血（赤帝之证）', en: 'Obtained White Snake Blood (Red Emperor\'s Proof).' },
  qin_drop:         { zh: '缴获了秦军令牌',   en: 'Looted a Qin army token.' },

  // ===== 任务状态 =====
  st_available:     { zh: '未接',        en: 'New' },
  st_active:        { zh: '进行中',      en: 'Active' },
  st_completed:     { zh: '✓可交',       en: '✓Done' },
  st_claimed:       { zh: '已完成',      en: 'Completed' },

  // ===== 物品 =====
  item_herb:        { zh: '草药',        en: 'Herb' },
  item_herb_desc:   { zh: '山中采集的药草',     en: 'Herb gathered in the mountains.' },
  item_sword:       { zh: '赤霄剑',      en: 'Red Dawn Blade' },
  item_sword_desc:  { zh: '传说中斩白蛇的宝剑', en: 'The legendary sword that slew the white snake.' },
  item_token:       { zh: '秦军令牌',   en: 'Qin Army Token' },
  item_token_desc:  { zh: '击败秦兵缴获的令牌', en: 'Taken from a defeated Qin soldier.' },
  item_blood:       { zh: '赤帝之证',   en: 'Red Emperor\'s Proof' },
  item_blood_desc:  { zh: '斩白蛇所得，赤帝血脉之证', en: 'Proof of the Red Emperor\'s bloodline.' },

  // ===== 采集 =====
  gather_herb:      { zh: '采集到一株草药！',    en: 'Found a herb!' },
  gather_nothing:   { zh: '这里什么也没有。',    en: 'Nothing here.' },
};

// 需要参数化的字符串
const FORMATS = {
  herb_count:       (n) => ({ zh: `你有${n}株草药`, en: `You have ${n} herb(s).` }),
  slay_progress:    (r, t) => ({ zh: `还剩${t - r}个目标，加油！`, en: `${t - r} targets remaining!` }),
  need_more:        (n) => ({ zh: `凑够${n}株可以打造赤霄剑。`, en: `Collect ${n} to forge the Red Dawn Blade.` }),
};

/** 获取本地化字符串 */
export function t(key, ...args) {
  const entry = STRINGS[key];
  if (!entry) return key;
  if (args.length > 0) {
    const fmt = FORMATS[key];
    if (fmt) return fmt(...args)[_lang];
  }
  return entry[_lang] || entry['zh'] || key;
}

/** 获取/设置当前语言 */
export function lang(newLang) {
  if (newLang) { _lang = newLang; localStorage.setItem('rpg_lang', newLang); }
  return _lang;
}

/** 初始化语言（从 localStorage 恢复） */
export function initLang() {
  const saved = localStorage.getItem('rpg_lang');
  if (saved === 'en' || saved === 'zh') _lang = saved;
}

export default { t, lang, initLang };
