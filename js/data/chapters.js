/**
 * 刘邦人生 — 全10章剧情框架、NPC、节点
 * 基于 history/research/ 历史研究资料
 */

// ===== 章节定义 =====
export const CHAPTERS = [
  { id:1, title:{zh:'平民时代',en:'Commoner'}, year:'前256-前209', theme:{zh:'梦想',en:'Dreams'},
    desc:{zh:'沛县丰邑的农家少年刘季，好酒及色，广交豪杰。',en:'A peasant youth who loved wine and friends.'} },
  { id:2, title:{zh:'反秦起义',en:'Uprising'}, year:'前209-前208', theme:{zh:'勇气',en:'Courage'},
    desc:{zh:'陈胜吴广揭竿而起，刘邦于芒砀山斩蛇起义。',en:'Chen Sheng rebels. Liu Bang slays the white snake.'} },
  { id:3, title:{zh:'灭秦战争',en:'Conquer Qin'}, year:'前208-前207', theme:{zh:'机会',en:'Chance'},
    desc:{zh:'刘邦西征入关，秦王子婴投降，秦朝灭亡。',en:'Liu Bang marches west. Qin surrenders.'} },
  { id:4, title:{zh:'鸿门宴',en:'Feast at Hongmen'}, year:'前206', theme:{zh:'博弈',en:'Gamble'},
    desc:{zh:'项羽设鸿门宴，刀光剑影中的生死抉择。',en:'A banquet of life and death with Xiang Yu.'} },
  { id:5, title:{zh:'汉中蛰伏',en:'Hanzhong Exile'}, year:'前206', theme:{zh:'隐忍',en:'Patience'},
    desc:{zh:'被封汉王，烧栈道示弱，萧何月下追韩信，登坛拜将，暗度陈仓。',en:'Burning bridges, recruiting Han Xin, secret march.'} },
  { id:6, title:{zh:'楚汉争霸',en:'Chu-Han War'}, year:'前205-前203', theme:{zh:'对决',en:'Duel'},
    desc:{zh:'彭城惨败，荥阳对峙，纪信诈降，成皋拉锯，鸿沟之约。',en:'Four-year war. Betrayal, endurance, turning tides.'} },
  { id:7, title:{zh:'垓下决战',en:'Gaixia'}, year:'前202', theme:{zh:'宿命',en:'Fate'},
    desc:{zh:'十面埋伏，四面楚歌，项羽乌江自刎。',en:'Final battle. Xiang Yu falls at Wujiang River.'} },
  { id:8, title:{zh:'建立汉朝',en:'Founding Han'}, year:'前202', theme:{zh:'创业',en:'Founding'},
    desc:{zh:'氾水之阳登基称帝，定都长安，制礼作乐。',en:'Crowned emperor. Capital Chang\'an. New dynasty.'} },
  { id:9, title:{zh:'皇帝时代',en:'Emperor Era'}, year:'前202-前195', theme:{zh:'孤独',en:'Loneliness'},
    desc:{zh:'铲除异姓王，白马之盟，君临天下的代价。',en:'Eliminating rivals. The lonely throne.'} },
  { id:10,title:{zh:'大风歌',en:'Song of the Wind'}, year:'前195', theme:{zh:'回望',en:'Reflection'},
    desc:{zh:'还乡沛县，一曲大风歌，英雄迟暮。',en:'Returning home. A final song for the ages.'} },
];

