import { Scene } from '../engine/scene_manager.js';
import { sceneManager } from '../engine/scene_manager.js';
import { renderer } from '../engine/renderer.js';
import { input } from '../engine/input.js';
import { CONFIG, COLORS } from '../data/config.js';
import { Tilemap } from '../engine/tilemap.js';
import { DialogueSystem } from '../systems/dialogue_system.js';
import { MAPS } from '../data/maps.js';
import { Inventory } from '../systems/inventory.js';
import { QuestManager, QUEST_STATE } from '../systems/quest_system.js';
import { saveManager } from '../engine/save_manager.js';
import { t, lang, initLang } from '../systems/localization.js';

export class GameScene extends Scene {
  constructor(assets, saveData) {
    super('GameScene');
    this._a = assets;
    this.tilemap = null;
    this.inventory = new Inventory();
    this.quests = new QuestManager();
    this.dialogue = new DialogueSystem();
    this._pendingC = null;
    this._afterDlg = null;

    this.hp = 30; this.maxHp = 30; this.atk = 5;
    this.prestige = 5; this.strategy = 6; this.charisma = 8; this.gold = 0;

    this.mapId = 'peixian'; this._md = null;
    this.px = 0; this.py = 0; this.speed = 80;
    this.dir = 'down'; this.mv = false; this._at = 0; this._af = 0;
    this._pcd = 0; this._visited = new Set();

    this.npcs = []; this.items = []; this.enemies = [];

    this.inCbt = false; this.cbtE = null;
    this._qz = null; this._qzS = 0; this._qzR = null; this._qzT = 0; this._qzD = 0;

    this.mO = false; this._ms = 0; this._sm = null;
    this._showReward = null; this._rst = !!saveData;
    if (saveData) this._restore(saveData);
  }

  enter() {
    initLang();
    this._initQ();
    this._sMap(this.mapId || 'peixian');
    if (this._rst && this._sp) { this.px = this._sp.x; this.py = this._sp.y; this._rst = false; }
  }

  _initQ() {
    if (this.quests.getAll().length > 0) return;
    // Ch1-2 主线
    this.quests.register({ id:'escort', title:'quest_escort_title', desc:'quest_escort_desc', objectiveType:'reach', objectiveTarget:'mangdang_deep', objectiveCount:1, rewards:[{type:'item',id:'sword',count:1}] });
    this.quests.register({ id:'slay_snake', title:'quest_snake_title', desc:'quest_snake_desc', objectiveType:'kill', objectiveTarget:'white_snake', objectiveCount:1, rewards:[{type:'item',id:'blood',count:1}] });
    // Ch3 约法三章
    this.quests.register({ id:'three_laws', title:'quest_three_laws_title', desc:'quest_three_laws_desc', objectiveType:'reach', objectiveTarget:'xianyang_palace', objectiveCount:1, rewards:[{type:'item',id:'gold',count:30}] });
    // Ch4 鸿门脱身
    this.quests.register({ id:'escape_feast', title:'quest_feast_title', desc:'quest_feast_desc', objectiveType:'reach', objectiveTarget:'hanzhong', objectiveCount:1, rewards:[{type:'item',id:'gold',count:50}] });
    // Ch5 暗度陈仓
    this.quests.register({ id:'chencang', title:'quest_chencang_title', desc:'quest_chencang_desc', objectiveType:'reach', objectiveTarget:'chencang', objectiveCount:1, rewards:[{type:'item',id:'gold',count:40}] });
    // Ch6 攻占荥阳
    this.quests.register({ id:'take_xingyang', title:'quest_xingyang_title', desc:'quest_xingyang_desc', objectiveType:'kill', objectiveTarget:'cc', objectiveCount:1, rewards:[{type:'item',id:'gold',count:60}] });
    // Ch7 垓下决战
    this.quests.register({ id:'gaixia_battle', title:'quest_gaixia_title', desc:'quest_gaixia_desc', objectiveType:'reach', objectiveTarget:'wujiang', objectiveCount:1, rewards:[{type:'item',id:'gold',count:80}] });
    // Ch8 登基称帝
    this.quests.register({ id:'coronation', title:'quest_coronation_title', desc:'quest_coronation_desc', objectiveType:'reach', objectiveTarget:'changan', objectiveCount:1, rewards:[{type:'item',id:'gold',count:100}] });
  }

