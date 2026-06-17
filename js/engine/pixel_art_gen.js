/**
 * 像素素材生成器 — 纯代码绘制精灵图/瓦片集/UI 素材
 *
 * 所有素材在内存中生成，无需外部图片文件。
 * 后续可直接替换为美术素材包。
 */

/** 汉风调色板（32色） */
const PAL = {
  // 地形
  GRASS_1:    '#4a8c3f',
  GRASS_2:    '#3d7234',
  DIRT_1:     '#8b6914',
  DIRT_2:     '#6b4f10',
  STONE_1:    '#7a7a7a',
  STONE_2:    '#5a5a5a',
  STONE_3:    '#4a4a4a',
  WATER_1:    '#2d6b9f',
  WATER_2:    '#1d4d7a',
  SAND:       '#d4c88c',
  WOOD:       '#8b5e3c',

  // 角色
  SKIN:       '#e8c39e',
  HAIR:       '#2a1a0a',
  CLOTH_RED:  '#c13a3a',
  CLOTH_GOLD: '#d4a843',
  CLOTH_DARK: '#3a2a1a',
  BOOTS:      '#4a3020',

  // UI
  UI_BG:      '#0d0d1a',
  UI_BORDER:  '#d4a843',
  UI_FILL:    '#1a1a2e',
  UI_ACCENT:  '#c13a3a',

  // 道具
  POTION_RED:  '#e04040',
  POTION_GREEN:'#40a040',
  GOLD_COIN:  '#ffd700',
  SILVER:     '#c0c0c0',
};

/**
 * 创建离屏 Canvas
 */
function createCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

/**
 * 生成瓦片集 (16×16 瓦片，排列在 spritesheet 上)
 * 返回 Image 对象
 */