// ===== 全NPC图鉴 =====
// role: 主角/妻子/谋士/将领/对手/帝王/诸侯/官员/平民
export const NPC_DATABASE = {
  // 第1章 — 平民时代
  liu_bang:   { id:'liu_bang', name:{zh:'刘邦',en:'Liu Bang'}, role:'主角', ch:[1,2,3,4,5,6,7,8,9,10],
    bio:{zh:'沛县丰邑人，出身农家。好酒及色，仁而爱人，喜施，意豁如也。',en:'Born a peasant. Loved wine, generous, ambitious.'} },
  liu_taigong:{ id:'liu_taigong', name:{zh:'刘太公',en:'Liu Taigong'}, role:'家人', ch:[1,6,8],
    bio:{zh:'刘邦之父，老实本分的农民。',en:'Liu Bang\'s father, an honest farmer.'} },
  lvzhi:      { id:'lvzhi', name:{zh:'吕雉',en:'Lü Zhi'}, role:'妻子', ch:[1,2,3,5,6,7,9],
    bio:{zh:'刘邦之妻，刚毅果决，后为汉朝第一位皇后。',en:'Liu Bang\'s wife. Iron-willed future empress.'} },
  xiao_he:    { id:'xiao_he', name:{zh:'萧何',en:'Xiao He'}, role:'谋士', ch:[1,2,3,5,6,8,9],
    bio:{zh:'沛县主吏掾，刘邦最重要的后勤总管，后为汉朝首任丞相。月下追韩信，制《九章律》。',en:'Chief strategist. Chased Han Xin. First Han chancellor.'} },
  cao_shen:   { id:'cao_shen', name:{zh:'曹参',en:'Cao Shen'}, role:'将领', ch:[1,2,3,5,6],
    bio:{zh:'沛县狱掾，身经百战，战功赫赫。萧规曹随。',en:'Jail warden turned general. "Cao followed Xiao\'s rules."'} },
  fan_kuai:   { id:'fan_kuai', name:{zh:'樊哙',en:'Fan Kuai'}, role:'将领', ch:[1,2,3,4,5,6],
    bio:{zh:'沛县屠狗者，鸿门宴上闯帐救主。刘邦的连襟。',en:'Dog butcher who saved Liu Bang at Hongmen Feast.'} },
  xiahou_ying:{ id:'xiahou_ying', name:{zh:'夏侯婴',en:'Xiahou Ying'}, role:'将领', ch:[1,2,3,5,6],
    bio:{zh:'沛县厩司御，刘邦的车夫兼护卫，忠心耿耿。',en:'Liu Bang\'s charioteer and loyal guard.'} },
  zhou_bo:    { id:'zhou_bo', name:{zh:'周勃',en:'Zhou Bo'}, role:'将领', ch:[1,2,3,5,6,9],
    bio:{zh:'编织匠人出身，后为汉朝太尉。刘邦预言"安刘氏者必勃也"。',en:'Weaver turned marshal. "He who secures the Liu clan."'} },
  wang_ao:    { id:'wang_ao', name:{zh:'王媪',en:'Madam Wang'}, role:'平民', ch:[1],
    bio:{zh:'酒肆老板娘，常赊酒给少年刘邦。',en:'Tavern owner who gave young Liu Bang credit.'} },
  lv_gong:    { id:'lv_gong', name:{zh:'吕公',en:'Lü Gong'}, role:'平民', ch:[1],
    bio:{zh:'吕雉之父，沛令座上客，慧眼识刘邦。',en:'Lü Zhi\'s father. Saw greatness in Liu Bang.'} },

  // 第2章 — 反秦起义
  chen_sheng: { id:'chen_sheng', name:{zh:'陈胜',en:'Chen Sheng'}, role:'起义者', ch:[2],
    bio:{zh:'大泽乡起义领袖，"王侯将相宁有种乎"。',en:'Leader of the Daze Village uprising.'} },

  // 第3章 — 灭秦
  ziying:     { id:'ziying', name:{zh:'子婴',en:'Ziying'}, role:'帝王', ch:[3],
    bio:{zh:'秦朝末代君主，向刘邦投降。',en:'Last ruler of Qin. Surrendered to Liu Bang.'} },
  zhang_liang:{ id:'zhang_liang', name:{zh:'张良',en:'Zhang Liang'}, role:'谋士', ch:[3,4,5,6,8,9],
    bio:{zh:'韩国贵族后裔，运筹帷幄之中，决胜千里之外。献烧栈道、下邑之谋。',en:'Aristocratic strategist. Mastermind behind Han victory.'} },

  // 第4章 — 鸿门宴
  xiang_yu:   { id:'xiang_yu', name:{zh:'项羽',en:'Xiang Yu'}, role:'对手', ch:[3,4,5,6,7],
    bio:{zh:'西楚霸王，力能扛鼎，千古战神。楚汉之争的最终败者。',en:'Hegemon-King of Western Chu. Unrivaled warrior, tragic hero.'} },
  xiang_bo:   { id:'xiang_bo', name:{zh:'项伯',en:'Xiang Bo'}, role:'诸侯', ch:[4],
    bio:{zh:'项羽叔父，鸿门宴上以身护刘邦。',en:'Xiang Yu\'s uncle. Protected Liu Bang at the feast.'} },
  fan_zeng:   { id:'fan_zeng', name:{zh:'范增',en:'Fan Zeng'}, role:'谋士', ch:[4],
    bio:{zh:'项羽首席谋士，力主杀刘邦，"竖子不足与谋"。',en:'Xiang Yu\'s strategist. "This brat is not worth advising."'} },
  xiang_zhuang:{ id:'xiang_zhuang', name:{zh:'项庄',en:'Xiang Zhuang'}, role:'将领', ch:[4],
    bio:{zh:'项羽堂弟，鸿门宴上舞剑意在沛公。',en:'Xiang Yu\'s cousin. Danced with sword aimed at Liu Bang.'} },

  // 第5章 — 汉中蛰伏
  han_xin:    { id:'han_xin', name:{zh:'韩信',en:'Han Xin'}, role:'将领', ch:[5,6,7,9],
    bio:{zh:'兵仙神帅。先投项羽不为所用，萧何月下追回拜大将。明修栈道暗度陈仓。',en:'Master of war. Chased by Xiao He. Secret march to Chencang.'} },
  zhang_han:  { id:'zhang_han', name:{zh:'章邯',en:'Zhang Han'}, role:'对手', ch:[3,5],
    bio:{zh:'秦末名将，后为雍王镇守关中。被韩信击败自杀。',en:'Qin general. Defeated by Han Xin, committed suicide.'} },

  // 第6章 — 楚汉争霸
  chen_ping:  { id:'chen_ping', name:{zh:'陈平',en:'Chen Ping'}, role:'谋士', ch:[4,5,6,9],
    bio:{zh:'六出奇计，反间范增，解荥阳之围。',en:'Master of intrigue. Six secret schemes.'} },
  ji_xin:     { id:'ji_xin', name:{zh:'纪信',en:'Ji Xin'}, role:'将领', ch:[6],
    bio:{zh:'将军。荥阳之围假扮刘邦诈降，被项羽烧死。',en:'General who impersonated Liu Bang. Burned alive by Xiang Yu.'} },
  peng_yue:   { id:'peng_yue', name:{zh:'彭越',en:'Peng Yue'}, role:'诸侯', ch:[6,7,9],
    bio:{zh:'梁王，游击袭扰楚军后方，后因被诬谋反遭剁成肉酱。',en:'King of Liang. Guerilla warfare master. Killed by false accusation.'} },
  ying_bu:    { id:'ying_bu', name:{zh:'英布',en:'Ying Bu'}, role:'诸侯', ch:[6,7,9],
    bio:{zh:'淮南王。先为项羽爱将，后投刘邦，老年反叛被诛。刘邦亲征中箭。',en:'King of Huainan. Betrayed both masters. Liu Bang was wounded fighting him.'} },
  cao_jiu:    { id:'cao_jiu', name:{zh:'曹咎',en:'Cao Jiu'}, role:'对手', ch:[6],
    bio:{zh:'楚军守将，被汉军辱骂后怒而出战被半渡而击，兵败自杀。',en:'Chu general. Baited into battle, defeated and committed suicide.'} },

  // 第8章 — 建立汉朝
  lou_jing:   { id:'lou_jing', name:{zh:'娄敬',en:'Lou Jing'}, role:'谋士', ch:[8],
    bio:{zh:'戍卒出身，献策定都关中。赐姓刘，即刘敬。',en:'Border guard who proposed Chang\'an as capital. Given the surname Liu.'} },
  shusun_tong:{ id:'shusun_tong', name:{zh:'叔孙通',en:'Shusun Tong'}, role:'官员', ch:[8],
    bio:{zh:'原秦博士，为汉制定朝仪。刘邦感叹"吾乃今日知为皇帝之贵也"。',en:'Qin scholar who designed Han court rituals.'} },
  zhang_cang: { id:'zhang_cang', name:{zh:'张苍',en:'Zhang Cang'}, role:'官员', ch:[8],
    bio:{zh:'定章程，规范历法与度量衡。',en:'Established Han calendar and measurement standards.'} },

  // 第9章 — 皇帝时代
  lu_hou:     { id:'lu_hou', name:{zh:'吕后',en:'Empress Lü'}, role:'妻子', ch:[9],
    bio:{zh:'刘邦去世后掌握大权的皇后。诛韩信、杀彭越。',en:'The iron empress who ruled after Liu Bang.'} },

  // 第10章 — 大风歌
  pei_elders: { id:'pei_elders', name:{zh:'沛县父老',en:'Pei Elders'}, role:'平民', ch:[10],
    bio:{zh:'刘邦还乡时共饮的故乡父老。',en:'Hometown elders who drank with the returning emperor.'} },
};

