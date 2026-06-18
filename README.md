# 刘邦人生 / Rise of Liu Bang

> 2D 像素历史 RPG — 从布衣到大汉天子，重走刘邦逆袭之路
>
> 2D Pixel Historical RPG — From commoner to Emperor of Han, relive Liu Bang's legendary rise

🌐 **在线版 / Play Online**: https://cao2525628257-arch.github.io/liubang-life-rpg/

---

## 🎮 操作 / Controls

| 按键 / Key | 功能 / Action |
|------------|---------------|
| ↑↓←→ / WASD | 移动角色 / Move |
| T / Enter | 对话 / 推进对话 / 选答案 — Talk / Advance / Confirm |
| ← → | 战斗/选项中切换 — Switch options in battle |
| Esc | 菜单（背包/任务/存档/返回标题）— Menu (Bag/Quest/Save/Title) |
| L | 中 / English 切换 — Toggle language |

## 🛠 技术栈 / Tech Stack

- Canvas 2D，640×360 像素完美缩放 / Pixel-perfect scaling
- 原生 ES Modules，零依赖、零构建 / Vanilla ES Modules, zero deps, zero build
- 所有素材代码生成（`pixel_art_gen.js`）/ All sprites procedurally generated
- 中英双语，L键即时切换 / Bilingual CN/EN, press L to toggle

## 🚀 启动 / Quick Start

```bash
cd my-game-html
python3 -m http.server 8766
# http://localhost:8766
```

## 📁 项目结构 / Project Structure

```
my-game-html/
├── index.html                  # 入口 / Entry
├── css/style.css               # Canvas缩放居中 / Scaling & centering
├── js/
│   ├── main.js                 # 启动+错误捕获 / Bootstrap + error handling
│   ├── engine/                 # 引擎（不依赖游戏内容）/ Engine (game-agnostic)
│   │   ├── game.js             # 游戏循环（固定时间步长）/ Game loop (fixed timestep)
│   │   ├── renderer.js         # Canvas渲染+摄像机 / Renderer + camera
│   │   ├── input.js            # 键盘鼠标管理 / Keyboard & mouse input
│   │   ├── scene_manager.js    # 场景栈（push/pop/switch）/ Scene stack
│   │   ├── tilemap.js          # 瓦片地图+碰撞检测 / Tilemap + collision
│   │   ├── entity.js           # 实体基类 / Entity base class
│   │   ├── asset_loader.js     # 异步资源加载 / Async asset loader
│   │   ├── audio_manager.js    # BGM/SFX（框架就绪）/ Audio manager (ready)
│   │   ├── save_manager.js     # localStorage存档 / Save system
│   │   └── pixel_art_gen.js    # 所有精灵代码生成 / Sprite generation
│   ├── scenes/                 # 场景 / Scenes
│   │   ├── title_scene.js      # 标题画面 / Title screen
│   │   ├── loading_scene.js    # 加载画面（生成素材）/ Loading (asset generation)
│   │   └── game_scene.js       # 主游戏场景（一切玩法）/ Main game scene
│   ├── systems/                # 游戏系统 / Game systems
│   │   ├── dialogue_system.js  # 对话（打字机+换行+选项）/ Dialogue system
│   │   ├── quest_system.js     # 任务管理 / Quest management
│   │   ├── inventory.js        # 背包 / Inventory
│   │   ├── localization.js     # 中英双语 / Localization
│   │   └── ui_components.js    # Button/Panel/ProgressBar / UI components
│   └── data/                   # 游戏内容数据 / Game data
│       ├── config.js           # 全局配置 / Global config
│       ├── maps.js             # 19张地图定义 / 19 map definitions
│       ├── chapters.js         # 全10章NPC/节点框架 / 10 chapter framework
│       └── dialogues.js        # 全10章对话数据（待接入）/ Dialogue data (pending)
└── assets/                     # 外部素材目录（可选）/ External assets (optional)
    ├── sprites/
    ├── audio/
    └── data/maps/
```

## 🏗 架构说明 / Architecture

### 场景流转 / Scene Flow
```
TitleScene → LoadingScene → GameScene
   ↑                           │
   └─────── 返回标题 / Back ←──┘
```

### GameScene 核心循环 / Core Loop
```
update(dt):
  菜单? → 处理菜单 / Menu open? → Handle menu
  战斗中? → 处理战斗面板 / In battle? → Battle panel
  对话中? → 推进对话+检查选项 / In dialogue? → Advance + check options
  否则 → 移动+敌人AI+传送+收集+交互 / Else → Move + AI + portals + collect + interact
```

### ⚔️ 战斗系统 / Battle System
- 触碰红名敌人 → 弹出视觉面板（300×200居中）/ Touch red-name enemy → battle panel pops up
- 显示敌我HP条 + 数学题 + 3个选项 / HP bars + math problem + 3 choices
- ← → 选择，Enter 确认，Esc 逃跑 / Arrows to pick, Enter to confirm, Esc to flee
- 难度分级 / Difficulty tiers：atk≤3 加减/add-sub / atk4-6 乘除/mul-div / atk≥7 混合/mixed

### 📋 任务系统 / Quest System
- NPC 接任务（头顶 `!`）→ 到达目的地自动完成+自动发奖 / Accept from NPC (`!` marker) → auto-complete on arrival + auto-reward
- 无需回头交任务 / No need to return to NPC
- 8个任务覆盖全10章 / 8 quests across 10 chapters

## ✏️ 如何添加内容 / How to Add Content

### 加新地图 / Add a Map
1. `js/data/maps.js` — 在 `MAPS` 对象中添加新条目 / Add entry to `MAPS`
2. `js/systems/localization.js` — 加 `map_xxx` 的名字 / Add map name
3. 确保有传送门连接（`portals` 数组）/ Ensure portal connections exist

### 加新 NPC / Add an NPC
1. 地图的 `npcs` 数组加条目 `{id, x, y, spriteKey, name, dialog}` / Add to map's `npcs` array
2. 如需专属精灵：`js/engine/pixel_art_gen.js` 加生成函数 / Custom sprite? Add to pixel_art_gen.js
3. 在 `js/scenes/loading_scene.js` 的 steps 数组中注册 / Register in loading_scene steps
4. `localization.js` 加名字和对话翻译 / Add name & dialogue translations

### 加新任务 / Add a Quest
1. `js/scenes/game_scene.js` 的 `_initQ` 中 `register` / Register in `_initQ`
2. `_sMap` 的 `reachRewards`（到达型）或 `killRewards`（杀敌型）/ Add to reward maps
3. `_qm` 中加 NPC→任务映射 / Map NPC → quest
4. `localization.js` 加 `quest_xxx_title/desc` / Add quest strings

### 加新精灵 / Add a Sprite
1. `js/engine/pixel_art_gen.js` — `export function generateXxxSprite()` / Add generator
2. `js/scenes/loading_scene.js` — import + steps数组加条目 / Import + register step
3. `js/data/maps.js` — NPC 的 `spriteKey` 指向新 key / Point NPC spriteKey to it

## ⚠️ 已知问题 / Known Issues

- 音效系统框架就绪但无音频文件 / Audio system ready but no audio files
- 手机端无触屏摇杆 / No touch controls for mobile
- `js/data/dialogues.js` 全10章对话数据已写好但未接入 NPC 交互 / 10-chapter dialogue data written but not wired to NPCs
- 地图数据在 JS 中手写，非 JSON 文件管理 / Map data hardcoded in JS, not managed as JSON