  _sMap(id) {
    var def = MAPS[id]; if (!def) return;
    this.mapId = id; this._md = def;
    var data = def.build();
    this.tilemap = new Tilemap({ data:data, tileset:this._a.tileset, tileWidth:16, tileHeight:16, tilesetCols:8, solidTiles:def.solidTiles });

    // 到达目的地 → 自动完成任务+发奖励（不需要回去交）
    var reachRewards = {
      mangdang_deep: { quest:'escort', gold:50, atk:5, item:'sword', msg:'到达芒砀山深处！\n🎁 获得赤霄剑 +50金 +5攻击力' },
      xianyang_palace: { quest:'three_laws', gold:30, msg:'进入秦王宫！\n🎁 获得30金' },
      hanzhong: { quest:'escape_feast', gold:50, msg:'成功抵达汉中！\n🎁 获得50金' },
      chencang: { quest:'chencang', gold:40, msg:'暗度陈仓成功！\n🎁 获得40金' },
      wujiang: { quest:'gaixia_battle', gold:80, msg:'追至乌江！\n🎁 获得80金' },
      changan: { quest:'coronation', gold:100, msg:'抵达定陶！登基称帝！\n🎁 获得100金' },
    };
    var rw = reachRewards[id];
    if (rw) {
      this.quests.advanceBy('reach', id);
      this.quests.advanceBy('reach', rw.quest); // 兼容旧quest id
      var q = this.quests._quests.get(rw.quest);
      if (q && q.state === QUEST_STATE.ACTIVE && q.isObjectiveDone) {
        this.quests.complete(rw.quest);
        var rewards = this.quests.claimRewards(rw.quest);
        for (var ri = 0; ri < rewards.length; ri++) this.inventory.add(rewards[ri].id, rewards[ri].count);
        this.gold += rw.gold;
        if (rw.atk) this.atk += rw.atk;
        if (rw.item) this.inventory.add(rw.item);
        if (rw.msg) this.dialogue.show(rw.msg, '');
      }
    }
    // 白蛇击杀在战斗系统中自动处理

    var self = this;
    this.npcs = def.npcs.map(function(n) {
      return { id:n.id, name:n.name, x:n.x, y:n.y, dialog:n.dialog, sprite: n.spriteKey ? self._a[n.spriteKey] : null };
    });

    this.items = [];
    if (id === 'mangdang') {
      for (var i = 0; i < 5; i++) {
        var cx = 4 + (i*37)%26, cy = 4 + (i*53)%18;
        if (data[cy] && data[cy][cx] === 5) this.items.push({x:cx*16+4, y:cy*16+4, t:'herb', ok:false});
      }
    }

    this.enemies = [];
    var qinSprite = this._a.npc_qin || null;
    var chuSprite = this._a.npc_chu || null;
    var warriorSprite = this._a.npc_warrior || null;

    var addE = function(id, nm, hp, atk, x, y, pat, sp) {
      this.enemies.push({ id:id, nm:nm, hp:hp, maxHp:hp, atk:atk, x:x, y:y, pat:pat||[], pi:0, ok:false, sp:sp||null });
    }.bind(this);

    if (id === 'peixian') addE('thief1', '地痞', 10, 3, 22*16, 6*16, [{x:22*16,y:5*16},{x:25*16,y:6*16},{x:23*16,y:8*16}]);
    if (id === 'mangdang_deep') {
      addE('qin1', '秦兵', 15, 4, 8*16, 7*16, [{x:6*16,y:7*16},{x:10*16,y:7*16}], qinSprite);
      addE('qin2', '秦兵什长', 25, 7, 22*16, 10*16, [{x:22*16,y:8*16},{x:24*16,y:12*16}], qinSprite);
      addE('qin3', '秦兵', 15, 4, 14*16, 16*16, [{x:12*16,y:14*16},{x:16*16,y:18*16}], qinSprite);
    }
    if (id === 'xianyang') {
      addE('qg1', '秦兵', 18, 5, 10*16, 14*16, [{x:10*16,y:14*16},{x:14*16,y:14*16}], qinSprite);
      addE('qg2', '秦兵', 18, 5, 22*16, 15*16, [{x:22*16,y:15*16},{x:24*16,y:13*16}], qinSprite);
    }
    if (id === 'hongmen') addE('cg1', '楚兵', 22, 6, 18*16, 14*16, [{x:18*16,y:13*16},{x:20*16,y:15*16}], chuSprite);
    if (id === 'hongmen_tent') addE('xz', '项庄', 30, 8, 10*16, 9*16, []);
    if (id === 'chencang') {
      addE('zhe', '章邯', 40, 9, 18*16, 13*16, [{x:18*16,y:13*16},{x:20*16,y:15*16}], warriorSprite);
      addE('qc1', '秦兵', 20, 6, 22*16, 16*16, [{x:22*16,y:16*16},{x:24*16,y:14*16}], qinSprite);
    }
    if (id === 'pengcheng') {
      addE('ce1', '楚军精锐', 25, 7, 14*16, 6*16, [{x:14*16,y:6*16},{x:18*16,y:8*16}], chuSprite);
      addE('ce2', '楚军精锐', 25, 7, 22*16, 16*16, [{x:22*16,y:16*16},{x:20*16,y:14*16}], chuSprite);
    }
    if (id === 'xingyang') addE('cc', '楚军守将', 35, 8, 16*16, 9*16, [{x:14*16,y:9*16},{x:18*16,y:9*16}], chuSprite);
    if (id === 'gaixia') {
      addE('cg1', '楚军护卫', 30, 7, 15*16, 10*16, [{x:15*16,y:10*16},{x:17*16,y:10*16}], chuSprite);
      addE('cg2', '楚军护卫', 30, 7, 12*16, 14*16, [{x:12*16,y:14*16},{x:14*16,y:12*16}], chuSprite);
    }

    if (def.playerSpawn) { this.px = def.playerSpawn.x; this.py = def.playerSpawn.y; }
    this._pcd = 1.5;
    renderer.setCamera(this.px - CONFIG.GAME_WIDTH/2, this.py - CONFIG.GAME_HEIGHT/2);

    var intros = {
      xianyang: '📖 第三章 · 灭秦战争\n刘邦趁项羽巨鹿鏖战，西进咸阳。',
      hongmen: '📖 第四章 · 鸿门宴\n项羽率40万大军入关。',
      hanzhong: '📖 第五章 · 汉中蛰伏\n萧何月下追韩信。',
      chencang: '韩信暗度陈仓！关中全部归汉！',
      pengcheng: '📖 第六章 · 楚汉争霸\n彭城惨败→荥阳对峙→鸿沟之约。',
      gaixia: '📖 第七章 · 垓下决战\n十面埋伏，四面楚歌。',
      wujiang: '"天之亡我，我何渡为！"',
      changan: '📖 第八章 · 建立汉朝\n刘邦即皇帝位。',
      changle_palace: '📖 第九章 · 皇帝时代\n铲除异姓王，白马之盟。',
      peixian_return: '📖 第十章 · 大风歌\n还乡沛县。',
    };
    if (intros[id] && !this._visited.has(id)) {
      this._visited.add(id);
      this.dialogue.show(t('intro_'+id)||intros[id], t('map_'+id)||def.name);
    }
  }

