/**
 * 刘邦人生 — 全10章对话数据
 * 基于 history/research/ 历史研究 + history/dialogues.md 结构
 *
 * 格式: DIALOGUES[chapterId][nodeId] = { speaker, speakerEn, lines: [...], choices?: [...] }
 */

export const DIALOGUES = {

  // ====== 第1章 平民时代 (9节点 1分支) ======
  1: {
    intro: {
      speaker: '旁白', speakerEn: 'Narrator',
      lines: [
        '秦朝末年，天下苦秦久矣。',
        '沛县丰邑，一个叫刘季的农家少年，\n正躺在田埂上望着天空发呆。',
        '他好酒及色，不爱种地，却广交豪杰，\n被乡人视作"无赖"。',
        '然而，历史的洪流即将把他推向\n一个从未想象过的舞台…',
      ],
    },
    young: {
      speaker: '刘太公', speakerEn: 'Liu Taigong',
      lines: [
        '季儿！又不好好种地！',
        '你看看你二哥，多么勤快。\n你这样下去怎么养活自己？',
      ],
    },
    young_reply: {
      speaker: '刘邦', speakerEn: 'Liu Bang',
      lines: [
        '爹，种地能有什么出息？',
        '我刘邦虽然现在穷，\n但胸有大志，岂是池中之物！',
      ],
    },
    tavern: {
      speaker: '王媪', speakerEn: 'Madam Wang',
      lines: [
        '刘季又来了？这次可不能再赊账了！',
        '不过…算了，你将来要是发达了，\n别忘了老身这碗酒。',
      ],
    },
    lv_gong: {
      speaker: '吕公', speakerEn: 'Lü Gong',
      lines: [
        '今日设宴款待沛中豪杰，贺礼不满千钱者，\n坐于堂下！',
        '——什么？你说你没带钱，却要坐堂上？',
        '有意思。我观你面相贵不可言，\n愿将小女吕雉许配于你。',
      ],
    },
    friends: {
      speaker: '萧何', speakerEn: 'Xiao He',
      lines: [
        '刘季这个人，虽然看起来吊儿郎当，',
        '但心胸开阔，待人真诚。',
        '萧何愿与君结交，日后必有所为。',
      ],
    },
  },

  // ====== 第2章 反秦起义 (7节点 1分支) ======
  2: {
    uprising: {
      speaker: '旁白', speakerEn: 'Narrator',
      lines: [
        '公元前209年，陈胜吴广在大泽乡揭竿而起，',
        '"王侯将相宁有种乎！"',
        '天下震动，各地豪杰纷纷响应。',
      ],
    },
    escort: {
      speaker: '萧何', speakerEn: 'Xiao He',
      lines: [
        '刘邦，县令派你押送一批刑徒去骊山修陵。',
        '但路上不断有人逃跑…你知道这意味着什么吗？',
        '秦法严苛，刑徒逃亡，押送者当斩。',
        '你好自为之。',
      ],
    },
    release: {
      speaker: '刘邦', speakerEn: 'Liu Bang',
      lines: [
        '反正横竖都是死，不如放了你们！',
        '你们各自逃命去吧，我也要躲进芒砀山了。',
      ],
    },
    release_result: {
      speaker: '旁白', speakerEn: 'Narrator',
      lines: [
        '刑徒们感动不已。',
        '有十几个人无家可归，自愿追随刘邦。',
        '他们在芒砀山中聚集，等待时机。',
      ],
    },
    snake: {
      speaker: '旁白', speakerEn: 'Narrator',
      lines: [
        '一日夜行，前方探路者回报：',
        '"前面有条大白蛇挡路，咱们绕道吧！"',
        '刘邦醉意朦胧，拔剑道：',
        '"壮士行路，何惧一蛇！"',
        '他挥剑将白蛇斩为两段。',
      ],
    },
    snake_legend: {
      speaker: '老妇人', speakerEn: 'Old Woman',
      lines: [
        '（路边传来哭声）',
        '我的儿子是白帝之子，化为白蛇，',
        '被赤帝之子斩杀了…',
        '从此，人们传说刘邦乃赤帝之子下凡。',
      ],
    },
    peixian_takeover: {
      speaker: '旁白', speakerEn: 'Narrator',
      lines: [
        '刘邦率众攻下沛县，被推举为沛公。',
        '从此踏上了争夺天下的征程。',
        '这一年，他四十八岁。',
      ],
    },
  },

  // ====== 第3章 灭秦战争 (13节点 2分支) ======
  3: {
    meeting_zhangliang: {
      speaker: '张良', speakerEn: 'Zhang Liang',
      lines: [
        '在下张良，韩国贵族之后，',
        '曾在博浪沙以铁锥刺杀秦始皇，可惜误中副车。',
        '见沛公气度不凡，愿将太公兵法献上。',
        '旁人听此兵法皆茫然，唯有沛公一听即悟。',
        '沛公真乃天授之人！愿随左右。',
      ],
    },
    march_west: {
      speaker: '刘邦', speakerEn: 'Liu Bang',
      lines: [
        '项羽在巨鹿拖住了秦军主力，',
        '我趁机西进，直捣关中咸阳！',
        '诸位以为如何？',
      ],
    },
    qin_surrender: {
      speaker: '子婴', speakerEn: 'Ziying',
      lines: [
        '（秦王子婴素车白马，系颈以组，',
        '封皇帝玺符节，在轵道旁向刘邦投降）',
        '秦朝…亡了。',
      ],
    },
    enter_xianyang: {
      speaker: '旁白', speakerEn: 'Narrator',
      lines: [
        '刘邦进入咸阳，见到秦宫的财富和美女，',
        '几乎迷失自我。',
        '樊哙和张良力劝：',
        '"秦正是因为这些奢侈之物而亡！\n沛公想重蹈覆辙吗？"',
        '刘邦幡然醒悟，封存府库，还军灞上。',
      ],
    },
    three_rules: {
      speaker: '刘邦', speakerEn: 'Liu Bang',
      lines: [
        '我与关中父老约法三章：',
        '杀人者死，伤人及盗抵罪！',
        '其余秦朝苛法全部废除！',
        '关中百姓大喜，唯恐刘邦不当秦王。',
      ],
    },
  },

  // ====== 第4章 鸿门宴 (21节点 4分支) ======
  4: {
    xiangyu_anger: {
      speaker: '旁白', speakerEn: 'Narrator',
      lines: [
        '刘邦派兵守住函谷关，不让诸侯入关。',
        '项羽大怒，率40万大军攻破函谷关，',
        '进驻鸿门，离灞上仅40里。',
        '项羽下令："明日犒赏士卒，击破沛公军！"',
      ],
    },
    xiangbo_warning: {
      speaker: '项伯', speakerEn: 'Xiang Bo',
      lines: [
        '（项伯连夜赶到汉营，私见张良）',
        '张良兄，快跟我走，不然玉石俱焚！',
        '项羽明天就要攻打你们了！',
      ],
    },
    feast_arrival: {
      speaker: '旁白', speakerEn: 'Narrator',
      lines: [
        '刘邦带张良、樊哙等百余人来到鸿门。',
        '项羽设宴款待。',
        '酒席之间，刀光剑影。',
      ],
    },
    sword_dance: {
      speaker: '项庄', speakerEn: 'Xiang Zhuang',
      lines: [
        '（项庄拔剑起舞）',
        '军中无以为乐，请以剑舞助兴！',
        '（剑锋直指刘邦——项庄舞剑，意在沛公！）',
      ],
    },
    fan_kuai_breaks_in: {
      speaker: '樊哙', speakerEn: 'Fan Kuai',
      lines: [
        '（樊哙持盾撞倒卫士，闯入大帐）',
        '项王！沛公先入咸阳却毫毛不敢有所近，',
        '还军灞上以待将军。',
        '如此大功未得封赏，将军却要杀功臣？',
        '这是走秦朝灭亡的老路！',
      ],
    },
    escape: {
      speaker: '刘邦', speakerEn: 'Liu Bang',
      lines: [
        '（小声对张良说）',
        '我去上个厕所…',
        '（趁机从小路逃回灞上，仅带二十骑）',
      ],
    },
    zhangliang_gifts: {
      speaker: '张良', speakerEn: 'Zhang Liang',
      lines: [
        '（代刘邦向项羽献白璧一双，',
        '向范增献玉斗一对）',
        '沛公不胜酒力，已先行告退。',
      ],
    },
    fanzeng_rage: {
      speaker: '范增', speakerEn: 'Fan Zeng',
      lines: [
        '（怒摔玉斗，拔剑砍碎）',
        '唉！竖子不足与谋！',
        '夺项王天下者，必沛公也！',
        '我们这些人，迟早要当刘邦的俘虏！',
      ],
    },
  },

  // ====== 第5章 汉中蛰伏 (14节点 2分支) ======
  5: {
    exiled: {
      speaker: '萧何', speakerEn: 'Xiao He',
      lines: [
        '项羽封王：刘邦为汉王，辖巴蜀汉中。',
        '刘邦大怒，要出兵攻打项羽。',
        '臣力劝：汉中虽偏，却可暂避锋芒。',
        '"汉中又称天汉，称呼很美。"',
        '"大王能屈于一人之下，方能伸于万乘之上！"',
      ],
    },
    burn_roads: {
      speaker: '张良', speakerEn: 'Zhang Liang',
      lines: [
        '（张良送到褒中，临别献策）',
        '"大王何不烧绝所过栈道，',
        '示天下无还心，以固项王之意？"',
        '刘邦于是烧毁褒斜道。',
        '关中三王果然放松了警惕。',
      ],
    },
    hanxin_flees: {
      speaker: '旁白', speakerEn: 'Narrator',
      lines: [
        '到了南郑，将士思乡逃亡，',
        '连韩信也趁夜离开了。',
        '韩信先投项羽，献"兴楚亡秦方略"不为所用，',
        '转投刘邦，却只当了个管粮草的小官。',
      ],
    },
    xiaohe_chase: {
      speaker: '萧何', speakerEn: 'Xiao He',
      lines: [
        '（不及禀报，连夜骑马去追）',
        '韩信！韩信！',
        '（寒溪河河水暴涨，韩信无法渡河）',
        '韩信，你是国士无双！',
        '跟我回去，我一定让汉王拜你为大将！',
      ],
    },
    hanxin_return: {
      speaker: '刘邦', speakerEn: 'Liu Bang',
      lines: [
        '（怒）萧何！你跑什么？',
        '几十个将军逃了我都不追！',
      ],
    },
    xiaohe_reply: {
      speaker: '萧何', speakerEn: 'Xiao He',
      lines: [
        '诸将易得耳。至如信者，国士无双。',
        '大王若只想当个汉中王，用不着韩信。',
        '若想争天下——非信无所与计事者！',
      ],
    },
    baijiang: {
      speaker: '旁白', speakerEn: 'Narrator',
      lines: [
        '刘邦择吉日、斋戒沐浴、筑拜将坛。',
        '以最隆重的礼仪拜韩信为大将军。',
        '宣布时，一军皆惊。',
      ],
    },
    handui: {
      speaker: '韩信', speakerEn: 'Han Xin',
      lines: [
        '（登坛对——汉中对）',
        '项王虽勇，不过匹夫之勇，妇人之仁。',
        '三秦王逼秦人降楚，二十万秦卒被坑杀，',
        '秦地百姓恨之入骨！',
        '而我军士卒多为关东人，日夜思归。',
        '大王若举兵东出，三秦可传檄而定！',
      ],
    },
    chencang: {
      speaker: '旁白', speakerEn: 'Narrator',
      lines: [
        '公元前206年八月，出兵时机已到。',
        '樊哙、周勃率万余兵大张旗鼓修复栈道。',
        '刘邦、韩信亲率主力秘密绕行故道。',
        '——明修栈道，暗度陈仓！',
        '章邯仓促应战，大败于陈仓。',
        '塞王司马欣、翟王董翳相继投降。',
        '关中…全部归汉！',
      ],
    },
  },

  // ====== 第6章 楚汉争霸 (14节点 3分支) ======
  6: {
    pengcheng_victory: {
      speaker: '旁白', speakerEn: 'Narrator',
      lines: [
        '刘邦纠集56万诸侯联军，趁项羽北上平齐，',
        '一举攻占楚都彭城。',
        '入城后，刘邦得意忘形——',
        '"收其货宝、美人，日置酒高会"。',
      ],
    },
    pengcheng_disaster: {
      speaker: '旁白', speakerEn: 'Narrator',
      lines: [
        '项羽亲率3万精骑火速回师，',
        '拂晓突袭汉军大营！',
        '汉军被挤压在谷水、泗水之间，自相践踏，',
        '死伤十余万人。',
        '刘邦的父亲和妻子吕雉被楚军俘虏。',
        '刘邦仅率数十骑突围…',
      ],
    },
    xingyang: {
      speaker: '陈平', speakerEn: 'Chen Ping',
      lines: [
        '项羽全力攻荥阳，截断运粮甬道。',
        '臣有一计——反间！',
        '项羽生性多疑，我们可以散布谣言，',
        '说范增、钟离眜等人与汉军有私交。',
      ],
    },
    fanzeng_leaves: {
      speaker: '旁白', speakerEn: 'Narrator',
      lines: [
        '陈平的反间计成功了。',
        '项羽开始怀疑亚父范增。',
        '范增怒道："天下事大定矣，君王自为之！"',
        '辞官回乡，病死于途中。',
        '项羽失去了最重要的谋士。',
      ],
    },
    jixin_sacrifice: {
      speaker: '纪信', speakerEn: 'Ji Xin',
      lines: [
        '大王！荥阳已守不住了。',
        '臣愿假扮大王，从东门出降，',
        '大王可趁机从西门逃走！',
      ],
    },
    jixin_death: {
      speaker: '旁白', speakerEn: 'Narrator',
      lines: [
        '纪信身穿王服，坐刘邦的车驾出东门。',
        '楚军欢呼："汉王投降了！"',
        '项羽发现受骗，大怒——',
        '将纪信活活烧死。',
        '而刘邦已趁乱从西门逃走…',
      ],
    },
    chenggao: {
      speaker: '旁白', speakerEn: 'Narrator',
      lines: [
        '成皋。楚将曹咎奉命坚守。',
        '项羽临行告诫："谨守成皋，慎勿与战。"',
        '汉军连续五六日，在城外百般辱骂，',
        '持白幡画猪狗畜生，极尽侮辱之能事。',
        '曹咎忍无可忍，怒而出战。',
        '汉军等楚军半渡汜水时发动猛击——',
        '全军覆没。曹咎自杀。',
      ],
    },
    guangwu_standoff: {
      speaker: '旁白', speakerEn: 'Narrator',
      lines: [
        '广武山。楚汉两军隔涧对峙。',
        '项羽将刘太公绑在砧板上：',
        '"刘邦！今不急下，吾烹太公！"',
        '刘邦答："吾与项羽俱北面受命怀王，',
        '约为兄弟，吾翁即若翁。',
        '必欲烹而翁，幸分我一杯羹！"',
        '（要煮的话，分我一碗汤！）',
      ],
    },
    arrow: {
      speaker: '旁白', speakerEn: 'Narrator',
      lines: [
        '项羽伏弩手射中刘邦胸口！',
        '刘邦弯腰捂住脚趾，大喊：',
        '"射中吾脚趾矣！"',
        '强忍伤痛巡视军营，安定军心。',
        '张良扶着他完成阅兵…',
      ],
    },
    honggou: {
      speaker: '旁白', speakerEn: 'Narrator',
      lines: [
        '韩信已定齐地，杀龙且。',
        '灌婴深入楚地，彭越绝楚粮道。',
        '楚军腹背受敌、兵疲食绝。',
        '项羽被迫约和——以鸿沟为界，中分天下。',
        '九月，归还刘邦父母妻子，引兵东归。',
      ],
    },
  },

  // ====== 第7章 垓下决战 (10节点 1分支) ======
  7: {
    break_treaty: {
      speaker: '张良', speakerEn: 'Zhang Liang',
      lines: [
        '大王！此时不追，更待何时！',
        '楚军粮尽兵疲，天亡项羽之时也！',
      ],
    },
    gaixia_siege: {
      speaker: '旁白', speakerEn: 'Narrator',
      lines: [
        '刘邦撕毁鸿沟和约，乘势追击。',
        '韩信、彭越、英布各率大军合围。',
        '项羽被围垓下，兵少食尽。',
        '夜间，四面响起楚地歌声...',
      ],
    },
    chu_song: {
      speaker: '旁白', speakerEn: 'Narrator',
      lines: [
        '——四面楚歌。',
        '楚军听到家乡的歌声，军心崩溃。',
        '项羽大惊："汉皆已得楚乎？是何楚人之多也！"',
      ],
    },
    xiangyu_song: {
      speaker: '项羽', speakerEn: 'Xiang Yu',
      lines: [
        '（悲歌慷慨，自为诗曰）',
        '力拔山兮气盖世，',
        '时不利兮骓不逝。',
        '骓不逝兮可奈何，',
        '虞兮虞兮奈若何！',
        '（歌数阕，虞姬和之。项王泣数行下，左右皆泣）',
      ],
    },
    breakout: {
      speaker: '旁白', speakerEn: 'Narrator',
      lines: [
        '项羽率八百骑趁夜突围。',
        '汉军五千骑追杀不舍。',
        '渡淮河时只剩百余骑。',
        '迷路时，田父故意指错方向——',
        '"左！" 陷入大泽之中。',
      ],
    },
    wujiang: {
      speaker: '旁白', speakerEn: 'Narrator',
      lines: [
        '乌江边。亭长驾船等候。',
        '"江东虽小，地方千里，众数十万，',
        '亦足王也！请大王急渡！"',
      ],
    },
    xiangyu_end: {
      speaker: '项羽', speakerEn: 'Xiang Yu',
      lines: [
        '（笑）',
        '天之亡我，我何渡为！',
        '且籍与江东子弟八千人渡江而西，',
        '今无一人还——纵江东父兄怜而王我，',
        '我何面目见之？',
        '（自刎于乌江）',
      ],
    },
  },

  // ====== 第8章 建立汉朝 (13节点 3分支) ======
  8: {
    coronation: {
      speaker: '旁白', speakerEn: 'Narrator',
      lines: [
        '前202年二月，氾水之阳。',
        '楚王韩信牵头的七位异姓诸侯王联名劝进。',
        '刘邦假意推辞："德薄不敢当帝位。"',
        '张良等人劝谏后，刘邦接受。',
        '国号：汉。定都洛阳（后迁长安）。',
      ],
    },
    why_han: {
      speaker: '萧何', speakerEn: 'Xiao He',
      lines: [
        '"汉"者，星汉灿烂，宽广无垠。',
        '大王初封汉王，以汉为国号，',
        '上合天意，下顺民心。',
      ],
    },
    loujing: {
      speaker: '娄敬', speakerEn: 'Lou Jing',
      lines: [
        '（一个普通戍卒求见皇帝）',
        '陛下！洛阳四面受敌，不宜为都。',
        '关中"被山带河，四塞以为固"，',
        '沃野千里，天府之国！',
        '应在咸阳旧址附近建都！',
      ],
    },
    changan: {
      speaker: '张良', speakerEn: 'Zhang Liang',
      lines: [
        '娄敬说得对。关中左崤函，右陇蜀，',
        '此所谓金城千里、天府之国也。',
        '新都取名——"长安"，长治久安。',
      ],
    },
    chaoyi: {
      speaker: '叔孙通', speakerEn: 'Shusun Tong',
      lines: [
        '陛下，臣为汉朝制定朝仪。',
        '（演练数月后，正式朝会）',
        '群臣列队，礼官指引，',
        '无人敢喧哗失礼。',
      ],
    },
    emperor_joy: {
      speaker: '刘邦', speakerEn: 'Liu Bang',
      lines: [
        '（坐在高高的龙椅上）',
        '吾乃今日知为皇帝之贵也！',
        '（我今天才知道当皇帝有多么尊贵！）',
      ],
    },
  },

  // ====== 第9章 皇帝时代 (15节点 3分支) ======
  9: {
    hanxin_demoted: {
      speaker: '旁白', speakerEn: 'Narrator',
      lines: [
        '前201年，有人告韩信谋反。',
        '陈平献"伪游云梦"之计。',
        '刘邦出巡云梦，韩信持钟离眜首级来见，',
        '被当场逮捕。',
      ],
    },
    hanxin_words: {
      speaker: '韩信', speakerEn: 'Han Xin',
      lines: [
        '（被绑后仰天长叹）',
        '狡兔死，良狗烹；',
        '高鸟尽，良弓藏；',
        '敌国破，谋臣亡。',
        '天下已定，我固当烹！',
      ],
    },
    lvzhi_kills: {
      speaker: '吕后', speakerEn: 'Empress Lü',
      lines: [
        '韩信被贬为淮阴侯，软禁于长安。',
        '五年后，陈豨反。韩信被指为内应。',
        '萧何骗韩信入宫朝贺：',
        '"虽疾，强入贺。"',
        '韩信踏入长乐宫钟室——',
        '被吕后安排的武士斩杀。',
      ],
    },
    pengyue_death: {
      speaker: '旁白', speakerEn: 'Narrator',
      lines: [
        '梁王彭越被诬谋反，刘邦贬其为庶人，',
        '流放蜀地。路遇吕后。',
        '吕后："彭越壮士也，今徙之蜀，此自遗患。"',
        '于是彭越被杀，剁成肉酱，分赐诸侯。',
      ],
    },
    yingbu_revolt: {
      speaker: '旁白', speakerEn: 'Narrator',
      lines: [
        '淮南王英布看到彭越的"肉酱"，恐惧万分。',
        '前196年，英布反。',
        '刘邦本欲派太子率军，吕后哭求，',
        '遂带病亲征。',
        '——战场上，一支流矢射中刘邦。',
      ],
    },
    white_horse: {
      speaker: '刘邦', speakerEn: 'Liu Bang',
      lines: [
        '（杀白马，与群臣歃血为盟）',
        '"非刘氏而王者，天下共击之！"',
        '"若无功上所不置而侯者，天下共诛之！"',
        '——白马之盟。',
      ],
    },
    refuse_treatment: {
      speaker: '刘邦', speakerEn: 'Liu Bang',
      lines: [
        '（箭伤日益恶化，吕后请良医诊治）',
        '吾以布衣提三尺剑取天下，',
        '此非天命乎？',
        '命乃在天，虽扁鹊何益！',
        '赐金五十斤，不让医生治疗。',
      ],
    },
    last_arrange: {
      speaker: '旁白', speakerEn: 'Narrator',
      lines: [
        '吕后问："陛下百岁后，萧相国即死，令谁代之？"',
        '刘邦答："曹参可代。"',
        '问其次："王陵可，然少戆。陈平智有余，然难以独任。"',
        '"周勃重厚少文，然安刘氏者必勃也，可令为太尉。"',
        '再问。刘邦闭目：',
        '"此以后亦非而所知也。"',
        '——汉十二年四月甲辰，崩于长乐宫。',
      ],
    },
  },

  // ====== 第10章 大风歌 (6节点 1分支) ======
  10: {
    return_home: {
      speaker: '旁白', speakerEn: 'Narrator',
      lines: [
        '平定英布之后，刘邦班师回朝，',
        '特地在沛县停留。',
        '这是他最后一次回到故乡。',
        '置酒沛宫，召故人父老子弟纵酒。',
      ],
    },
    wind_song: {
      speaker: '刘邦', speakerEn: 'Liu Bang',
      lines: [
        '（发沛中儿得百二十人，教之歌）',
        '（刘邦亲自击筑，慷慨伤怀）',
        '大风起兮云飞扬——',
        '威加海内兮归故乡——',
        '安得猛士兮守四方！',
        '（起舞，泣数行下）',
      ],
    },
    reflection: {
      speaker: '刘邦', speakerEn: 'Liu Bang',
      lines: [
        '（对沛县父老说）',
        '我虽然当了皇帝，但最怀念的，',
        '还是在这片土地上喝酒的日子。',
        '游子悲故乡。吾虽都关中，',
        '万岁后吾魂魄犹乐思沛。',
      ],
    },
    ending: {
      speaker: '旁白', speakerEn: 'Narrator',
      lines: [
        '从沛县一个农家少年，',
        '到开创四百年大汉天下的开国皇帝。',
        '刘邦的一生，是中国历史上最不可思议的逆袭。',
        '',
        '—— 刘邦人生 · 完 ——',
      ],
    },
  },
};

/**
 * 快捷查找：获取某章某节点的对话
 * @returns {{speaker:string, lines:string[], choices?:string[]}}
 */
export function getChapterDialogue(chapterId, nodeId) {
  const ch = DIALOGUES[chapterId];
  if (!ch) return null;
  return ch[nodeId] || null;
}

/**
 * 获取本章所有节点ID
 */
export function getChapterNodes(chapterId) {
  const ch = DIALOGUES[chapterId];
  return ch ? Object.keys(ch) : [];
}