export function generateTileset() {
  const TILE = 16;
  const COLS = 8;
  const ROWS = 3;
  const c = createCanvas(COLS * TILE, ROWS * TILE);
  const ctx = c.getContext('2d');

  // 辅助: 画瓦片
  function tile(col, row, drawFn) {
    const x = col * TILE;
    const y = row * TILE;
    ctx.save();
    ctx.translate(x, y);
    drawFn(ctx, TILE);
    ctx.restore();
  }

  // 0,0 — 草地A
  tile(0, 0, (ctx, s) => {
    ctx.fillStyle = PAL.GRASS_1;
    ctx.fillRect(0, 0, s, s);
    // 草纹理
    ctx.fillStyle = PAL.GRASS_2;
    ctx.fillRect(2, 4, 2, 2); ctx.fillRect(8, 11, 3, 2);
    ctx.fillRect(12, 2, 2, 2); ctx.fillRect(4, 13, 2, 1);
  });

  // 1,0 — 草地B（纹理变化）
  tile(1, 0, (ctx, s) => {
    ctx.fillStyle = PAL.GRASS_1;
    ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = '#529944';
    ctx.fillRect(5, 6, 3, 1); ctx.fillRect(10, 3, 2, 2);
    ctx.fillStyle = PAL.GRASS_2;
    ctx.fillRect(1, 11, 3, 2); ctx.fillRect(13, 7, 2, 2);
  });

  // 2,0 — 泥土地
  tile(2, 0, (ctx, s) => {
    ctx.fillStyle = PAL.DIRT_1;
    ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = PAL.DIRT_2;
    ctx.fillRect(3, 5, 2, 3); ctx.fillRect(10, 2, 2, 2);
    ctx.fillRect(7, 10, 3, 2); ctx.fillRect(1, 1, 2, 2);
    // 小石子
    ctx.fillStyle = PAL.STONE_2;
    ctx.fillRect(5, 8, 1, 1); ctx.fillRect(12, 12, 2, 1);
  });

  // 3,0 — 石板路
  tile(3, 0, (ctx, s) => {
    ctx.fillStyle = PAL.STONE_1;
    ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = PAL.STONE_2;
    ctx.fillRect(4, 0, 1, 16); ctx.fillRect(11, 0, 1, 16);
    ctx.fillRect(0, 4, 16, 1); ctx.fillRect(0, 11, 16, 1);
    ctx.fillStyle = PAL.STONE_3;
    ctx.fillRect(4, 4, 1, 1); ctx.fillRect(11, 11, 1, 1);
  });

  // 0,1 — 石墙
  tile(0, 1, (ctx, s) => {
    ctx.fillStyle = PAL.STONE_1;
    ctx.fillRect(0, 0, s, s);
    // 砖块纹理
    ctx.fillStyle = PAL.STONE_2;
    for (let y = 0; y < s; y += 8) {
      for (let x = (y % 16 === 0 ? 0 : 4); x < s; x += 8) {
        ctx.fillRect(x, y, 8, 3);
        ctx.fillRect(x, y + 5, 8, 3);
      }
    }
    ctx.fillStyle = PAL.STONE_3;
    ctx.fillRect(1, 1, 1, 1); ctx.fillRect(7, 9, 1, 1);
    ctx.fillRect(13, 3, 1, 1); ctx.fillRect(3, 12, 1, 1);
  });

  // 1,1 — 水面A
  tile(1, 1, (ctx, s) => {
    ctx.fillStyle = PAL.WATER_1;
    ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = PAL.WATER_2;
    ctx.fillRect(4, 4, 3, 1); ctx.fillRect(9, 8, 4, 1);
    ctx.fillRect(1, 12, 5, 1);
  });

  // 2,1 — 水面B (波浪偏移)
  tile(2, 1, (ctx, s) => {
    ctx.fillStyle = PAL.WATER_1;
    ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = PAL.WATER_2;
    ctx.fillRect(0, 2, 4, 1); ctx.fillRect(6, 11, 5, 1);
    ctx.fillRect(11, 6, 3, 1);
    ctx.fillStyle = '#3a8ac0';
    ctx.fillRect(5, 2, 2, 1); ctx.fillRect(0, 11, 3, 1);
  });

  // 3,1 — 木地板
  tile(3, 1, (ctx, s) => {
    ctx.fillStyle = PAL.WOOD;
    ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = '#6b4226';
    for (let y = 0; y < s; y += 4) {
      ctx.fillRect(0, y, s, 1);
    }
    ctx.fillStyle = '#9b6e4c';
    ctx.fillRect(3, 0, 1, 16); ctx.fillRect(10, 0, 1, 16);
  });

  // 4,0 — 花丛
  tile(4, 0, (ctx, s) => {
    ctx.fillStyle = PAL.GRASS_1;
    ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = '#e040a0';
    ctx.fillRect(6, 10, 4, 4);
    ctx.fillRect(10, 8, 2, 2);
    ctx.fillStyle = '#60d040';
    ctx.fillRect(5, 13, 6, 3);
    ctx.fillStyle = '#f0e040';
    ctx.fillRect(7, 11, 2, 2);
  });

  // 5,0 — 灌木
  tile(5, 0, (ctx, s) => {
    ctx.fillStyle = PAL.GRASS_1;
    ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = '#2d5a1e';
    ctx.fillRect(2, 6, 12, 10);
    ctx.fillStyle = '#3d7a2e';
    ctx.fillRect(4, 4, 8, 10);
    ctx.fillStyle = '#4d9a3e';
    ctx.fillRect(5, 5, 3, 3); ctx.fillRect(10, 7, 2, 2);
  });

  // 0,2 — 树
  tile(0, 2, (ctx, s) => {
    ctx.fillStyle = PAL.GRASS_1;
    ctx.fillRect(0, 0, s, s);
    // 树干
    ctx.fillStyle = '#5a3a1a';
    ctx.fillRect(6, 8, 4, 8);
    // 树冠
    ctx.fillStyle = '#2d5a1e';
    ctx.fillRect(1, 0, 14, 10);
    ctx.fillStyle = '#3d7a2e';
    ctx.fillRect(3, 2, 10, 8);
    ctx.fillStyle = '#4d9a3e';
    ctx.fillRect(6, 3, 4, 4);
  });

  // 1,2 — 房屋墙
  tile(1, 2, (ctx, s) => {
    ctx.fillStyle = '#e8d5a3';
    ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = '#d4c080';
    for (let y = 0; y < s; y += 4) {
      ctx.fillRect(0, y, s, 1);
    }
    ctx.fillStyle = '#c0a860';
    ctx.fillRect(5, 0, 1, 16); ctx.fillRect(11, 0, 1, 16);
  });

  // 2,2 — 房屋屋顶
  tile(2, 2, (ctx, s) => {
    ctx.fillStyle = PAL.CLOTH_RED;
    ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = '#8a1a1a';
    for (let row = 0; row < s; row += 4) {
      ctx.fillRect(0, row, s, 1);
      ctx.fillRect(0, row + 2, s, 1);
    }
  });

  // 直接用 data URL 生成 Image
  const img = new Image();
  return new Promise((resolve) => {
    img.onload = () => resolve(img);
    img.src = c.toDataURL();
  });
}

