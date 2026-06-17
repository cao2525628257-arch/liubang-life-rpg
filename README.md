# 像素RPG — HTML 游戏引擎

基于 Canvas 2D 的像素风 RPG 游戏引擎，零依赖，打开即用。

## 快速开始

直接用浏览器打开 `index.html`，或用本地服务器：

```bash
# Python 3
python3 -m http.server 8000

# 或 VS Code Live Server 插件
```

然后访问 `http://localhost:8000`

## 操作

| 按键 | 功能 |
|------|------|
| 任意键 | 标题画面 → 进入游戏 |
| T | 触发测试对话 |
| Enter / Space | 推进对话 / 确认选择 |
| ↑↓ | 菜单/选项移动 |
| Esc | 打开/关闭菜单 |

## 项目结构

```
my-game-html/
├── index.html              # 入口
├── css/style.css           # 像素完美缩放样式
├── js/
│   ├── main.js             # 启动引擎
│   ├── data/config.js      # 全局配置
│   ├── engine/             # 引擎核心
│   │   ├── game.js         # 游戏循环
│   │   ├── renderer.js     # Canvas 渲染 + 摄像机
│   │   ├── input.js        # 键盘/鼠标输入
│   │   ├── scene_manager.js # 场景栈
│   │   ├── asset_loader.js # 资源异步加载
│   │   ├── audio_manager.js # BGM/SFX
│   │   ├── entity.js       # 实体基类
│   │   ├── tilemap.js      # 瓦片地图 + 碰撞
│   │   └── save_manager.js # 存档系统
│   ├── scenes/             # 游戏场景
│   ├── systems/            # 游戏系统
│   │   ├── dialogue_system.js
│   │   └── ui_components.js
│   └── assets/data/        # JSON 数据
└── assets/                 # 素材目录（用户自行添加）
```

## 添加素材

将图片/音频放入对应目录，代码中通过 `AssetLoader` 加载：

```js
import { assetLoader } from './engine/asset_loader.js';

// 加载精灵图
await assetLoader.loadImage('player', 'assets/sprites/player.png');
// 使用
const img = assetLoader.get('player');
```

## 配置

编辑 `js/data/config.js` 修改分辨率、瓦片大小、调试模式等。

## 技术栈

- Canvas 2D API
- ES Modules（原生）
- 无框架、无构建步骤
- 640×360 像素完美缩放