  // ==================== UPDATE ====================
  update(dt) {
    if (this._pcd > 0) this._pcd -= dt;
    if (this.mO) { this._um(); return; }
    if (this.inCbt) { this._uc(dt); return; }
    if (this._showReward && !this.dialogue.active) {
      var r = this._showReward; this._showReward = null;
      this.dialogue.show(r, ''); return;
    }
    if (this.dialogue.active) {
      this.dialogue.update(dt);
      this.dialogue.handleInput(input);
      this._checkC();
      return;
    }
    if (input.isKeyPressed('Escape')) { this.mO = true; this._ms = 0; this._sm = null; return; }
    if (input.isKeyPressed('KeyL')) { lang(lang()==='zh'?'en':'zh'); return; }
    this._mv(dt);
    this._ue(dt);
    if (this._pcd <= 0) this._cp();
    this._cl();
    this._ce();
    renderer.follow(this.px+8, this.py+8, 0.15);
    this._ccam();
    if (input.isKeyPressed('KeyT') || input.isKeyPressed('Enter')) this._int();
  }

  _checkC() {
    if (this._pendingC && !this.dialogue.active) {
      var cb = this._pendingC; this._pendingC = null;
      cb(this.dialogue._lastChoiceIdx);
    }
  }

  // ==================== MOVE ====================
  _mv(dt) {
    var dx = 0, dy = 0;
    if (input.isKeyDown('ArrowUp') || input.isKeyDown('KeyW')) dy = -1;
    if (input.isKeyDown('ArrowDown') || input.isKeyDown('KeyS')) dy = 1;
    if (input.isKeyDown('ArrowLeft') || input.isKeyDown('KeyA')) dx = -1;
    if (input.isKeyDown('ArrowRight') || input.isKeyDown('KeyD')) dx = 1;
    if (dx && dy) { dx *= 0.707; dy *= 0.707; }
    this.mv = dx !== 0 || dy !== 0;
    if (!this.mv) { this._af = 0; return; }
    this.dir = Math.abs(dx) > Math.abs(dy) ? (dx>0?'right':'left') : (dy>0?'down':'up');
    var nx = this.px + dx * this.speed * dt;
    var ny = this.py + dy * this.speed * dt;
    var b = {x:nx+2, y:this.py+2, w:12, h:12};
    if (!this.tilemap.collidesWith(b) && !this._be(nx, this.py)) this.px = nx;
    b.x = this.px+2; b.y = ny+2;
    if (!this.tilemap.collidesWith(b) && !this._be(this.px, ny)) this.py = ny;
    this.px = Math.max(0, Math.min(this.tilemap.worldWidth-16, this.px));
    this.py = Math.max(0, Math.min(this.tilemap.worldHeight-16, this.py));
    this._at += dt; if (this._at >= 0.15) { this._at = 0; this._af = (this._af+1)%3; }
  }
  _be(x, y) { return this.enemies.some(function(e){ return !e.ok && Math.abs(x-e.x)<12 && Math.abs(y-e.y)<12; }); }
  _ccam() {
    var cx = Math.max(0, Math.min(this.tilemap.worldWidth-CONFIG.GAME_WIDTH, renderer.cameraX));
    var cy = Math.max(0, Math.min(this.tilemap.worldHeight-CONFIG.GAME_HEIGHT, renderer.cameraY));
    renderer.setCamera(cx, cy);
  }

  // ==================== AI ====================
  _ue(dt) {
    for (var i = 0; i < this.enemies.length; i++) {
      var e = this.enemies[i];
      if (e.ok || !e.pat || e.pat.length < 2) continue;
      var tgt = e.pat[e.pi];
      var dx = tgt.x - e.x, dy = tgt.y - e.y, ds = Math.hypot(dx, dy);
      if (ds < 2) { e.pi = (e.pi+1) % e.pat.length; continue; }
      e.x += (dx/ds) * 30 * dt;
      e.y += (dy/ds) * 30 * dt;
    }
  }

  // ==================== PORTALS ====================
  _cp() {
    if (!this._md || !this._md.portals) return;
    var cx = this.px + 8, cy = this.py + 8;
    for (var i = 0; i < this._md.portals.length; i++) {
      var p = this._md.portals[i];
      if (cx > p.x && cx < p.x+p.w && cy > p.y && cy < p.y+p.h) {
        if (p.targetMap) {
          this._sMap(p.targetMap);
          if (p.targetX != null) this.px = p.targetX;
          if (p.targetY != null) this.py = p.targetY;
        }
        return;
      }
    }
  }