/**
 * 生成角色精灵图（4方向行走，3帧动画）
 * 返回 { image, frameW, frameH, directions: {down, left, right, up} }
 */
export function generateCharacterSprite(hairColor = PAL.HAIR, clothColor = PAL.CLOTH_RED) {
  const FRAME_W = 16;
  const FRAME_H = 16;
  const COLS = 3; // 每方向3帧
  const ROWS = 4; // 4个方向
  const c = createCanvas(COLS * FRAME_W, ROWS * FRAME_H);
  const ctx = c.getContext('2d');

  function drawBody(ctx, ox, oy) {
    // 头
    ctx.fillStyle = PAL.SKIN;
    ctx.fillRect(ox + 5, oy + 0, 6, 5);
    // 头发
    ctx.fillStyle = hairColor;
    ctx.fillRect(ox + 4, oy + 0, 8, 3);
    ctx.fillRect(ox + 3, oy + 1, 2, 2);
    ctx.fillRect(ox + 11, oy + 1, 2, 2);
    // 眼睛
    ctx.fillStyle = '#000';
    ctx.fillRect(ox + 7, oy + 2, 2, 1);
    // 身体/衣服
    ctx.fillStyle = clothColor;
    ctx.fillRect(ox + 4, oy + 5, 8, 5);
    // 金色腰带
    ctx.fillStyle = PAL.CLOTH_GOLD;
    ctx.fillRect(ox + 4, oy + 8, 8, 1);
  }

  // 向下 (row 0)
  for (let f = 0; f < 3; f++) {
    const ox = f * FRAME_W;
    drawBody(ctx, ox, 0);
    // 腿（走路动画：开/合/开）
    ctx.fillStyle = PAL.CLOTH_DARK;
    const legOff = [1, 0, -1][f];
    ctx.fillRect(ox + 5, oy(10), 2, 6);
    ctx.fillRect(ox + 9 + legOff, oy(10), 2, 6);
    // 鞋
    ctx.fillStyle = PAL.BOOTS;
    ctx.fillRect(ox + 5, oy(14), 3, 2);
    ctx.fillRect(ox + 9 + legOff, oy(14), 3, 2);
  }

  // 向左 (row 1)
  for (let f = 0; f < 3; f++) {
    const ox = f * FRAME_W, oy = 16;
    drawBody(ctx, ox, oy);
    const legOff = [1, 0, -2][f];
    ctx.fillStyle = PAL.CLOTH_DARK;
    ctx.fillRect(ox + 5 + legOff, oy + 10, 2, 6);
    ctx.fillRect(ox + 9 + legOff, oy + 10, 2, 6);
    ctx.fillStyle = PAL.BOOTS;
    ctx.fillRect(ox + 5 + legOff, oy + 14, 3, 2);
    ctx.fillRect(ox + 9 + legOff, oy + 14, 3, 2);
  }

  // 向右 (row 2)
  for (let f = 0; f < 3; f++) {
    const ox = f * FRAME_W, oy = 32;
    drawBody(ctx, ox, oy);
    const legOff = [-1, 0, 2][f];
    ctx.fillStyle = PAL.CLOTH_DARK;
    ctx.fillRect(ox + 5 + legOff, oy + 10, 2, 6);
    ctx.fillRect(ox + 9 + legOff, oy + 10, 2, 6);
    ctx.fillStyle = PAL.BOOTS;
    ctx.fillRect(ox + 5 + legOff, oy + 14, 3, 2);
    ctx.fillRect(ox + 9 + legOff, oy + 14, 3, 2);
  }

  // 向上 (row 3)
  for (let f = 0; f < 3; f++) {
    const ox = f * FRAME_W, oy = 48;
    drawBody(ctx, ox, oy);
    ctx.fillStyle = PAL.CLOTH_DARK;
    ctx.fillRect(ox + 5, oy + 10, 2, 6);
    ctx.fillRect(ox + 9, oy + 10, 2, 6);
    ctx.fillStyle = PAL.BOOTS;
    ctx.fillRect(ox + 5, oy + 14, 3, 2);
    ctx.fillRect(ox + 9, oy + 14, 3, 2);
  }

  const img = new Image();

  return new Promise((resolve) => {
    img.onload = () => resolve({
      image: img,
      frameW: FRAME_W,
      frameH: FRAME_H,
      directions: { down: 0, left: 1, right: 2, up: 3 },
    });
    img.src = c.toDataURL();
  });
}

