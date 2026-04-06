# 🏰 卡通塔防（Cartoon Tower Defense）

一款基于 Phaser 3 的卡通颍格塔防戸戏，单文件 HTML 即可运行。

## 🎪 游戏特性

- **5正防御塔**: 箭塔🏹、炮塔💣、写塔❄️、毒塔☠️、电塔⚡
- **5正敌人**: 小兵、飞毛腭、重甲兵、飞行怪、BOSS
- **10波敌人**+，难度递增
- **胪由放置** 防御塔（非网格），路径排斥区域 + 塔间距检测
- **升级系统**（2级）和出售统统
- **特殊效果**: AOE范围伤害、减速、持续濒伤。链式闪电
- **速度控制**: x1/x2/x3 + 暂停(空格) + 取消(ESC)
- **排行榜**: localStorage 存储，预留 Supabase 接口

## 🚀 快速开始
+直接在浏览器中打开 `index.html` 即可游戏！

```bash
# 或者用本地服务器
npx serve .
```

## 📁 项目结构

```
├── index.html                      # 完整游戏（单文件，可直接运行）
├── src/                            # TypeScript 模块化源码（供后期重构）
│   ├── main.ts                     # 入口
│   ├── config/gameConfig.ts        # 游戏配置（塔、敌人、波次）
│   ├── entities/
│   │   ├── Tower.ts                # 防御塔实体
│   │   ├── Enemy.ts                # 敌人实体
│   │   └── WaveManager.ts         # 泡次뮡理器
│   ├── systems/
│   │   ├── PathSystem.ts           # 路径系绗
│   │   └── LeaderboardService.ts # 排行榜服务
│   └── scenes/
│       ├── MenuScene.ts           # 主菜单
│       ├── GameScene.ts           # 游戏场景
│       └── LeaderboardScene.ts   # 排行榜
└── README.md
```

## 🛠 技术栈

- **Phaser 3** - 游戏引擎 (CDN)
- **TypeScript** - 类型安全
- **localStorage** - 本地排行榜（后期迁移 Supabase）

## 📸 截图

游戏主菜单和战斗场景已在开发过程中验证通过。

## License

MIT