  // ==================== COLLECT / ENEMY TOUCH ====================
  _cl() {
    for (var i = 0; i < this.items.length; i++) {
      var c = this.items[i];
      if (c.ok) continue;
      if (Math.hypot(this.px+8-c.x, this.py+8-c.y) < 14) {
        c.ok = true; this.inventory.add('herb');
        this.dialogue.show(t('gather_herb'), '');
      }
    }
  }
  _ce() {
    for (var i = 0; i < this.enemies.length; i++) {
      var e = this.enemies[i];
      if (e.ok) continue;
      if (Math.hypot(this.px+8-e.x-8, this.py+8-e.y-8) < 26) { this._sc(e); return; }
    }
  }

  // ==================== COMBAT (Visual Panel) ====================
  _genQ(e) {
    var d = e.atk || 3, a, b, ans, op;
    if (d <= 3) { a = ~~(Math.random()*18)+2; b = ~~(Math.random()*a); op = Math.random()<0.5?'+':'-'; ans = op==='+'?a+b:a-b; }
    else if (d <= 6) { a = ~~(Math.random()*11)+2; b = ~~(Math.random()*11)+2; op = '×'; ans = a*b; }
    else { a = ~~(Math.random()*18)+2; b = ~~(Math.random()*11)+2; op = '+'; ans = a+b; }
    var ch = [ans];
    while (ch.length < 3) { var f = ans + ~~((Math.random()-0.5)*10); if (f !== ans && f > 0 && ch.indexOf(f) === -1) ch.push(f); }
    ch.sort(function(){ return Math.random()-0.5; });
    return { q: a+' '+op+' '+b+' = ?', ans: ans, ch: ch.map(String) };
  }
  _sc(e) { this.inCbt = true; this.cbtE = e; this._qz = this._genQ(e); this._qzS = 0; this._qzR = null; this._qzT = 0; }

  _uc(dt) {
    if (!this.inCbt || !this.cbtE) return;
    var e = this.cbtE;
    if (!this._qzR) {
      if (input.isKeyPressed('ArrowLeft')||input.isKeyPressed('ArrowUp')) this._qzS = Math.max(0, this._qzS-1);
      if (input.isKeyPressed('ArrowRight')||input.isKeyPressed('ArrowDown')) this._qzS = Math.min(2, this._qzS+1);
      if (input.isKeyPressed('Enter')||input.isKeyPressed('Space')) {
        var ok = this._qz.ch[this._qzS] === String(this._qz.ans);
        if (ok) {
          var dm = this.atk + (Math.random()<0.1?this.atk:0);
          e.hp -= dm; this._qzD = dm; this._qzR = 'hit';
          if (e.hp <= 0) { e.ok = true; this._qzR = 'win'; this.gold += 5 + ~~(Math.random()*10);
            var killRewards = { cc:{ quest:'take_xingyang', gold:60 } };
            var kr = killRewards[e.id];
            if (kr) {
              this.quests.advanceBy('kill', e.id);
              var kq = this.quests._quests.get(kr.quest);
              if (kq && kq.state === QUEST_STATE.ACTIVE && kq.isObjectiveDone) {
                this.quests.complete(kr.quest); this.quests.claimRewards(kr.quest);
                this.gold += kr.gold; this._showReward = '攻克荥阳！🎁 +60金';
              }
            }
          }
        } else {
          var dm2 = ~~(e.atk * (0.7+Math.random()*0.6));
          this.hp -= dm2; this._qzD = dm2; this._qzR = 'miss';
          if (this.hp <= 0) { this.hp = ~~(this.maxHp/3); this._qzR = 'lose'; }
        }
        this._qzT = 1.0;
      }
      if (input.isKeyPressed('Escape')) { this.inCbt = false; this.cbtE = null; this._qz = null; }
    } else {
      this._qzT -= dt;
      if (this._qzT <= 0) {
        if (this._qzR === 'win' || this._qzR === 'lose') { this.inCbt = false; this.cbtE = null; this._qz = null; this._qzR = null; }
        else { this._qzR = null; this._qz = this._genQ(e); this._qzS = 0; }
      }
    }
  }

