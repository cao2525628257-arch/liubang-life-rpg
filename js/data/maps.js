/**
 * 地图数据 — 刘邦人生 · 秦末乱世
 *
 * 瓦片ID（对应 pixel_art_gen.js, COLS=8）:
 *   Row0: 1=草地A, 2=草地B, 3=泥土, 4=石板路, 5=花丛, 6=灌木
 *   Row1: 9=石墙, 10=水面A, 11=水面B, 12=木地板
 *   Row2: 17=树, 18=房屋墙, 19=房屋屋顶
 */
const T = {
  G1: 1, G2: 2, DIRT: 3, PATH: 4,
  FLOWER: 5, BUSH: 6,
  WALL: 9, W1: 10, W2: 11, WOOD: 12,
  TREE: 17, HOUSE: 18, ROOF: 19,
};

const SOLID = new Set([T.WALL, T.TREE, T.W1, T.W2, T.HOUSE, T.ROOF, T.BUSH]);

function fill(d, r1, c1, r2, c2, tile) {
  for (let r = r1; r <= r2; r++)
    for (let c = c1; c <= c2; c++)
      d[r][c] = tile;
}

function emptyMap(rows, cols) {
  const d = [];
  for (let r = 0; r < rows; r++) {
    d[r] = [];
    for (let c = 0; c < cols; c++)
      d[r][c] = (r === 0 || r === rows - 1 || c === 0 || c === cols - 1) ? T.WALL : T.G1;
  }
  return d;
}

function grassify(d, rows, cols) {
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      if (d[r][c] === T.G1 && (r + c) % 3 === 0) d[r][c] = T.G2;
}

