<p align="center">
  <a href="#english">English</a> | <a href="#chinese">中文</a>
</p>

---

<a id="english"></a>

# Rise of Liu Bang / 刘邦人生

> 2D Pixel Historical RPG — From commoner to Emperor of Han, relive Liu Bang's legendary rise

🌐 **Play Online**: https://cao2525628257-arch.github.io/liubang-life-rpg/

---

## Controls

| Key | Action |
|-----|--------|
| ↑↓←→ / WASD | Move |
| T / Enter | Talk / Advance dialogue / Confirm |
| ← → | Switch options (battle / dialogue) |
| Esc | Menu (Bag / Quest / Save / Title) |
| L | Toggle Chinese / English |
| M | Toggle Mute |

## Tech Stack

- Canvas 2D, 640×360 pixel-perfect scaling
- Vanilla ES Modules, zero dependencies, zero build
- All sprites procedurally generated (`pixel_art_gen.js`)
- Procedural chiptune BGM + SFX via Web Audio API (`audio_generator.js`)
- Character voice blips (Undertale-style) during typewriter dialogue
- Bilingual CN/EN, press L to toggle instantly

## Quick Start

```bash
cd my-game-html
python3 -m http.server 8766
# http://localhost:8766
```

## Project Structure

```
my-game-html/
├── index.html                  # Entry point
├── css/style.css               # Canvas scaling & centering
├── js/
│   ├── main.js                 # Bootstrap + global error handling
│   ├── engine/                 # Engine (game-agnostic)
│   │   ├── game.js             # Game loop (fixed timestep)
│   │   ├── renderer.js         # Canvas renderer + camera
│   │   ├── input.js            # Keyboard & mouse input
│   │   ├── scene_manager.js    # Scene stack (push/pop/switch)
│   │   ├── tilemap.js          # Tilemap + collision detection
│   │   ├── entity.js           # Entity base class
│   │   ├── asset_loader.js     # Async asset loading
│   │   ├── audio_manager.js    # Audio manager (BGM / SFX / voice / mute)
│   │   ├── audio_generator.js   # Procedural chiptune + SFX via Web Audio API
│   │   ├── save_manager.js     # localStorage save system
│   │   └── pixel_art_gen.js    # All sprite generation code
│   ├── scenes/                 # Scenes
│   │   ├── title_scene.js      # Title screen
│   │   ├── loading_scene.js    # Loading screen (asset generation)
│   │   └── game_scene.js       # Main game scene (all gameplay)
│   ├── systems/                # Game Systems
│   │   ├── dialogue_system.js  # Typewriter dialogue + options
│   │   ├── quest_system.js     # Quest management
│   │   ├── inventory.js        # Inventory bag
│   │   ├── localization.js     # CN/EN bilingual support
│   │   └── ui_components.js    # Button / Panel / ProgressBar
│   └── data/                   # Game Content Data
│       ├── config.js           # Global configuration
│       ├── maps.js             # 19 map definitions
│       ├── chapters.js         # 10-chapter NPC & node framework
│       └── dialogues.js        # 10-chapter dialogue data (pending wiring)
└── assets/                     # External assets (optional)
    ├── sprites/
    ├── audio/
    └── data/maps/
```

## Architecture

### Scene Flow
```
TitleScene → LoadingScene → GameScene
   ↑                           │
   └─────── Back to Title ─────┘
```

### GameScene Core Loop
```
update(dt):
  Menu open? → Handle menu
  In battle? → Battle panel
  In dialogue? → Advance dialogue + check options
  Otherwise → Move + Enemy AI + Portals + Collect + Interact
```

### Battle System
- Touch red-name enemy → 300×200 battle panel pops up
- Displays HP bars + math problem + 3 answer choices
- ← → to pick, Enter to confirm, Esc to flee
- Difficulty scaling: atk≤3 addition/subtraction / atk 4–6 multiplication/division / atk≥7 mixed

### Quest System
- Accept quests from NPCs (marked with `!`) → auto-complete on arrival → auto-reward
- No need to return to NPC
- 8 quests spanning 10 chapters

### Audio System (Web Audio API)
- **BGM**: 5 procedural chiptune tracks (town/field/palace/battle/title) with Chinese pentatonic scale melodies, auto-switched per map
- **SFX**: 12 sound effects (menu/dialogue/battle/quest/item/portal)
- **Voice Blips**: Undertale-style — each NPC type has a distinct voice (scholar/female/warrior/king/elder/mystic...), triggered every ~3 chars during typewriter dialogue
- **M key**: Toggle mute, with HUD indicator

## How to Add Content

### Add a Map
1. `js/data/maps.js` — add entry to `MAPS` object
2. `js/systems/localization.js` — add map name under `map_xxx`
3. Ensure portal connections exist in `portals` array

### Add an NPC
1. Add `{id, x, y, spriteKey, name, dialog}` to the map's `npcs` array
2. For a custom sprite: add generation function in `js/engine/pixel_art_gen.js`
3. Register in `js/scenes/loading_scene.js` steps array
4. Add name & dialogue translations in `localization.js`

### Add a Quest
1. `js/scenes/game_scene.js` — register in `_initQ`
2. Add rewards to `_sMap` (`reachRewards` or `killRewards`)
3. Map NPC → quest in `_qm`
4. Add `quest_xxx_title` / `quest_xxx_desc` in `localization.js`