  _rc(ctx) {
    if (!this.inCbt || !this.cbtE) return;
    var e = this.cbtE;
    var nm = t('npc_'+e.id) || e.nm;
    var w = 300, h = 200, x = (CONFIG.GAME_WIDTH-w)/2, y = (CONFIG.GAME_HEIGHT-h)/2;
    renderer.drawUIRect(x, y, w, h, '#0d0d1a');
    ctx.strokeStyle = '#c13a3a'; ctx.lineWidth = 2;
    ctx.strokeRect(x+0.5, y+0.5, w-1, h-1);

    renderer.drawUIText('⚔ '+nm, x+12, y+16, '#ff4444', 'bold 13px monospace');
    var er = e.hp/e.maxHp;
    renderer.drawUIRect(x+100, y+12, 150, 7, '#111');
    renderer.drawUIRect(x+101, y+13, Math.floor(148*er), 5, er>0.5?'#4f4':er>0.25?'#ff0':'#f00');
    renderer.drawUIText('HP '+Math.max(0,e.hp)+'/'+e.maxHp, x+100, y+23, '#888', '8px monospace');

    var pr = this.hp/this.maxHp;
    renderer.drawUIRect(x+100, y+30, 150, 7, '#111');
    renderer.drawUIRect(x+101, y+31, Math.floor(148*pr), 5, pr>0.5?'#4f4':pr>0.25?'#ff0':'#f00');
    renderer.drawUIText('你 HP '+Math.max(0,this.hp)+'/'+this.maxHp, x+100, y+41, '#888', '8px monospace');

    if (this._qzR === 'win') {
      renderer.drawUIText('🎉 胜利！', x+w/2-30, y+90, '#ffd700', 'bold 16px monospace');
    } else if (this._qzR === 'lose') {
      renderer.drawUIText('💀 战败，HP恢复1/3', x+w/2-60, y+90, '#f44', 'bold 16px monospace');
    } else if (this._qzR) {
      var txt = this._qzR === 'hit' ? '✅ 正确! -'+this._qzD+'HP' : '❌ 错误! 答案'+this._qz.ans+' -'+this._qzD+'HP';
      renderer.drawUIText(txt, x+20, y+90, this._qzR==='hit'?'#4f4':'#f44', '12px monospace');
    } else {
      renderer.drawUIText(this._qz.q, x+w/2-30, y+68, '#fff', 'bold 16px monospace');
      for (var i = 0; i < this._qz.ch.length; i++) {
        var c = this._qz.ch[i];
        var cx = x+20+i*90, cy = y+95, cw = 82, ch = 32;
        var sel = i === this._qzS;
        renderer.drawUIRect(cx, cy, cw, ch, sel?'#3a2a0a':'#111');
        ctx.strokeStyle = sel ? '#ffd700' : '#444'; ctx.lineWidth = 1;
        ctx.strokeRect(cx+0.5, cy+0.5, cw-1, ch-1);
        ctx.font = 'bold 14px monospace';
        var tw = ctx.measureText(c).width;
        renderer.drawUIText(c, cx+cw/2-tw/2, cy+22, sel?'#ffd700':'#ccc', 'bold 14px monospace');
      }
    }
    renderer.drawUIText('← → 选  Enter 答  Esc 逃', x+50, y+h-14, '#555', '9px monospace');
  }

  // ==================== INTERACT ====================
  async _int() {
    for (var i = 0; i < this.npcs.length; i++) {
      var n = this.npcs[i];
      if (Math.hypot(this.px-n.x, this.py-n.y) < 32) { await this._tn(n); return; }
    }
  }

