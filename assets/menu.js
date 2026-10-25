/* AJEENTY — the menu: the oven, the item list, the tray, the order form and the order tracker.
   Words (EN/AR) and the menu itself (from the A3 print menu) are at the top. Online ordering goes through AJ.order (common.js). */
(() => {
'use strict';
const $ = s => document.querySelector(s);
const WA = AJ.WA;
const JREESH = 100000;
const LBP = n => Number(n).toLocaleString('en-US');
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------- words ---------------- */
const T = {
  en:{
    skip:'Skip to the menu', h1:'The menu', title:'Menu | AJEENTY, Ras El Nabeh, Beirut',
    jreesh:'Jreesh (whole-wheat) dough for any man’oushe', jreeshHow:'Switch it on under the man’oushe in your tray.',
    addLbl:'Add', home:'Home', catsLabel:'Menu sections',
    manoushe:"Man'oushe", mashrouha:'Mashrouha', dozen:'Dozen', halfDozen:'Half dozen (6 pieces)', jreeshDough:'Jreesh dough', lbp:'LBP',
    tray:'Your tray', orderShort:'Order', clear:'Clear tray', clearConfirm:'Tap again to clear',
    copy:'Copy order', copied:'Copied', total:'Total', note:'Prices in Lebanese pounds.',
    empty:'Nothing on your tray yet. Tap Add on anything you fancy: it bakes in the oven up top and lands here.',
    close:'Close', flavor:'Flavor', jreeshTag:'Jreesh', each:'each', slip:'Order slip',
    add:(n,v,p)=>`Add ${n}${v?', '+v:''}, ${p} LBP`, grab:(n,p)=>`Add ${n}, ${p} LBP`, remove:n=>`Remove one ${n}`,
    added:(n,c,t)=>`${n} added. ${c} on your tray, ${t} LBP.`, items:c=>c===1?'1 item':`${c} items`,
    heatHint:'Tap Add on anything to start baking', heatNext:(n,x)=>`${n} more for ${x}`, heatMax:'Oven at full blast',
    waHead:"Marhaba AJEENTY! I'd like to order:", waName:'Name:', waHow:'Pickup or delivery:', waTime:'Time:', waAddr:'Delivery address:',
    navMenu:'Menu', navVisit:'Visit us', askWa:'Questions on WhatsApp', kicker:'The full menu', lede:'Tap the peel on anything you fancy. It bakes in the oven above and lands on your tray. Then order right here, for pickup or delivery.',
    footTag:'Fresh dough. Hot oven.', fVisit:'Visit', fAddr:'Haraty Street, Moazzen Building<br>Bchara al Khoury, Beirut', fHours:'Hours', fHoursP:'Monday to Saturday<br>7:00 AM – 8:00 PM<br>Sunday 7:00 AM – 7:00 PM', fOrder:'Call us', fMobile:'Mobile and WhatsApp', fLand:'Landline', gmaps:'Google Maps',
    placeOrder:'Place order', details:'Your details', confirmed:'Order confirmed', orderNo:'Order', back:'Back',
    pickup:'Pickup', delivery:'Delivery', fType:'Pickup or delivery', fName:'Your name', fPhone:'Phone number', fAddress:'Delivery address', fAddressPh:'Area, street, building, floor', fTime:'Pickup time', fNote:'Notes (optional)', fNotePh:'Extra crispy, no onions…',
    asap:'As soon as possible', whenOpen:'As soon as you open', today:'Today', tomorrow:'Tomorrow', days:['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
    send:'Send order', sending:'Sending…', sendWa:'Send on WhatsApp', errName:'Please add your name.', errPhone:'Please add a phone number we can reach you on.', errTime:'That pickup time has passed. Please pick another one.', errAddress:'Please add your delivery address.',
    errSend:'We couldn’t send your order. Check your connection and try again, or send the same order on WhatsApp.',
    previewNote:'Preview mode: orders aren’t sent anywhere from this copy of the site.', previewTrack:'Preview mode: this order wasn’t sent. The steps move on their own so you can see the tracker.',
    waModeNote:'Online ordering is almost ready. For now, sending opens WhatsApp with your order already written.', sendViaWa:'Send on WhatsApp',
    closedNote:s=>`We’re closed right now (${s}). We’ll start on your order as soon as we open.`, updated:x=>`Updated ${x} · refreshes on its own`, offline:'Can’t reach us right now. Retrying…', notFound:'We can’t find this order yet. If you just sent it, give it a minute.',
    questions:'Questions about your order?', backMenu:'Back to menu', yourOrder:'Your order', ordered:id=>`Order ${id} sent.`, waPhone:'Phone:', waNote:'Notes:', waId:'Order no.:',
    bothNote:'After you send, WhatsApp opens with your order and its number. Press send there too so we see it right away.', tkWaHint:'WhatsApp didn’t open? Send us the same order there so we see it right away.',
    errSendWa:'We couldn’t save your order online, so it opened in WhatsApp instead. Press send there and we’ll take it from there.'
  },
  ar:{
    skip:'انتقل للمنيو', h1:'المنيو', title:'المنيو | عجينتي، راس النبع، بيروت',
    jreesh:'عجينة جريش (قمحة كاملة) لأي منقوشة', jreeshHow:'فعّلها تحت المنقوشة بصينيتك.',
    addLbl:'زيد', home:'الرئيسية', catsLabel:'أقسام المنيو',
    manoushe:'منقوشة', mashrouha:'مشروحة', dozen:'دزينة', halfDozen:'نص دزينة (٦ قطع)', jreeshDough:'عجينة جريش', lbp:'ل.ل.',
    tray:'صينيتك', orderShort:'اطلب', clear:'فضّي الصينية', clearConfirm:'اكبس كمان مرة للتأكيد',
    copy:'انسخ الطلب', copied:'انتسخ', total:'المجموع', note:'الأسعار بالليرة اللبنانية.',
    empty:'صينيتك فاضية. اكبس «زيد» حد أي صنف، بينخبز بالفرن فوق وبينزل هون.',
    close:'سكّر', flavor:'النكهة', jreeshTag:'جريش', each:'الحبة', slip:'ورقة الطلب',
    add:(n,v,p)=>`زيد ${n}${v?'، '+v:''}، ${p} ل.ل.`, grab:(n,p)=>`زيد ${n}، ${p} ل.ل.`, remove:n=>`شيل واحد ${n}`,
    added:(n,c,t)=>`زدنا ${n}. عندك ${c} بالصينية، ${t} ل.ل.`,
    items:c=>c===1?'صنف واحد':c===2?'صنفين':c<=10?`${c} أصناف`:`${c} صنف`,
    heatHint:'اكبس «زيد» عأي صنف ليبلّش الخبز', heatNext:(n,x)=>`${n} كمان ليصير ${x}`, heatMax:'الفرن عالآخر',
    waHead:'مرحبا عجينتي! بدي اطلب:', waName:'الاسم:', waHow:'استلام أو دليفري:', waTime:'الوقت:', waAddr:'عنوان الدليفري:',
    navMenu:'المنيو', navVisit:'زورونا', askWa:'اسألنا عالواتساب', kicker:'المنيو كلّه', lede:'اكبس عالمطرحة حد أي صنف بيعجبك. بيخبز بالفرن فوق وبينزل عصينيتك. وبعدين اطلب من هون، استلام أو دليفري.',
    footTag:'عجينة طازة. فرن حامي.', fVisit:'العنوان', fAddr:'شارع حاراتي، بناية المؤذن<br>بشارة الخوري، بيروت', fHours:'الدوام', fHoursP:'الإثنين – السبت<br>7:00 الصبح – 8:00 المسا<br>الأحد 7:00 الصبح – 7:00 المسا', fOrder:'اتصل فينا', fMobile:'خلوي وواتساب', fLand:'أرضي', gmaps:'Google Maps',
    placeOrder:'اطلب', details:'تفاصيلك', confirmed:'تأكّد طلبك', orderNo:'طلب رقم', back:'رجوع',
    pickup:'استلام من المحل', delivery:'دليفري', fType:'استلام أو دليفري', fName:'الاسم', fPhone:'رقم التلفون', fAddress:'عنوان الدليفري', fAddressPh:'المنطقة، الشارع، البناية، الطابق', fTime:'وقت الاستلام', fNote:'ملاحظات (اختياري)', fNotePh:'مقرمشة زيادة، بلا بصل…',
    asap:'بأسرع وقت', whenOpen:'أول ما تفتحوا', today:'اليوم', tomorrow:'بكرا', days:['الأحد','الإثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'],
    send:'ابعت الطلب', sending:'عم نبعت…', sendWa:'ابعت عالواتساب', errName:'زيد اسمك.', errPhone:'زيد رقم تلفون فينا نحكيك عليه.', errTime:'هالوقت مرق. نقّي وقت تاني للاستلام.', errAddress:'زيد عنوان الدليفري.',
    errSend:'ما قدرنا نبعت طلبك. شيّك عالانترنت وجرّب مرة تانية، أو ابعت نفس الطلب عالواتساب.',
    previewNote:'وضع التجربة: هالنسخة من الموقع ما بتبعت طلبات.', previewTrack:'وضع التجربة: هالطلب ما انبعت. الخطوات عم تمشي لحالها لتشوف كيف بيشتغل التتبّع.',
    waModeNote:'الطلب أونلاين صار قريب. هلّق، لمّا تبعت بيفتح الواتساب وطلبك مكتوب جاهز.', sendViaWa:'ابعت عالواتساب',
    closedNote:s=>`نحنا مسكّرين هلّق (${s}). منبلّش بطلبك أول ما نفتح.`, updated:x=>`آخر تحديث ${x} · بيتحدّث لحالو`, offline:'ما عم نقدر نوصل هلّق. عم نرجع نجرّب…', notFound:'ما لقينا الطلب لهلّق. إذا هلّق بعتّو، استنّى دقيقة.',
    questions:'عندك سؤال عن طلبك؟', backMenu:'رجوع عالمنيو', yourOrder:'طلبك', ordered:id=>`انبعت الطلب ${id}.`, waPhone:'التلفون:', waNote:'ملاحظات:', waId:'رقم الطلب:',
    bothNote:'بعد ما تبعت، بيفتح الواتساب وطلبك ورقمه مكتوبين. اكبس ابعت هونيك كمان لنشوفه دغري.', tkWaHint:'ما فتح الواتساب؟ ابعتلنا نفس الطلب هونيك لنشوفه دغري.',
    errSendWa:'ما قدرنا نحفظ طلبك أونلاين، فانفتح عالواتساب. اكبس ابعت هونيك ونحنا منكمّل.'
  }
};
const HEAT = [
  {min:0,  en:'Fire is lit',    ar:'النار والعة'},
  {min:1,  en:'Hot',            ar:'حامي'},
  {min:3,  en:'Blazing',        ar:'مولّع'},
  {min:6,  en:'Full furn',      ar:'الفرن فل'},
  {min:10, en:'Mo3allem level', ar:'مستوى المعلّم'}
];

/* ---------------- the menu (from the A3 print menu) ---------------- */
const S = (id,en,ar,nen,nar,items) => ({id,en,ar,nen,nar,items});
const I = (id,en,ar,p,art,o={}) => ({id,en,ar,p:Array.isArray(p)?p:[p],art,...o});
const MENU = [
  S('manakish','Manakish','مناقيش','Fresh from the oven.','طازة من الفرن.',[
    I('akawi','Cheese akawi','جبنة عكاوي',[250000,320000],{k:'round',t:'akawi'}),
    I('thyme','Thyme','زعتر',[80000,110000],{k:'round',t:'zaatar'}),
    I('spinach-l','Large spinach','سبانخ كبير',[110000,null],{k:'tri',f:'spinach'}),
    I('tom-onion','Tomato & onion','بندورة وبصل',[180000,230000],{k:'round',t:'tomato'}),
    I('keshek','Keshek','كشك',[200000,250000],{k:'round',t:'keshek'}),
    I('cocktail','Cocktail','كوكتيل',[230000,280000],{k:'round',split:['zaatar','keshek','cheese']}),
    I('lahme','Lahme baajin','لحم بعجين',[280000,350000],{k:'round',t:'lahm'}),
    I('kafta','Kafta','كفتة',[400000,500000],{k:'round',t:'kafta'}),
    I('soujouk','Soujouk','سجق',[400000,450000],{k:'round',t:'soujouk'}),
    I('tom-onion-ch','Tomato onion & cheese','بندورة بصل وجبنة',[230000,280000],{k:'round',t:'tomato',ch:1}),
    I('keshek-ch','Keshek & cheese','كشك وجبنة',[250000,300000],{k:'round',t:'keshek',ch:1}),
    I('lahme-ch','Lahme baajin & cheese','لحمة مع جبنة',[330000,420000],{k:'round',t:'lahm',ch:1}),
    I('four','4 cheese','4 أجبان',[350000,500000],{k:'round',split:['cheese','cheddar','akawi','halloumi']}),
    I('kafta-ch','Kafta & cheese','كفتة مع جبنة',[450000,550000],{k:'round',t:'kafta',ch:1}),
    I('soujouk-ch','Soujouk & cheese','سجق مع جبنة',[450000,520000],{k:'round',t:'soujouk',ch:1}),
    I('doublex','Doublex (cheese & thyme)','دوبليكس (جبنة وزعتر)',[450000,550000],{k:'round',split:['cheese','zaatar']}),
    I('habash','Habash & cheese','حبش وجبنة',[450000,550000],{k:'round',t:'habash'})
  ]),
  S('moajanat','Moajanat','معجنات','By the dozen, or boxed up.','بالدزينة أو بالعلبة.',[
    I('open-thyme','Open thyme','زعتر مفتوح',200000,{k:'cluster',of:{k:'round',t:'zaatar'}},{tag:'dozen'}),
    I('spinach-dz','Spinach','سبانخ',350000,{k:'cluster',of:{k:'tri',f:'spinach'}},{tag:'dozen'}),
    I('purslane-dz','Purslane','بقلة',350000,{k:'cluster',of:{k:'tri',f:'purslane'}},{tag:'dozen'}),
    I('chard-dz','Chard','سلق',350000,{k:'cluster',of:{k:'tri',f:'chard'}},{tag:'dozen'}),
    I('fresh-thyme','Fresh thyme','زعتر أخضر',350000,{k:'cluster',of:{k:'round',t:'freshthyme'}},{tag:'dozen'}),
    I('spinach-mix','Spinach & mix','سبانخ مع خلطة',350000,{k:'cluster',of:{k:'tri',f:'spinmix'}},{hi:1}),
    I('spicy-spinach','Spicy spinach','سبانخ حر',370000,{k:'cluster',of:{k:'tri',f:'spicy'}},{tag:'dozen'}),
    I('sanbousik','Cheese sanbousik','سنبوسك جبنة',400000,{k:'cluster',of:{k:'moon'}},{tag:'dozen'}),
    I('cheese-parsley','Cheese & parsley','جبنة مع بقدونس',400000,{k:'cluster',of:{k:'moon',g:1}},{tag:'dozen'}),
    I('open-cheese','Open cheese','جبنة مفتوح',400000,{k:'cluster',of:{k:'round',t:'cheese'}},{tag:'dozen'}),
    I('open-kishik','Open kishik','كشك مفتوح',400000,{k:'cluster',of:{k:'round',t:'keshek'}},{tag:'dozen'}),
    I('spinach-labne','Spinach labne & mix','سبانخ لبنة مع خلطة',400000,{k:'cluster',of:{k:'tri',f:'labne'}},{hi:1}),
    I('pizza-dz','Pizza','بيتزا',420000,{k:'cluster',of:{k:'pizza'}},{tag:'dozen'}),
    I('jreesh-spinach','Jreesh spinach','سبانخ جريش (قمحة كاملة)',450000,{k:'cluster',of:{k:'tri',f:'spinach',d:'j'}},{tag:'dozen',jr:1}),
    I('sfiha-dz','Sfiha','صفيحة',450000,{k:'cluster',of:{k:'sq'}},{tag:'dozen'}),
    I('box-thyme','Box – thyme','Box - زعتر',500000,{k:'box',t:'zaatar'}),
    I('box-kishik','Box – kishik','Box - كشك',500000,{k:'box',t:'keshek'}),
    I('mixed','Mixed dozen pastries','معجنات دزينة مشكل',550000,{k:'mixed'})
  ]),
  S('half-dozen','Half dozen','نص دزينة','6 pieces per portion.','٦ قطع بالحصة.',[
    I('half-spinach',"Spinach","سبانخ",200000,{k:'cluster',of:{k:'tri',f:'spinach'}},{tag:'halfDozen'}),
    I('half-cheese-parsley',"Cheese & parsley","جبنة مع بقدونس",250000,{k:'cluster',of:{k:'moon',g:1}},{tag:'halfDozen'}),
    I('half-purslane',"Purslane (bakle)","بقلة",200000,{k:'cluster',of:{k:'tri',f:'purslane'}},{tag:'halfDozen'}),
    I('half-jreesh-spinach',"Jreesh spinach","سبانخ جريش (قمحة كاملة)",250000,{k:'cluster',of:{k:'tri',f:'spinach',d:'j'}},{tag:'halfDozen',jr:1}),
    I('half-pizza',"Pizza","بيتزا",250000,{k:'cluster',of:{k:'pizza'}},{tag:'halfDozen'}),
    I('half-sfiha',"Sfiha","صفيحة",250000,{k:'cluster',of:{k:'sq'}},{tag:'halfDozen'}),
    I('half-spicy-spinach',"Spicy spinach","سبانخ حر",250000,{k:'cluster',of:{k:'tri',f:'spicy'}},{tag:'halfDozen'})
  ]),
  S('trabolsiyeh','Trabolsiyeh','طرابلسية','Tripoli-style.','عالطريقة الطرابلسية.',[
    I('trab-cheese','Trabolsiyeh cheese','طرابلسية جبنة',220000,{k:'boat',f:'cheese',slit:1}),
    I('trab-meat','Trabolsiyeh meat','طرابلسية لحمة',250000,{k:'boat',f:'lahm',slit:1}),
    I('trab-pizza','Trabolsiyeh pizza','طرابلسية بيتزا',250000,{k:'boat',f:'pizza',slit:1})
  ]),
  S('shakhtoura','Shakhtoura','شختورة','Little boats on jreesh dough.','عجينة جريش.',[
    I('sh-spinach','Spinach','سبانخ',200000,{k:'boat',f:'spinach',d:'j'},{jr:1}),
    I('sh-mhammara','Mhammara','محمرة',200000,{k:'boat',f:'mhammara',d:'j'},{jr:1}),
    I('sh-purslane','Purslane','بقلة',200000,{k:'boat',f:'purslane',d:'j'},{jr:1}),
    I('sh-pizza','Pizza','بيتزا',220000,{k:'boat',f:'pizza',d:'j'},{jr:1})
  ]),
  S('pizza','Pizza','بيتزا','','',[
    I('pizza-m','Pizza M','بيتزا وسط',550000,{k:'pizza'}),
    I('pizza-l','Pizza L','بيتزا كبير',720000,{k:'pizza'})
  ]),
  S('piece','By the piece','حبة','Single pieces.','بالحبة.',[
    I('single-pastry','Single pastry','معجنات حبة',35000,{k:'tri',f:'spinach'}),
    I('piece-pizza','Pizza','بيتزا',45000,{k:'slice'}),
    I('single-sfiha','Single sfiha','صفيحة',45000,{k:'sq'}),
    I('piece-cheese-sambousik','Cheese sambousik','سنبوسك جبنة',45000,{k:'moon'}),
    I('piece-cheese-parsley','Cheese & parsley','جبنة وبقدونس',45000,{k:'moon',g:1})
  ]),
  S('addons','Add-ons','إضافات','Add extras to your order.','زيد إضافات على طلبك.',[
    I('addon-labneh',"Add labneh","إضافة لبنة",50000,{k:'round',t:'cheese'},{addon:1}),
    I('addon-special-mix',"Add special mix","إضافة خلطة خاصة",100000,{k:'round',t:'freshthyme'},{addon:1}),
    I('addon-vegetables',"Add vegetables","إضافة خضار",20000,{k:'round',t:'tomato'},{addon:1})
  ]),
  S('drinks','Drinks','مشروبات','Cold from the fridge.','باردين من البراد.',[
    I('cans','Cans','علب',75000,{k:'can'},{cold:1,flav:[['Pepsi','بيبسي','#1F4FA0'],['Pepsi diet','بيبسي دايت','#C3C9D4'],['Pepsi max','بيبسي ماكس','#1B1D21'],['Mirinda','ميرندا','#F08A1C'],['Mirinda zero','ميرندا زيرو','#F4B54B'],['7up','سفن أب','#2E8B3E'],['7up diet','سفن أب دايت','#B9D3BE']]}),
    I('mr-juicy','Mr Juicy','مستر جوسي',30000,{k:'juice'},{cold:1,flav:[['Mango','مانجا','#F5A623'],['Apple','تفاح','#9BC23C'],['Orange','برتقال','#F28C28'],['Strawberry banana','فراولة وموز','#E5566D'],['Pineapple','أناناس','#EBC93F']]}),
    I('tropicana','Tropicana','تروبيكانا',60000,{k:'bottle'},{cold:1,flav:[['Orange','برتقال','#F28C28'],['Pineapple','أناناس','#EBC93F'],['Mango','مانجا','#F5A623']]}),
    I('water','Water, small','مياه صغيرة',30000,{k:'water'},{cold:1}),
    I('evervess','Evervess sparkling water','إيفرفس مياه فوارة',60000,{k:'sparkle'},{cold:1})
  ])
];
// Real photos from the shop, shown at the top of the sections they belong to
const PHOTO = {
  manakish:{f:'m-manakish', en:'Zaatar and cheese man’oushe baking on the oven floor', ar:'مناقيش زعتر وجبنة عم تنخبز بأرض الفرن'},
  moajanat:{f:'m-moajanat', en:'A tray of sfiha going into the oven', ar:'صينية صفيحة فايتة عالفرن'},
  'half-dozen':{f:'m-half', en:'Trays of spinach fatayer', ar:'صواني فطاير سبانخ'},
  shakhtoura:{f:'m-shakhtoura', en:'Spinach and pizza shakhtoura on a tray', ar:'شختورة سبانخ وبيتزا بالصينية'},
  piece:{f:'m-piece', en:'Sfiha and sesame pastries, just baked', ar:'صفيحة ومعجنات بالسمسم طالعين هلّق'}
};
const ITEMS = {}, SEC = {}, DUP = {};
MENU.forEach(s => { SEC[s.id] = s; s.items.forEach(it => { it.sec = s.id; ITEMS[it.id] = it; DUP[it.en] = (DUP[it.en] || 0) + 1; }); });

/* ---------------- food drawing ---------------- */
const rng = seed => { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
const hash = s => { let h = 2166136261 >>> 0; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
const f1 = n => Math.round(n * 10) / 10;
const DOUGH = { w:{crust:'#D3955A', top:'#E8BE84', dark:'#AE6F3A'}, j:{crust:'#9F6837', top:'#BA8550', dark:'#7E5129'} };
const TOP = {
  zaatar:{b:'#5D6A2C', L:[['blob',8,'#7D8D3C',6,.6],['dot',48,'#2C3615',1.05],['seed',26,'#F0E3C2',1.2]]},
  freshthyme:{b:'#E4BE86', L:[['leaf',26,'#4C7D2D',3],['leaf',14,'#73A23E',2.6],['arc',6,'#F4EAD8',1.6]]},
  cheese:{b:'#F3E2B3', L:[['blob',9,'#FBF1D3',7,.95],['blob',13,'#DBA14C',3,.8],['dot',6,'#B8743A',1.4,.8]]},
  cheddar:{b:'#F0C95E', L:[['blob',8,'#F7DC8A',5,.9],['blob',8,'#D2913B',2.4,.8]]},
  akawi:{b:'#F7EED6', L:[['blob',8,'#FFFAEC',7,.95],['blob',9,'#D9A04A',2.8,.75],['dot',4,'#B8743A',1.3,.7]]},
  halloumi:{b:'#EBD9B0', L:[['blob',7,'#F6EBCF',5,.9],['dot',10,'#C4823F',1.5,.7]]},
  keshek:{b:'#C98843', L:[['blob',7,'#B26F2E',6,.6],['cube',16,'#A2301D',1.7],['arc',8,'#F2E6C9',1.4],['seed',14,'#EAD8AA',1]]},
  tomato:{b:'#E7BC85', L:[['cube',19,'#C7321F',2.3],['arc',9,'#F6ECDA',1.9],['dot',14,'#4F8A2C',.9]]},
  lahm:{b:'#9C4527', L:[['dot',46,'#6A2713',1.5],['cube',10,'#CB4B2B',1.4],['seed',6,'#EBD7A6',1.2],['dot',8,'#4C7C2A',.8]]},
  kafta:{b:'#A3623B', L:[['log',9,'#5E2A15',4.2],['dot',22,'#4C7C2A',1],['cube',8,'#C9452A',1.3]]},
  soujouk:{b:'#C4582D', L:[['blob',8,'#E08A42',5,.6],['slice',9,'#7A2213',5]]},
  habash:{b:'#F3E2B3', L:[['blob',8,'#FBF1D3',7,.95],['blob',10,'#DBA14C',2.8,.8],['fold',5,'#EBA6A0',7.5],['fold',3,'#D98A84',5.5]]},
  spinach:{b:'#3F6B2A', L:[['leaf',16,'#5E9136',2.4],['dot',6,'#EADDBE',1],['dot',6,'#9F2E1D',.9]]},
  purslane:{b:'#4D7B2E', L:[['leaf',22,'#80AE46',2.2],['cube',8,'#C8321F',1.5]]},
  chard:{b:'#2E5826', L:[['leaf',14,'#4F7F33',3.2],['dot',5,'#E9DDBF',1]]},
  spinmix:{b:'#3F6B2A', L:[['leaf',12,'#5E9136',2.4],['cube',10,'#C8321F',1.6],['arc',6,'#F2E6C9',1.4]]},
  labne:{b:'#3F6B2A', L:[['leaf',12,'#5E9136',2.4],['blob',9,'#FBF7EF',2.6,.95]]},
  spicy:{b:'#3F6B2A', L:[['leaf',12,'#5E9136',2.4],['dot',14,'#D7261B',1.2]]},
  mhammara:{b:'#C2462A', L:[['blob',10,'#8B5A2B',2.6],['dot',12,'#E87A4A',1.4],['seed',5,'#EBD7A6',1]]},
  pizza:{b:'#C93A22', L:[['blob',11,'#F6E1A2',6.5,.95],['blob',8,'#E0A54C',2.2,.8],['ring',7,'#1F1D1B',2.1],['arc',6,'#3F8A2E',2.4],['blob',5,'#DCCBA8',3]]}
};
const disc = (cx,cy,R) => ({x0:cx-R,x1:cx+R,y0:cy-R,y1:cy+R,in:(x,y)=>(x-cx)**2+(y-cy)**2<R*R});
const sector = (cx,cy,R,a0,a1) => ({...disc(cx,cy,R), in:(x,y)=>{ if ((x-cx)**2+(y-cy)**2 >= R*R) return false; let a = Math.atan2(y-cy,x-cx); while (a < a0) a += 2*Math.PI; return a < a1; }});
const lens = (cx,cy,rx,ry) => ({x0:cx-rx,x1:cx+rx,y0:cy-ry,y1:cy+ry,in:(x,y)=>{ const u=(x-cx)/rx; return Math.abs(y-cy) < ry*(1-u*u)*.9; }});
const box = (x0,y0,x1,y1) => ({x0,y0,x1,y1,in:()=>true});
const triR = (ax,ay,bx,by,cx,cy) => ({x0:Math.min(ax,bx,cx),x1:Math.max(ax,bx,cx),y0:Math.min(ay,by,cy),y1:Math.max(ay,by,cy),in:(x,y)=>{
  const d1=(x-bx)*(ay-by)-(ax-bx)*(y-by), d2=(x-cx)*(by-cy)-(bx-cx)*(y-cy), d3=(x-ax)*(cy-ay)-(cx-ax)*(y-ay);
  return !((d1<0||d2<0||d3<0) && (d1>0||d2>0||d3>0)); }});
const circleP = (cx,cy,R) => `M${cx-R} ${cy}a${R} ${R} 0 1 0 ${2*R} 0a${R} ${R} 0 1 0 ${-2*R} 0Z`;
const sectorP = (cx,cy,R,a0,a1) => `M${cx} ${cy}L${f1(cx+R*Math.cos(a0))} ${f1(cy+R*Math.sin(a0))}A${R} ${R} 0 ${a1-a0>Math.PI?1:0} 1 ${f1(cx+R*Math.cos(a1))} ${f1(cy+R*Math.sin(a1))}Z`;

function layer(r, reg, [shape,n,color,size,op], k=1) {
  n = Math.max(1, Math.round(n*k));
  let s = '', placed = 0, tries = 0;
  while (placed < n && tries < n*40) {
    tries++;
    const x = reg.x0 + r()*(reg.x1-reg.x0), y = reg.y0 + r()*(reg.y1-reg.y0);
    if (!reg.in(x,y)) continue;
    placed++;
    const z = size*(.7+r()*.6), rot = Math.round(r()*180), X = f1(x), Y = f1(y), tr = `transform="rotate(${rot} ${X} ${Y})"`;
    switch (shape) {
      case 'dot':  s += `<circle cx="${X}" cy="${Y}" r="${f1(z)}"/>`; break;
      case 'seed': s += `<ellipse cx="${X}" cy="${Y}" rx="${f1(z)}" ry="${f1(z*.5)}" ${tr}/>`; break;
      case 'cube': s += `<rect x="${f1(x-z)}" y="${f1(y-z)}" width="${f1(z*2)}" height="${f1(z*2)}" rx="${f1(z*.45)}" ${tr}/>`; break;
      case 'arc':  s += `<path d="M${f1(x-z*1.6)} ${Y}q${f1(z*1.6)} ${f1(-z*1.6)} ${f1(z*3.2)} 0" fill="none" stroke="${color}" stroke-width="${f1(z*.7)}" stroke-linecap="round" ${tr}/>`; break;
      case 'log':  s += `<rect x="${f1(x-z*1.4)}" y="${f1(y-z*.55)}" width="${f1(z*2.8)}" height="${f1(z*1.1)}" rx="${f1(z*.55)}" ${tr}/>`; break;
      case 'slice':s += `<circle cx="${X}" cy="${Y}" r="${f1(z)}"/><circle cx="${f1(x-z*.3)}" cy="${f1(y-z*.25)}" r="${f1(z*.22)}" fill="#E9B38F"/><circle cx="${f1(x+z*.35)}" cy="${f1(y+z*.2)}" r="${f1(z*.18)}" fill="#E9B38F"/>`; break;
      case 'leaf': s += `<path d="M${X} ${Y}q${f1(z)} ${f1(-z)} ${f1(z*2)} 0q${f1(-z)} ${f1(z)} ${f1(-z*2)} 0z" ${tr}/>`; break;
      case 'blob': s += `<ellipse cx="${X}" cy="${Y}" rx="${f1(z)}" ry="${f1(z*.75)}" ${tr}/>`; break;
      case 'ring': s += `<circle cx="${X}" cy="${Y}" r="${f1(z)}" fill="none" stroke="${color}" stroke-width="${f1(z*.6)}"/>`; break;
      case 'fold': s += `<path d="M${f1(x-z)} ${Y}q${f1(z*.5)} ${f1(-z*.9)} ${f1(z)} 0t${f1(z)} 0q${f1(-z*.2)} ${f1(z*1.1)} ${f1(-z)} ${f1(z*.5)}q${f1(-z*.8)} ${f1(z*.3)} ${f1(-z)} ${f1(-z*.5)}z" ${tr}/>`; break;
    }
  }
  return `<g fill="${color}"${op ? ` opacity="${op}"` : ''}>${s}</g>`;
}
const topping = (name, r, reg, path, k=1) => { const t = TOP[name]; return `<path d="${path}" fill="${t.b}"/>` + t.L.map(l => layer(r, reg, l, k)).join(''); };
const bran = (r, reg, D) => layer(r, reg, ['dot',22,D.dark,.7,.8]);

function artRound(sp, r) {
  const D = DOUGH[sp.d||'w'], R0 = 37;
  let s = `<circle cx="50" cy="50" r="46" fill="${D.crust}"/><circle cx="50" cy="50" r="43" fill="${D.top}"/>`;
  for (let i = 0; i < 11; i++) { const a = r()*6.283, x = f1(50+Math.cos(a)*40.5), y = f1(50+Math.sin(a)*40.5); s += `<ellipse cx="${x}" cy="${y}" rx="${f1(2+r()*2)}" ry="${f1(1.2+r())}" fill="${D.dark}" opacity=".45" transform="rotate(${Math.round(a*57.3+90)} ${x} ${y})"/>`; }
  if (sp.split) {
    const n = sp.split.length;
    sp.split.forEach((t, k) => { const a0 = -Math.PI/2 + k*2*Math.PI/n, a1 = a0 + 2*Math.PI/n; s += topping(t, r, sector(50,50,R0-1,a0,a1), sectorP(50,50,R0,a0,a1), 1/n*1.6); });
  } else s += topping(sp.t, r, disc(50,50,R0-1), circleP(50,50,R0));
  if (sp.ch) s += layer(r, disc(50,50,R0-3), ['blob',10,'#F8E8BC',7,.92]) + layer(r, disc(50,50,R0-4), ['blob',11,'#D9A04A',2.6,.8]);
  if (sp.d === 'j') s += bran(r, {x0:4,x1:96,y0:4,y1:96,in:(x,y)=>{const d=(x-50)**2+(y-50)**2; return d>38.5*38.5 && d<45*45;}}, D);
  return s + `<ellipse cx="36" cy="34" rx="15" ry="7" fill="#fff" opacity=".1" transform="rotate(-35 36 34)"/>`;
}
function artTri(sp, r) {
  const D = DOUGH[sp.d||'w'], P = 'M50 15 L85 75 L15 75 Z', F = TOP[sp.f||'spinach'];
  let s = `<path d="${P}" fill="${D.crust}" stroke="${D.crust}" stroke-width="15" stroke-linejoin="round"/><path d="${P}" fill="${D.top}" stroke="${D.top}" stroke-width="9" stroke-linejoin="round"/>`;
  s += layer(r, triR(50,20,80,72,20,72), ['blob',6,D.dark,2.6,.28]);
  if (sp.d === 'j') s += bran(r, triR(50,18,82,74,18,74), D);
  s += `<path d="M50 15 L15 75" stroke="#fff" stroke-opacity=".2" stroke-width="4" stroke-linecap="round"/>`;
  s += `<path d="M50 55 L50 41 M50 55 L62 62 M50 55 L38 62" stroke="${F.b}" stroke-width="6" stroke-linecap="round"/>`;
  s += layer(r, disc(50,55,7), ['dot',5,F.L[0][2],1.3]);
  s += `<path d="M50 55 L50 22 M50 55 L79 71.5 M50 55 L21 71.5" stroke="${D.dark}" stroke-width="2.6" stroke-linecap="round" fill="none"/>`;
  return s;
}
function artMoon(sp, r) {
  const D = DOUGH.w;
  let s = `<path d="M12 62 A38 38 0 0 1 88 62 Z" fill="${D.crust}" stroke="${D.crust}" stroke-width="6" stroke-linejoin="round"/><path d="M16 60 A34 34 0 0 1 84 60 Z" fill="${D.top}"/>`;
  s += layer(r, {x0:18,x1:82,y0:30,y1:58,in:(x,y)=>(x-50)**2+(y-62)**2<30*30}, ['blob',6,D.dark,2.6,.28]);
  for (let i = 1; i < 14; i++) { const a = Math.PI + i*Math.PI/14; s += `<path d="M${f1(50+38*Math.cos(a))} ${f1(62+38*Math.sin(a))} L${f1(50+31*Math.cos(a))} ${f1(62+31*Math.sin(a))}" stroke="${D.dark}" stroke-width="2" stroke-linecap="round"/>`; }
  if (sp.g) s += layer(r, {x0:24,x1:76,y0:36,y1:56,in:(x,y)=>(x-50)**2+(y-62)**2<24*24}, ['leaf',7,'#4C7C2A',1.8]);
  s += `<path d="M20 56 A30 30 0 0 1 44 33" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width="3" stroke-linecap="round"/>`;
  return `<g transform="translate(0 8)">${s}</g>`;
}
function artSq(sp, r) {
  const D = DOUGH.w;
  let s = `<rect x="16" y="16" width="68" height="68" rx="9" fill="${D.crust}"/><rect x="19" y="19" width="62" height="62" rx="7" fill="${D.top}"/>`;
  s += `<path d="M19 19 L32 23 L23 32 Z M81 19 L68 23 L77 32 Z M19 81 L23 68 L32 77 Z M81 81 L77 68 L68 77 Z" fill="${D.dark}" opacity=".45"/>`;
  s += topping('lahm', r, box(30,30,70,70), 'M33 28 H67 Q72 28 72 33 V67 Q72 72 67 72 H33 Q28 72 28 67 V33 Q28 28 33 28Z', .75);
  return `<g transform="rotate(-8 50 50)">${s}</g>`;
}
function artBoat(sp, r) {
  const D = DOUGH[sp.d||'w'], ry = sp.slit ? 8 : 13;
  let s = `<path d="M4 50 C24 20 76 20 96 50 C76 80 24 80 4 50 Z" fill="${D.crust}"/><path d="M9 50 C27 25 73 25 91 50 C73 75 27 75 9 50 Z" fill="${D.top}"/>`;
  if (sp.d === 'j') s += bran(r, lens(50,50,40,22), D);
  s += topping(sp.f||'cheese', r, lens(50,50,29,ry), `M20 50 C34 ${f1(50-ry*1.35)} 66 ${f1(50-ry*1.35)} 80 50 C66 ${f1(50+ry*1.35)} 34 ${f1(50+ry*1.35)} 20 50 Z`, sp.slit ? .45 : .6);
  s += `<path d="M14 45 C30 28 70 28 86 45" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width="3" stroke-linecap="round"/>`;
  return `<g transform="rotate(-22 50 50)">${s}</g>`;
}
function artPizza(sp, r) {
  let s = `<circle cx="50" cy="50" r="46" fill="#D3955A"/><circle cx="50" cy="50" r="42" fill="#E6B579"/>`;
  for (let i = 0; i < 9; i++) { const a = r()*6.283; s += `<ellipse cx="${f1(50+Math.cos(a)*44)}" cy="${f1(50+Math.sin(a)*44)}" rx="3" ry="1.6" fill="#A8693A" opacity=".45" transform="rotate(${Math.round(a*57.3+90)} ${f1(50+Math.cos(a)*44)} ${f1(50+Math.sin(a)*44)})"/>`; }
  return s + topping('pizza', r, disc(50,50,35), circleP(50,50,38));
}
function artSlice(sp, r) {
  let s = `<path d="M50 10 L86 80 Q50 94 14 80 Z" fill="#E6B579" stroke="#D3955A" stroke-width="3" stroke-linejoin="round"/>`;
  s += topping('pizza', r, triR(50,24,76,74,24,74), 'M50 18 L79 75 Q50 84 21 75 Z', .5);
  return s + `<path d="M15 81 Q50 95 85 81" fill="none" stroke="#C98448" stroke-width="9" stroke-linecap="round"/>`;
}
function artCluster(sp, seed) {
  return [[30,36,-14],[70,36,12],[50,68,0]].map(([x,y,rot],i) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(.56) translate(-50 -50)">${art(sp.of, seed+'/'+i)}</g>`).join('');
}
function artBox(sp, seed) {
  let s = `<path d="M20 8 L80 8 L88 26 L12 26 Z" fill="#DDB27A"/><path d="M50 21 C43.5 17 43 12.5 46 11.8 C47.8 11.4 49.3 12.6 50 14 C50.7 12.6 52.2 11.4 54 11.8 C57 12.5 56.5 17 50 21 Z" fill="#B8663E"/>`;
  s += `<rect x="10" y="26" width="80" height="62" rx="4" fill="#C8995F"/><rect x="15" y="31" width="70" height="52" rx="2" fill="#A97B47"/>`;
  [[27,44],[50,44],[73,44],[27,70],[50,70],[73,70]].forEach(([x,y],i) => { s += `<g transform="translate(${x} ${y}) scale(.25) translate(-50 -50)">${art({k:'round',t:sp.t}, seed+'/'+i)}</g>`; });
  return s;
}
function artMixed(sp, seed) {
  return [[{k:'tri',f:'spinach'},30,33],[{k:'moon'},70,30],[{k:'round',t:'zaatar'},31,69],[{k:'sq'},69,68]].map(([p,x,y],i) => `<g transform="translate(${x} ${y}) scale(.5) translate(-50 -50)">${art(p, seed+'/'+i)}</g>`).join('');
}
const artCan = c => `<ellipse cx="50" cy="89" rx="21" ry="4" fill="#000" opacity=".18"/><rect x="30" y="15" width="40" height="73" rx="7" fill="${c}"/><rect x="36" y="20" width="5" height="62" rx="2.5" fill="#fff" opacity=".3"/><rect x="61" y="18" width="9" height="68" rx="4.5" fill="#000" opacity=".14"/><path d="M30 44 Q50 36 70 44 L70 56 Q50 48 30 56 Z" fill="#fff" opacity=".88"/><circle cx="50" cy="48" r="4.2" fill="${c}"/><ellipse cx="50" cy="16" rx="19" ry="4.2" fill="#D6DAE0"/><ellipse cx="50" cy="16" rx="14" ry="2.8" fill="#B5BAC2"/><rect x="45.5" y="13.6" width="9" height="3" rx="1.5" fill="#8F959E"/>`;
const artJuice = c => `<ellipse cx="50" cy="90" rx="19" ry="3.6" fill="#000" opacity=".18"/><rect x="41" y="9" width="18" height="9" rx="2" fill="#F4EBDD" stroke="#D8CBB5"/><path d="M42 18 H58 L61 29 H39 Z" fill="${c}" opacity=".85"/><rect x="33" y="28" width="34" height="61" rx="10" fill="${c}"/><rect x="33" y="45" width="34" height="25" fill="#FFF8EC"/><circle cx="50" cy="57.5" r="7" fill="${c}"/><path d="M50 50.5 q5 -6 10 -3 q-5 4 -10 3z" fill="#4E8A2E"/><rect x="37" y="31" width="4.5" height="54" rx="2.2" fill="#fff" opacity=".3"/>`;
const artBottle = c => `<ellipse cx="50" cy="92" rx="17" ry="3.4" fill="#000" opacity=".18"/><rect x="43" y="5" width="14" height="8" rx="2" fill="#F4EBDD" stroke="#D8CBB5"/><path d="M44 13 H56 V22 C56 27 64 29 64 38 V88 Q64 91 61 91 H39 Q36 91 36 88 V38 C36 29 44 27 44 22 Z" fill="${c}"/><rect x="36" y="50" width="28" height="22" fill="#FFF8EC"/><circle cx="50" cy="61" r="6.5" fill="${c}"/><path d="M50 54.5 q4 -5 8 -2.5 q-4 3.5 -8 2.5z" fill="#4E8A2E"/><path d="M40.5 34 V86" stroke="#fff" stroke-opacity=".35" stroke-width="3.5" stroke-linecap="round"/>`;
const artWater = () => `<ellipse cx="50" cy="92" rx="16" ry="3.2" fill="#000" opacity=".16"/><rect x="43" y="6" width="14" height="8" rx="2" fill="#2B6CB0"/><path d="M44 14 H56 V20 C56 25 63 27 63 35 V88 Q63 91 60 91 H40 Q37 91 37 88 V35 C37 27 44 25 44 20 Z" fill="#DDF0F8" stroke="#A9CFE0" stroke-width="1.2"/><path d="M37.6 40 H62.4 V88 Q62.4 90.4 60 90.4 H40 Q37.6 90.4 37.6 88 Z" fill="#B9DFF0" opacity=".85"/><path d="M37.6 47 H62.4 M37.6 78 H62.4" stroke="#A9CFE0"/><rect x="37" y="54" width="26" height="16" fill="#2B6CB0" opacity=".9"/><path d="M41 63 q4 -4 9 0 q4 4 9 0" stroke="#fff" fill="none" stroke-width="1.6"/><path d="M41 31 V86" stroke="#fff" stroke-opacity=".7" stroke-width="3" stroke-linecap="round"/>`;
const artSparkle = () => `<ellipse cx="50" cy="92" rx="16" ry="3.2" fill="#000" opacity=".18"/><rect x="43.5" y="6" width="13" height="8" rx="2" fill="#C9CED6"/><path d="M44.5 14 H55.5 V24 C55.5 30 63 31 63 40 V88 Q63 91 60 91 H40 Q37 91 37 88 V40 C37 31 44.5 30 44.5 24 Z" fill="#3E7D4F"/><rect x="37" y="55" width="26" height="17" fill="#F4EBDD"/><path d="M41 63.5 h18" stroke="#3E7D4F" stroke-width="2.4" stroke-linecap="round"/><g fill="#fff" opacity=".55"><circle cx="45" cy="44" r="1.4"/><circle cx="52" cy="38" r="1"/><circle cx="56" cy="47" r="1.2"/><circle cx="48" cy="80" r="1.2"/><circle cx="55" cy="84" r="1"/></g><path d="M41 34 V86" stroke="#fff" stroke-opacity=".3" stroke-width="3" stroke-linecap="round"/>`;

function art(sp, seed, c) {
  const r = rng(hash(String(seed)));
  switch (sp.k) {
    case 'round': return artRound(sp, r);
    case 'tri': return artTri(sp, r);
    case 'moon': return artMoon(sp, r);
    case 'sq': return artSq(sp, r);
    case 'boat': return artBoat(sp, r);
    case 'pizza': return artPizza(sp, r);
    case 'slice': return artSlice(sp, r);
    case 'cluster': return artCluster(sp, seed);
    case 'box': return artBox(sp, seed);
    case 'mixed': return artMixed(sp, seed);
    case 'can': return artCan(c);
    case 'juice': return artJuice(c);
    case 'bottle': return artBottle(c);
    case 'water': return artWater();
    case 'sparkle': return artSparkle();
  }
  return '';
}
// Real AJEENTY products, cut out of the shop photos (retouched). Items without a matching photo keep their drawing.
const PHOTOS = {
  akawi:'akawi', 'spinach-dz':'spinach', 'half-spinach':'spinach', 'single-pastry':'spinach',
  'open-thyme':'zaatar-mini', 'box-thyme':'zaatar-mini',
  'sfiha-dz':'sfiha', 'half-sfiha':'sfiha', 'single-sfiha':'sfiha',
  'pizza-m':'pizza', 'pizza-l':'pizza', 'pizza-dz':'pizza-mini', 'half-pizza':'pizza-mini', 'piece-pizza':'pizza-mini'
};
const photoSrc = k => `../img/photos/menu/${k}.webp`;
const photoArt = (k, x = 0, y = 0, w = 100, r = 0) => `<image href="${photoSrc(k)}" x="${x}" y="${y}" width="${w}" height="${w}"${r ? ` transform="rotate(${r} ${x + w/2} ${y + w/2})"` : ''}/>`;
const PHOTO_ART = { mixed: () => photoArt('spinach', -2, 0, 64, -12) + photoArt('sfiha', 38, 6, 62, 9) + photoArt('pizza-mini', 16, 38, 62, -3) };
const hasPhoto = it => !!(PHOTOS[it.id] || PHOTO_ART[it.id]);
const ART = {};
function artFor(it, fi) {
  if (PHOTOS[it.id]) return photoArt(PHOTOS[it.id]);
  if (PHOTO_ART[it.id]) return PHOTO_ART[it.id]();
  const key = it.id + '|' + (fi ?? '');
  if (!ART[key]) ART[key] = art(it.art, it.id, it.flav ? it.flav[fi || 0][2] : null);
  return ART[key];
}

/* ---------------- state ---------------- */
// The tray lives in this browser (localStorage): it survives a reload, closing the tab and coming back later,
// and every open tab shares it. It is emptied once an order goes through, and forgotten after TRAY_DAYS untouched.
const KEY = 'ajeenty-furn-v1';
const TRAY_DAYS = 7;
const state = { lang:'en', tray:[], flav:{}, note:'', at:0, sent:null };
function load(d) {
  if (!d) { try { d = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { d = null; } }
  state.tray = []; state.note = ''; state.sent = null; state.at = 0;
  if (!d) return;
  if (d.lang === 'ar' || d.lang === 'en') state.lang = d.lang;
  if (d.flav && typeof d.flav === 'object') state.flav = d.flav;
  if (d.at && Date.now() - d.at > TRAY_DAYS * 864e5) return;   // a tray left for over a week starts fresh
  state.at = +d.at || 0;
  if (Array.isArray(d.tray)) state.tray = d.tray.filter(l => l && ITEMS[l.id] && ITEMS[l.id].p[l.v] != null && l.q > 0).map(l => ({id:l.id, v:+l.v||0, f:l.f ?? null, j:!!l.j, q:Math.min(99, l.q|0), ts:l.ts||0}));
  if (typeof d.note === 'string') state.note = d.note.slice(0, 300);
  if (d.sent && typeof d.sent.ref === 'string') state.sent = { ref: d.sent.ref, sig: String(d.sent.sig || '') };
}
function save() { state.at = Date.now(); try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
const L = () => state.lang;
const t = k => T[L()][k];
const count = () => state.tray.reduce((a,l) => a + l.q, 0);
const unit = l => ITEMS[l.id].p[l.v] + (l.j ? JREESH : 0);
const total = () => state.tray.reduce((a,l) => a + unit(l)*l.q, 0);
const variantName = (it, v, lg=L()) => it.p.length === 2 ? T[lg][v ? 'mashrouha' : 'manoushe'] : '';
function lineName(l, lg=L()) {
  const it = ITEMS[l.id];
  let s = it[lg];
  if (it.tag === 'dozen' || it.tag === 'halfDozen') s += ` (${T[lg][it.tag]})`;
  else if (DUP[it.en] > 1) s += ` · ${SEC[it.sec][lg]}`;
  const v = variantName(it, l.v, lg); if (v) s += ` (${v})`;
  if (it.flav && l.f != null) s += ` – ${it.flav[l.f][lg === 'en' ? 0 : 1]}`;
  if (l.j) s += ` · ${T[lg].jreeshTag}`;
  return s;
}
// Order text for WhatsApp and "Copy order": items and quantities only, no prices.
function orderText(lg = L(), d = null, id = '') {
  const W = T[lg], out = [W.waHead];
  if (id) out.push(`${W.waId} ${id}`);
  out.push(...state.tray.map(l => `• ${l.q}× ${lineName(l, lg)}`));
  if (d) {
    out.push('', `${W.waName} ${d.name}`, `${W.waPhone} ${d.phone}`, `${W.waHow} ${d.type === 'delivery' ? W.delivery : W.pickup}`);
    out.push(d.type === 'delivery' ? `${W.waAddr} ${d.address}` : `${W.waTime} ${d.timeLabel}`);
    if (d.note) out.push(`${W.waNote} ${d.note}`);
  }
  return out.join('\n');
}
const waLink = text => `https://wa.me/${WA}?text=${encodeURIComponent(text)}`;
const waHref = (d, id = '') => waLink(orderText(L(), d, id));

/* ---------------- render ---------------- */
const menuEl = $('#menu'), catsEl = $('#catsIn'), catsBar = $('#cats');
function card(it) {
  const lg = L(), other = lg === 'en' ? 'ar' : 'en';
  const vs = it.p.map((p, v) => [p, v]).filter(([p]) => p != null);   // only sizes this item really comes in
  const solo = vs.length === 1;
  const fi = it.flav ? (state.flav[it.id] || 0) : null;
  const tags = [];
  if (it.jr) tags.push(t('jreeshDough'));
  if (solo && it.p.length === 2) tags.push(variantName(it, vs[0][1]));   // e.g. large spinach only comes as a man'oushe
  const ctl = (v, p) => {
    const vn = variantName(it, v);
    const lab = it.cold ? T[lg].grab(it[lg], LBP(p)) : T[lg].add(it[lg], vn, LBP(p));
    return `<span class="ctl" data-ctl="${it.id}|${v}">`
      + `<button class="minus" type="button" data-act="dec" data-id="${it.id}" data-v="${v}" aria-label="${esc(T[lg].remove(it[lg] + (vn ? ' ' + vn : '')))}" hidden><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 12h11"/></svg></button>`
      + `<span class="ct num" data-ct="${it.id}|${v}" hidden>0</span>`
      + `<button class="add" type="button" data-act="add" data-id="${it.id}" data-v="${v}" aria-label="${esc(lab)}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 6.5v11M6.5 12h11"/></svg><span class="lbl">${esc(t('addLbl'))}</span></button>`
      + `</span>`;
  };
  const price = p => `<span class="pr"><span class="num">${LBP(p)}</span><small>${t('lbp')}</small></span>`;
  const rows = vs.map(([p, v]) => {
    const vn = solo ? '' : variantName(it, v);
    return `<div class="opt">${vn ? `<span class="vl">${esc(vn)}</span><span class="dots" aria-hidden="true"></span>` : ''}${price(p)}${ctl(v, p)}</div>`;
  }).join('');
  let h = `<div class="art${it.hi ? ' hi' : ''}${it.cold ? ' cold' : ''}${hasPhoto(it) ? ' photo' : ''}" data-art="${it.id}"><svg viewBox="0 0 100 100" aria-hidden="true">${artFor(it, fi)}</svg></div>`;
  h += `<div class="head"><h3 class="nm">${esc(it[lg])}</h3><p class="alt-nm" lang="${other}" dir="${other === 'ar' ? 'rtl' : 'ltr'}">${esc(it[other])}</p>${tags.length ? `<p class="tags">${tags.map(x => `<span>${esc(x)}</span>`).join('')}</p>` : ''}</div>`;
  h += `<div class="opts">${rows}</div>`;
  if (it.flav) h += `<div class="fl" role="radiogroup" aria-label="${esc(t('flavor'))}">${it.flav.map((f,i) => `<button type="button" role="radio" aria-checked="${fi === i}" data-act="flav" data-id="${it.id}" data-i="${i}" style="--c:${f[2]}"><i></i>${esc(f[lg === 'en' ? 0 : 1])}</button>`).join('')}</div>`;
  return `<article class="item${solo ? ' solo' : ''}${it.flav ? ' flav' : ''}" id="it-${it.id}">${h}</article>`;
}
function renderMenu() {
  const lg = L(), other = lg === 'en' ? 'ar' : 'en';
  catsEl.innerHTML = MENU.map(s => `<button type="button" data-sec="${s.id}">${esc(s[lg])}<small class="num">${s.items.length}</small></button>`).join('');
  menuEl.innerHTML = MENU.map(s => {
    const note = lg === 'en' ? s.nen : s.nar, ph = PHOTO[s.id];
    const jr = s.id === 'manakish'
      ? `<p class="sec-jr"><svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-wheat"/></svg><span><b>${esc(t('jreesh'))}</b> <span class="ltr num">+${LBP(JREESH)}</span> ${esc(t('lbp'))}<span class="how">${esc(t('jreeshHow'))}</span></span></p>` : '';
    const photo = ph ? `<figure class="sec-photo"><img src="../img/photos/${ph.f}-sm.jpg" srcset="../img/photos/${ph.f}-sm.jpg 600w, ../img/photos/${ph.f}.jpg 960w" sizes="(max-width:760px) 92vw, 440px" width="960" height="600" loading="lazy" alt="${esc(ph[lg])}"></figure>` : '';
    return `<section class="sec${ph ? ' has-photo' : ''}" id="sec-${s.id}" aria-labelledby="h-${s.id}">`
      + `<header class="sec-head"><div class="sec-ttl"><h2 id="h-${s.id}">${esc(s[lg])}</h2><p class="alt" lang="${other}" dir="${other === 'ar' ? 'rtl' : 'ltr'}">${esc(s[other])}</p>${note ? `<p class="sec-note">${esc(note)}</p>` : ''}${jr}</div>${photo}</header>`
      + `<div class="items">${s.items.map(card).join('')}</div></section>`;
  }).join('');
}
function renderStatic() {
  const W = T[L()];
  document.querySelectorAll('[data-t]').forEach(el => { const v = W[el.dataset.t]; if (typeof v === 'string') el.textContent = v; });
  document.querySelectorAll('[data-th]').forEach(el => { const v = W[el.dataset.th]; if (typeof v === 'string') el.innerHTML = v; });
  document.querySelectorAll('[data-ta]').forEach(el => el.dataset.ta.split(';').forEach(p => { const [a, k] = p.split(':'); if (W[k]) el.setAttribute(a, W[k]); }));
  AJ.waLinks(L());
  document.querySelectorAll('.lang button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === L())));
  $('#chitClose').setAttribute('aria-label', t('close'));
}
/* ---------------- search (English and Arabic, common spellings) ---------------- */
const searchEl = $('#menuSearch');
const SW = {
  en: { label:'Search the menu', ph:'What are you craving?', clear:'Clear search', empty:'Nothing in the oven by that name.', hint:'Try cheese, zaatar, spinach or a section name.', reset:'See the whole menu', n:c => c === 1 ? '1 match' : `${c} matches` },
  ar: { label:'فتّش بالمنيو', ph:'شو مشتهي اليوم؟', clear:'امسح البحث', empty:'ما في شي بالفرن بهالاسم.', hint:'جرّب جبنة، زعتر، سبانخ أو اسم القسم.', reset:'شوف المنيو كلّه', n:c => `${c} نتيجة` }
};
const ALIAS = { thyme:'zaatar zatar zaatr زعتر', 'open-thyme':'zaatar zatar', 'fresh-thyme':'zaatar zatar', 'box-thyme':'zaatar zatar', akawi:'akkawi akawe cheese جبنة', moajanat:'mo3ajanat pastries fatayer معجنات فطاير', lahme:'lahm lahem meat لحمة', 'lahme-ch':'lahm meat', keshek:'kishik keshk kechek', 'open-kishik':'keshek keshk', 'box-kishik':'keshek keshk', sanbousik:'sambousik sambousek', 'piece-cheese-sambousik':'sanbousik sambousek', 'spinach-dz':'fatayer sabanekh', sfiha:'sfeeha sfeha meat', 'sfiha-dz':'sfeeha sfeha meat', soujouk:'sujuk sujok sausage', drinks:'drink soda juice water' };
const norm = v => String(v).toLowerCase().normalize('NFD').replace(/[̀-ًͯ-ٰٟ]/g, '').replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/[’'`]/g, '').replace(/3/g, 'a').trim();
function filterMenu() {
  const W = SW[L()], q = norm(searchEl.value), terms = q.split(/\s+/).filter(Boolean);
  let total = 0;
  MENU.forEach(sec => {
    let n = 0;
    sec.items.forEach(it => {
      const show = !terms.length || terms.every(x => norm([it.en, it.ar, sec.en, sec.ar, ALIAS[it.id] || '', ALIAS[sec.id] || ''].join(' ')).includes(x));
      const el = document.getElementById('it-' + it.id); if (el) el.hidden = !show;
      if (show) n++;
    });
    const se = document.getElementById('sec-' + sec.id); if (se) se.hidden = !n;
    const b = catsEl.querySelector(`[data-sec="${sec.id}"]`);
    if (b) { b.disabled = !n; b.querySelector('small').textContent = n; }
    total += n;
  });
  $('#searchCount').textContent = terms.length ? W.n(total) : '';
  $('#searchClear').hidden = !terms.length;
  $('#menuEmpty').hidden = total !== 0;
  spy();
}
function searchWords() {
  const W = SW[L()];
  $('#searchLabel').textContent = W.label; searchEl.placeholder = W.ph;
  $('#searchClear').setAttribute('aria-label', W.clear);
  $('#emptyTitle').textContent = W.empty; $('#emptyHint').textContent = W.hint; $('#emptyReset').textContent = W.reset;
}
const clearSearch = () => { searchEl.value = ''; filterMenu(); searchEl.focus(); };
searchEl.addEventListener('input', filterMenu);
searchEl.addEventListener('keydown', e => { if (e.key === 'Escape' && searchEl.value) { e.preventDefault(); clearSearch(); } });
$('#searchClear').addEventListener('click', clearSearch);
$('#emptyReset').addEventListener('click', clearSearch);

function setLang(lg) {
  state.lang = lg;
  document.documentElement.lang = lg;
  document.documentElement.dir = lg === 'ar' ? 'rtl' : 'ltr';
  document.title = t('title');
  AJ.saveLang(lg);
  renderStatic(); renderMenu(); searchWords(); filterMenu(); update(); save(); AJ.paintStatus(lg);
  if (!sheet.hidden) setView(view);
  renderChip();
}
setInterval(() => AJ.paintStatus(L()), 60000);

/* ---------------- updates ---------------- */
const sceneEl = $('#scene'), traybar = $('#traybar');
function update() {
  const c = count(), tot = total(), lg = L();
  document.querySelectorAll('[data-ctl]').forEach(el => {
    const [id, v] = el.dataset.ctl.split('|');
    const n = state.tray.filter(l => l.id === id && l.v === +v).reduce((a,l) => a + l.q, 0);
    const ct = el.querySelector('.ct');
    ct.textContent = n; ct.hidden = !n; el.querySelector('.minus').hidden = !n;
    el.classList.toggle('has', n > 0);
  });
  traybar.hidden = c === 0;
  $('#trayCount').textContent = c;
  $('#trayTotal').innerHTML = `${LBP(tot)}<small>${t('lbp')}</small>`;
  $('#trayOpen').setAttribute('aria-label', `${t('tray')}: ${T[lg].items(c)}, ${LBP(tot)} ${t('lbp')}`);
  $('#placeBtn').disabled = !c;
  renderChip();
  // heat
  const h = Math.min(c, 10) / 10;
  sceneEl.style.setProperty('--heat', h);
  const lv = [...HEAT].reverse().find(x => c >= x.min), nx = HEAT.find(x => x.min > c);
  const deg = `${200 + Math.min(c,10)*25}°C`;
  $('#heatName').textContent = lv[lg];
  $('#heatTemp').textContent = c ? deg : '';
  $('#heatSub').textContent = c === 0 ? t('heatHint') : nx ? T[lg].heatNext(nx.min - c, nx[lg]) : t('heatMax');
  $('#heatFill').style.width = (h*100) + '%';
  $('#heatBar').setAttribute('aria-valuenow', Math.round(h*100));
  $('#heatBar').setAttribute('aria-label', `${lv[lg]}, ${deg}`);
  const pb = $('#pbadge');
  pb.style.display = c ? '' : 'none';
  $('#pbadgeTxt').textContent = (c > 99 ? '99+' : c) + '×';
  if (!$('#sheet').hidden) renderChit();
}
function announce(msg) { const el = $('#live'); el.textContent = ''; setTimeout(() => { el.textContent = msg; }, 30); }
function latest(id, v, f) {
  return state.tray.filter(l => l.id === id && l.v === v && (f === undefined || l.f === f)).sort((a,b) => b.ts - a.ts)[0];
}
function add(id, v, btn) {
  const it = ITEMS[id]; if (!it || it.p[v] == null) return;
  const f = it.flav ? (state.flav[id] || 0) : null;
  const l = latest(id, v, f);
  if (l) { l.q = Math.min(99, l.q + 1); l.ts = Date.now(); }
  else state.tray.push({id, v, f, j:false, q:1, ts:Date.now()});
  save(); update();
  const name = lineName(l || state.tray[state.tray.length-1]);
  announce(T[L()].added(name, T[L()].items(count()), LBP(total())));
  if (btn && !reduce) {
    btn.classList.remove('shove'); void btn.offsetWidth; btn.classList.add('shove');
    const a = btn.closest('.item')?.querySelector('.art'); if (a) { a.classList.remove('hop'); void a.offsetWidth; a.classList.add('hop'); }
  }
  play(it, f);
}
function dec(id, v) {
  const l = latest(id, v); if (!l) return;
  l.q--; if (l.q <= 0) state.tray.splice(state.tray.indexOf(l), 1);
  save(); update();
}
function setFlav(id, i) {
  state.flav[id] = i; save();
  const it = ITEMS[id], card = document.getElementById('it-' + id);
  if (!card) return;
  card.querySelector('.art svg').innerHTML = artFor(it, i);
  card.querySelectorAll('[data-act="flav"]').forEach(b => b.setAttribute('aria-checked', String(+b.dataset.i === i)));
}

/* ---------------- the furn: peel + fridge animation ---------------- */
const peel = $('#peel'), blade = $('#bladeG'), onpeel = $('#onpeel'), itemRaw = $('#itemRaw'), itemBaked = $('#itemBaked'), fridge = $('#fridge');
const REST = {x:338, y:240}, IN = {x:300, y:216};
const ease = k => k < .5 ? 4*k*k*k : 1 - Math.pow(-2*k + 2, 3) / 2;
const backOut = k => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3*Math.pow(k-1,3) + c1*Math.pow(k-1,2); };
const tween = (d, fn) => new Promise(res => { const t0 = performance.now(); const step = now => { const k = Math.min(1, (now - t0) / d); fn(k); k < 1 ? requestAnimationFrame(step) : res(); }; requestAnimationFrame(step); });
const wait = ms => new Promise(r => setTimeout(r, ms));
function setPeel(p) {
  const x = REST.x + (IN.x - REST.x)*p, y = REST.y + (IN.y - REST.y)*p;
  peel.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)})`);
  blade.setAttribute('transform', `scale(${(1 - .3*p).toFixed(3)})`);
}
const onPeel = a => `<g transform="scale(1 .42)"><svg x="-33" y="-33" width="66" height="66" viewBox="0 0 100 100" overflow="visible">${a}</svg></g>`;
function bumpTray() {
  const b = $('#trayIcon'); if (!b || reduce) return;
  b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump');
}
function fly(a, fromEl, flat, sp = 1) {
  const tgt = $('#trayIcon');
  if (reduce || !fromEl || !tgt || traybar.hidden) { bumpTray(); return; }
  const r = fromEl.getBoundingClientRect(), q = tgt.getBoundingClientRect();
  if (!r.width || !q.width) { bumpTray(); return; }
  const S = 64, el = document.createElement('div');
  el.className = 'flyer';
  el.innerHTML = `<svg viewBox="0 0 100 100" aria-hidden="true">${a}</svg>`;
  document.body.appendChild(el);
  const x0 = r.left + r.width/2 - S/2, y0 = r.top + r.height/2 - S/2, x1 = q.left + q.width/2 - S/2, y1 = q.top + q.height/2 - S/2;
  const sx = r.width / S, sy = flat ? r.height / S : sx;
  const xm = x0 + (x1 - x0)*.3, ym = y0 - 70, sm = Math.max(sx, .9)*1.15;
  const anim = el.animate([
    {transform:`translate(${x0}px,${y0}px) scale(${sx},${sy})`},
    {transform:`translate(${xm}px,${ym}px) scale(${sm}) rotate(-14deg)`, offset:.32},
    {transform:`translate(${x1}px,${y1}px) scale(.32) rotate(26deg)`, opacity:.9}
  ], {duration: 780 / Math.sqrt(sp), easing:'cubic-bezier(.45,0,.25,1)'});
  anim.onfinish = () => { el.remove(); bumpTray(); };
  anim.oncancel = () => el.remove();
}
const Q = []; let running = false;
function play(it, f) {
  const a = artFor(it, f);
  if (reduce) {
    if (!it.cold) { itemRaw.innerHTML = ''; itemBaked.innerHTML = onPeel(a); }
    return;
  }
  Q.push({it, a});
  if (Q.length > 3) Q.splice(0, Q.length - 3);
  if (!running) run();
}
async function run() {
  running = true;
  while (Q.length) {
    const job = Q.shift(), sp = 1 + Math.min(Q.length, 3)*.6;
    try { await (job.it.cold ? fridgeRun(job, sp) : ovenRun(job, sp)); } catch (e) {}
  }
  running = false;
}
async function ovenRun(job, sp) {
  itemRaw.innerHTML = onPeel(job.a); itemBaked.innerHTML = onPeel(job.a);
  itemRaw.style.opacity = 1; itemBaked.style.opacity = 0;
  sceneEl.classList.add('baking');
  await tween(220/sp, k => onpeel.setAttribute('transform', `translate(0 -3) scale(${Math.max(0, backOut(k)).toFixed(3)})`));
  await tween(430/sp, k => setPeel(ease(k)));
  sceneEl.classList.add('flare');
  await tween(560/sp, k => { itemRaw.style.opacity = 1 - k; itemBaked.style.opacity = k; });
  sceneEl.classList.remove('flare');
  await tween(430/sp, k => setPeel(1 - ease(k)));
  sceneEl.classList.remove('baking');
  itemRaw.innerHTML = '';
  fly(job.a, itemBaked.querySelector('svg'), true, sp);
  await wait(150/sp);
}
async function fridgeRun(job, sp) {
  fridge.classList.add('open');
  await wait(200/sp);
  fly(job.a, $('#fridgeIn'), false, sp);
  await wait(320/sp);
  fridge.classList.remove('open');
  await wait(140/sp);
}

/* ---------------- scene build ---------------- */
function buildScene() {
  // grey tile arch around the oven mouth, like the real oven
  let s = '';
  const cx = 300, cy = 200, ix = 74, iy = 52, ox = 86, oy = 63, n = 17, gap = .012;
  const pt = (rx, ry, a) => `${f1(cx + rx*Math.cos(a))} ${f1(cy + ry*Math.sin(a))}`;
  for (let i = 0; i < n; i++) {
    const a0 = Math.PI + i*Math.PI/n + gap, a1 = Math.PI + (i+1)*Math.PI/n - gap;
    s += `<path d="M${pt(ox,oy,a0)} A${ox} ${oy} 0 0 1 ${pt(ox,oy,a1)} L${pt(ix,iy,a1)} A${ix} ${iy} 0 0 0 ${pt(ix,iy,a0)} Z" fill="${i % 2 ? '#BDB8AC' : '#D2CDC2'}"/>`;
  }
  [200, 209.5, 219].forEach((y, i) => {
    s += `<rect x="214" y="${y+.5}" width="12" height="8.5" fill="${i%2 ? '#D2CDC2' : '#BDB8AC'}"/><rect x="374" y="${y+.5}" width="12" height="8.5" fill="${i%2 ? '#BDB8AC' : '#D2CDC2'}"/>`;
  });
  s += `<path d="M${pt(ox+1,oy+1,Math.PI)} A${ox+1} ${oy+1} 0 0 1 ${pt(ox+1,oy+1,2*Math.PI)}" fill="none" stroke="#7F786E" stroke-width="1.4"/>`;
  s += `<path d="M${pt(ix,iy,Math.PI)} A${ix} ${iy} 0 0 1 ${pt(ix,iy,2*Math.PI)}" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="1"/>`;
  $('#arch').innerHTML = s;
  // dial ticks
  let tk = '';
  for (let k = 0; k <= 8; k++) {
    const a = (-120 + k*30) * Math.PI/180, i1 = k % 2 ? 12 : 11, w = k % 2 ? .7 : 1.2;
    tk += `<line x1="${f1(200+Math.sin(a)*i1)}" y1="${f1(132-Math.cos(a)*i1)}" x2="${f1(200+Math.sin(a)*14)}" y2="${f1(132-Math.cos(a)*14)}" stroke="${k > 5 ? '#B8341E' : '#6B5537'}" stroke-width="${w}"/>`;
  }
  $('#ticks').innerHTML = tk;
  // cans in the fridge
  const cols = ['#1F4FA0','#F08A1C','#2E8B3E','#C3C9D4','#E5566D','#F5A623','#1B1D21','#9BC23C'];
  let st = '';
  [200,222,244].forEach((y, row) => {
    st += `<rect x="64" y="${y}" width="60" height="1.6" fill="#CDBFA6"/>`;
    for (let i = 0; i < 6; i++) { const h = row === 2 ? 15 : 12 + (i % 2)*2; st += `<rect x="${67 + i*9.4}" y="${y - h}" width="6.4" height="${h}" rx="1.4" fill="${cols[(i + row*3) % cols.length]}"/>`; }
  });
  $('#fridgeStock').innerHTML = st;
  // the display counter: fatayer, sfiha, zaatar and mini pizzas
  const D = '#D9A066', Dk = '#B57B45';
  const tri = (x, y) => `<path d="M${x} ${y-9} L${x+8} ${y+5} L${x-8} ${y+5} Z" fill="${D}" stroke="${Dk}" stroke-width="1.2" stroke-linejoin="round"/><path d="M${x} ${y} L${x} ${y-7} M${x} ${y} L${x+6} ${y+4} M${x} ${y} L${x-6} ${y+4}" stroke="${Dk}" stroke-width="1"/>`;
  const sq = (x, y) => `<rect x="${x-8}" y="${y-6}" width="16" height="12" rx="2.5" fill="${D}"/><rect x="${x-5}" y="${y-3.5}" width="10" height="7" rx="1.5" fill="#8B3A22"/>`;
  const rnd = (x, y, top, dot) => `<ellipse cx="${x}" cy="${y}" rx="9" ry="5" fill="${D}"/><ellipse cx="${x}" cy="${y-.5}" rx="6.6" ry="3.4" fill="${top}"/>${dot ? `<circle cx="${x}" cy="${y-.8}" r="1.6" fill="#2B2620"/>` : ''}`;
  let df = `<rect x="-220" y="190" width="226" height="5" rx="1" fill="#F4EBDD" opacity=".85"/><rect x="-220" y="226" width="226" height="5" rx="1" fill="#F4EBDD" opacity=".85"/>`;
  for (let i = 0; i < 7; i++) df += i < 4 ? tri(-204 + i*20, 184) : sq(-200 + i*20 + 6, 186);
  for (let i = 0; i < 8; i++) df += rnd(-206 + i*27, 224, i % 2 ? '#F2DFA6' : '#5D6A2C', i % 2);
  $('#displayFood').innerHTML = df;
  let cf = '';
  for (let i = 0; i < 4; i++) cf += rnd(481 + i*17, 218, '#F2DFA6', 1).replace(/rx="9" ry="5"/, 'rx="7.5" ry="4"').replace(/rx="6.6" ry="3.4"/, 'rx="5.4" ry="2.7"');
  $('#cartFood').innerHTML = cf;
  itemBaked.innerHTML = onPeel(artFor(ITEMS.thyme, null));
  setPeel(0);
}

/* ---------------- the oven shrinks once you start scrolling, so there is more room for the menu ---------------- */
let compact = false;
function setCompact(on) { if (on === compact) return; compact = on; document.documentElement.classList.toggle('compact', on); }
addEventListener('scroll', () => setCompact(scrollY > 40), { passive: true });

/* ---------------- chit ---------------- */
const sheet = $('#sheet'), linesEl = $('#lines');
function renderChit() {
  $('#jreeshNote').hidden = !state.tray.some(l => { const it = ITEMS[l.id]; return it.sec === 'manakish' && !it.jr; });
  if (!state.tray.length) linesEl.innerHTML = `<p class="empty">${esc(t('empty'))}</p>`;
  else linesEl.innerHTML = state.tray.map((l, i) => {
    const it = ITEMS[l.id], id = `jr-${l.id}-${l.v}-${l.f ?? 'x'}`;
    let jr = '';
    if (it.jr) jr = `<span class="jr fixed">${esc(t('jreeshDough'))}</span>`;
    else if (it.sec === 'manakish') jr = `<label class="jr${l.j ? ' on' : ''}" for="${id}"><input type="checkbox" id="${id}" data-jr="${i}"${l.j ? ' checked' : ''}><span>${esc(t('jreeshTag'))} +${LBP(JREESH)}</span></label>`;
    return `<div class="line"><span class="q">${l.q}×</span><div class="ln"><span class="n">${esc(lineName(l))}</span><span class="sub">${LBP(unit(l))} ${t('lbp')} ${t('each')}</span></div><b class="lt">${LBP(unit(l)*l.q)}</b><div class="ops">${jr}<div class="step"><button type="button" data-step="-1" data-i="${i}" aria-label="−">−</button><span>${l.q}</span><button type="button" data-step="1" data-i="${i}" aria-label="+">+</button></div></div></div>`;
  }).join('');
  $('#totVal').innerHTML = `${LBP(total())}<small>${t('lbp')}</small>`;
  const cb = $('#clearBtn'); cb.textContent = cb.classList.contains('armed') ? t('clearConfirm') : t('clear'); cb.disabled = !state.tray.length;
  $('#copyBtn').textContent = t('copy'); $('#copyBtn').disabled = !state.tray.length;
}
let lastFocus = null;
function openChit(v = 'tray') {
  if (sheet.hidden) lastFocus = document.activeElement;
  sheet.hidden = false; document.documentElement.classList.add('locked');
  setView(v);
}
function closeChit() { sheet.hidden = true; document.documentElement.classList.remove('locked'); $('#copyArea').hidden = true; disarm(); renderChip(); if (lastFocus && lastFocus.focus) lastFocus.focus(); }
let armT = 0;
function disarm() { clearTimeout(armT); $('#clearBtn').classList.remove('armed'); }


/* ---------------- ordering: details form → Google Sheet → live tracker ---------------- */
const chit = $('.chit'), form = $('#vForm'), CUST_KEY = 'ajeenty-customer-v1';
let view = 'tray', sending = false, pollT = 0;

function setView(v) {
  if (!['tray', 'form', 'track'].includes(v)) v = 'tray';
  if (v === 'form' && !state.tray.length) v = 'tray';
  if (v === 'track' && !AJ.order.get()) v = 'tray';
  view = v; chit.dataset.view = v;
  $('#vTray').hidden = v !== 'tray'; form.hidden = v !== 'form'; $('#vTrack').hidden = v !== 'track';
  $('#chitBack').hidden = v !== 'form';
  const lg = L();
  $('#chitTitle').textContent = t(v === 'tray' ? 'tray' : v === 'form' ? 'details' : 'confirmed');
  $('#chitEyebrow').textContent = v === 'track'
    ? `${t('slip')} · ${t((AJ.order.get() || {}).type === 'delivery' ? 'delivery' : 'pickup')}`
    : `${t('slip')} · ${new Intl.DateTimeFormat(lg === 'ar' ? 'ar-LB-u-nu-latn' : 'en-GB', {weekday:'short', day:'numeric', month:'short'}).format(new Date())}`;
  if (v === 'tray') renderChit();
  if (v === 'form') renderForm();
  if (v === 'track') renderTrack();
  requestAnimationFrame(() => {
    const first = v === 'form' ? form.querySelector('input[name="name"]') : $('#chitClose');
    if (first && !sheet.hidden) first.focus({ preventScroll: true });
  });
}

// pickup times in 15-minute steps, inside opening hours (Beirut time)
function clock(m, lg) { const h = Math.floor(m / 60), mm = String(m % 60).padStart(2, '0'); return `${h % 12 || 12}:${mm} ${lg === 'ar' ? (h < 12 ? 'الصبح' : 'المسا') : (h < 12 ? 'AM' : 'PM')}`; }
function timeSlots() {
  const lg = L(), W = T[lg], { day, mins } = AJ.now(), h = AJ.HOURS[day], out = [];
  if (h && mins >= h[0] * 60 && mins < h[1] * 60 - 15) {
    out.push({ v: 'ASAP', label: W.asap });
    for (let m = Math.ceil((mins + 20) / 15) * 15; m <= h[1] * 60 - 15; m += 15) out.push({ v: `Today ${clock(m, 'en')}`, label: `${W.today} ${clock(m, lg)}` });
  } else {
    let d = 0;
    if (!(h && mins < h[0] * 60)) { d = 1; while (d < 8 && !AJ.HOURS[(day + d) % 7]) d++; }
    const nd = (day + d) % 7, H = AJ.HOURS[nd];
    const en = d === 0 ? 'Today' : d === 1 ? 'Tomorrow' : T.en.days[nd], lbl = d === 0 ? W.today : d === 1 ? W.tomorrow : W.days[nd];
    out.push({ v: 'When you open', label: W.whenOpen });
    for (let m = H[0] * 60 + 15; m <= H[1] * 60 - 15; m += 15) out.push({ v: `${en} ${clock(m, 'en')}`, label: `${lbl} ${clock(m, lg)}` });
  }
  return out;
}
function loadCustomer() { try { return JSON.parse(localStorage.getItem(CUST_KEY) || 'null') || {}; } catch (e) { return {}; } }
function saveCustomer(d) { try { localStorage.setItem(CUST_KEY, JSON.stringify({ name: d.name, phone: d.phone, address: d.address, type: d.type })); } catch (e) {} }
function toggleType() {
  const type = form.elements.type.value;
  form.querySelectorAll('[data-for]').forEach(el => { el.hidden = el.dataset.for !== type; });
}
function renderForm() {
  const lg = L(), W = T[lg], c = count(), mode = AJ.order.mode(), st = AJ.status(lg);
  $('#recapItems').textContent = W.items(c);
  $('#recapTotal').innerHTML = `${LBP(total())}<small>${t('lbp')}</small>`;
  const mn = $('#modeNote');
  mn.hidden = mode === 'live' && !AJ.order.alsoWa();
  mn.className = 'note-box ' + (mode === 'preview' ? 'preview' : 'info');
  mn.textContent = mode === 'preview' ? W.previewNote : mode === 'live' ? W.bothNote : W.waModeNote;
  $('#closedNote').hidden = st.open;
  if (!st.open) $('#closedNote').textContent = W.closedNote(st.when);
  const cust = loadCustomer(), el = form.elements;
  ['name', 'phone', 'address'].forEach(k => { if (!el[k].value && cust[k]) el[k].value = cust[k]; });
  if (!el.note.value && state.note) el.note.value = state.note;
  if (!form.dataset.touched && (cust.type === 'delivery' || cust.type === 'pickup')) el.type.value = cust.type;
  const keep = el.time.value;
  el.time.innerHTML = timeSlots().map(o => `<option value="${esc(o.v)}">${esc(o.label)}</option>`).join('');
  if ([...el.time.options].some(o => o.value === keep)) el.time.value = keep;
  form.querySelectorAll('[data-tp]').forEach(x => x.setAttribute('placeholder', W[x.dataset.tp]));
  $('#sendTxt').textContent = mode === 'whatsapp' ? W.sendViaWa : W.send;
  toggleType();
}
function fieldError(name, msg) {
  const inp = form.elements[name], wrap = inp.closest('.fld');
  let e = wrap.querySelector('.ferr');
  if (!msg) { inp.removeAttribute('aria-invalid'); if (e) e.remove(); return true; }
  inp.setAttribute('aria-invalid', 'true');
  if (!e) { e = document.createElement('small'); e.className = 'ferr'; e.id = 'err-' + name; wrap.appendChild(e); inp.setAttribute('aria-describedby', e.id); }
  e.textContent = msg;
  return false;
}
function readForm() {
  const el = form.elements, type = el.type.value === 'delivery' ? 'delivery' : 'pickup';
  const opt = el.time.selectedOptions[0];
  return {
    type, name: el.name.value.trim(), phone: el.phone.value.trim(), address: el.address.value.trim(),
    time: type === 'pickup' && opt ? opt.value : '', timeLabel: type === 'pickup' && opt ? opt.textContent : '',
    note: el.note.value.trim(), website: el.website.value
  };
}
function validate(d) {
  const W = T[L()];
  const ok = [
    fieldError('name', d.name.length >= 2 ? '' : W.errName),
    fieldError('phone', d.phone.replace(/\D/g, '').length >= 7 ? '' : W.errPhone),
    fieldError('address', d.type !== 'delivery' || d.address.length >= 5 ? '' : W.errAddress)
  ];
  if (ok.includes(false)) { const bad = form.querySelector('[aria-invalid="true"]'); if (bad) bad.focus(); return false; }
  return true;
}
function showSendError(d, waSent) {
  $('#formErrMsg').textContent = waSent ? t('errSendWa') : t('errSend');
  $('#waFallback').href = waHref(d);
  $('#formErr').hidden = false;
  $('#formErr').scrollIntoView({ block: 'nearest' });
}
form.addEventListener('change', e => {
  if (e.target.name === 'type') { form.dataset.touched = '1'; toggleType(); fieldError('address', ''); saveDraft(); }
  if (e.target.name === 'time') fieldError('time', '');
});
form.addEventListener('input', e => { if (e.target.getAttribute('aria-invalid')) fieldError(e.target.name, ''); saveDraft(); });
// A half-filled form is kept as it's typed: details for next time, the note with this tray.
let draftT = 0;
function saveDraft() {
  clearTimeout(draftT);
  draftT = setTimeout(() => {
    if (form.hidden) return;
    const d = readForm(), cust = loadCustomer();
    saveCustomer({ name: d.name || cust.name, phone: d.phone || cust.phone, address: d.address || cust.address, type: d.type });
    if (state.note !== d.note) { state.note = d.note; save(); }
  }, 250);
}
form.addEventListener('submit', async e => {
  e.preventDefault();
  if (sending || !state.tray.length) return;
  const d = readForm();
  if (!validate(d)) return;
  // the form may have been open a while: a pickup time that has already gone by is refused, never sent
  if (d.type === 'pickup' && !timeSlots().some(o => o.v === d.time)) {
    const el = form.elements.time;
    el.innerHTML = timeSlots().map(o => `<option value="${esc(o.v)}">${esc(o.label)}</option>`).join('');
    fieldError('time', t('errTime')); el.focus(); return;
  }
  saveCustomer(d);
  $('#formErr').hidden = true;
  const mode = AJ.order.mode();
  if (mode === 'whatsapp') { window.open(waHref(d), '_blank', 'noopener'); return; }
  // Sheet + WhatsApp: open the WhatsApp tab now, while the tap still counts (phones block pop-ups opened later),
  // then point it at WhatsApp once the Sheet has given the order its number.
  let waWin = null;
  if (AJ.order.alsoWa()) {
    try {
      waWin = window.open('', '_blank');
      if (waWin) { waWin.opener = null; waWin.document.write('<title>AJEENTY</title><p style="font:16px system-ui;padding:24px">Opening WhatsApp… / عم نفتح الواتساب…</p>'); }
    } catch (e2) { waWin = null; }
  }
  sending = true; $('#sendBtn').disabled = true; $('#sendTxt').textContent = t('sending');
  const payload = {
    type: d.type, name: d.name, phone: d.phone,
    address: d.type === 'delivery' ? d.address : '', time: d.type === 'pickup' ? d.time : '',
    note: d.note, lang: L(), website: d.website,
    items: state.tray.map(l => ({ name: lineName(l, 'en'), qty: l.q }))   // English names for the kitchen, no prices
  };
  // Same order sent again (a retry after a timeout or a dropped connection) keeps the same reference,
  // so the Sheet saves it once. Any change to the tray or the details makes it a new order.
  const sig = JSON.stringify([payload.type, payload.name, payload.phone, payload.address, payload.time, payload.note, payload.items]);
  if (!state.sent || state.sent.sig !== sig) { state.sent = { ref: newRef(), sig }; save(); }
  payload.ref = state.sent.ref;
  try {
    const res = await AJ.order.send(payload);
    const wa = AJ.order.alsoWa() ? orderText(L(), d, res.id) : '';
    if (wa && waWin) { try { waWin.location.href = waLink(wa); } catch (e2) {} }
    AJ.order.set({
      id: res.id, type: d.type, at: Date.now(), checked: Date.now(), status: 'Received', preview: !!res.preview,
      total: total(), time: d.timeLabel, wa, waOpened: !!waWin, lines: state.tray.map(l => ({ q: l.q, en: lineName(l, 'en'), ar: lineName(l, 'ar') }))
    });
    state.tray = []; state.note = ''; state.sent = null; save(); update();
    form.reset(); delete form.dataset.touched;
    const u = new URL(location.href); u.searchParams.set('order', res.id); history.replaceState(null, '', u);
    setView('track'); startPolling(false);
    announce(T[L()].ordered(res.id));
  } catch (err) {
    // Sheet failed: the order still reaches you on WhatsApp if that tab is open.
    if (waWin) { try { waWin.location.href = waHref(d); } catch (e2) {} }
    showSendError(d, !!waWin);
  } finally {
    sending = false; $('#sendBtn').disabled = false; $('#sendTxt').textContent = AJ.order.mode() === 'whatsapp' ? t('sendViaWa') : t('send');
  }
});

function fmtClock(ts) { return new Intl.DateTimeFormat(L() === 'ar' ? 'ar-LB-u-nu-latn' : 'en-GB', { hour: 'numeric', minute: '2-digit', hour12: L() !== 'ar' }).format(new Date(ts)); }
function renderTrack() {
  const o = AJ.order.get(); if (!o) return;
  const lg = L(), W = T[lg], steps = AJ.order.STEPS[o.type] || AJ.order.STEPS.pickup, ST = AJ.order.ST[lg];
  const cur = Math.max(0, steps.indexOf(o.status || 'Received')), cancelled = o.status === 'Cancelled';
  $('#tkId').textContent = o.id;
  $('#tkType').textContent = (o.type === 'delivery' ? W.delivery : W.pickup) + (o.type === 'pickup' && o.time ? ` · ${o.time}` : '');
  $('#tkPreview').hidden = !o.preview;
  const showWa = !!o.wa && !AJ.order.isFinal(o.status);
  $('#tkWaBox').hidden = !showWa;
  if (showWa) $('#tkWa').href = waLink(o.wa);
  $('#tkSteps').hidden = cancelled; $('#tkCancel').hidden = !cancelled;
  $('#tkCancel').textContent = ST.Cancelled[1];
  $('#tkSteps').innerHTML = steps.map((k, i) => {
    const cls = i < cur ? 'done' : i === cur ? (AJ.order.isFinal(k) ? 'done now' : 'now') : 'next';
    return `<li class="${cls}"${i === cur ? ' aria-current="step"' : ''}><span class="dot" aria-hidden="true"></span><span><b>${esc(ST[k][0])}</b>${i === cur ? `<small>${esc(ST[k][1])}</small>` : ''}</span></li>`;
  }).join('');
  $('#tkMeta').textContent = o.offline ? W.offline : o.missing ? W.notFound : AJ.order.isFinal(o.status) ? '' : W.updated(fmtClock(o.checked || o.at));
  $('#tkItems').innerHTML = Array.isArray(o.lines) && o.lines.length
    ? `<ul>${o.lines.map(l => `<li><b>${l.q}×</b> ${esc(l[lg] || l.en)}</li>`).join('')}</ul>${o.total ? `<p class="tk-total"><span>${esc(W.total)}</span><b>${LBP(o.total)}<small>${esc(W.lbp)}</small></b></p>` : ''}`
    : '';
}
function renderChip() {
  const o = AJ.order.get(), chip = $('#orderChip');
  const show = AJ.order.chipVisible(o) && sheet.hidden;
  chip.hidden = !show;
  document.body.classList.toggle('chip-up', show && !traybar.hidden);
  if (!show) return;
  $('#chipTxt').textContent = `${t('yourOrder')} · ${AJ.order.chipLabel(o.status || 'Received', L())}`;
  chip.classList.toggle('final', AJ.order.isFinal(o.status));
}
// checkNow = false right after sending: the order was just saved as "Received", so the first check can wait.
function startPolling(checkNow = true) {
  clearInterval(pollT);
  const o = AJ.order.get();
  if (!o || AJ.order.isFinal(o.status)) return;
  const tick = async () => {
    const n = await AJ.order.refresh();
    renderChip(); if (!sheet.hidden && view === 'track') renderTrack();
    if (!n || AJ.order.isFinal(n.status)) clearInterval(pollT);
  };
  pollT = setInterval(tick, o.preview ? 3000 : 30000);   // the Sheet is checked every 30 seconds
  if (checkNow) tick();
}
document.addEventListener('visibilitychange', () => { if (!document.hidden) startPolling(); });
$('#orderBar').addEventListener('click', () => openChit('form'));
$('#placeBtn').addEventListener('click', () => setView('form'));
$('#chitBack').addEventListener('click', () => setView('tray'));
$('#orderChip').addEventListener('click', () => openChit('track'));
// keep keyboard focus inside the open slip
sheet.addEventListener('keydown', e => {
  if (e.key !== 'Tab') return;
  const f = [...chit.querySelectorAll('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])')]
    .filter(x => !x.disabled && x.offsetParent !== null && !x.closest('.hp'));
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});

/* ---------------- events ---------------- */
menuEl.addEventListener('click', e => {
  const b = e.target.closest('[data-act]'); if (!b) return;
  const {act, id} = b.dataset;
  if (act === 'add') add(id, +b.dataset.v, b);
  else if (act === 'dec') dec(id, +b.dataset.v);
  else if (act === 'flav') setFlav(id, +b.dataset.i);
});
catsEl.addEventListener('click', e => {
  const b = e.target.closest('[data-sec]'); if (!b) return;
  const sec = document.getElementById('sec-' + b.dataset.sec);
  if (sec) sec.scrollIntoView({behavior: reduce ? 'auto' : 'smooth', block:'start'});
});
document.querySelectorAll('.lang button').forEach(b => b.addEventListener('click', () => { if (b.dataset.lang !== L()) setLang(b.dataset.lang); }));
$('#trayOpen').addEventListener('click', () => openChit('tray'));
sheet.addEventListener('click', e => { if (e.target.closest('[data-close]')) closeChit(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !sheet.hidden) closeChit(); });
linesEl.addEventListener('click', e => {
  const b = e.target.closest('[data-step]'); if (!b) return;
  const l = state.tray[+b.dataset.i]; if (!l) return;
  l.q = Math.min(99, l.q + (+b.dataset.step)); l.ts = Date.now();
  if (l.q <= 0) state.tray.splice(+b.dataset.i, 1);
  save(); update();
});
linesEl.addEventListener('change', e => {
  const c = e.target.closest('[data-jr]'); if (!c) return;
  const l = state.tray[+c.dataset.jr]; if (!l) return;
  l.j = c.checked;
  const twin = state.tray.find(x => x !== l && x.id === l.id && x.v === l.v && x.f === l.f && x.j === l.j);
  if (twin) { twin.q = Math.min(99, twin.q + l.q); state.tray.splice(state.tray.indexOf(l), 1); }
  save(); update();
  const nc = linesEl.querySelector(`[data-jr]`); if (nc && document.activeElement === document.body) nc.focus();
});
$('#clearBtn').addEventListener('click', e => {
  const b = e.currentTarget;
  if (b.classList.contains('armed')) { disarm(); state.tray = []; save(); update(); return; }
  b.classList.add('armed'); b.textContent = t('clearConfirm');
  clearTimeout(armT); armT = setTimeout(() => { b.classList.remove('armed'); b.textContent = t('clear'); }, 3000);
});
$('#copyBtn').addEventListener('click', e => {
  const b = e.currentTarget, text = orderText(), area = $('#copyArea');
  const ok = () => { b.textContent = t('copied'); setTimeout(() => { b.textContent = t('copy'); }, 1600); };
  const fallback = () => { area.value = text; area.hidden = false; area.focus(); area.select(); };
  try { navigator.clipboard.writeText(text).then(ok, fallback); } catch (err) { fallback(); }
});
/* section spy: highlight the category you're in and keep its chip in view */
let spyRaf = 0, lastCur = null;
function spy() {
  spyRaf = 0;
  const line = catsBar.getBoundingClientRect().bottom + 90;   // a section counts once its heading is just under the bar
  let cur = null;
  document.querySelectorAll('.sec').forEach(s => { if (!s.hidden && s.getBoundingClientRect().top <= line) cur = s.id.slice(4); });
  catsEl.querySelectorAll('button').forEach(b => b.setAttribute('aria-current', String(b.dataset.sec === cur)));
  if (cur && cur !== lastCur) {
    lastCur = cur;
    const b = catsEl.querySelector(`[data-sec="${cur}"]`);
    if (b) {  // relative scroll works the same in English (LTR) and Arabic (RTL)
      const r = b.getBoundingClientRect(), c = catsEl.getBoundingClientRect();
      catsEl.scrollBy({ left: (r.left + r.width / 2) - (c.left + c.width / 2), behavior: reduce ? 'auto' : 'smooth' });
    }
  }
}
addEventListener('scroll', () => { if (!spyRaf) spyRaf = requestAnimationFrame(spy); }, {passive:true});

/* ---------------- other tabs ---------------- */
// Another tab (or this page coming back from the back/forward cache) may have changed the tray or placed
// the order: always take the saved copy, so an old tab can never put already-ordered items back.
function resync() {
  const lg = state.lang;
  load(null); state.lang = lg;
  update();
  if (!sheet.hidden) {
    if (view === 'form' && !state.tray.length && !sending) setView(AJ.order.get() ? 'track' : 'tray');
    else if (view === 'form') renderForm();
    else if (view === 'track') renderTrack();
  }
}
addEventListener('storage', e => {
  if (e.key === KEY || e.key === null) resync();
  if (e.key === AJ.order.KEY || e.key === null) { renderChip(); startPolling(false); if (!sheet.hidden && view === 'track') renderTrack(); }
});
addEventListener('pageshow', e => { if (e.persisted) { resync(); renderChip(); startPolling(); } });
const newRef = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), b => 'abcdefghijkmnpqrstuvwxyz23456789'[b % 32]).join('');

/* ---------------- boot ---------------- */
function start() {
  load(null);
  state.lang = AJ.pickLang();
  buildScene();
  setLang(state.lang);
  const q = (new URLSearchParams(location.search).get('order') || '').toUpperCase();
  if (/^[A-Z0-9]{8}$/.test(q)) {
    const o = AJ.order.get();
    if (!o || o.id !== q) AJ.order.set({ id: q, type: 'pickup', at: Date.now(), status: 'Received', preview: AJ.order.mode() !== 'live' });
    openChit('track');
  }
  startPolling(); renderChip();
  // deep links from the homepage, e.g. /menu/#it-thyme
  const target = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if (target) requestAnimationFrame(() => {
    window.scrollTo(0, 120); setCompact(true); spy();
    requestAnimationFrame(() => { target.scrollIntoView({block:'start'}); target.classList.add('flash'); });
  });
}
start();
})();
