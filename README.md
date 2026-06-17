# 刘邦人生 / Rise of Liu Bang

> 2D 像素历史 RPG — 从布衣到大汉天子，重走刘邦逆袭之路

🌐 **在线版**: https://cao2525628257-arch.github.io/liubang-life-rpg/

---

## 操作

| 按键 | 功能 |
|------|------|
| ↑↓←→ / WASD | 移动角色 |
| T / Enter | 对话 / 推进对话 / 选答案 |
| ← → | 战斗/选项中切换 |
| Esc | 菜单（背包/任务/存档/返回标题） |
| L | 中/English 切换 |

## 技术栈

- Canvas 2D，640×360 像素完美缩放
- 原生 ES Modules，零依赖、零构建
- 所有素材代码生成（`pixel_art_gen.js`）
- 中英双语，L键即时切换

## 启动

```bash
cd my-game-html
python3 -m http.server 8766
# http://localhost:8766
```

## 项目结构

```
my-game-html/
├── index.html                  # 入口
├── css/style.css               # Canvas缩放居中
├── js/
│   ├── main.js                 # 启动+错误捕获
│   ├── engine/                 # 引擎（不依赖游戏内容）
│   │   ├── game.js             # 游戏循环（固定时间步长）
│   │   ├── renderer.js         # Canvas渲染+摄像机
│   │   ├── input.js            # 键盘鼠标管理
│   │   ├── scene_manager.js    # 场景栈（push/pop/switch）
│   │   ├── tilemap.js          # 瓦片地图+碰撞检测
│   │   ├── entity.js           # 实体基类
│   │   ├── asset_loader.js     # 异步资源加载
│   │   ├── audio_manager.js    # BGM/SFX（框架就绪）
│   │   ├── save_manager.js     # localStorage存档
│   │   └── pixel_art_gen.js    # 所有精灵代码生成
│   ├── scenes/                 # 场景
│   │   ├── title_scene.js      # 标题画面
│   │   ├── loading_scene.js    # 加载画面（生成素材）
│   │   └── game_scene.js       # 主游戏场景（一切玩法）
│   ├── systems/                # 游戏系统
│   │   ├── dialogue_system.js  # 对话（打字机+换行+选项）
│   │   ├── quest_system.js     # 任务管理
│   │   ├── inventory.js        # 背包
│   │   ├── localization.js     # 中英双语
│   │   └── ui_components.js    # Button/Panel/ProgressBar
│   └── data/                   # 游戏内容数据
│       ├── config.js           # 全局配置
│       ├── maps.js             # 19张地图定义
│       ├── chapters.js         # 全10章NPC/节点框架
│       └── dialogues.js        # 全10章对话数据（待接入）
└── assets/                     # 外部素材目录（可选）
    ├── sprites/
    ├── audio/
    └── data/maps/
```

## 架构说明

### 场景流转
```
TitleScene → LoadingScene → GameScene
   ↑                           │
   └─────── 返回标题 ←─────────┘
```

### GameScene 核心循环
```
update(dt):
  菜单? → 处理菜单
  战斗中? → 处理战斗面板
  对话中? → 推进对话+检查选项
  否则 → 移动+敌人AI+传送+收集+交互
```

### 战斗系统
- 触碰红名敌人 → 弹出视觉面板（300×200居中）
- 显示敌我HP条 + 数学题 + 3个选项
- ← → 选择，Enter 确认，Esc 逃跑
- 难度分级：atk≤3 加减 / atk4-6 乘除 / atk≥7 混合

### 任务系统
- NPC 接任务（头顶 `!`）→ 到达目的地自动完成+自动发奖
- 无需回头交任务
- 8个任务覆盖全10章

## 如何添加内容

### 加新地图
1. `js/data/maps.js` — 在 `MAPS` 对象中添加新条目
2. `js/systems/localization.js` — 加 `map_xxx` 的名字
3. 确保有传送门连接（`portals` 数组）

### 加新 NPC
1. 地图的 `npcs` 数组加条目 `{id, x, y, spriteKey, name, dialog}`
2. 如需专属精灵：`js/engine/pixel_art_gen.js` 加生成函数
3. 在 `js/scenes/loading_scene.js` 的 steps 数组中注册
4. `localization.js` 加名字和对话翻译

### 加新任务
1. `js/scenes/game_scene.js` 的 `_initQ` 中 `register`
2. `_sMap` 的 `reachRewards`（到达型）或 `killRewards`（杀敌型）
3. `_qm` 中加 NPC→任务映射
4. `localization.js` 加 `quest_xxx_title/desc`

### 加新精灵
1. `js/engine/pixel_art_gen.js` — `export function generateXxxSprite()`
2. `js/scenes/loading_scene.js` — import + steps数组加条目
3. `js/data/maps.js` — NPC 的 `spriteKey` 指向新 key

## 已知问题

- 音效系统框架就绪但无音频文件
- 手机端无触屏摇杆
- `js/data/dialogues.js` 全10章对话数据已写好但未接入 NPC 交互
- 地图数据在 JS 中手写，非 JSON 文件管理