// ===== 章节剧情节点 =====
// 每章的关键剧情节点
export const CHAPTER_NODES = {
  1: [ // 平民时代
    { id:'start', name:{zh:'少年刘季',en:'Young Liu'}, type:'dialogue', npc:['liu_bang','liu_taigong'],
      desc:{zh:'沛县丰邑，农家少年刘季不事生产，好酒喜交游。',en:'A farm boy who prefers drinking to farming.'} },
    { id:'lushi', name:{zh:'吕公择婿',en:'Marriage'}, type:'choice', npc:['lv_gong','lvzhi'],
      desc:{zh:'吕公设宴，刘邦空手赴宴却得美妻。',en:'The banquet that won Liu Bang a wife.'} },
    { id:'friend', name:{zh:'结交豪杰',en:'Making Friends'}, type:'dialogue', npc:['xiao_he','cao_shen','fan_kuai'],
      desc:{zh:'在酒肆中结识萧何、曹参、樊哙等豪杰。',en:'Meeting future allies at the tavern.'} },
    { id:'walk', name:{zh:'田间遐想',en:'Daydreams'}, type:'dialogue',
      desc:{zh:'望着田野发呆，心中有大志却不知从何而起。',en:'Staring at fields, dreaming of something greater.'} },
  ],
  5: [ // 汉中蛰伏
    { id:'start', name:{zh:'被迫入汉中',en:'Exiled to Hanzhong'}, type:'dialogue', npc:['liu_bang','xiao_he'],
      desc:{zh:'被封汉王，远赴巴蜀汉中。刘邦大怒欲攻项羽，萧何力劝隐忍。',en:'Forced into exile. Xiao He counsels patience.'} },
    { id:'chase', name:{zh:'萧何月下追韩信',en:'Xiao He chases Han Xin'}, type:'cutscene', npc:['xiao_he','han_xin'],
      desc:{zh:'韩信觉不被重用趁夜逃去。萧何不及禀报，连夜追回。',en:'Han Xin flees. Xiao He rides through the night to bring him back.'} },
    { id:'hanxin', name:{zh:'登坛拜将',en:'Appointing Han Xin'}, type:'choice', npc:['liu_bang','han_xin'],
      desc:{zh:'择吉日、筑拜将坛，以隆重礼仪拜韩信为大将。一军皆惊。',en:'A ceremonial platform. The army is shocked at Han Xin\'s appointment.'} },
    { id:'ending', name:{zh:'暗度陈仓',en:'Secret March'}, type:'choice', npc:['liu_bang','han_xin','zhang_liang','fan_kuai'],
      desc:{zh:'明修栈道迷惑敌军，主力暗出陈仓道。还定三秦！',en:'Pretending to repair roads while secretly marching on Chencang.'} },
  ],
  6: [ // 楚汉争霸
    { id:'start', name:{zh:'彭城之战',en:'Battle of Pengcheng'}, type:'cutscene', npc:['liu_bang','xiang_yu'],
      desc:{zh:'纠集56万诸侯联军攻占彭城。得意忘形后遭3万精骑突袭，死伤十余万。',en:'560,000 allies take Pengcheng. Then 30,000 cavalry destroy them.'} },
    { id:'battle', name:{zh:'荥阳对峙',en:'Xingyang Standoff'}, type:'choice', npc:['liu_bang','chen_ping','ji_xin'],
      desc:{zh:'陈平反间计离间范增。纪信假扮刘邦出降被烧死。',en:'Chen Ping\'s intrigue. Ji Xin sacrifices himself.'} },
    { id:'victory', name:{zh:'成皋拉锯',en:'Chenggao'}, type:'choice', npc:['liu_bang','cao_jiu','peng_yue'],
      desc:{zh:'曹咎被辱骂激怒出城，兵败自杀。汉军收复成皋。',en:'Cao Jiu baited to his death. Han army retakes Chenggao.'} },
    { id:'end', name:{zh:'鸿沟之约',en:'Hong Canal Treaty'}, type:'cutscene', npc:['liu_bang','xiang_yu'],
      desc:{zh:'以鸿沟为界，中分天下。楚军东归，汉军西还。',en:'Dividing the realm at Hong Canal. A fragile peace.'} },
  ],
};

