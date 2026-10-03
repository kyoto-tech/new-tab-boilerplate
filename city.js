"use strict";

(() => {
  const canvas = document.getElementById("city-scene");
  const p = PixelArt.create(canvas);
  const { rect, line, dot, dither, polygon, outline, ellipse, text, jpText } = p;

  function panel(x,y,w,h,edge=5,fill=0) {
    rect(x,y,w,h,edge); rect(x+1,y+1,w-2,h-2,fill);
  }

  function sky() {
    const ramp=[1,2,3,4,5,6,7];
    for(let y=30;y<290;y++) {
      const position=Math.min(ramp.length-1,(y-30)/220*(ramp.length-1));
      const index=Math.floor(position);
      dither(0,y,640,1,ramp[index],ramp[Math.min(index+1,ramp.length-1)],position-index);
    }
    ellipse(503,114,29,29,7,true);
    for(let y=-29;y<=29;y++) {
      const half=Math.floor(Math.sqrt(29*29-y*y));
      dither(503-half,114+y,half*2+1,1,7,8,(29-y)/58);
    }
    polygon([[390,119],[413,119],[432,115],[456,116],[474,120],[523,120],[541,123],[557,123],[570,125],[390,125]],4,5,.5);
    line(403,126,560,126,6);
    polygon([[18,83],[47,83],[57,80],[80,79],[94,83],[116,83],[127,87],[172,87],[184,90],[18,90]],2,4,.25);
    polygon([[235,65],[261,65],[273,62],[300,62],[317,67],[365,67],[372,70],[235,70]],2,3,.5);
    [[65,54],[199,68],[359,52],[573,69],[440,47],[612,104],[214,98]].forEach(([x,y])=>dot(x,y,7));
    line(412,78,416,78,6);dot(414,77,8);dot(414,79,8);
  }

  function skyline() {
    for(let i=0;i<46;i++) {
      const x=i*15-10, y=198-((i*29+11)%65), w=12+(i%3)*4;
      rect(x,y,w,283-y,3);
      rect(x+3,y-4,w-6,4,3);
      if(i%3===0) line(x+7,y-4,x+7,y-14,3);
      for(let row=y+8;row<270;row+=7) for(let col=x+3;col<x+w-2;col+=4) {
        if((row+col*5)%7<3) rect(col,row,1,2,5);
      }
    }
    for(let i=0;i<18;i++) {
      const x=i*39-9,y=199-((i*31)%39),w=24+(i%4)*3;
      rect(x,y,w,294-y,2);
      line(x,y,x+w,y,4);
      for(let row=y+5;row<279;row+=6) for(let col=x+3;col<x+w-3;col+=5) {
        if((row*3+col)%5<2) rect(col,row,2,2,6);
      }
    }
  }

  function rooftop(x,y,w) {
    const bx=x+5,by=y-10;
    polygon([[bx,by],[bx+5,by-3],[bx+21,by-3],[bx+16,by]],5); 
    rect(bx,by,16,8,2);polygon([[bx+16,by],[bx+21,by-3],[bx+21,by+5],[bx+16,by+8]],0);
    line(bx,by,bx+16,by,6);
    for(let i=2;i<14;i+=3) line(bx+i,by+2,bx+i,by+6,4);
    line(x+w-12,y-4,x+w-12,y-24,0);
    line(x+w-18,y-18,x+w-5,y-18,5);
    line(x+w-16,y-22,x+w-7,y-22,4);
    dot(x+w-12,y-25,11);
  }

  function building({x,y,w,h,d=12,face=3,side=1,top=5,light=8,cols=5,roof=true}) {
    const body=[[x,y],[x+w,y],[x+w,y+h],[x,y+h]];
    const flank=[[x+w,y],[x+w+d,y-7],[x+w+d,y+h-7],[x+w,y+h]];
    const lid=[[x,y],[x+d,y-7],[x+w+d,y-7],[x+w,y]];
    polygon(flank,side,face,.2);outline(flank);
    polygon(body,face);outline(body);
    dither(x+w-10,y+2,9,h-3,face,side,.5);
    polygon(lid,top,face,.25);outline(lid);
    line(x+1,y+1,x+w-1,y+1,top);
    for(let yy=y+7;yy<y+h-8;yy+=11) {
      line(x+2,yy+7,x+w-3,yy+7,side);
      for(let col=0;col<cols;col++) {
        const xx=x+5+col*Math.floor((w-9)/cols);
        const lit=((col*17+yy*11+x)%13)>4;
        rect(xx,yy,Math.max(3,Math.floor((w-10)/cols)-3),5,0);
        if(lit) {
          rect(xx+1,yy+1,Math.max(2,Math.floor((w-10)/cols)-4),2,light);
          line(xx+1,yy+3,xx+Math.max(2,Math.floor((w-10)/cols)-4),yy+3,light===8?6:13);
        }
      }
    }
    for(let yy=y+12;yy<y+h-8;yy+=14) {
      line(x+w+4,yy,x+w+d-3,yy-3,0);
      if(yy%3) line(x+w+4,yy+1,x+w+d-3,yy-2,12);
    }
    // Downpipe and facade seam: deliberate one-pixel details at native resolution.
    line(x+2,y+5,x+2,y+h-3,top);
    line(x+w-4,y+8,x+w-4,y+h-2,side);
    if(roof) rooftop(x,y,w);
  }

  function neighborhood() {
    const blocks=[
      {x:12,y:176,w:57,h:133,face:4,top:6,cols:5},
      {x:95,y:153,w:60,h:143,face:3,top:5,light:14,cols:5},
      {x:191,y:183,w:54,h:111,face:4,top:6,light:8,cols:4},
      {x:251,y:210,w:31,h:82,face:2,top:4,light:14,cols:3},
      {x:379,y:149,w:63,h:143,face:3,top:5,light:14,cols:5},
      {x:479,y:145,w:65,h:143,face:4,top:6,light:8,cols:6},
      {x:572,y:182,w:58,h:122,face:3,top:5,light:7,cols:5},
    ];
    blocks.forEach(building);
    // Rooftop tanks and secondary utility buildings give the skyline depth.
    panel(181,251,51,44,0,2);line(181,251,232,251,5);
    dither(184,254,46,38,2,3,.25);
    rect(191,263,13,18,0);rect(213,263,13,18,0);
    line(169,238,169,223,0);line(185,238,185,223,0);
    ellipse(177,218,12,5,4,true);rect(165,218,25,11,4);
    ellipse(177,217,12,4,6,true);ellipse(177,217,12,4,0);
    line(165,226,190,226,2);
  }

  function clockTower() {
    building({x:296,y:124,w:54,h:180,d:15,face:12,side:1,top:13,light:14,cols:4,roof:false});
    polygon([[299,123],[299,109],[309,109],[309,97],[337,97],[337,109],[347,109],[347,123]],12,13,.25);
    outline([[299,123],[299,109],[309,109],[309,97],[337,97],[337,109],[347,109],[347,123]]);
    line(310,97,337,97,14);line(300,110,346,110,13);
    line(324,97,324,59,0);line(325,97,325,64,13);
    line(319,75,330,75,3);rect(323,56,3,3,11);dot(324,55,9);
    panel(300,135,46,57,13,0);
    ellipse(323,160,20,20,13);ellipse(323,160,18,18,14);
    ellipse(323,160,16,16,1,true);ellipse(323,160,16,16,12);
    for(let i=0;i<12;i++) {
      const angle=i*Math.PI/6;
      line(323+Math.sin(angle)*14,160-Math.cos(angle)*14,323+Math.sin(angle)*12,160-Math.cos(angle)*12,15);
    }
    rect(298,195,51,11,1);line(298,195,348,195,13);
    rect(300,210,2,65,13);rect(342,210,2,65,13);
    for(let y=217;y<268;y+=8) {dot(300,y,15);dot(343,y,15);}
    panel(311,279,25,25,5,0);rect(315,283,7,20,12);rect(324,283,7,20,13);
    line(311,279,336,279,14);polygon([[291,305],[356,305],[350,311],[284,311]],5);outline([[291,305],[356,305],[350,311],[284,311]]);
  }

  function portrait(x,y) {
    // An original tiny android announcer, ready for a future blinking loop.
    polygon([[x+2,y+33],[x+7,y+25],[x+25,y+25],[x+31,y+33]],12);
    polygon([[x+10,y+22],[x+12,y+31],[x+21,y+31],[x+23,y+22]],7);
    polygon([[x+3,y+25],[x+2,y+11],[x+5,y+4],[x+13,y],[x+24,y+2],[x+29,y+9],[x+29,y+26]],3);
    polygon([[x+7,y+10],[x+24,y+8],[x+25,y+21],[x+20,y+27],[x+14,y+27],[x+8,y+22]],8);
    polygon([[x+7,y+10],[x+9,y+21],[x+14,y+26],[x+11,y+11]],6);
    polygon([[x+5,y+10],[x+11,y+2],[x+25,y+4],[x+25,y+13],[x+18,y+7],[x+13,y+13],[x+12,y+8],[x+8,y+15]],1);
    line(x+10,y+15,x+14,y+15,0);line(x+20,y+14,x+24,y+14,0);
    rect(x+12,y+16,2,2,14);rect(x+21,y+15,2,2,14);dot(x+12,y+16,15);dot(x+21,y+15,15);
    dot(x+18,y+20,6);line(x+16,y+23,x+20,y+23,10);
    polygon([[x+7,y+27],[x+13,y+33],[x+2,y+33]],13);polygon([[x+24,y+27],[x+20,y+33],[x+31,y+33]],13);
    rect(x+27,y+15,2,5,14);rect(x+26,y+15,1,5,15);
  }

  function billboards() {
    line(104,145,104,153,0);line(147,145,147,153,0);
    panel(83,95,84,51,13,1);panel(85,97,80,47,14,1);
    for(let y=100;y<134;y+=3) line(88,y,161,y,12);
    ellipse(125,117,13,13,13,true);ellipse(125,117,13,13,14);
    let previous;
    for(let step=0;step<=120;step++) {
      const angle=step/120*Math.PI*2;
      const x=Math.cos(angle)*25,y=Math.sin(angle)*6;
      const next=[125+x*.91-y*(-.41),117+x*(-.41)+y*.91];
      if(previous)line(...previous,...next,11);
      previous=next;
    }
    jpText("星のクラブ",94,131,15,11);dot(87,99,15);dot(162,142,15);
    // The projector is a little piece of equipment, not a blurred light cone.
    panel(118,150,16,4,0,13);

    line(391,141,391,149,0);line(428,141,428,149,0);
    panel(374,100,72,42,10,1);panel(376,102,68,38,11,1);
    ellipse(410,117,8,6,11);ellipse(410,117,4,3,1,true);
    line(404,112,401,107,11);line(416,112,419,107,11);
    dot(407,116,15);dot(413,116,15);line(408,121,412,121,7);
    jpText("夢の続き",388,127,7,10);

    line(492,132,492,144,0);line(534,132,534,144,0);
    panel(475,73,79,60,5,0);panel(477,75,75,56,8,1);
    dither(479,77,40,44,1,2,.25);portrait(483,80);
    jpText("ルナ",524,81,8,11);jpText("ラジオ",520,96,14,9);
    text("88",524,107,11,2,0);jpText("夜を歩こう",486,119,7,10);
  }

  function shopfronts() {
    building({x:64,y:237,w:125,h:78,d:15,face:4,side:1,top:6,light:8,cols:11,roof:false});
    building({x:448,y:229,w:141,h:77,d:16,face:12,side:1,top:13,light:14,cols:12,roof:false});
    rooftop(64,237,125);rooftop(448,229,141);
    // Ramen sign, striped awning, noren curtains, lanterns, and stools.
    panel(69,261,115,15,10,0);panel(70,262,113,13,11,0);
    jpText("月光ラーメン",82,262,8,12);
    polygon([[70,277],[183,277],[187,284],[66,284]],10);
    for(let x=69;x<181;x+=10) polygon([[x+2,277],[x+7,277],[x+9,284],[x,284]],7);
    line(66,284,187,284,0);rect(69,285,116,28,0);
    rect(79,287,42,19,8);rect(84,289,34,12,6);
    for(let x=80;x<121;x+=11) {rect(x,287,9,9,10);line(x,287,x+8,287,11);}
    rect(129,288,38,20,1);rect(131,289,15,18,6);rect(149,289,15,18,5);
    line(127,309,168,309,8);
    for(let x=133;x<164;x+=13) {rect(x,307,7,2,10);line(x+1,309,x+1,314,0);line(x+5,309,x+5,314,0);}
    [74,177].forEach(x=>{line(x,284,x,288,5);ellipse(x,295,4,6,8,true);line(x,289,x,300,10);line(x-2,295,x+2,295,6);});
    panel(184,242,14,42,0,10);
    [..."ラーメン"].forEach((char,i)=>jpText(char,186,241+i*10,8,10));
    // Arcade glass and cabinet silhouettes.
    panel(453,253,131,16,13,0);panel(455,255,127,12,14,1);
    jpText("星くずゲームセンター",461,254,15,10);
    rect(454,272,128,33,0);
    for(let x=460;x<543;x+=24) {
      rect(x,276,17,26,2);rect(x+2,279,13,9,10);rect(x+3,280,11,6,11);
      rect(x+5,282,2,2,9);rect(x+11,281,2,3,1);
      line(x+1,292,x+15,292,13);dot(x+5,291,8);dot(x+11,291,14);
      line(x+3,302,x+14,302,12);
    }
    rect(557,274,20,29,12);line(567,274,567,301,14);dot(565,289,15);
  }

  function wires() {
    const cable=(x0,y0,x1,y1,sag,color)=>{
      let previous=[x0,y0];
      for(let i=1;i<=60;i++) {
        const t=i/60,next=[x0+(x1-x0)*t,y0+(y1-y0)*t+4*t*(1-t)*sag];
        line(...previous,...next,color);previous=next;
      }
    };
    cable(36,201,222,208,18,0);cable(36,204,222,211,18,1);
    cable(222,208,369,216,12,0);cable(369,216,602,202,21,0);
    [36,222,369,602].forEach((x,i)=>{
      const y=[201,208,216,202][i];rect(x,y-9,2,106,0);line(x-8,y-2,x+8,y-2,0);
      rect(x-6,y-5,2,3,5);rect(x+5,y-5,2,3,5);
    });
  }

  function railway() {
    polygon([[0,317],[640,295],[640,318],[0,342]],3,5,.25);
    line(0,319,640,297,5);line(0,341,640,317,0);line(0,342,640,318,12);
    for(let x=0;x<640;x+=23) line(x,319-x*.034,x-5,340-x*.037,2);
    polygon([[0,343],[640,319],[640,370],[0,394]],0,12,.2);
    for(let x=0;x<640;x+=21) line(x,352-x*.035,x+7,361-x*.035,3);
    line(0,354,640,331,5);line(0,360,640,337,13);
    [[240,332],[607,314]].forEach(([x,y])=>{
      line(x,y,x,y-42,0);line(x+1,y,x+1,y-42,5);line(x,y-42,x+10,y-45,5);
      rect(x+7,y-46,12,3,0);rect(x+8,y-45,10,1,8);
    });
    // The vending machine stays on the sidewalk; walkers are drawn per frame.
    panel(594,294,12,20,0,10);rect(596,296,8,9,1);
    for(let y=298;y<304;y+=3) for(let x=597;x<604;x+=3) rect(x,y,2,2,14);
    rect(596,309,6,2,0);dot(604,307,9);
  }

  // The Yamanote-inspired car is drawn per frame (see drawTrain) so it can
  // arrive, dwell with open doors, and depart instead of sitting fixed forever.
  const trainTop = x => 336 - x * .035;

  function drawTrainBody(dx, dy, doorOpen) {
    for (const [left0, right0] of [[-14, 315], [319, 655]]) {
      const left = left0 + dx, right = right0 + dx;
      if (right < -20 || left > 660) continue;
      const top = x => trainTop(x) + dy;
      polygon([[left,top(left)],[right,top(right)],[right,top(right)+25],[left,top(left)+25]],7,6,.25);
      line(left,top(left),right,top(right),0);
      line(left,top(left)+2,right,top(right)+2,14);
      line(left,top(left)+20,right,top(right)+20,13);
      line(left,top(left)+25,right,top(right)+25,0);
      for(let x=left+14;x<right-4;x+=27) {
        const y=top(x)+5;
        if((x-left)%108>=81) {
          rect(x,y,20,17,13);
          dither(x+2,y+2,16,11,2,15,doorOpen);
          const gap=doorOpen*3.5;
          line(x+10-gap,y+2,x+10-gap,y+13,7);
          line(x+10+gap,y+2,x+10+gap,y+13,7);
        } else {
          rect(x,y,22,10,0);rect(x+1,y+1,20,8,2);
          line(x+2,y+7,x+19,y+7,14);
          dot(x+5,y+3,5);dot(x+14,y+3,5);
        }
      }
    }
  }

  function drawSpeedLines(intensity) {
    if (intensity<=0) return;
    p.withClip(13,35,614,327,()=>{
      const count=Math.round(intensity*8);
      for(let i=0;i<count;i++) {
        const x=40+i*68, y=trainTop(x)+8+(i%3)*6, len=5+Math.round(intensity*11);
        line(x,y,x-len,y,i%2?14:9);
      }
    });
  }

  function drawPantographSpark(dx,time) {
    const x=330+dx;
    if (x<25||x>615||Math.floor(time/110)%4) return;
    const y=trainTop(x);
    p.withClip(13,35,614,327,()=>{
      line(x,y-7,x,y-2,0);dot(x,y-8,15);
      if(Math.floor(time/55)%2===0) dot(x+1,y-9,9);
    });
  }

  // The near rail sits closer to the viewer than the train, so this glint
  // stays in front of it at a fixed screen position (the rail doesn't move).
  function drawForegroundRail() {
    line(0,362,640,339,3);
  }

  function frame() {
    // All visible lettering uses our bitmap glyphs and shares the 16-color palette.
    rect(0,0,640,34,0);rect(0,363,640,37,0);
    // Hazard-tape trim along the outer top and bottom edges, like a caution
    // stripe painted on a piece of equipment casing.
    for(let x=0;x<640;x++) for(let y=0;y<3;y++) dot(x,y,(x+y)%8<4?8:0);
    for(let x=0;x<640;x++) for(let y=397;y<400;y++) dot(x,y,(x+y)%8<4?8:0);
    jpText("ネオン東京",16,5,7,20);
    jpText("東京・渋谷",544,6,14,10);
    jpText("夜の散歩",554,19,5,9);
    // A conduit run bridges the gap between the title and the weather board,
    // with bolted junction collars standing in for cable ties. Confined to
    // x135-335 so the weather board's own per-frame redraw (x338-525)
    // doesn't erase it every tick.
    line(135,16,330,16,12);line(135,17,330,17,0);
    [165,250].forEach(x=>{
      rect(x,13,10,7,2);line(x,14,x+9,14,0);
      dot(x+2,16,14);dot(x+7,16,14);
    });
    line(12,33,627,33,12);line(12,363,627,363,12);
    line(12,33,12,363,12);line(627,33,627,363,12);
    rect(0,34,12,329,0);rect(628,34,12,329,0);
    // Vertical service pipes run down each side margin with riveted joints.
    [0,628].forEach(left=>{
      const cx=left+6;
      line(cx,36,cx,361,12);line(cx-1,36,cx-1,361,0);
      for(let y=40;y<360;y+=22) {
        rect(left+2,y,9,4,2);line(left+2,y+1,left+10,y+1,0);
        dot(left+3,y+2,14);dot(left+9,y+2,14);
      }
    });
    // Corner bolt plates replace plain dots with a riveted bracket look.
    [[12,33],[627,33],[12,363],[627,363]].forEach(([x,y])=>{
      rect(x-2,y-2,5,5,2);dot(x,y,14);
    });
    // A second conduit run along the footer, clear of the caption below it.
    line(14,366,625,366,12);line(14,367,625,367,0);
    for(let x=60;x<600;x+=90) {
      rect(x,364,10,6,2);line(x,365,x+9,365,0);
      dot(x+2,367,14);dot(x+7,367,14);
    }
    jpText("終電のあとも、街は眠らない。",19,372,7,11);
  }

  function drawCity() {
    rect(0,0,640,400,0);
    sky();skyline();
    dither(0,281,640,119,1,2,.25);
    neighborhood();clockTower();billboards();shopfronts();wires();railway();frame();
    p.present();
    canvas.dataset.ready="true";
  }

  const motionButton = document.getElementById("motion-toggle");
  const lightingSelect = document.getElementById("lighting-mode");
  const tokyoClock = document.getElementById("tokyo-clock");
  const weatherStatus = document.getElementById("weather-status");
  const weatherFreshness = document.getElementById("weather-freshness");
  const tokyoFormatter = new Intl.DateTimeFormat("ja-JP",{timeZone:"Asia/Tokyo",hour:"2-digit",minute:"2-digit",second:"2-digit",hourCycle:"h23"});
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const palettes = {
    morning: ["#111122","#333355","#665577","#997799","#bb8899","#ddaabb","#ffbb99","#ffddbb","#ffeeaa","#ffffdd","#bb5577","#ff88aa","#557788","#669999","#99ddcc","#ddffee"],
    day: ["#112233","#334466","#446699","#6688bb","#7799bb","#99aacc","#bbccdd","#ddeeff","#ffdd99","#ffffee","#aa4477","#ee77aa","#445577","#448899","#77ccdd","#bbffee"],
    dusk: [...p.palette],
    night: ["#111122","#111133","#222255","#333366","#554477","#775588","#996699","#bb7799","#ffbb77","#ffeecc","#aa3366","#ff66aa","#223355","#226677","#55bbcc","#aaeeee"],
  };
  const boards = [
    { name: "orbit", modes: ["ring", "radar", "comet"], mode: "ring", remaining: 5900 },
    { name: "dream", modes: ["cat", "sleep", "dance"], mode: "cat", remaining: 7600 },
    { name: "radio", modes: ["host", "wave", "message"], mode: "host", remaining: 9100 },
  ];
  const TRAIN_DURATIONS = { dwell: 6500, departing: 2600, empty: 4200, arriving: 3000 };
  const TRAIN_ORDER = ["dwell", "departing", "empty", "arriving"];
  let train = { phase: "dwell", phaseStart: 0 };
  let paused = reducedMotion.matches;
  let animationTime = 0;
  let lastTick = 0;
  let timer = 0;
  let clockPulseStart = null;
  let vendingEffect = null;
  let catReactionStart = null;
  let activeLighting = "";
  const WEATHER_URL="https://api.open-meteo.com/v1/forecast?latitude=35.6595&longitude=139.7005&current=temperature_2m%2Cweather_code&timezone=Asia%2FTokyo&forecast_days=1";
  const WEATHER_CACHE_KEY="neon-tokyo-weather-v1";
  const WEATHER_INTERVAL=15*60*1000;
  let weather={kind:"unknown",label:"取得中",temperature:null,fetchedAt:0,source:"loading"};
  let weatherTimer=0;
  let weatherPending=false;

  function weatherForCode(code) {
    if(code===0||code===1) return {kind:"clear",label:"晴れ"};
    if(code===2||code===3||code===45||code===48) return {kind:"cloudy",label:code>=45?"霧":"くもり"};
    if([71,73,75,77,85,86].includes(code)) return {kind:"snow",label:"雪"};
    if([51,53,55,56,57,61,63,65,66,67,80,81,82,95,96,97,99].includes(code)) return {kind:"rain",label:code>=95?"雷雨":"雨"};
    return {kind:"unknown",label:"不明"};
  }

  function readWeatherCache() {
    try {
      const saved=JSON.parse(localStorage.getItem(WEATHER_CACHE_KEY));
      if(saved&&Number.isFinite(saved.temperature)&&Number.isInteger(saved.code)&&
         Number.isFinite(saved.fetchedAt)&&saved.fetchedAt>0&&saved.fetchedAt<=Date.now()) {
        return {...weatherForCode(saved.code),temperature:saved.temperature,fetchedAt:saved.fetchedAt,
          source:Date.now()-saved.fetchedAt<WEATHER_INTERVAL?"cached":"stale"};
      }
    } catch { /* Storage can be unavailable in a restricted browser profile. */ }
    return null;
  }

  function renderWeatherStatus() {
    const temp=weather.temperature===null?"":` ${Math.round(weather.temperature)}℃`;
    const suffix=weather.source==="live"?"現在":weather.source==="cached"?"保存済み":weather.source==="stale"?"前回の情報":weather.source==="loading"?"取得中":"取得できません";
    weatherStatus.textContent=weather.kind==="unknown"&&weather.temperature===null?
      `東京・渋谷の天気：${suffix}`:`東京・渋谷${temp} ${weather.label}（${suffix}）`;
    weatherFreshness.textContent=weather.fetchedAt?
      `取得 ${tokyoFormatter.format(new Date(weather.fetchedAt))} JST${weather.source==="stale"?"・古い情報":""}`:
      "位置情報は使わず、渋谷の天気を表示します";
    canvas.dataset.weather=weather.kind;
    canvas.dataset.weatherSource=weather.source;
  }

  async function refreshWeather() {
    window.clearTimeout(weatherTimer);weatherTimer=0;
    if(document.hidden||weatherPending) return;
    const age=Date.now()-weather.fetchedAt;
    if(weather.fetchedAt&&age<WEATHER_INTERVAL) {
      weatherTimer=window.setTimeout(refreshWeather,WEATHER_INTERVAL-age);
      return;
    }
    weatherPending=true;
    try {
      const response=await fetch(WEATHER_URL,{signal:AbortSignal.timeout(10000)});
      if(!response.ok) throw new Error(`Weather HTTP ${response.status}`);
      const data=await response.json();
      const current=data.current;
      if(!current||!Number.isFinite(current.temperature_2m)||!Number.isInteger(current.weather_code)||!current.time) {
        throw new Error("Incomplete weather data");
      }
      weather={...weatherForCode(current.weather_code),temperature:current.temperature_2m,fetchedAt:Date.now(),source:"live"};
      try {localStorage.setItem(WEATHER_CACHE_KEY,JSON.stringify({temperature:weather.temperature,code:current.weather_code,fetchedAt:weather.fetchedAt}));} catch { /* The live scene still works without storage. */ }
    } catch {
      weather=weather.fetchedAt?{...weather,source:"stale"}:{kind:"unknown",label:"不明",temperature:null,fetchedAt:0,source:"offline"};
    } finally {
      weatherPending=false;
      renderWeatherStatus();
      drawAnimatedFrame();
      if(!document.hidden) weatherTimer=window.setTimeout(refreshWeather,WEATHER_INTERVAL);
    }
  }

  function tokyoTime(now) {
    const parts=Object.fromEntries(tokyoFormatter.formatToParts(now).map(part=>[part.type,Number(part.value)]));
    return {hours:parts.hour,minutes:parts.minute,seconds:parts.second};
  }

  function automaticLighting(hour) {
    if(hour>=5&&hour<10) return "morning";
    if(hour>=10&&hour<17) return "day";
    if(hour>=17&&hour<21) return "dusk";
    return "night";
  }

  function updateLighting(now) {
    const phase=lightingSelect.value==="auto"?automaticLighting(tokyoTime(now).hours):lightingSelect.value;
    if(phase!==activeLighting) {
      activeLighting=phase;
      p.setPalette(palettes[phase]);
      canvas.dataset.lighting=phase;
    }
  }

  function drawClock(now) {
    const {hours,minutes,seconds}=tokyoTime(now);
    const hourAngle=(hours%12+minutes/60+seconds/3600)*Math.PI/6;
    const minuteAngle=(minutes+seconds/60)*Math.PI/30;
    const secondAngle=seconds*Math.PI/30;
    line(323,160,323+Math.sin(hourAngle)*10,160-Math.cos(hourAngle)*10,9);
    line(323,160,323+Math.sin(minuteAngle)*14,160-Math.cos(minuteAngle)*14,14);
    line(323,160,323+Math.sin(secondAngle)*15,160-Math.cos(secondAngle)*15,11);
    rect(322,159,3,3,15);
    const digits=`${String(hours).padStart(2,"0")}:${String(minutes).padStart(2,"0")}`;
    text(digits,309,197,14,1,0);
    if(tokyoClock.dateTime!==digits) {
      tokyoClock.dateTime=digits;
      tokyoClock.textContent=`東京の時刻 ${digits} JST`;
    }
    canvas.dataset.tokyoTime=`${digits}:${String(seconds).padStart(2,"0")}`;
  }

  function drawMovingCloud(time) {
    const x = Math.round(-105 + (time * .022) % 750);
    polygon([[x,61],[x+16,61],[x+23,57],[x+39,57],[x+46,60],[x+68,60],[x+76,63],[x+83,63],[x+83,67],[x,67]],3,4,.36);
    line(x+5,68,x+65,68,5);
  }

  function drawWeather(time) {
    p.withClip(13,35,614,327,()=>{
      if(["cloudy","rain","snow"].includes(weather.kind)) {
        for(const [x,y] of [[72,82],[264,58],[490,101]]) {
          polygon([[x,y+10],[x+12,y+10],[x+18,y+5],[x+38,y+5],[x+44,y+9],[x+58,y+9],[x+65,y+13],[x,y+13]],3,4,.4);
          line(x+6,y+14,x+58,y+14,5);
        }
      }
      if(weather.kind==="rain") for(let i=0;i<85;i++) {
        const x=13+(i*83+Math.floor(time/28)*3)%614;
        const y=35+(i*137+Math.floor(time/25)*7)%327;
        line(x,y,x-3,y+7,i%5===0?15:14);
      }
      if(weather.kind==="snow") for(let i=0;i<65;i++) {
        const x=13+(i*97+Math.floor(time/100)*(i%3+1))%614;
        const y=35+(i*113+Math.floor(time/100)*(i%4+1))%327;
        rect(x,y,i%7===0?3:2,2,i%3===0?9:15);
      }
    });
  }

  function drawWeatherBoard() {
    rect(338,5,187,24,0);
    const message=weather.temperature===null?`東京の天気 ${weather.source==="offline"?"通信不可":"取得中"}`:`東京 ${Math.round(weather.temperature)}℃ ${weather.label}`;
    jpText(message,343,5,15,11);
    jpText(weather.source==="stale"?"前回の情報":weather.source==="offline"?"通信できません":weather.source==="cached"?"保存済みの天気":"渋谷の現在の天気",343,17,5,8);
  }

  // Real neon tubes stutter rarely and irregularly, not on a steady beat.
  // Each sign checks a pseudo-random hash per time slice so dropouts land at
  // unpredictable moments instead of a repeating, synchronized-looking cycle.
  function neonFlicker(time,seed) {
    const bucket=Math.floor(time/450)+seed*733;
    const hash=Math.sin(bucket*12.9898)*43758.5453;
    return hash-Math.floor(hash)<0.012;
  }

  function drawOrbit(mode,time) {
    if(neonFlicker(time,0)) { rect(87,99,76,43,0); return; }
    rect(87,99,76,43,1);
    for(let y=101;y<131;y+=3) line(89,y,160,y,12);
    if(mode==="ring") {
      ellipse(125,117,13,13,13,true);ellipse(125,117,13,13,14);
      const tilt=Math.sin(time/1050)*.45-.3;
      let previous;
      for(let i=0;i<=80;i++) {
        const angle=i*Math.PI*2/80,rx=Math.cos(angle)*25,ry=Math.sin(angle)*6;
        const next=[125+rx*Math.cos(tilt)-ry*Math.sin(tilt),117+rx*Math.sin(tilt)+ry*Math.cos(tilt)];
        if(previous) line(...previous,...next,11);
        previous=next;
      }
      dot(125,117,15);
      jpText("星のクラブ",94,131,15,11);
    } else if(mode==="radar") {
      ellipse(125,117,16,13,13);ellipse(125,117,10,8,14);
      const angle=time/480;
      line(125,117,125+16*Math.cos(angle),117+13*Math.sin(angle),15);
      dot(125,117,11);dot(109,114,8);dot(136,123,11);
      jpText("電波を発見",93,131,15,10);
    } else {
      const x=99+Math.round((time/75)%55),y=111+Math.round(Math.sin(time/350)*4);
      for(let i=0;i<18;i+=3) line(x-i,y+i/3,x-i-2,y+i/3,11);
      ellipse(x,y,4,3,8,true);dot(x+1,y-1,9);
      jpText("願いをかけて",91,131,15,10);
    }
    line(88,101+Math.floor(time/300)%30,162,101+Math.floor(time/300)%30,13);
  }

  function drawDream(mode,time) {
    if(neonFlicker(time,1)) { rect(378,104,65,34,0); return; }
    rect(378,104,65,34,1);
    if(mode==="sleep") {
      ellipse(408,116,11,10,10,true);ellipse(412,112,10,9,1,true);
      dot(389,111,15);dot(426,109,15);dot(431,122,8);
      jpText("おやすみ",386,127,7,10);
    } else {
      const bounce=mode==="dance"?Math.round(Math.sin(time/280)*2):0;
      ellipse(410,117+bounce,8,6,11);
      line(404,112+bounce,401,107+bounce,11);
      line(416,112+bounce,419,107+bounce,11);
      dot(407,116+bounce,15);dot(413,116+bounce,15);
      line(408,121+bounce,412,121+bounce,7);
      if(mode==="dance") {
        line(402,119+bounce,396,114-bounce,11);
        line(418,119+bounce,424,114+bounce,11);
        jpText("ねこの音楽",381,127,7,10);
      } else jpText("夢の続き",388,127,7,10);
    }
    for(let x=382;x<443;x+=12) dot(x,106+(Math.floor(time/600)+x)%3,10);
  }

  function drawRadio(mode,time) {
    if(neonFlicker(time,2)) { rect(479,77,71,52,0); return; }
    rect(479,77,71,52,1);
    if(mode==="wave") {
      for(let i=0;i<12;i++) {
        const bar=4+Math.abs(Math.round(Math.sin(time/270+i*1.5)*14));
        rect(483+i*5,111-bar,3,bar,i%3?14:11);
        dot(484+i*5,110-bar,15);
      }
      jpText("ルナラジオ",488,78,8,10);
      jpText("夜の音楽",486,119,7,10);
    } else {
      dither(479,77,40,44,1,2,.25);
      portrait(483,80);
      if(mode==="host"&&time%3100<190) {
        line(494,96,496,96,0);line(503,95,505,95,0);
      }
      jpText("ルナ",524,81,8,11);
      jpText("ラジオ",520,96,14,9);
      text("88",524,107,11,2,0);
      jpText(mode==="host"?"夜を歩こう":"こんばんは",486,119,7,10);
      if(mode==="message") {
        dot(539,105,15);dot(541,107,11);dot(543,105,15);
      }
    }
  }

  const easeInCubic = t => t*t*t;
  const easeOutCubic = t => 1-Math.pow(1-t,3);

  function advanceTrain(time) {
    while (time-train.phaseStart>=TRAIN_DURATIONS[train.phase]) {
      train.phaseStart+=TRAIN_DURATIONS[train.phase];
      train.phase=TRAIN_ORDER[(TRAIN_ORDER.indexOf(train.phase)+1)%TRAIN_ORDER.length];
    }
  }

  function drawTrain(time) {
    if (train.phase==="empty") { drawForegroundRail(); return; }
    const elapsed=time-train.phaseStart;
    const duration=TRAIN_DURATIONS[train.phase];
    const t=Math.min(1,Math.max(0,elapsed/duration));
    let dx=0,dy=0,doorOpen=0,speed=0;
    if (train.phase==="dwell") {
      const settle=Math.max(0,1-elapsed/450);
      dy=Math.sin(elapsed/60)*settle*.8;
      const opening=Math.min(1,elapsed/500);
      const closing=Math.min(1,Math.max(0,(elapsed-(duration-700))/700));
      doorOpen=Math.max(0,opening-closing);
    } else if (train.phase==="departing") {
      dx=easeInCubic(t)*700;
      speed=t*t;
    } else if (train.phase==="arriving") {
      dx=-700+easeOutCubic(t)*700;
      speed=(1-t)*(1-t);
    }
    drawTrainBody(dx,dy,doorOpen);
    if (speed>.3) drawSpeedLines(speed);
    if (speed>.15) drawPantographSpark(dx,time);
    drawForegroundRail();
  }

  // A row of chevrons like a real platform indicator board: lit segments
  // count down (pink "<") to this train's departure while it's at the
  // platform, then count up (cyan ">") to the next arrival once it's gone.
  function drawTrainProgress(time) {
    const elapsed=time-train.phaseStart;
    let fraction,color,arrow;
    if (train.phase==="dwell"||train.phase==="departing") {
      const total=TRAIN_DURATIONS.dwell+TRAIN_DURATIONS.departing;
      const elapsedPresent=train.phase==="dwell"?elapsed:TRAIN_DURATIONS.dwell+elapsed;
      fraction=Math.max(0,1-elapsedPresent/total);
      color=11;arrow="<";
    } else {
      const total=TRAIN_DURATIONS.empty+TRAIN_DURATIONS.arriving;
      const elapsedAway=train.phase==="empty"?elapsed:TRAIN_DURATIONS.empty+elapsed;
      fraction=Math.min(1,elapsedAway/total);
      color=14;arrow=">";
    }
    const left=19,count=40,step=15;
    const lit=Math.round(count*fraction);
    for(let i=0;i<count;i++) {
      text(arrow,left+i*step,386,i<lit?color:1,1,1);
    }
  }

  function drawWalkers(time) {
    const walkers=[
      { start: 58, speed: 11, direction: 1, coat: 11, bag: false },
      { start: 160, speed: 9, direction: -1, coat: 14, bag: true },
      { start: 320, speed: 7, direction: 1, coat: 8, bag: false },
    ];
    for(const walker of walkers) {
      const distance=(walker.start+time/1000*walker.speed)%680;
      const x=Math.round(walker.direction===1?-20+distance:660-distance);
      const feet=Math.round(321-x*.035);
      const step=Math.floor(time/240)%2;
      const bob=step;
      ellipse(x,feet,4,1,0,true);
      // Each figure is drawn on the platform's back edge, above the train.
      line(x-2,feet-5-bob,x+(step?-3:-1),feet-1,0);
      line(x+2,feet-5-bob,x+(step?3:1),feet-1,0);
      rect(x-3,feet-12-bob,7,7,0);
      rect(x-2,feet-11-bob,5,6,walker.coat);
      line(x-4,feet-10-bob,x-4+(step?1:-1),feet-6-bob,walker.coat);
      line(x+4,feet-10-bob,x+4+(step?-1:1),feet-6-bob,walker.coat);
      rect(x-2,feet-17-bob,5,5,0);
      rect(x-1,feet-15-bob,4,3,7);
      rect(x-2,feet-18-bob,5,2,walker.bag?5:1);
      dot(x+(walker.direction===1?2:-1),feet-14-bob,0);
      if(walker.bag) {
        rect(x+4,feet-10-bob,3,5,12);
        line(x+3,feet-11-bob,x+6,feet-8-bob,0);
      }
    }
  }

  function drawClockPulse(time) {
    if(clockPulseStart===null) return;
    const elapsed=time-clockPulseStart;
    if(elapsed>=1500) { clockPulseStart=null; return; }
    const radius=12+Math.round(elapsed/1500*195);
    p.withClip(13,35,614,327,()=>{
      ellipse(323,160,radius,Math.round(radius*.82),14);
      if(radius>28) ellipse(323,160,radius-4,Math.round((radius-4)*.82),13);
    });
    for(let i=0;i<4;i++) {
      const angle=i*Math.PI/2+elapsed/430;
      const x=323+Math.cos(angle)*Math.min(radius,34);
      const y=160+Math.sin(angle)*Math.min(radius,34)*.82;
      dot(x,y,15);
    }
  }

  function drawVendingSurprise(time) {
    if(!vendingEffect) return;
    const elapsed=time-vendingEffect.started;
    if(elapsed>=2100) { vendingEffect=null; return; }
    const progress=elapsed/2100;
    const x=601+Math.round(Math.sin(progress*6)*5);
    const y=285-Math.round(progress*23);
    const color=[11,14,8][vendingEffect.shape];
    p.withClip(13,35,614,327,()=>{
      if(vendingEffect.shape===0) {
        polygon([[x,y+5],[x-5,y],[x-5,y-3],[x-2,y-5],[x,y-3],[x+2,y-5],[x+5,y-3],[x+5,y],[x,y+5]],color);
        dot(x-2,y-3,15);dot(x+2,y-3,15);
      } else if(vendingEffect.shape===1) {
        polygon([[x,y-6],[x+2,y-2],[x+6,y],[x+2,y+2],[x,y+6],[x-2,y+2],[x-6,y],[x-2,y-2]],color);
        rect(x-1,y-1,3,3,15);
      } else {
        ellipse(x,y,5,5,color);ellipse(x,y,3,3,15);
        dot(x+2,y+2,color);
      }
      dot(x-8,y+4,15);dot(x+8,y-6,15);
      line(x-11,y-1,x-9,y-1,color);
    });
  }

  function drawCat(time) {
    const elapsed=catReactionStart===null?Infinity:time-catReactionStart;
    const reacting=elapsed<1250;
    if(catReactionStart!==null&&!reacting) catReactionStart=null;
    const hop=reacting?1+Math.round(Math.sin(elapsed/1250*Math.PI)*4):0;
    const y=224-hop;
    ellipse(526,y,7,4,0,true);
    ellipse(533,y-4,4,4,0,true);
    polygon([[530,y-6],[530,y-11],[533,y-8],[536,y-11],[537,y-5]],0);
    dot(532,y-5,14);dot(535,y-5,reacting?11:14);
    line(520,y-1,516,y-4,0);
    line(516,y-4,reacting?514:516,reacting?y-11:y-8,0);
    if(reacting) {
      dot(543,y-12,11);dot(541,y-14,15);dot(545,y-14,15);
      line(539,y-17,539,y-15,11);
    }
  }

  // Two idle equipment LEDs on the top-bar conduit, pulsing out of sync.
  // Kept within x135-335 (clear of the weather board's own per-frame redraw).
  function drawStatusLights(time) {
    [[175,26],[290,26]].forEach(([x,y],i)=>{
      dot(x,y,Math.sin(time/900+i*2.4)>0?14:12);
    });
  }

  // A couple of frames of 1px screen shake sells weight at this pixel scale:
  // once when the train settles to a stop, and a lighter shiver on the tower's
  // light pulse. Deterministic from time so pause/reduced-motion freeze it too.
  function computeShake(time) {
    let amount=0;
    if(train.phase==="dwell") {
      const elapsed=time-train.phaseStart;
      if(elapsed<260) amount=Math.max(amount,1-elapsed/260);
    }
    if(clockPulseStart!==null) {
      const elapsed=time-clockPulseStart;
      if(elapsed<180) amount=Math.max(amount,(1-elapsed/180)*.6);
    }
    if(amount<=0) return [0,0];
    const seed=Math.floor(time/40);
    const dir=seed%2===0?1:-1;
    const magnitude=Math.round(amount);
    return [dir*magnitude,(seed%3===0?dir:0)*magnitude];
  }

  function drawAnimatedFrame() {
    const now=new Date();
    updateLighting(now);
    p.pixels.set(staticPixels);
    drawTrain(animationTime);
    drawMovingCloud(animationTime);
    drawOrbit(boards[0].mode,animationTime);
    drawDream(boards[1].mode,animationTime);
    drawRadio(boards[2].mode,animationTime);
    drawWalkers(animationTime);
    drawCat(animationTime);
    drawClockPulse(animationTime);
    drawVendingSurprise(animationTime);
    drawWeather(animationTime);
    drawClock(now);
    drawWeatherBoard();
    drawTrainProgress(animationTime);
    drawStatusLights(animationTime);
    const phaseLabel={morning:"朝",day:"昼",dusk:"夕方",night:"夜"}[activeLighting];
    jpText(`${phaseLabel} / 山手線の街`,491,372,5,10);
    const [shakeX,shakeY]=computeShake(animationTime);
    p.present(shakeX,shakeY);
    canvas.dataset.billboardModes=boards.map(board=>board.mode).join(",");
  }

  function tick() {
    timer=0;
    if(paused||document.hidden) return;
    const now=performance.now();
    const delta=Math.min(250,Math.max(0,now-lastTick));
    lastTick=now;
    animationTime+=delta;
    advanceTrain(animationTime);
    for(const board of boards) {
      board.remaining-=delta;
      if(board.remaining<=0) {
        const choices=board.modes.filter(mode=>mode!==board.mode);
        board.mode=choices[Math.floor(Math.random()*choices.length)];
        board.remaining=5700+Math.random()*3000;
      }
    }
    drawAnimatedFrame();
    timer=window.setTimeout(tick,100);
  }

  function syncMotion() {
    window.clearTimeout(timer);timer=0;
    motionButton.setAttribute("aria-pressed",String(paused));
    motionButton.textContent=paused?"動きを再開":"動きを止める";
    canvas.dataset.motion=paused?"paused":"playing";
    if(!paused&&!document.hidden) {
      lastTick=performance.now();
      tick();
    }
  }

  function fitScreen() {
    // The monitor bezel's 14px padding on every side (see city.css .monitor)
    // must come out of the available space before the screen itself is sized.
    const fit=Math.min((window.innerWidth-44)/640,(window.innerHeight-122)/400);
    // Use whole-pixel magnification when at least 2× fits. Smaller windows fit
    // the whole frame with nearest-neighbor scaling, which can give uneven pixels.
    const scale=fit>=2?Math.floor(fit):Math.max(.1,fit);
    const sceneFrame=document.getElementById("scene-frame");
    sceneFrame.style.width=`${640*scale}px`;
    sceneFrame.style.height=`${400*scale}px`;
    document.querySelector(".motion-controls").style.width=sceneFrame.style.width;
  }

  function playWithCity(action) {
    const board=boards.find(item=>item.name===action);
    const status=document.getElementById("scene-status");
    if(board) {
      board.mode=board.modes[(board.modes.indexOf(board.mode)+1)%board.modes.length];
      board.remaining=5700+Math.random()*3000;
      status.textContent="看板の映像を切り替えました。";
    } else if(action==="tower") {
      clockPulseStart=animationTime;
      status.textContent="時計塔から光の輪が広がりました。";
    } else if(action==="vending") {
      vendingEffect={started:animationTime,shape:Math.floor(Math.random()*3)};
      status.textContent="自動販売機からホログラムが出ました。";
    } else if(action==="cat") {
      catReactionStart=animationTime;
      status.textContent="屋上の猫が跳ねました。";
    }
    drawAnimatedFrame();
  }

  drawCity();
  const staticPixels=p.pixels.slice();
  weather=readWeatherCache()||weather;
  renderWeatherStatus();
  drawAnimatedFrame();fitScreen();syncMotion();refreshWeather();
  document.querySelectorAll(".scene-hit").forEach(button=>{
    button.addEventListener("click",()=>playWithCity(button.dataset.action));
    button.addEventListener("keydown",event=>{
      if((event.key==="Enter"||event.key===" ")&&!event.repeat) {
        event.preventDefault();
        playWithCity(button.dataset.action);
      }
    });
    button.addEventListener("keyup",event=>{
      if(event.key===" ") event.preventDefault();
    });
  });
  motionButton.addEventListener("click",()=>{paused=!paused;syncMotion();});
  lightingSelect.addEventListener("change",drawAnimatedFrame);
  document.addEventListener("visibilitychange",()=>{
    window.clearTimeout(timer);timer=0;
    window.clearTimeout(weatherTimer);weatherTimer=0;
    if(!document.hidden) drawAnimatedFrame();
    if(!document.hidden) refreshWeather();
    if(!document.hidden&&!paused) {
      lastTick=performance.now();
      tick();
    }
  });
  window.addEventListener("focus",()=>{drawAnimatedFrame();refreshWeather();});
  window.addEventListener("pageshow",()=>{drawAnimatedFrame();refreshWeather();});
  window.setInterval(()=>{
    if(!document.hidden&&paused) drawAnimatedFrame();
  },1000);
  reducedMotion.addEventListener("change",event=>{paused=event.matches;syncMotion();});
  window.addEventListener("resize",fitScreen,{passive:true});
})();