### Add a Sprite
1. `js/engine/pixel_art_gen.js` — `export function generateXxxSprite()`
2. `js/scenes/loading_scene.js` — import + add to steps array
3. `js/data/maps.js` — point NPC `spriteKey` to the new key

## Historical Sources / 信息来源

Game content is based on the following historical references:

### Core Sources

1. **Shiji: Annals of Gaozu** (*史记·高祖本纪*) — Essential biography of Liu Bang
   - 📖 [CTEXT](https://ctext.org/shiji/gao-zu-ben-ji/zh)

2. **Shiji: Annals of Xiang Yu** (*史记·项羽本纪*) — Key parallel reading
   - 📖 [CTEXT](https://ctext.org/shiji/xiang-yu-ben-ji/zh)

3. **Hanshu: Annals of Gaodi** (*汉书·高帝纪*) — Official dynastic history
   - 📖 [CTEXT Part 1](https://ctext.org/han-shu/gao-di-ji-shang/zh)
   - 📖 [CTEXT Part 2](https://ctext.org/han-shu/gao-di-ji-xia/zh)

### Further Reading

- **House of Marquis of Liu** (Zhang Liang)
- **Biography of the Marquis of Huaiyin** (Han Xin)
- **House of Chancellor Xiao** (Xiao He)

> Multiple perspectives on Liu Bang's rise and his victory over Xiang Yu.

### Academic Research

4. **The Mythology of Liu Bang in Shiji and Western Han Elites** (English paper)
   - Covers: birth myth, white serpent legend, Mandate of Heaven, Shiji's portrayal of Liu Bang, myth and Western Han political legitimacy
   - 📖 [ResearchGate (PDF)](https://www.researchgate.net/publication/related)

### Full Tables of Contents

- 📖 [Shiji (Records of the Grand Historian)](https://ctext.org/shiji/zh)
- 📖 [Hanshu (Book of Han)](https://ctext.org/han-shu/zh)

---

## Known Issues

- No touch controls for mobile
- `js/data/dialogues.js` has full 10-chapter dialogue data written but not yet wired to NPC interactions
- Map data hardcoded in JS rather than managed as JSON files

---

<a id="chinese"></a>

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
| M | 切换静音 |

## 技术栈

- Canvas 2D，640×360 像素完美缩放
- 原生 ES Modules，零依赖、零构建
- 所有素材代码生成（`pixel_art_gen.js`）
- Web Audio API 程序化复古芯片 BGM + SFX（`audio_generator.js`）
- 角色语气音（Undertale 风格），打字时随 NPC 类型变化
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
│   │   ├── audio_manager.js    # 音频管理（BGM/SFX/语气音/静音）
│   │   ├── audio_generator.js   # Web Audio API 程序化芯片音效
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
   └─────── 返回标题 ──────────┘
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

### 音频系统（Web Audio API）
- **BGM**：5首程序化芯片音乐（城镇/野外/宫殿/战斗/标题），五声音阶旋律，按地图自动切换
- **SFX**：12种音效（菜单/对话/战斗/任务/物品/传送门）
- **语气音**：Undertale 风格——每个 NPC 类型有独特声音（文臣/女性/武将/帝王/长者/神秘...），打字时每~3字触发
- **M 键**：切换静音，HUD 有状态指示

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

## 信息来源 / Historical Sources

游戏历史内容参考以下资料：

### 核心史料

1. **《史记·高祖本纪》** — 刘邦传记，研究刘邦必读
   - 📖 [CTEXT 中国哲学书电子化计划](https://ctext.org/shiji/gao-zu-ben-ji/zh)

2. **《史记·项羽本纪》** — 与刘邦对照阅读最重要的史料
   - 📖 [CTEXT 中国哲学书电子化计划](https://ctext.org/shiji/xiang-yu-ben-ji/zh)

3. **《汉书·高帝纪》** — 官方史书中的刘邦
   - 📖 [CTEXT 汉书·高帝纪上](https://ctext.org/han-shu/gao-di-ji-shang/zh)
   - 📖 [CTEXT 汉书·高帝纪下](https://ctext.org/han-shu/gao-di-ji-xia/zh)

### 扩展阅读

- **《留侯世家》**（张良）
- **《淮阴侯列传》**（韩信）
- **《萧相国世家》**（萧何）

> 从不同人物视角研究刘邦，对于分析"刘邦为何能战胜项羽"特别有帮助。

### 学术研究

4. **The Mythology of Liu Bang in Shiji and Western Han Elites**（英文论文）
   - 讨论：刘邦出生神话、斩白蛇传说、天命思想、《史记》如何塑造刘邦形象、刘邦神话与西汉政治合法性
   - 📖 [ResearchGate 全文 PDF](https://www.researchgate.net/publication/related)

### 全文目录

- 📖 [史记全文目录](https://ctext.org/shiji/zh)
- 📖 [汉书全文目录](https://ctext.org/han-shu/zh)

---

## 已知问题

- 手机端无触屏摇杆
- `js/data/dialogues.js` 全10章对话数据已写好但未接入 NPC 交互
- 地图数据在 JS 中手写，非 JSON 文件管理