// ===== 章节间关键抉择（影响后续走向） =====
export const KEY_CHOICES = {
  ch4_feast: {
    id:'ch4_feast', ch:4,
    desc:{zh:'鸿门宴上如何脱身？',en:'How to escape the Hongmen Feast?'},
    options:[
      { text:{zh:'借故如厕，悄然离去',en:'Slip away to the privy'},
        effect:{zh:'张良殿后献礼，刘邦从小路逃回灞上。',en:'Zhang Liang covers. Flee through back roads.'},
        stats:{strat:+2} },
      { text:{zh:'正面应对，据理力争',en:'Stand and argue'},
        effect:{zh:'与项羽当面对质，凶险万分。',en:'Confront Xiang Yu directly. Extremely dangerous.'},
        stats:{prestige:+2} },
      { text:{zh:'依赖项伯说情',en:'Rely on Xiang Bo'},
        effect:{zh:'利用项伯的信任度过危机。',en:'Use Xiang Bo\'s goodwill to defuse the crisis.'},
        stats:{char:+2} },
    ],
  },
  ch5_strategy: {
    id:'ch5_strategy', ch:5,
    desc:{zh:'如何出汉中争天下？',en:'How to break out of Hanzhong?'},
    options:[
      { text:{zh:'暗度陈仓，奇袭三秦',en:'Secret march on Chencang'},
        effect:{zh:'韩信之计，出其不意。',en:'Han Xin\'s plan. Surprise attack.'},
        stats:{strat:+3} },
      { text:{zh:'正面修复栈道，堂堂正正',en:'Repair plank roads openly'},
        effect:{zh:'虽稳但慢，给章邯太多准备时间。',en:'Slow. Zhang Han will prepare.'},
        stats:{prestige:+1} },
    ],
  },
};