  async _tn(npc) {
    if (npc.id === 'xiao_he') {
      var q = this.quests._quests.get('escort');
      if (q && q.state === QUEST_STATE.AVAILABLE) {
        await this.dialogue.show(t('dlg_xiao_he_start'), t('npc_xiao_he'));
        var idx = await this._sc2([t('choice_accept'), t('choice_decline')]);
        if (idx === 0) { this.quests.accept('escort'); await this.dialogue.show(t('dlg_xiao_he_quest'), t('npc_xiao_he')); }
        return;
      }
      if (q && q.state === QUEST_STATE.ACTIVE) { await this.dialogue.show(t('dlg_xiao_he_go')||'快去芒砀山深处！到了自会有收获。', t('npc_xiao_he')); return; }
      if (q && q.state === 'claimed') { await this.dialogue.show(t('dlg_xiao_he_later')||'乱世将至，保重。', t('npc_xiao_he')); return; }
    }
    // 白蛇任务——芒砀山刑徒给（斩完自动奖励）
    if (npc.id === 'follower1') {
      var sq = this.quests._quests.get('slay_snake');
      if (sq && sq.state === QUEST_STATE.AVAILABLE) {
        await this.dialogue.show(t('dlg_snake_intro')||'前面有条大白蛇挡路！\n亭长若能斩杀此蛇，\n必能树立威望！', t('npc_prisoner'));
        var si = await this._sc2([t('choice_slay')||'好！斩蛇立威！', t('choice_around')||'绕道而行']);
        if (si === 0) { this.quests.accept('slay_snake'); await this.dialogue.show(t('dlg_snake_go')||'那白蛇就在东边的路上！斩了它！', t('npc_prisoner')); }
        return;
      }
    }

    // 通用任务对话（接了就出发，到达自动奖励）
    var questMap = { zhang_liang:'three_laws', xiang_bo:'escape_feast', hanxin:'chencang', chen_ping:'take_xingyang', hanxin2:'gaixia_battle', hanxin3:'coronation' };
    var qid2 = questMap[npc.id];
    if (qid2) {
      var q2 = this.quests._quests.get(qid2);
      if (q2 && q2.state === QUEST_STATE.AVAILABLE) {
        var qInfos = {
          three_laws: ['dlg_three_laws_go', 'choice_yes'],
          escape_feast: ['dlg_feast_go', 'choice_thanks'],
          chencang: ['dlg_chencang_go', 'choice_yes'],
          take_xingyang: ['dlg_xingyang_go', 'choice_strike'],
          gaixia_battle: ['dlg_gaixia_go', 'choice_chase'],
          coronation: ['dlg_coronation_go', 'choice_crown']
        };
        var qi = qInfos[qid2];
        await this.dialogue.show(t(qi[0]), t('npc_'+npc.id)||npc.name);
        var idx2 = await this._sc2([t(qi[1]), t('choice_wait')||'等等']);
        if (idx2 === 0) { this.quests.accept(qid2); }
        return;
      }
    }

    if (npc.id === 'white_snake') {
      await this.dialogue.show(t('dlg_snake'), t('npc_white_snake'));
      if (this.charisma >= 8) {
        var i2 = await this._sc2([t('choice_slay_snake')||'⚔ 斩杀白蛇', t('choice_spirit')||'✨ 以赤帝之名感召']);
        if (i2 === 1) { this.strategy += 1; this.charisma += 2; await this.dialogue.show(t('dlg_snake_spare')||'白蛇低首，化作白光消散。众人惊呼：赤帝之子！', ''); return; }
      }
      var i3 = await this._sc2([t('choice_fight_5')||'⚔ 攻击！(需攻击≥5)', t('choice_retreat')||'🏃 暂避']);
      if (i3 === 0) {
        if (this.atk < 5) { await this.dialogue.show(t('dlg_need_atk')||'攻击力不够！去完成押送任务获得赤霄剑。', ''); return; }
        this.quests.advanceBy('kill', 'white_snake');
        this.prestige += 3; this.gold += 100;
        this.inventory.add('blood');
        await this.dialogue.show(t('dlg_white_snake_win'), '');
      }
      return;
    }
    if (npc.id === 'ziying') { await this.dialogue.show(t('dlg_ziying')||npc.dialog, t('npc_ziying')); await this.dialogue.show(t('dlg_three_laws'), t('npc_ziying')); return; }
    if (npc.id === 'xiang_yu') { await this.dialogue.show(t('dlg_xiang_yu')||npc.dialog, t('npc_xiang_yu')); await this.dialogue.show(t('dlg_hongmen_feast'), t('npc_xiang_yu')); return; }
    if (npc.id === 'fan_zeng') { await this.dialogue.show(t('dlg_fan_zeng')||'（举玉玦示意三次，项羽不应）范增摔碎玉斗："竖子不足与谋！夺项王天下者，必沛公也！"', t('npc_fan_zeng')); return; }
    if (npc.id === 'hanxin') { await this.dialogue.show(t('dlg_hanxin')||npc.dialog, t('npc_hanxin')); await this.dialogue.show(t('dlg_chencang'), t('npc_hanxin')); return; }
    if (npc.id === 'xiang_yu2') { await this.dialogue.show(t('dlg_xiang_yu2')||npc.dialog, t('npc_xiang_yu2')); return; }
    if (npc.id === 'liu_bang_final') { await this.dialogue.show(t('dlg_liu_bang_final')||npc.dialog, t('npc_liu_bang_final')); return; }
    if (npc.id === 'liu_bang_last') { await this.dialogue.show(t('dlg_liu_bang_last')||npc.dialog, t('npc_liu_bang_last')); return; }
    if (npc.id === 'lvhou') { await this.dialogue.show(t('dlg_lvhou')||npc.dialog, t('npc_lvhou')); return; }

    var dk = {wangao:'dlg_wangao',villager1:'dlg_villager',villager2:'dlg_qin_citizen',fan_kuai:'dlg_fan_kuai',lvzhi:'dlg_lvzhi',cao_shen:'dlg_cao_shen',xiang_bo:'dlg_xiang_bo',soldier1:'dlg_chu_soldier',elder:'dlg_villager',fan_kuai2:'dlg_fan_kuai2',xiang_zhuang:'dlg_xiang_zhuang',xiao_he2:'dlg_xiao_he2',zhang_han:'dlg_zhang_han',fan_kuai3:'dlg_fan_kuai3',ji_xin:'dlg_ji_xin',peng_yue:'dlg_peng_yue',zhang_liang2:'dlg_zhang_liang2',boatman:'dlg_boatman',lou_jing:'dlg_lou_jing',zhang_liang3:'dlg_zhang_liang3',liu_bang_old:'dlg_liu_bang_old',shusun_tong:'dlg_shusun_tong'};
    var d = dk[npc.id];
    var sn = t('npc_'+npc.id) || npc.name;
    await this.dialogue.show(d ? t(d) : (npc.dialog||'…'), sn);
  }

  _sc2(choices) { this.dialogue.showChoices(choices); return new Promise(function(r){ this._pendingC = r; }.bind(this)); }

  // ==================== MENU ====================
  _um() {
    if (this._sm) { if (input.isKeyPressed('Escape')) this._sm = null; return; }
    if (input.isKeyPressed('ArrowUp')) this._ms = Math.max(0, this._ms-1);
    if (input.isKeyPressed('ArrowDown')) this._ms = Math.min(4, this._ms+1);
    if (input.isKeyPressed('Enter')||input.isKeyPressed('Space')) this._ex();
    if (input.isKeyPressed('Escape')) this.mO = false;
  }
  _ex() {
    switch (this._ms) {
      case 0: this.mO = false; break;
      case 1: this._sm = 'inv'; break;
      case 2: this._sm = 'qst'; break;
      case 3: this._sv(); this.mO = false; break;
      case 4: this.mO = false; this._gt();
    }
  }
  _sv() { saveManager.save(0, {mapId:this.mapId,px:this.px,py:this.py,hp:this.hp,maxHp:this.maxHp,atk:this.atk,prestige:this.prestige,strategy:this.strategy,charisma:this.charisma,gold:this.gold,inventory:this.inventory.serialize(),quests:this.quests.serialize(),timestamp:Date.now()}); }
  async _gt() { var m = await import('./title_scene.js'); sceneManager.switch(new m.TitleScene()); }
  _restore(d) {
    this.mapId = d.mapId||'peixian'; this._sp = {x:d.px||0, y:d.py||0};
    if (d.hp) this.hp = d.hp; if (d.atk) this.atk = d.atk;
    if (d.prestige) this.prestige = d.prestige; if (d.strategy) this.strategy = d.strategy; if (d.charisma) this.charisma = d.charisma; if (d.gold) this.gold = d.gold;
    if (d.inventory) this.inventory.deserialize(d.inventory); if (d.quests) this.quests.deserialize(d.quests);
  }