function oy(y) { return y; } // helper — 简化本地坐标

/**
 * 生成 NPC 精灵图（简单静态，无动画）
 */
export function generateNPCSprite(clothColor = '#4a7a3a') {
  const c = createCanvas(16, 16);
  const ctx = c.getContext('2d');

  // 头
  ctx.fillStyle = PAL.SKIN;
  ctx.fillRect(5, 0, 6, 5);
  // 头发
  ctx.fillStyle = '#3a1a0a';
  ctx.fillRect(4, 0, 8, 3);
  // 眼睛
  ctx.fillStyle = '#000';
  ctx.fillRect(7, 2, 2, 1);
  // 衣服
  ctx.fillStyle = clothColor;
  ctx.fillRect(4, 5, 8, 5);
  // 腿
  ctx.fillStyle = PAL.CLOTH_DARK;
  ctx.fillRect(5, 10, 2, 6);
  ctx.fillRect(9, 10, 2, 6);

  const img = new Image();
  return new Promise((resolve) => {
    img.onload = () => resolve(img);
    img.src = c.toDataURL();
  });
}

/**
 * 生成女性NPC精灵（吕雉等）
 */
export function generateFemaleSprite(hairColor = '#1a0a0a', clothColor = '#c13a3a') {
  const c = createCanvas(16, 16);
  const ctx = c.getContext('2d');

  // 头
  ctx.fillStyle = PAL.SKIN;
  ctx.fillRect(5, 0, 6, 5);
  // 长发（女性发型，盘髻）
  ctx.fillStyle = hairColor;
  ctx.fillRect(4, 0, 8, 4); // 发顶
  ctx.fillRect(3, 1, 2, 3); // 左鬓
  ctx.fillRect(11, 1, 2, 3); // 右鬓
  ctx.fillRect(4, 3, 1, 2); // 左侧发
  ctx.fillRect(11, 3, 1, 2); // 右侧发
  // 发髻
  ctx.fillRect(6, 0, 4, 1);
  // 眼睛
  ctx.fillStyle = '#000';
  ctx.fillRect(7, 2, 2, 1);
  // 衣服（汉服长裙）
  ctx.fillStyle = clothColor;
  ctx.fillRect(3, 5, 10, 5);
  // 腰带
  ctx.fillStyle = PAL.CLOTH_GOLD;
  ctx.fillRect(4, 8, 8, 1);
  // 裙子下摆
  ctx.fillStyle = clothColor;
  ctx.fillRect(2, 10, 12, 3);
  ctx.fillStyle = '#7a1e1e';
  ctx.fillRect(3, 13, 10, 3);

  const img = new Image();
  return new Promise((resolve) => {
    img.onload = () => resolve(img);
    img.src = c.toDataURL();
  });
}

