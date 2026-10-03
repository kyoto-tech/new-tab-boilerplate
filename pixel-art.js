"use strict";

// All primitives write palette indices. No browser paths, text antialiasing,
// alpha blending, or interpolated colors enter the 640 × 400 framebuffer.
const PixelArt = (() => {
  const palette = [
    "#111122", "#222244", "#333366", "#554477",
    "#775577", "#997788", "#bb8899", "#ddaabb",
    "#ffcc99", "#ffeecc", "#aa3366", "#ff77aa",
    "#335566", "#448888", "#77ccbb", "#bbffdd",
  ];
  const bayer = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
  const glyphs = {
    A:[14,17,17,31,17,17,17], B:[30,17,17,30,17,17,30],
    C:[14,17,16,16,16,17,14], D:[30,17,17,17,17,17,30],
    E:[31,16,16,30,16,16,31], F:[31,16,16,30,16,16,16],
    G:[14,17,16,23,17,17,15], H:[17,17,17,31,17,17,17],
    I:[31,4,4,4,4,4,31], J:[7,2,2,2,2,18,12],
    K:[17,18,20,24,20,18,17], L:[16,16,16,16,16,16,31],
    M:[17,27,21,21,17,17,17], N:[17,25,21,19,17,17,17],
    O:[14,17,17,17,17,17,14], P:[30,17,17,30,16,16,16],
    Q:[14,17,17,17,21,18,13], R:[30,17,17,30,20,18,17],
    S:[15,16,16,14,1,1,30], T:[31,4,4,4,4,4,4],
    U:[17,17,17,17,17,17,14], V:[17,17,17,17,17,10,4],
    W:[17,17,17,21,21,21,10], X:[17,17,10,4,10,17,17],
    Y:[17,17,10,4,4,4,4], Z:[31,1,2,4,8,16,31],
    0:[14,17,19,21,25,17,14], 1:[4,12,4,4,4,4,14],
    2:[14,17,1,2,4,8,31], 3:[30,1,1,14,1,1,30],
    4:[2,6,10,18,31,2,2], 5:[31,16,16,30,1,1,30],
    6:[14,16,16,30,17,17,14], 7:[31,1,2,4,8,8,8],
    8:[14,17,17,14,17,17,14], 9:[14,17,17,15,1,1,14],
    " ":[0,0,0,0,0,0,0], ".":[0,0,0,0,0,6,6],
    ":":[0,6,6,0,6,6,0],
    "-":[0,0,0,31,0,0,0], "/":[1,1,2,4,8,16,16],
    "+":[0,4,4,31,4,4,0], "!":[4,4,4,4,4,0,4],
    ">":[16,8,4,2,4,8,16], "<":[1,2,4,8,4,2,1], "'":[4,4,8,0,0,0,0],
    "?":[14,17,1,2,4,0,4],
  };

  function create(canvas) {
    const width = canvas.width;
    const height = canvas.height;
    const pixels = new Uint8Array(width * height);
    const context = canvas.getContext("2d", { alpha: false });
    context.imageSmoothingEnabled = false;
    const rgb = palette.map(hex => [1,3,5].map(offset => parseInt(hex.slice(offset, offset+2),16)));
    const image = context.createImageData(width, height);
    const japaneseGlyphs = new Map();
    let clip = { left: 0, top: 0, right: width, bottom: height };

    function dot(x, y, color) {
      x = Math.round(x); y = Math.round(y);
      if (x >= clip.left && x < clip.right && y >= clip.top && y < clip.bottom) pixels[y*width+x] = color;
    }
    function rect(x, y, w, h, color) {
      const left = Math.max(clip.left, Math.round(x));
      const right = Math.min(clip.right, Math.round(x+w));
      for (let row = Math.max(clip.top, Math.round(y)); row < Math.min(clip.bottom, Math.round(y+h)); row++) {
        if (right > left) pixels.fill(color, row*width+left, row*width+right);
      }
    }
    function withClip(x, y, w, h, draw) {
      const previous = clip;
      clip = {
        left: Math.max(previous.left, Math.round(x)),
        top: Math.max(previous.top, Math.round(y)),
        right: Math.min(previous.right, Math.round(x+w)),
        bottom: Math.min(previous.bottom, Math.round(y+h)),
      };
      try { draw(); } finally { clip = previous; }
    }
    function line(x0, y0, x1, y1, color) {
      x0=Math.round(x0); y0=Math.round(y0); x1=Math.round(x1); y1=Math.round(y1);
      const dx=Math.abs(x1-x0), sx=x0<x1?1:-1, dy=-Math.abs(y1-y0), sy=y0<y1?1:-1;
      let error=dx+dy;
      for (;;) {
        dot(x0,y0,color);
        if(x0===x1 && y0===y1) break;
        const twice=error*2;
        if(twice>=dy) {error+=dy;x0+=sx;}
        if(twice<=dx) {error+=dx;y0+=sy;}
      }
    }
    function dither(x,y,w,h,base,shade,amount=.5) {
      rect(x,y,w,h,base);
      for(let yy=Math.max(0,Math.round(y)); yy<Math.min(height,y+h); yy++) {
        for(let xx=Math.max(0,Math.round(x));xx<Math.min(width,x+w);xx++) {
          if(bayer[(yy&3)*4+(xx&3)]<amount*16) dot(xx,yy,shade);
        }
      }
    }
    function polygon(points,base,shade=base,amount=0) {
      const top=Math.max(0,Math.ceil(Math.min(...points.map(p=>p[1]))));
      const bottom=Math.min(height-1,Math.floor(Math.max(...points.map(p=>p[1]))));
      for(let y=top;y<=bottom;y++) {
        const intersections=[];
        for(let i=0;i<points.length;i++) {
          const a=points[i], b=points[(i+1)%points.length];
          if((a[1]<=y && b[1]>y)||(b[1]<=y && a[1]>y)) intersections.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));
        }
        intersections.sort((a,b)=>a-b);
        for(let i=0;i<intersections.length;i+=2) {
          for(let x=Math.max(0,Math.ceil(intersections[i]));x<=Math.min(width-1,Math.floor(intersections[i+1]));x++) {
            dot(x,y,bayer[(y&3)*4+(x&3)]<amount*16?shade:base);
          }
        }
      }
    }
    function outline(points,color=0) {
      points.forEach((p,i)=>line(...p,...points[(i+1)%points.length],color));
    }
    function ellipse(cx,cy,rx,ry,color,filled=false) {
      if(filled) {
        for(let y=-ry;y<=ry;y++) {
          const half=Math.floor(rx*Math.sqrt(Math.max(0,1-y*y/(ry*ry))));
          rect(cx-half,cy+y,half*2+1,1,color);
        }
      } else {
        let previous=[cx+rx,cy];
        for(let step=1;step<=Math.ceil(Math.max(rx,ry)*10);step++) {
          const angle=step/Math.ceil(Math.max(rx,ry)*10)*Math.PI*2;
          const next=[Math.round(cx+Math.cos(angle)*rx),Math.round(cy+Math.sin(angle)*ry)];
          line(...previous,...next,color); previous=next;
        }
      }
    }
    function text(value,x,y,color,scale=1,spacing=1) {
      for(const char of value.toUpperCase()) {
        (glyphs[char]||glyphs["?"]).forEach((row,yy)=>{
          for(let xx=0;xx<5;xx++) if(row&(1<<(4-xx))) rect(x+xx*scale,y+yy*scale,scale,scale,color);
        });
        x+=(5+spacing)*scale;
      }
    }
    function jpText(value,x,y,color,size=11) {
      const key=`${size}:${value}`;
      let glyph=japaneseGlyphs.get(key);
      if(!glyph) {
        const scratch=document.createElement("canvas");
        const brush=scratch.getContext("2d",{willReadFrequently:true});
        brush.font=`bold ${size}px "Noto Sans CJK JP", "Yu Gothic", sans-serif`;
        scratch.width=Math.ceil(brush.measureText(value).width)+2;
        scratch.height=size+4;
        brush.font=`bold ${size}px "Noto Sans CJK JP", "Yu Gothic", sans-serif`;
        brush.fillStyle="#fff";
        brush.textBaseline="top";
        brush.fillText(value,1,0);
        const bitmap=brush.getImageData(0,0,scratch.width,scratch.height).data;
        glyph={width:scratch.width,height:scratch.height,bitmap};
        japaneseGlyphs.set(key,glyph);
      }
      for(let row=0;row<glyph.height;row++) for(let col=0;col<glyph.width;col++) {
        if(glyph.bitmap[(row*glyph.width+col)*4+3]>100) dot(x+col,y+row,color);
      }
      return glyph.width;
    }
    function present(shiftX=0,shiftY=0) {
      if(!shiftX&&!shiftY) {
        for(let i=0;i<pixels.length;i++) {
          const color=rgb[pixels[i]], offset=i*4;
          image.data[offset]=color[0];image.data[offset+1]=color[1];image.data[offset+2]=color[2];image.data[offset+3]=255;
        }
      } else {
        // A tiny whole-pixel shift of the read source gives a cheap screen
        // shake for impact moments without touching the drawn framebuffer.
        for(let y=0;y<height;y++) {
          const sy=Math.min(height-1,Math.max(0,y-shiftY));
          for(let x=0;x<width;x++) {
            const sx=Math.min(width-1,Math.max(0,x-shiftX));
            const color=rgb[pixels[sy*width+sx]], offset=(y*width+x)*4;
            image.data[offset]=color[0];image.data[offset+1]=color[1];image.data[offset+2]=color[2];image.data[offset+3]=255;
          }
        }
      }
      context.putImageData(image,0,0);
    }
    function setPalette(colors) {
      if(colors.length!==16||colors.some(color=>!/^#[0-9a-f]{6}$/i.test(color))) {
        throw new Error("A scene palette must contain exactly 16 hex colors.");
      }
      colors.forEach((color,index)=>{
        palette[index]=color;
        rgb[index]=[1,3,5].map(offset=>parseInt(color.slice(offset,offset+2),16));
      });
    }
    return { width,height,palette,pixels,dot,rect,withClip,line,dither,polygon,outline,ellipse,text,jpText,present,setPalette };
  }
  return { create, palette };
})();