  // ==================== RENDER ====================
  render(ctx) {
    if (this.tilemap) this.tilemap.render(ctx);

    // PORTAL MARKERS
    if (this._md && this._md.portals) {
      for (var i = 0; i < this._md.portals.length; i++) {
        var p = this._md.portals[i];
        var tt = performance.now()/1000;
        var alpha = 0.4 + 0.3*Math.sin(tt*3+p.x);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#ffd700';
        for (var j = 0; j < 3; j++) {
          var ppx = p.x+p.w/2+Math.cos(tt*2+j*2)*8;
          var ppy = p.y+p.h/2+Math.sin(tt*2+j*2)*8;
          ctx.fillRect(ppx-2, ppy-2, 4, 4);
        }
        ctx.globalAlpha = 1;
        if (p.label) {
          var lbl = p.label;
          if (p.labelKey) { var tr = t(p.labelKey); if (tr !== p.labelKey) lbl = tr; }
          renderer.drawText(lbl, p.x+p.w/2-lbl.length*3, p.y-4, '#ffd700', '9px monospace');
        }
      }
    }

    // COLLECTIBLES
    for (var i = 0; i < this.items.length; i++) {
      var c = this.items[i];
      if (c.ok) continue;
      var ct = performance.now()/500;
      ctx.globalAlpha = 0.5 + 0.3*Math.sin(ct);
      renderer.drawRect(c.x-2, c.y-4, 12, 14, '#40ff40');
      ctx.globalAlpha = 1;
    }

    // ENEMIES
    for (var i = 0; i < this.enemies.length; i++) {
      var e = this.enemies[i];
      if (e.ok) continue;
      if (e.sp) renderer.drawImage(e.sp, e.x, e.y, 16, 16);
      else renderer.drawRect(e.x, e.y, 16, 16, '#cc2222');
      var er = e.hp/e.maxHp;
      renderer.drawRect(e.x-2, e.y-6, 20, 3, '#000');
      renderer.drawRect(e.x-2, e.y-6, Math.floor(20*er), 3, er>0.5?'#4f4':er>0.25?'#ff0':'#f00');
      var enm = t('npc_'+e.id) || e.nm;
      renderer.drawText(enm, e.x-4, e.y-12, '#f66', '7px monospace');
    }

    // NPCs
    for (var i = 0; i < this.npcs.length; i++) {
      var n = this.npcs[i];
      if (n.sprite) { renderer.drawImage(n.sprite, n.x, n.y, 16, 16); }
      else {
        renderer.drawRect(n.x, n.y, 16, 16, '#333');
        var nm2 = t('npc_'+n.id) || n.name;
        renderer.drawUIText(nm2.charAt(0), n.x+4, n.y+12, '#fff', 'bold 10px monospace');
      }
      var nm = t('npc_'+n.id) || n.name;
      renderer.drawText(nm, n.x-6, n.y-8, COLORS.PARCHMENT, '8px monospace');
      // Quest marker
      var qm = this._qm(n.id);
      if (qm) renderer.drawUIText(qm, n.x+4, n.y-16, qm==='!'?'#ffd700':qm==='?'?'#4f4':'#888', 'bold 14px monospace');
    }

    this._dp(ctx);
    this._dh(ctx);
    this.dialogue.render(ctx);
    if (this.mO) this._dm(ctx);
    if (this.inCbt) this._rc(ctx);
  }

  _qm(id) {
    var map = { xiao_he:'escort', follower1:'slay_snake', zhang_liang:'three_laws', xiang_bo:'escape_feast', hanxin:'chencang', chen_ping:'take_xingyang', hanxin2:'gaixia_battle', hanxin3:'coronation' };
    var qid = map[id]; if (!qid) return null;
    var q = this.quests._quests.get(qid); if (!q) return null;
    if (q.state === QUEST_STATE.AVAILABLE) return '!';
    if (q.state === QUEST_STATE.COMPLETED) return '✓';
    return null;
  }

  _dp(ctx) {
    var sd = this._a.player;
    if (!sd) { renderer.drawRect(this.px, this.py, 16, 16, COLORS.GOLD); return; }
    var dm = {down:0, left:1, right:2, up:3};
    var row = dm[this.dir] || 0;
    var col = this.mv ? this._af : 1;
    renderer.drawImageCropped(sd.image, col*sd.frameW, row*sd.frameH, sd.frameW, sd.frameH, this.px, this.py, sd.frameW, sd.frameH);
  }