/** 项羽 — 武将精灵（黑甲红袍） */
export function generateWarriorSprite() {
  const c = createCanvas(16, 16); const ctx = c.getContext('2d');
  // 头+盔
  ctx.fillStyle = PAL.SKIN; ctx.fillRect(5, 0, 6, 4);
  ctx.fillStyle = '#3a3a3a'; ctx.fillRect(4, 0, 8, 3); // 铁盔
  ctx.fillStyle = '#000'; ctx.fillRect(7, 1, 2, 1); // 眼
  // 黑甲
  ctx.fillStyle = '#2a2a2a'; ctx.fillRect(3, 4, 10, 6);
  ctx.fillStyle = '#444'; ctx.fillRect(5, 4, 6, 1); // 肩甲
  // 红袍
  ctx.fillStyle = '#8a1a1a'; ctx.fillRect(2, 8, 12, 3);
  ctx.fillStyle = '#c13a3a'; ctx.fillRect(3, 10, 10, 3);
  // 腿
  ctx.fillStyle = '#2a2a2a'; ctx.fillRect(5, 13, 2, 3); ctx.fillRect(9, 13, 2, 3);
  return new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = c.toDataURL(); });
}

/** 子婴 — 秦帝王精灵（黄袍素衣） */
export function generateEmperorSprite() {
  const c = createCanvas(16, 16); const ctx = c.getContext('2d');
  ctx.fillStyle = PAL.SKIN; ctx.fillRect(5, 0, 6, 5);
  ctx.fillStyle = '#1a1a0a'; ctx.fillRect(4, 0, 8, 3); // 发冠
  ctx.fillStyle = '#000'; ctx.fillRect(7, 2, 2, 1);
  // 黄袍
  ctx.fillStyle = '#d4a843'; ctx.fillRect(3, 5, 10, 5);
  ctx.fillStyle = '#8b6914'; ctx.fillRect(2, 9, 12, 3); // 下摆
  ctx.fillStyle = '#6b4f10'; ctx.fillRect(5, 12, 2, 4); ctx.fillRect(9, 12, 2, 4);
  // 系颈之组（投降绳索）
  ctx.fillStyle = '#fff'; ctx.fillRect(5, 3, 6, 1);
  return new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = c.toDataURL(); });
}

/** 白蛇 — 蛇形精灵 */
export function generateSnakeSprite() {
  const c = createCanvas(32, 24); const ctx = c.getContext('2d');
  // 蛇身（蜿蜒）
  ctx.fillStyle = '#f0f0f0';
  ctx.fillRect(2, 10, 4, 4); ctx.fillRect(6, 8, 4, 8);
  ctx.fillRect(10, 6, 4, 12); ctx.fillRect(14, 8, 4, 8);
  ctx.fillRect(18, 10, 4, 6); ctx.fillRect(22, 12, 4, 4);
  // 蛇头
  ctx.fillStyle = '#e0e0e0';
  ctx.fillRect(26, 10, 4, 6);
  ctx.fillStyle = '#c00'; ctx.fillRect(29, 11, 1, 1); // 眼
  ctx.fillStyle = '#c00'; ctx.fillRect(30, 13, 1, 1); // 舌
  // 鳞片高光
  ctx.fillStyle = '#ffffff'; ctx.fillRect(8, 7, 2, 2); ctx.fillRect(16, 9, 2, 2);
  return new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = c.toDataURL(); });
}

/** 秦兵（黑甲长矛） */
export function generateQinSoldierSprite() {
  const c = createCanvas(16, 16); const ctx = c.getContext('2d');
  ctx.fillStyle = PAL.SKIN; ctx.fillRect(5, 0, 6, 4);
  ctx.fillStyle = '#1a1a1a'; ctx.fillRect(4, 0, 8, 3); // 黑铁盔
  ctx.fillStyle = '#000'; ctx.fillRect(7, 1, 2, 1);
  // 黑甲
  ctx.fillStyle = '#1a1a1a'; ctx.fillRect(3, 4, 10, 6);
  ctx.fillStyle = '#333'; ctx.fillRect(5, 4, 6, 1); // 胸甲线
  // 腰带
  ctx.fillStyle = '#555'; ctx.fillRect(4, 9, 8, 1);
  // 腿
  ctx.fillStyle = '#1a1a1a'; ctx.fillRect(5, 10, 2, 6); ctx.fillRect(9, 10, 2, 6);
  // 长矛（右侧）
  ctx.fillStyle = '#8b6914'; ctx.fillRect(13, 2, 1, 13); // 矛杆
  ctx.fillStyle = '#ccc'; ctx.fillRect(12, 2, 3, 2); // 矛头
  return new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = c.toDataURL(); });
}