export const MAPS = {

  /** ====== 沛县 ====== */
  peixian: {
    id: 'peixian', name: '沛县',
    rows: 22, cols: 32,
    solidTiles: SOLID,
    build() {
      const d = emptyMap(22, 32);

      // 十字土路
      fill(d, 11, 1, 11, 30, T.PATH);
      fill(d, 2, 15, 20, 16, T.PATH);

      // 左上角小树林
      for (let r = 2; r < 10; r++)
        for (let c = 2; c < 8; c++)
          if ((r + c) % 4 === 0) d[r][c] = T.TREE;

      // 右上池塘
      for (let r = 3; r < 9; r++)
        for (let c = 24; c < 30; c++)
          d[r][c] = (r + c) % 2 ? T.W1 : T.W2;

      // 装饰
      d[4][14] = T.FLOWER; d[4][18] = T.FLOWER;
      d[17][11] = T.FLOWER; d[18][19] = T.FLOWER;
      d[7][20] = T.BUSH; d[15][8] = T.BUSH;

      // 刘邦家（左下）
      fill(d, 14, 3, 14, 7, T.ROOF);
      fill(d, 15, 3, 16, 7, T.HOUSE);
      d[15][5] = T.WOOD;

      // 县衙（右下）
      fill(d, 15, 24, 15, 29, T.ROOF);
      fill(d, 16, 24, 17, 29, T.HOUSE);
      d[16][26] = T.WOOD;

      // 酒肆（右上角）
      fill(d, 4, 10, 4, 13, T.ROOF);
      fill(d, 5, 10, 6, 13, T.HOUSE);
      d[5][11] = T.WOOD;

      grassify(d, 22, 32);
      return d;
    },
    npcs: [
      { id: 'wangao', x: 10 * 16, y: 4 * 16, spriteKey: 'npc_villager',
        name: '王媪', dialog: '刘季这孩子从小就有大志，\n如今做了亭长，也算出息了。' },
      { id: 'villager1', x: 18 * 16, y: 11 * 16, spriteKey: 'npc_villager',
        name: '乡民', dialog: '听说陈胜吴广在大泽乡起义了！\n天下要乱了…' },
      { id: 'fan_kuai', x: 26 * 16, y: 14 * 16, spriteKey: 'npc_fankuai',
        name: '樊哙', dialog: '刘邦兄弟！我是屠狗的樊哙，\n要干大事记得叫上我！' },
    ],
    portals: [
      { x: 5 * 16, y: 15 * 16 - 4, w: 16, h: 8, targetMap: 'liu_home',
        targetX: 5 * 16, targetY: 12 * 16, labelKey: 'portal_peixian_to_liu_home', label: '刘邦家' },
      { x: 26 * 16, y: 17 * 16 - 4, w: 16, h: 8, targetMap: 'xianya',
        targetX: 5 * 16, targetY: 10 * 16, labelKey: 'portal_peixian_to_xianya', label: '县衙' },
      { x: 11 * 16, y: 6 * 16 - 4, w: 16, h: 8, targetMap: 'jiusi',
        targetX: 5 * 16, targetY: 12 * 16, labelKey: 'portal_peixian_to_jiusi', label: '酒肆' },
      { x: 30 * 16, y: 11 * 16, w: 8, h: 16, targetMap: 'mangdang',
        targetX: 2 * 16, targetY: 11 * 16, labelKey: 'portal_peixian_to_mangdang', label: '→芒砀山' },
    ],
    playerSpawn: { x: 16 * 16, y: 11 * 16 },
  },

  /** ====== 刘邦家 ====== */
  liu_home: {
    id: 'liu_home', name: '刘邦家',
    rows: 14, cols: 11,
    solidTiles: new Set([T.WALL]),
    build() {
      const d = emptyMap(14, 11);
      fill(d, 1, 1, 12, 9, T.WOOD);
      for (let r = 1; r < 13; r++) { d[r][1] = T.WALL; d[r][9] = T.WALL; }
      fill(d, 1, 1, 1, 9, T.WALL);
      fill(d, 12, 1, 12, 9, T.WALL);
      d[12][4] = T.WOOD; d[12][5] = T.WOOD; d[12][6] = T.WOOD; // 门
      return d;
    },
    npcs: [
      { id: 'lvzhi', x: 5 * 16, y: 5 * 16, spriteKey: 'npc_female',
        name: '吕雉', dialog: '夫君，外面世道不太平，\n万事要小心。' },
    ],
    portals: [
      { x: 4 * 16, y: 12 * 16 + 4, w: 48, h: 4, targetMap: 'peixian',
        targetX: 5 * 16, targetY: 15 * 16 + 8, labelKey: 'portal_liu_home_to_peixian', label: '出门' },
    ],
    playerSpawn: { x: 5 * 16, y: 10 * 16 },
  },

  /** ====== 县衙 ====== */
  xianya: {
    id: 'xianya', name: '县衙',
    rows: 14, cols: 11,
    solidTiles: new Set([T.WALL]),
    build() {
      const d = emptyMap(14, 11);
      fill(d, 1, 1, 12, 9, T.WOOD);
      for (let r = 1; r < 13; r++) { d[r][1] = T.WALL; d[r][9] = T.WALL; }
      fill(d, 1, 1, 1, 9, T.WALL);
      fill(d, 12, 1, 12, 9, T.WALL);
      d[12][4] = T.WOOD; d[12][5] = T.WOOD; d[12][6] = T.WOOD;
      // 案桌
      d[6][4] = T.PATH; d[6][5] = T.PATH; d[6][6] = T.PATH;
      d[7][4] = T.PATH; d[7][5] = T.PATH; d[7][6] = T.PATH;
      return d;
    },
    npcs: [
      { id: 'xiao_he', x: 5 * 16, y: 5 * 16, spriteKey: 'npc_xiaohe',
        name: '萧何', dialog: '刘邦，县令让你押送一批刑徒\n去骊山修陵。这是苦差事，\n但办好了说不定能升迁。\n（接任务：押送刑徒）' },
    ],
    portals: [
      { x: 4 * 16, y: 12 * 16 + 4, w: 48, h: 4, targetMap: 'peixian',
        targetX: 26 * 16, targetY: 17 * 16 + 8, labelKey: 'portal_xianya_to_peixian', label: '出门' },
    ],
    playerSpawn: { x: 5 * 16, y: 10 * 16 },
  },

  /** ====== 酒肆 ====== */
  jiusi: {
    id: 'jiusi', name: '王媪酒肆',
    rows: 12, cols: 11,
    solidTiles: new Set([T.WALL]),
    build() {
      const d = emptyMap(12, 11);
      fill(d, 1, 1, 10, 9, T.WOOD);
      for (let r = 1; r < 11; r++) { d[r][1] = T.WALL; d[r][9] = T.WALL; }
      fill(d, 1, 1, 1, 9, T.WALL);
      fill(d, 10, 1, 10, 9, T.WALL);
      d[10][4] = T.WOOD; d[10][5] = T.WOOD; d[10][6] = T.WOOD;
      fill(d, 6, 3, 6, 7, T.WALL); // 柜台
      return d;
    },
    npcs: [
      { id: 'cao_shen', x: 5 * 16, y: 5 * 16, spriteKey: 'npc_guard',
        name: '曹参', dialog: '刘邦兄！来喝酒！\n我虽是狱掾，但这世道…\n咱们迟早得干一番大事！' },
    ],
    portals: [
      { x: 4 * 16, y: 10 * 16 + 4, w: 48, h: 4, targetMap: 'peixian',
        targetX: 11 * 16, targetY: 6 * 16 + 8, labelKey: 'portal_jiusi_to_peixian', label: '出门' },
    ],
    playerSpawn: { x: 5 * 16, y: 8 * 16 },
  },

  /** ====== 芒砀山 ====== */
  mangdang: {
    id: 'mangdang', name: '芒砀山',
    rows: 22, cols: 30,
    solidTiles: new Set([T.WALL, T.TREE, T.W1, T.W2, T.BUSH]),
    build() {
      const d = emptyMap(22, 30);

      // 散落树木
      for (let r = 2; r < 21; r++)
        for (let c = 2; c < 29; c++)
          if ((r * 7 + c * 13) % 17 === 0) d[r][c] = T.TREE;

      // 右下山间小溪
      for (let r = 15; r < 21; r++)
        for (let c = 23; c < 29; c++)
          d[r][c] = (r + c) % 2 ? T.W1 : T.W2;

      // 花丛
      for (let i = 0; i < 8; i++) {
        d[2 + ((i * 37) % 19)][2 + ((i * 53) % 27)] = T.FLOWER;
      }
      d[6][14] = T.BUSH; d[10][22] = T.BUSH;
      d[16][8] = T.BUSH; d[18][18] = T.BUSH;

      grassify(d, 22, 30);
      return d;
    },
    npcs: [
      { id: 'follower1', x: 10 * 16, y: 8 * 16, spriteKey: 'npc_villager',
        name: '刑徒', dialog: '亭长仁义，放我们一条生路。\n我等愿追随左右！' },
      { id: 'white_snake', x: 20 * 16, y: 14 * 16, spriteKey: 'npc_snake',
        name: '白蛇', dialog: '（一条巨大的白蛇挡住了去路！\n此乃白帝之子，斩之可立威！）' },
    ],
    portals: [
      { x: 2 * 16, y: 11 * 16, w: 8, h: 16, targetMap: 'peixian',
        targetX: 29 * 16, targetY: 11 * 16, labelKey: 'portal_mangdang_to_peixian', label: '←回沛县' },
      { x: 22 * 16, y: 1 * 16, w: 48, h: 4, targetMap: 'mangdang_deep',
        targetX: 14 * 16, targetY: 18 * 16, labelKey: 'portal_mangdang_to_mangdang_deep', label: '深山↓' },
    ],
    playerSpawn: { x: 4 * 16, y: 11 * 16 },
  },

  /** ====== 芒砀山深处 ====== */
  mangdang_deep: {
    id: 'mangdang_deep', name: '芒砀山深处',
    rows: 20, cols: 30,
    solidTiles: new Set([T.WALL, T.TREE]),
    build() {
      const d = emptyMap(20, 30);
      fill(d, 1, 1, 18, 28, T.DIRT);
      for (let r = 0; r < 20; r++) for (let c = 0; c < 30; c++)
        if (r === 0 || r === 19 || c === 0 || c === 29) d[r][c] = T.WALL;

      // 山岩
      d[5][8] = T.WALL; d[5][21] = T.WALL;
      d[10][5] = T.WALL; d[10][14] = T.WALL; d[10][24] = T.WALL;
      d[15][9] = T.WALL; d[15][20] = T.WALL;
      d[8][16] = T.W1; d[8][17] = T.W2;
      d[16][12] = T.W1;

      return d;
    },
    npcs: [],
    portals: [
      { x: 14 * 16, y: 18 * 16 + 4, w: 48, h: 4, targetMap: 'mangdang',
        targetX: 22 * 16, targetY: 3 * 16, labelKey: 'portal_mangdang_deep_to_mangdang', label: '出洞' },
      { x: 26 * 16, y: 14 * 16, w: 16, h: 24, targetMap: 'peixian',
        targetX: 16 * 16, targetY: 11 * 16, labelKey: 'portal_mangdang_deep_to_peixian', label: '回沛县(交任务)' },
      { x: 26 * 16, y: 1 * 16, w: 48, h: 4, targetMap: 'xianyang',
        targetX: 5 * 16, targetY: 10 * 16, labelKey: 'portal_mangdang_deep_to_xianyang', label: '→咸阳' },
    ],
    playerSpawn: { x: 14 * 16, y: 17 * 16 },
  },

  /** ====== 第3章 咸阳城（灭秦） ====== */
  xianyang: {
    id: 'xianyang', name: '咸阳城外',
    rows: 20, cols: 30,
    solidTiles: new Set([T.WALL, T.TREE, T.W1, T.W2, T.HOUSE, T.ROOF, T.BUSH]),
    build() {
      const d = emptyMap(20, 30);
      // 城墙
      for (let c = 6; c < 26; c++) d[1][c] = T.WALL;
      // 城门
      d[1][14] = T.PATH; d[1][15] = T.PATH;
      // 大道
      fill(d, 2, 14, 18, 15, T.PATH);
      // 房屋
      fill(d, 3, 4, 3, 6, T.ROOF); fill(d, 4, 4, 5, 6, T.HOUSE); d[4][5] = T.WOOD;
      fill(d, 3, 10, 3, 12, T.ROOF); fill(d, 4, 10, 5, 12, T.HOUSE); d[4][11] = T.WOOD;
      fill(d, 3, 18, 3, 20, T.ROOF); fill(d, 4, 18, 5, 20, T.HOUSE); d[4][19] = T.WOOD;
      fill(d, 10, 4, 10, 6, T.ROOF); fill(d, 11, 4, 12, 6, T.HOUSE); d[11][5] = T.WOOD;
      // 树木
      d[5][24]=T.TREE;d[6][25]=T.TREE;d[2][26]=T.TREE;d[8][2]=T.TREE;d[14][3]=T.TREE;d[16][26]=T.TREE;
      // 花丛
      d[9][22]=T.FLOWER;d[15][6]=T.FLOWER;d[17][24]=T.FLOWER;
      grassify(d, 20, 30);
      return d;
    },
    npcs: [
      { id: 'zhang_liang', x: 7 * 16, y: 9 * 16, spriteKey: 'npc_zhangliang',
        name: '张良', dialog: '沛公！咸阳就在眼前。\n记住——约法三章，得民心者得天下。' },
      { id: 'villager2', x: 20 * 16, y: 8 * 16, spriteKey: 'npc_villager',
        name: '秦民', dialog: '秦法严苛已久，沛公若能\n废除苛法，我等愿效犬马之劳！' },
    ],
    portals: [
      { x: 3 * 16, y: 1 * 16, w: 48, h: 4, targetMap: 'mangdang_deep',
        targetX: 26 * 16, targetY: 3 * 16, labelKey: 'portal_xianyang_to_mangdang_deep', label: '←芒砀山' },
      { x: 14 * 16, y: 1 * 16 - 2, w: 32, h: 4, targetMap: 'xianyang_palace',
        targetX: 12 * 16, targetY: 14 * 16, labelKey: 'portal_xianyang_to_xianyang_palace', label: '秦王宫↓' },
      { x: 26 * 16, y: 11 * 16, w: 8, h: 16, targetMap: 'hongmen',
        targetX: 2 * 16, targetY: 11 * 16, labelKey: 'portal_xianyang_to_hongmen', label: '→鸿门' },
    ],
    playerSpawn: { x: 6 * 16, y: 10 * 16 },
  },

  /** ====== 咸阳秦王宫 ====== */
  xianyang_palace: {
    id: 'xianyang_palace', name: '秦王宫',
    rows: 16, cols: 26,
    solidTiles: new Set([T.WALL]),
    build() {
      const d = emptyMap(16, 26);
      fill(d, 1, 1, 14, 24, T.WOOD);
      for (let r = 1; r < 15; r++) { d[r][1] = T.WALL; d[r][24] = T.WALL; }
      fill(d, 1, 1, 1, 24, T.WALL);
      fill(d, 14, 1, 14, 24, T.WALL);
      // 大门
      d[14][12] = T.WOOD; d[14][13] = T.WOOD;
      // 柱子
      d[4][5]=T.WALL; d[4][12]=T.WALL; d[4][19]=T.WALL;
      d[9][5]=T.WALL; d[9][12]=T.WALL; d[9][19]=T.WALL;
      // 王座区域
      fill(d, 3, 10, 3, 14, T.PATH);
      d[2][12] = T.ROOF;
      return d;
    },
    npcs: [
      { id: 'ziying', x: 13 * 16, y: 4 * 16, spriteKey: 'npc_emperor',
        name: '子婴', dialog: '（秦王子婴素车白马，系颈以组）\n秦朝…亡了。\n我将玉玺交予沛公。' },
      { id: 'fan_kuai2', x: 16 * 16, y: 10 * 16, spriteKey: 'npc_fankuai',
        name: '樊哙', dialog: '大哥！这秦宫财宝如山，\n美女如云。但张良说得对——\n贪图享乐就是走秦朝老路！' },
    ],
    portals: [
      { x: 12 * 16, y: 14 * 16 + 2, w: 32, h: 4, targetMap: 'xianyang',
        targetX: 14 * 16, targetY: 3 * 16, labelKey: 'portal_xianyang_palace_to_xianyang', label: '出宫' },
    ],
    playerSpawn: { x: 12 * 16, y: 12 * 16 },
  },

  /** ====== 第4章 鸿门 ====== */
  hongmen: {
    id: 'hongmen', name: '鸿门',
    rows: 20, cols: 28,
    solidTiles: new Set([T.WALL, T.TREE, T.HOUSE, T.ROOF, T.BUSH]),
    build() {
      const d = emptyMap(20, 28);
      // 楚军大营
      fill(d, 2, 2, 17, 27, T.DIRT);
      // 营帐
      fill(d, 3, 12, 3, 17, T.ROOF);
      fill(d, 4, 12, 8, 17, T.HOUSE);
      d[4][14] = T.WOOD; d[4][15] = T.WOOD; // 大帐门
      // 周围营帐
      fill(d, 10, 4, 10, 8, T.ROOF); fill(d, 11, 4, 13, 8, T.HOUSE);
      fill(d, 10, 21, 10, 25, T.ROOF); fill(d, 11, 21, 13, 25, T.HOUSE);
      // 篝火
      d[7][7] = T.PATH; d[7][22] = T.PATH;
      d[14][6] = T.PATH; d[14][15] = T.PATH;
      // 火把/装饰
      d[5][9] = T.BUSH; d[5][20] = T.BUSH; d[12][13] = T.BUSH;
      grassify(d, 20, 28);
      return d;
    },
    npcs: [
      { id: 'xiang_bo', x: 8 * 16, y: 12 * 16, spriteKey: 'npc_villager',
        name: '项伯', dialog: '（低声）张良兄让我来报信——\n项羽明日要攻打汉军！' },
      { id: 'soldier1', x: 22 * 16, y: 12 * 16, spriteKey: 'npc_guard',
        name: '楚兵', dialog: '项王有令，明日犒赏三军，\n一举击破刘邦！' },
    ],
    portals: [
      { x: 2 * 16, y: 11 * 16, w: 8, h: 16, targetMap: 'xianyang',
        targetX: 25 * 16, targetY: 11 * 16, labelKey: 'portal_hongmen_to_xianyang', label: '←咸阳' },
      { x: 14 * 16, y: 8 * 16, w: 32, h: 4, targetMap: 'hongmen_tent',
        targetX: 12 * 16, targetY: 14 * 16, labelKey: 'portal_hongmen_to_hongmen_tent', label: '大帐↓' },
    ],
    playerSpawn: { x: 4 * 16, y: 11 * 16 },
  },

  /** ====== 鸿门宴大帐 ====== */
  hongmen_tent: {
    id: 'hongmen_tent', name: '鸿门宴大帐',
    rows: 16, cols: 26,
    solidTiles: new Set([T.WALL]),
    build() {
      const d = emptyMap(16, 26);
      fill(d, 1, 1, 14, 24, T.WOOD);
      for (let r = 1; r < 15; r++) { d[r][1] = T.WALL; d[r][24] = T.WALL; }
      fill(d, 1, 1, 1, 24, T.WALL);
      fill(d, 14, 1, 14, 24, T.WALL);
      d[14][12] = T.WOOD; d[14][13] = T.WOOD; // 入口
      // 酒席案桌
      fill(d, 6, 8, 6, 17, T.PATH);
      fill(d, 10, 8, 10, 17, T.PATH);
      // 主人位
      d[3][12] = T.ROOF; d[3][13] = T.ROOF;
      // 柱子
      d[4][6] = T.WALL; d[4][19] = T.WALL; d[11][6] = T.WALL; d[11][19] = T.WALL;
      return d;
    },
    npcs: [
      { id: 'xiang_yu', x: 13 * 16, y: 4 * 16, spriteKey: 'npc_warrior',
        name: '项羽', dialog: '沛公远来，请上座。\n（眼神中藏着杀机）' },
      { id: 'xiang_zhuang', x: 10 * 16, y: 9 * 16, spriteKey: 'npc_guard',
        name: '项庄', dialog: '（拔剑起舞）\n军中无以为乐，请以剑舞助兴！\n（剑锋直指沛公！）' },
      { id: 'fan_zeng', x: 20 * 16, y: 9 * 16, spriteKey: 'npc_fanzeng',
        name: '范增', dialog: '（举玉玦示意项羽动手，\n项羽默然不应）\n唉！时机已过…' },
    ],
    portals: [
      { x: 12 * 16, y: 14 * 16 + 2, w: 32, h: 4, targetMap: 'hongmen',
        targetX: 14 * 16, targetY: 9 * 16, labelKey: 'portal_hongmen_tent_to_hongmen', label: '出帐' },
      { x: 23 * 16, y: 7 * 16, w: 16, h: 24, targetMap: 'hanzhong',
        targetX: 4 * 16, targetY: 11 * 16, labelKey: 'portal_hongmen_tent_to_hanzhong', label: '→汉中' },
    ],
    playerSpawn: { x: 12 * 16, y: 12 * 16 },
  },

  /** ====== 第5章 汉中（蛰伏） ====== */
  hanzhong: {
    id: 'hanzhong', name: '汉中',
    rows: 20, cols: 28,
    solidTiles: new Set([T.WALL, T.TREE, T.W1, T.W2, T.HOUSE, T.ROOF, T.BUSH]),
    build() {
      const d = emptyMap(20, 28);
      fill(d, 1, 2, 18, 27, T.G1);
      // 汉军大营
      fill(d, 8, 10, 12, 18, T.DIRT);
      fill(d, 8, 10, 8, 18, T.PATH);
      // 拜将台
      fill(d, 3, 12, 3, 16, T.HOUSE);
      d[3][14] = T.ROOF;
      fill(d, 2, 13, 2, 15, T.ROOF);
      // 栈道残迹（烧毁的木板）
      for (let c = 22; c < 28; c += 2) { d[6][c] = T.WOOD; d[7][c] = T.WOOD; }
      d[6][24] = T.PATH; d[7][25] = T.PATH; // 残破
      // 营帐
      fill(d, 14, 4, 14, 7, T.ROOF); fill(d, 15, 4, 16, 7, T.HOUSE);
      fill(d, 14, 22, 14, 25, T.ROOF); fill(d, 15, 22, 16, 25, T.HOUSE);
      // 树木
      d[10][2]=T.TREE;d[17][26]=T.TREE;d[18][3]=T.TREE;d[2][2]=T.TREE;
      grassify(d, 20, 28);
      return d;
    },
    npcs: [
      { id: 'xiao_he2', x: 12 * 16, y: 15 * 16, spriteKey: 'npc_xiaohe',
        name: '萧何', dialog: '大王，我追回了一个人——\n韩信！他是国士无双，\n必能助大王争夺天下！' },
      { id: 'hanxin', x: 14 * 16, y: 5 * 16, spriteKey: 'npc_hanxin',
        name: '韩信', dialog: '（登坛对——汉中对）\n项王虽勇，匹夫之勇耳。\n大王若举兵东出，\n三秦可传檄而定！' },
    ],
    portals: [
      { x: 4 * 16, y: 11 * 16, w: 8, h: 16, targetMap: 'hongmen_tent',
        targetX: 23 * 16, targetY: 10 * 16, labelKey: 'portal_hanzhong_to_hongmen_tent', label: '←鸿门' },
      { x: 24 * 16, y: 11 * 16, w: 8, h: 16, targetMap: 'chencang',
        targetX: 4 * 16, targetY: 11 * 16, labelKey: 'portal_hanzhong_to_chencang', label: '→陈仓' },
    ],
    playerSpawn: { x: 5 * 16, y: 11 * 16 },
  },

  /** ====== 陈仓（暗度陈仓） ====== */
  chencang: {
    id: 'chencang', name: '陈仓',
    rows: 20, cols: 28,
    solidTiles: new Set([T.WALL, T.TREE, T.W1, T.W2, T.HOUSE, T.ROOF, T.BUSH]),
    build() {
      const d = emptyMap(20, 28);
      // 山路
      fill(d, 2, 14, 18, 15, T.DIRT);
      for (let r=2;r<19;r++) for (let c=2;c<14;c++) if ((r+c)%3===0) d[r][c]=T.TREE;
      for (let r=2;r<19;r++) for (let c=16;c<27;c++) if ((r+c)%3===0) d[r][c]=T.TREE;
      // 陈仓城
      fill(d, 8, 17, 8, 22, T.WALL);
      fill(d, 12, 17, 12, 22, T.WALL);
      d[9][17] = T.HOUSE; d[10][17] = T.HOUSE; d[11][17] = T.HOUSE;
      d[9][18] = T.HOUSE; d[10][18] = T.HOUSE; d[11][18] = T.HOUSE;
      d[10][19] = T.HOUSE; d[10][20] = T.HOUSE; d[10][21] = T.HOUSE;
      d[10][22] = T.WOOD; // 城门
      // 栈道方向
      for (let c=6;c<12;c++) { d[2][c]=T.WOOD; d[3][c]=T.WOOD; }
      d[2][10] = T.PATH;
      grassify(d, 20, 28);
      return d;
    },
    npcs: [
      { id: 'zhang_han', x: 18 * 16, y: 15 * 16, spriteKey: 'npc_warrior',
        name: '章邯', dialog: '什么？！汉军不是还在修栈道吗，\n怎么已经打到陈仓了？！\n——韩信！你好狠的计策！' },
      { id: 'fan_kuai3', x: 10 * 16, y: 13 * 16, spriteKey: 'npc_fankuai',
        name: '樊哙', dialog: '哈哈哈！我们在那边大张旗鼓修栈道，\n章邯果然中计了！\n韩信将军真是神机妙算！' },
    ],
    portals: [
      { x: 4 * 16, y: 11 * 16, w: 8, h: 16, targetMap: 'hanzhong',
        targetX: 23 * 16, targetY: 11 * 16, labelKey: 'portal_chencang_to_hanzhong', label: '←汉中' },
      { x: 24 * 16, y: 11 * 16, w: 8, h: 16, targetMap: 'pengcheng',
        targetX: 4 * 16, targetY: 11 * 16, labelKey: 'portal_chencang_to_pengcheng', label: '→彭城' },
    ],
    playerSpawn: { x: 6 * 16, y: 11 * 16 },
  },

  /** ====== 第6章 彭城（楚汉争霸） ====== */
  pengcheng: {
    id: 'pengcheng', name: '彭城',
    rows: 20, cols: 28,
    solidTiles: new Set([T.WALL, T.TREE, T.W1, T.W2, T.HOUSE, T.ROOF, T.BUSH]),
    build() {
      const d = emptyMap(20, 28);
      fill(d, 1, 2, 18, 27, T.DIRT);
      // 楚都宫殿废墟
      fill(d, 3, 12, 3, 17, T.ROOF); fill(d, 4, 12, 6, 17, T.HOUSE);
      // 战场痕迹
      for (let i=0;i<10;i++) { const rr=4+Math.floor(Math.random()*14), rc=3+Math.floor(Math.random()*23); d[rr][rc]=T.PATH; }
      // 城墙残垣
      for (let c=8;c<20;c++) { d[10][c]=T.WALL; d[9][c]=Math.random()<.5?T.WALL:T.DIRT; }
      // 树木
      d[2][2]=T.TREE;d[2][25]=T.TREE;d[17][3]=T.TREE;d[17][26]=T.TREE;
      return d;
    },
    npcs: [
      { id: 'chen_ping', x: 8*16, y: 8*16, spriteKey: 'npc_chenping',
        name: '陈平', dialog: '大王！彭城虽破，但楚军主力尚存。\n臣有一计——反间！\n项羽多疑，离间他与范增、钟离眜。' },
      { id: 'ji_xin', x: 20*16, y: 14*16, spriteKey: 'npc_guard',
        name: '纪信', dialog: '大王！荥阳若守不住，\n臣愿假扮大王开城出降，\n大王可从西门突围。' },
    ],
    portals: [
      { x: 2*16, y: 11*16, w: 8, h: 16, targetMap: 'chencang', targetX: 23*16, targetY: 11*16, labelKey: 'portal_pengcheng_to_chencang', label: '←陈仓' },
      { x: 25*16, y: 14*16, w: 8, h: 16, targetMap: 'xingyang', targetX: 4*16, targetY: 11*16, labelKey: 'portal_pengcheng_to_xingyang', label: '→荥阳' },
    ],
    playerSpawn: { x: 4*16, y: 11*16 },
  },

  /** ====== 荥阳（对峙） ====== */
  xingyang: {
    id: 'xingyang', name: '荥阳',
    rows: 20, cols: 28,
    solidTiles: new Set([T.WALL, T.TREE, T.W1, T.W2, T.HOUSE, T.ROOF, T.BUSH]),
    build() {
      const d = emptyMap(20, 28);
      fill(d, 1, 2, 18, 27, T.DIRT);
      // 城墙
      for (let c=6; c<24; c++) { d[1][c]=T.WALL; d[18][c]=T.WALL; }
      for (let r=1; r<19; r++) { d[r][6]=T.WALL; d[r][23]=T.WALL; }
      d[1][14]=T.DIRT; d[1][15]=T.DIRT; // 北门
      d[18][14]=T.DIRT; d[18][15]=T.DIRT; // 南门
      // 城内
      fill(d, 8, 10, 12, 19, T.DIRT);
      fill(d, 9, 13, 11, 16, T.WOOD); // 将军府
      // 敖仓
      for (let c=20;c<23;c++) { d[15][c]=T.WALL; d[16][c]=T.WALL; d[17][c]=T.WALL; }
      d[15][21]=T.PATH;
      return d;
    },
    npcs: [
      { id: 'peng_yue', x: 14*16, y: 5*16, spriteKey: 'npc_pengyue',
        name: '彭越', dialog: '汉王！我在楚军后方不断骚扰，\n断了他们的粮道。\n项羽疲于奔命，成皋必将易手！' },
    ],
    portals: [
      { x: 4*16, y: 11*16, w: 8, h: 16, targetMap: 'pengcheng', targetX: 24*16, targetY: 14*16, labelKey: 'portal_xingyang_to_pengcheng', label: '←彭城' },
      { x: 24*16, y: 14*16, w: 8, h: 24, targetMap: 'gaixia', targetX: 4*16, targetY: 11*16, labelKey: 'portal_xingyang_to_gaixia', label: '→垓下' },
    ],
    playerSpawn: { x: 6*16, y: 11*16 },
  },

  /** ====== 第7章 垓下·乌江 ====== */
  gaixia: {
    id: 'gaixia', name: '垓下',
    rows: 20, cols: 30,
    solidTiles: new Set([T.WALL, T.TREE, T.W1, T.W2, T.HOUSE, T.ROOF, T.BUSH]),
    build() {
      const d = emptyMap(20, 30);
      fill(d, 1, 2, 18, 28, T.DIRT);
      // 汉军围城
      for (let c=5;c<10;c++) { d[3][c]=T.HOUSE; d[2][c]=T.ROOF; } // 韩信帐
      for (let c=22;c<27;c++) { d[3][c]=T.HOUSE; d[2][c]=T.ROOF; } // 彭越帐
      for (let c=5;c<27;c++) { d[16][c]=T.HOUSE; d[15][c]=T.ROOF; } // 刘邦帐
      // 楚营（中央被围）
      fill(d, 8, 13, 12, 17, T.DIRT);
      d[10][15]=T.PATH; // 项羽帐
      // 篝火
      for (let i=0;i<8;i++) { d[2+Math.floor(Math.random()*16)][2+Math.floor(Math.random()*27)]=T.FLOWER; }
      return d;
    },
    npcs: [
      { id: 'hanxin2', x:7*16, y:5*16, spriteKey:'npc_guard', name:'韩信',
        dialog: '大王！臣设十面埋伏之计，\n楚军已插翅难飞。\n今夜请四面楚歌，瓦解楚军士气。' },
      { id: 'zhang_liang2', x:24*16, y:5*16, spriteKey:'npc_villager', name:'张良',
        dialog: '我已命汉军齐唱楚歌。\n楚军听到家乡歌声，思乡心切，\n军心必溃。' },
    ],
    portals: [
      { x:4*16, y:11*16, w:8, h:16, targetMap:'xingyang', targetX:23*16, targetY:15*16, labelKey:'portal_gaixia_to_xingyang', label:'←荥阳' },
      { x:26*16, y:11*16, w:8, h:24, targetMap:'wujiang', targetX:4*16, targetY:11*16, labelKey:'portal_gaixia_to_wujiang', label:'→乌江' },
    ],
    playerSpawn: { x:6*16, y:11*16 },
  },

  wujiang: {
    id: 'wujiang', name: '乌江',
    rows: 18, cols: 26,
    solidTiles: new Set([T.WALL, T.TREE, T.W1, T.W2, T.BUSH]),
    build() {
      const d = emptyMap(18, 26);
      for (let r=1;r<17;r++) for (let c=1;c<25;c++) d[r][c]=T.G1;
      // 乌江
      for (let c=10;c<22;c++) for (let r=14;r<17;r++) d[r][c]=(r+c)%2?T.W1:T.W2;
      // 渡口
      d[13][15]=T.PATH; d[13][16]=T.PATH; d[14][15]=T.PATH;
      // 树
      d[3][3]=T.TREE;d[3][22]=T.TREE;d[8][2]=T.TREE;d[8][23]=T.TREE;d[12][4]=T.TREE;
      grassify(d,18,26);
      return d;
    },
    npcs: [
      { id:'xiang_yu2', x:14*16, y:11*16, spriteKey:'npc_warrior', name:'项羽',
        dialog: '（独立乌江边，仰天长叹）\n天之亡我，我何渡为！\n籍与江东子弟八千人渡江而西，\n今无一人还——\n纵江东父兄怜而王我，\n我何面目见之？' },
      { id:'boatman', x:16*16, y:13*16, spriteKey:'npc_villager', name:'亭长',
        dialog: '大王！江东虽小，地方千里，\n众数十万，亦足王也！\n请大王急渡！' },
    ],
    portals: [
      { x:4*16, y:11*16, w:8, h:16, targetMap:'gaixia', targetX:25*16, targetY:11*16, labelKey:'portal_wujiang_to_gaixia', label:'←垓下' },
      { x:22*16, y:5*16, w:8, h:16, targetMap:'changan', targetX:4*16, targetY:11*16, labelKey:'portal_wujiang_to_changan', label:'→定陶' },
    ],
    playerSpawn: { x:6*16, y:11*16 },
  },

  /** ====== 第8章 长安·建立汉朝 ====== */
  changan: {
    id: 'changan', name: '定陶·登基',
    rows: 20, cols: 28,
    solidTiles: new Set([T.WALL, T.TREE, T.W1, T.W2, T.HOUSE, T.ROOF, T.BUSH]),
    build() {
      const d = emptyMap(20, 28);
      fill(d, 1, 2, 18, 27, T.G1);
      // 登基台
      fill(d, 3, 12, 3, 17, T.PATH);
      fill(d, 2, 13, 2, 16, T.HOUSE);
      d[2][14]=T.ROOF; d[2][15]=T.ROOF;
      // 百官列队
      for (let r=5;r<8;r++) for (let c=6;c<23;c+=4) d[r][c]=T.FLOWER;
      // 旗帜
      d[1][10]=T.BUSH; d[1][19]=T.BUSH;
      for (let c=3;c<26;c+=7) { d[12][c]=T.HOUSE; d[13][c]=T.ROOF; }
      grassify(d,20,28);
      return d;
    },
    npcs: [
      { id:'hanxin3', x:10*16, y:6*16, spriteKey:'npc_hanxin', name:'韩信',
        dialog: '臣楚王韩信，率七位诸侯王，\n联名劝进——请汉王即皇帝位！\n国号"汉"，定都洛阳！' },
      { id:'lou_jing', x:20*16, y:10*16, spriteKey:'npc_villager', name:'娄敬',
        dialog: '陛下！臣一介戍卒，斗胆进言：\n洛阳四面受敌，不宜为都。\n关中"被山带河，四塞以为固"，\n沃野千里，天府之国！' },
      { id:'zhang_liang3', x:18*16, y:14*16, spriteKey:'npc_villager', name:'张良',
        dialog: '娄敬说得对！新都取名——\n"长安"！长治久安之意。\n关中金城千里，天府之国。' },
    ],
    portals: [
      { x:4*16, y:11*16, w:8, h:16, targetMap:'wujiang', targetX:21*16, targetY:6*16, labelKey:'portal_changan_to_wujiang', label:'←乌江' },
      { x:24*16, y:5*16, w:8, h:20, targetMap:'changle_palace', targetX:12*16, targetY:14*16, labelKey:'portal_changan_to_changle_palace', label:'→长乐宫' },
    ],
    playerSpawn: { x:6*16, y:11*16 },
  },

  /** ====== 第9章 长乐宫·皇帝时代 ====== */
  changle_palace: {
    id: 'changle_palace', name: '长乐宫',
    rows: 16, cols: 28,
    solidTiles: new Set([T.WALL]),
    build() {
      const d = emptyMap(16, 28);
      fill(d, 1, 1, 14, 26, T.WOOD);
      for (let r=1;r<15;r++) { d[r][1]=T.WALL; d[r][26]=T.WALL; }
      fill(d,1,1,1,26,T.WALL); fill(d,14,1,14,26,T.WALL);
      d[14][13]=T.WOOD; d[14][14]=T.WOOD; // 门
      // 柱子
      d[4][5]=T.WALL;d[4][13]=T.WALL;d[4][21]=T.WALL;
      d[10][5]=T.WALL;d[10][13]=T.WALL;d[10][21]=T.WALL;
      // 王座
      fill(d,2,11,2,15,T.ROOF); fill(d,3,12,3,14,T.HOUSE);
      // 钟室
      fill(d,11,20,11,25,T.WALL); d[12][22]=T.HOUSE;
      return d;
    },
    npcs: [
      { id:'liu_bang_old', x:14*16, y:4*16, spriteKey:'npc_liuhuang', name:'刘邦',
        dialog: '（坐在龙椅上，威严中透着疲惫）\n吾以布衣提三尺剑取天下，\n此非天命乎？\n……非刘氏而王者，天下共击之！' },
      { id:'lvhou', x:10*16, y:8*16, spriteKey:'npc_female', name:'吕后',
        dialog: '陛下，异姓诸侯王势力太大，\n不可不除。韩信、彭越、英布…\n妾身来办。' },
      { id:'shusun_tong', x:6*16, y:10*16, spriteKey:'npc_villager', name:'叔孙通',
        dialog: '陛下！臣为汉朝制定朝仪。\n演练数月后，群臣列队，\n无人敢喧哗失礼。\n刘邦感叹："吾乃今日知为皇帝之贵也！"' },
    ],
    portals: [
      { x:12*16, y:14*16+2, w:32, h:4, targetMap:'changan', targetX:24*16, targetY:7*16, labelKey:'portal_changle_palace_to_changan', label:'出宫' },
      { x:24*16, y:7*16, w:8, h:16, targetMap:'peixian_return', targetX:2*16, targetY:11*16, labelKey:'portal_changle_palace_to_peixian_return', label:'→沛县' },
    ],
    playerSpawn: { x:12*16, y:12*16 },
  },

  /** ====== 第10章 沛县·大风歌 ====== */
  peixian_return: {
    id: 'peixian_return', name: '沛县·还乡',
    rows: 20, cols: 28,
    solidTiles: new Set([T.WALL, T.TREE, T.HOUSE, T.ROOF, T.BUSH]),
    build() {
      const d = emptyMap(20, 28);
      fill(d,1,2,18,27,T.G1);
      // 沛宫（临时行宫）
      fill(d,4,10,4,17,T.ROOF); fill(d,5,10,7,17,T.HOUSE);
      d[5][13]=T.WOOD; d[5][14]=T.WOOD;
      // 乡间小路
      fill(d,11,2,11,27,T.PATH);
      // 老宅
      fill(d,14,5,14,8,T.ROOF); fill(d,15,5,16,8,T.HOUSE);
      // 酒肆
      fill(d,14,21,14,24,T.ROOF); fill(d,15,21,16,24,T.HOUSE);
      d[15][22]=T.WOOD;
      // 树和花
      d[3][2]=T.TREE;d[3][25]=T.TREE;d[8][2]=T.TREE;d[17][26]=T.TREE;
      d[10][5]=T.FLOWER;d[10][22]=T.FLOWER;d[17][14]=T.FLOWER;
      grassify(d,20,28);
      return d;
    },
    npcs: [
      { id:'liu_bang_final', x:14*16, y:6*16, spriteKey:'npc_liuhuang', name:'刘邦',
        dialog: '（置酒沛宫，召故人父老子弟纵酒，\n发沛中儿得百二十人，教之歌）\n大风起兮云飞扬——\n威加海内兮归故乡——\n安得猛士兮守四方！\n（起舞，泣数行下）' },
      { id:'elder', x:10*16, y:13*16, spriteKey:'npc_villager', name:'父老',
        dialog: '陛下还乡，乃沛县之荣耀。\n我等愿世代供奉，免沛县赋税，\n以为陛下汤沐邑。' },
      { id:'liu_bang_last', x:20*16, y:16*16, spriteKey:'npc_liuhuang', name:'刘邦',
        dialog: '游子悲故乡。\n吾虽都关中，万岁后，\n吾魂魄犹乐思沛。\n\n从农家少年到大汉天子——\n此乃天命，亦乃人力。\n\n—— 全篇完 ——' },
    ],
    portals: [
      { x:2*16, y:11*16, w:8, h:16, targetMap:'changle_palace', targetX:23*16, targetY:8*16, labelKey:'portal_peixian_return_to_changle_palace', label:'←长安' },
    ],
    playerSpawn: { x:4*16, y:11*16 },
  },
};