  _dh(ctx) {
    renderer.drawUIRect(4, 4, 160, 46, 'rgba(0,0,0,0.6)');
    renderer.drawUIText(`HP ${this.hp}/${this.maxHp}  ⚔${this.atk}`, 10, 16, '#fff', '10px monospace');
    renderer.drawUIText(`👑${this.prestige} 🧠${this.strategy} 💬${this.charisma} 🪙${this.gold}`, 10, 28, '#aaa', '9px monospace');
    renderer.drawUIText(t('map_'+this.mapId)||'', 10, 42, COLORS.GOLD, '9px monospace');

    renderer.drawUIText(lang()==='zh'?'L=EN':'L=中文', CONFIG.GAME_WIDTH-40, CONFIG.GAME_HEIGHT-28, '#555', '9px monospace');
    renderer.drawUIRect(0, CONFIG.GAME_HEIGHT-14, CONFIG.GAME_WIDTH, 14, 'rgba(0,0,0,0.5)');
    var nearN = this.npcs.some(function(n){ return Math.hypot(this.px-n.x, this.py-n.y)<32; }.bind(this));
    var nearE = this.enemies.some(function(e){ return !e.ok && Math.hypot(this.px+8-e.x-8, this.py+8-e.y-8)<32; }.bind(this));
    var h = [t('hint_move')];
    if (nearE) h.push('⚠ 靠近敌人!'); else if (nearN) h.push(t('hint_interact'));
    if (this.items.some(function(c){ return !c.ok; })) h.push('自动收集');
    h.push(t('hint_esc'));
    renderer.drawUIText(h.join(' | '), 6, CONFIG.GAME_HEIGHT-3, COLORS.PARCHMENT, '9px monospace');
  }

  _dm(ctx) {
    renderer.drawUIRect(0, 0, CONFIG.GAME_WIDTH, CONFIG.GAME_HEIGHT, 'rgba(0,0,0,0.6)');
    if (this._sm === 'inv') { this._di(ctx); return; }
    if (this._sm === 'qst') { this._dq(ctx); return; }
    var pw = 170, ph = 230, px = (CONFIG.GAME_WIDTH-pw)/2, py = (CONFIG.GAME_HEIGHT-ph)/2;
    renderer.drawUIRect(px, py, pw, ph, '#0d0d1a');
    ctx.strokeStyle = COLORS.GOLD; ctx.lineWidth = 1; ctx.strokeRect(px+0.5, py+0.5, pw-1, ph-1);
    renderer.drawUIText(t('menu'), px+pw/2-26, py+18, COLORS.GOLD, 'bold 13px monospace');
    renderer.drawUIText('────────', px+20, py+46, '#444', '9px monospace');
    var ms = this._ms;
    ['resume','inventory','quests','save','back_title'].forEach(function(k, i){
      var iy = py+60+i*30;
      renderer.drawUIText((i===ms?'▶ ':'  ')+t(k), px+18, iy, i===ms?COLORS.GOLD:COLORS.WHITE, '12px monospace');
    });
  }

  _di(ctx) {
    var w=280,h=210,x=(CONFIG.GAME_WIDTH-w)/2,y=(CONFIG.GAME_HEIGHT-h)/2;
    renderer.drawUIRect(x,y,w,h,'#0d0d1a');ctx.strokeStyle=COLORS.GOLD;ctx.lineWidth=1;ctx.strokeRect(x+0.5,y+0.5,w-1,h-1);
    renderer.drawUIText(t('inventory')+'  (Esc)',x+10,y+14,COLORS.GOLD,'12px monospace');
    var items=this.inventory.list();
    if (!items.length) renderer.drawUIText(t('empty_bag'),x+w/2-24,y+60,'#555','12px monospace');
    else items.forEach(function(it,i){
      var iy=y+40+i*26;
      renderer.drawUIText('• '+(t('item_'+it.id)||it.name)+' x'+it.count, x+14, iy, COLORS.WHITE, '12px monospace');
    });
  }

  _dq(ctx) {
    var w=300,h=210,x=(CONFIG.GAME_WIDTH-w)/2,y=(CONFIG.GAME_HEIGHT-h)/2;
    renderer.drawUIRect(x,y,w,h,'#0d0d1a');ctx.strokeStyle=COLORS.GOLD;ctx.lineWidth=1;ctx.strokeRect(x+0.5,y+0.5,w-1,h-1);
    renderer.drawUIText(t('quests')+'  (Esc)',x+10,y+14,COLORS.GOLD,'12px monospace');
    var qs=this.quests.getAll();
    if (!qs.length) renderer.drawUIText(t('no_quests'),x+w/2-24,y+60,'#555','12px monospace');
    else qs.forEach(function(q,i){
      var iy=y+40+i*52;
      var sl={available:[t('st_available'),'#666'],active:[t('st_active'),COLORS.GOLD],completed:[t('st_completed'),'#4a4'],claimed:[t('st_claimed'),'#666']};
      var l=sl[q.state]||['?','#666'], c=l[0], color=l[1];
      renderer.drawUIText((t(q.title)||q.title)+' ['+c+']', x+12, iy, color, '12px monospace');
      renderer.drawUIText(t(q.desc)||q.desc, x+12, iy+14, '#999', '10px monospace');
      if (q.state===QUEST_STATE.ACTIVE) renderer.drawUIText('进度: '+q.progress+'/'+q.objectiveCount, x+12, iy+26, COLORS.WHITE, '10px monospace');
    });
  }
}