/** 楚兵（赤甲剑） */
export function generateChuSoldierSprite() {
  const c = createCanvas(16, 16); const ctx = c.getContext('2d');
  ctx.fillStyle = PAL.SKIN; ctx.fillRect(5, 0, 6, 4);
  ctx.fillStyle = '#5a1a1a'; ctx.fillRect(4, 0, 8, 3); // 赤盔
  ctx.fillStyle = '#000'; ctx.fillRect(7, 1, 2, 1);
  // 赤甲
  ctx.fillStyle = '#8a1a1a'; ctx.fillRect(3, 4, 10, 6);
  ctx.fillStyle = '#a33'; ctx.fillRect(5, 5, 6, 1);
  // 腰带
  ctx.fillStyle = '#c8a840'; ctx.fillRect(4, 9, 8, 1);
  // 腿
  ctx.fillStyle = '#5a1a1a'; ctx.fillRect(5, 10, 2, 6); ctx.fillRect(9, 10, 2, 6);
  // 佩剑
  ctx.fillStyle = '#ccc'; ctx.fillRect(12, 4, 2, 9);
  ctx.fillStyle = '#8b6914'; ctx.fillRect(11, 3, 4, 1);
  return new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = c.toDataURL(); });
}

// ===== 核心角色专属精灵 =====

/** 萧何 — 文官（蓝袍、儒冠） */
export function generateXiaoheSprite() {
  const c = createCanvas(16, 16); const ctx = c.getContext('2d');
  ctx.fillStyle = PAL.SKIN; ctx.fillRect(5, 0, 6, 4);
  ctx.fillStyle = '#1a2a3a'; ctx.fillRect(4, 0, 8, 3); // 儒冠
  ctx.fillStyle = '#000'; ctx.fillRect(7, 1, 2, 1);
  ctx.fillStyle = '#3a5a8a'; ctx.fillRect(3, 4, 10, 5); // 蓝袍
  ctx.fillStyle = '#4a6a9a'; ctx.fillRect(5, 4, 6, 2); // 衣襟
  ctx.fillStyle = '#c8a840'; ctx.fillRect(4, 8, 8, 1); // 腰带
  ctx.fillStyle = '#2a4a6a'; ctx.fillRect(3, 10, 10, 6); // 下摆
  ctx.fillStyle = '#8a6a3a'; ctx.fillRect(13, 6, 2, 4); // 毛笔
  return new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = c.toDataURL(); });
}

/** 韩信 — 大将（银甲、佩剑、披风） */
export function generateHanxinSprite() {
  const c = createCanvas(16, 16); const ctx = c.getContext('2d');
  ctx.fillStyle = PAL.SKIN; ctx.fillRect(5, 0, 6, 4);
  ctx.fillStyle = '#c8c8c8'; ctx.fillRect(4, 0, 8, 3); // 银盔
  ctx.fillStyle = '#000'; ctx.fillRect(7, 1, 2, 1);
  ctx.fillStyle = '#aaa'; ctx.fillRect(3, 4, 10, 5); // 银甲
  ctx.fillStyle = '#ddd'; ctx.fillRect(5, 4, 6, 1);
  ctx.fillStyle = '#8a1a1a'; ctx.fillRect(2, 6, 1, 6); // 红披风
  ctx.fillStyle = '#888'; ctx.fillRect(4, 8, 8, 1);
  ctx.fillStyle = '#666'; ctx.fillRect(5, 10, 2, 6); ctx.fillRect(9, 10, 2, 6);
  ctx.fillStyle = '#fff'; ctx.fillRect(13, 5, 2, 6); // 佩剑
  return new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = c.toDataURL(); });
}

/** 张良 — 策士（白衣、羽扇、飘然） */
export function generateZhangliangSprite() {
  const c = createCanvas(16, 16); const ctx = c.getContext('2d');
  ctx.fillStyle = PAL.SKIN; ctx.fillRect(5, 0, 6, 4);
  ctx.fillStyle = '#1a2a1a'; ctx.fillRect(4, 0, 8, 3);
  ctx.fillStyle = '#000'; ctx.fillRect(7, 1, 2, 1);
  ctx.fillStyle = '#e8e8e0'; ctx.fillRect(3, 4, 10, 5); // 白衣
  ctx.fillStyle = '#f8f8f0'; ctx.fillRect(5, 4, 6, 2);
  ctx.fillStyle = '#c8c0a0'; ctx.fillRect(4, 8, 8, 1);
  ctx.fillStyle = '#d8d8c8'; ctx.fillRect(3, 10, 10, 6);
  ctx.fillStyle = '#e8e8d0'; ctx.fillRect(13, 3, 3, 5); // 羽扇
  ctx.fillStyle = '#f8f8e8'; ctx.fillRect(14, 4, 2, 3);
  return new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = c.toDataURL(); });
}

/** 陈平 — 谋士（紫袍、阴沉、袖中藏计） */
export function generateChenpingSprite() {
  const c = createCanvas(16, 16); const ctx = c.getContext('2d');
  ctx.fillStyle = PAL.SKIN; ctx.fillRect(5, 0, 6, 4);
  ctx.fillStyle = '#1a0a1a'; ctx.fillRect(4, 0, 8, 3);
  ctx.fillStyle = '#000'; ctx.fillRect(7, 1, 2, 1);
  ctx.fillStyle = '#4a1a4a'; ctx.fillRect(3, 4, 10, 5); // 紫袍
  ctx.fillStyle = '#5a2a5a'; ctx.fillRect(5, 4, 6, 2);
  ctx.fillStyle = '#888'; ctx.fillRect(4, 8, 8, 1);
  ctx.fillStyle = '#3a0a3a'; ctx.fillRect(3, 10, 10, 6);
  ctx.fillStyle = '#ffd700'; ctx.fillRect(6, 6, 1, 2); // 袖中金
  return new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = c.toDataURL(); });
}

/** 刘邦(皇帝) — 黄袍龙袍 */
export function generateEmperorLiuSprite() {
  const c = createCanvas(16, 16); const ctx = c.getContext('2d');
  ctx.fillStyle = PAL.SKIN; ctx.fillRect(5, 0, 6, 4);
  ctx.fillStyle = '#1a1a0a'; ctx.fillRect(4, 0, 8, 3);
  ctx.fillStyle = '#000'; ctx.fillRect(7, 1, 2, 1);
  ctx.fillStyle = '#d4a843'; ctx.fillRect(2, 4, 12, 5); // 龙袍
  ctx.fillStyle = '#e8c860'; ctx.fillRect(4, 4, 8, 2);
  ctx.fillStyle = '#8b6914'; ctx.fillRect(3, 8, 10, 1); // 玉带
  ctx.fillStyle = '#c8a040'; ctx.fillRect(2, 10, 12, 6); // 下摆
  ctx.fillStyle = '#f0d870'; ctx.fillRect(5, 7, 2, 2); // 龙纹
  return new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = c.toDataURL(); });
}

/** 樊哙 — 屠狗猛将（赤膊、屠刀） */
export function generateFankuaiSprite() {
  const c = createCanvas(16, 16); const ctx = c.getContext('2d');
  ctx.fillStyle = PAL.SKIN; ctx.fillRect(5, 0, 6, 4);
  ctx.fillStyle = '#2a1a0a'; ctx.fillRect(4, 0, 8, 3); // 乱发
  ctx.fillStyle = '#000'; ctx.fillRect(7, 1, 2, 1);
  ctx.fillStyle = '#c8a080'; ctx.fillRect(3, 4, 10, 6); // 赤膊(肤色)
  ctx.fillStyle = '#d4b898'; ctx.fillRect(5, 4, 4, 6); // 胸肌
  ctx.fillStyle = '#4a2a1a'; ctx.fillRect(4, 9, 8, 3); // 皮裙
  ctx.fillStyle = '#6a3a2a'; ctx.fillRect(5, 10, 2, 6); ctx.fillRect(9, 10, 2, 6);
  ctx.fillStyle = '#ccc'; ctx.fillRect(13, 3, 3, 8); // 屠刀
  ctx.fillStyle = '#f00'; ctx.fillRect(14, 3, 1, 1); // 刀刃血
  return new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = c.toDataURL(); });
}

/** 范增 — 老谋士（白发、苍老） */
export function generateFanzengSprite() {
  const c = createCanvas(16, 16); const ctx = c.getContext('2d');
  ctx.fillStyle = '#d8c8a8'; ctx.fillRect(5, 0, 6, 4); // 苍老肤色
  ctx.fillStyle = '#e8e8e8'; ctx.fillRect(4, 0, 8, 4); // 白发
  ctx.fillStyle = '#000'; ctx.fillRect(7, 2, 2, 1);
  ctx.fillStyle = '#5a4a3a'; ctx.fillRect(3, 4, 10, 5); // 褐袍
  ctx.fillStyle = '#6a5a4a'; ctx.fillRect(5, 4, 6, 2);
  ctx.fillStyle = '#8a7a6a'; ctx.fillRect(4, 8, 8, 1);
  ctx.fillStyle = '#4a3a2a'; ctx.fillRect(5, 10, 2, 6); ctx.fillRect(9, 10, 2, 6);
  ctx.fillStyle = '#888'; ctx.fillRect(12, 3, 1, 6); // 拐杖
  return new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = c.toDataURL(); });
}

/** 彭越 — 枭雄（褐衣、粗犷） */
export function generatePengyueSprite() {
  const c = createCanvas(16, 16); const ctx = c.getContext('2d');
  ctx.fillStyle = '#c8a878'; ctx.fillRect(5, 0, 6, 4);
  ctx.fillStyle = '#3a2a1a'; ctx.fillRect(4, 0, 8, 3);
  ctx.fillStyle = '#000'; ctx.fillRect(7, 1, 2, 1);
  ctx.fillStyle = '#6a4a2a'; ctx.fillRect(3, 4, 10, 5); // 褐衣
  ctx.fillStyle = '#7a5a3a'; ctx.fillRect(5, 4, 6, 2);
  ctx.fillStyle = '#4a2a1a'; ctx.fillRect(4, 8, 8, 1);
  ctx.fillStyle = '#5a3a1a'; ctx.fillRect(5, 10, 2, 6); ctx.fillRect(9, 10, 2, 6);
  ctx.fillStyle = '#888'; ctx.fillRect(13, 6, 3, 2); // 腰刀
  return new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = c.toDataURL(); });
}

/** 项伯 — 楚将（轻甲、与项羽同族但温和） */
export function generateXiangboSprite() {
  const c = createCanvas(16, 16); const ctx = c.getContext('2d');
  ctx.fillStyle = PAL.SKIN; ctx.fillRect(5, 0, 6, 4);
  ctx.fillStyle = '#4a2a2a'; ctx.fillRect(4, 0, 8, 3);
  ctx.fillStyle = '#000'; ctx.fillRect(7, 1, 2, 1);
  ctx.fillStyle = '#6a3a3a'; ctx.fillRect(3, 4, 10, 5);
  ctx.fillStyle = '#8a5a5a'; ctx.fillRect(5, 4, 6, 1);
  ctx.fillStyle = '#aaa'; ctx.fillRect(4, 8, 8, 1);
  ctx.fillStyle = '#5a2a2a'; ctx.fillRect(5, 10, 2, 6); ctx.fillRect(9, 10, 2, 6);
  return new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = c.toDataURL(); });
}

/** 纪信 — 忠将（白面、正气） */
export function generateJixinSprite() {
  const c = createCanvas(16, 16); const ctx = c.getContext('2d');
  ctx.fillStyle = '#f0e0d0'; ctx.fillRect(5, 0, 6, 4);
  ctx.fillStyle = '#2a3a2a'; ctx.fillRect(4, 0, 8, 3);
  ctx.fillStyle = '#000'; ctx.fillRect(7, 1, 2, 1);
  ctx.fillStyle = '#3a5a3a'; ctx.fillRect(3, 4, 10, 5); // 绿袍
  ctx.fillStyle = '#4a6a4a'; ctx.fillRect(5, 4, 6, 2);
  ctx.fillStyle = '#8a7a3a'; ctx.fillRect(4, 8, 8, 1);
  ctx.fillStyle = '#2a4a2a'; ctx.fillRect(5, 10, 2, 6); ctx.fillRect(9, 10, 2, 6);
  return new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = c.toDataURL(); });
}

/** 导出色板供外部使用 */
export { PAL };
