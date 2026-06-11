/* ================= language ================= */
function setLang(l){
  document.documentElement.setAttribute('data-lang', l);
  document.documentElement.lang = (l==='jp'?'ja':'en');
  var b = document.getElementById('langBtn');
  if(b) b.textContent = (l==='jp'?'EN':'日本語');
  try{localStorage.setItem('kw-lang', l)}catch(e){}
}
function toggleLang(){
  setLang(document.documentElement.getAttribute('data-lang')==='jp' ? 'en' : 'jp');
}
try{ var saved = localStorage.getItem('kw-lang'); if(saved){ setLang(saved); } }catch(e){}

/* ================= lazy YouTube ================= */
document.querySelectorAll('.yt').forEach(function(el){
  el.addEventListener('click', function(){
    var id = el.getAttribute('data-id');
    var f = document.createElement('iframe');
    f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
    f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    f.allowFullscreen = true;
    el.classList.remove('tilt');
    el.style.transform = 'none';
    el.innerHTML = '';
    el.appendChild(f);
  }, {once:true});
});

/* ================= mobile nav ================= */
document.querySelectorAll('#navPill a').forEach(function(a){
  a.addEventListener('click', function(){ document.getElementById('navPill').classList.remove('open'); });
});

/* ================= reveal on scroll ================= */
var io = new IntersectionObserver(function(entries){
  entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('on'); io.unobserve(e.target); } });
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });

/* ================= count-up stats ================= */
var cio = new IntersectionObserver(function(entries){
  entries.forEach(function(e){
    if(!e.isIntersecting) return;
    cio.unobserve(e.target);
    var el = e.target, target = +el.dataset.n, t0 = null;
    function tick(t){
      if(!t0) t0 = t;
      var p = Math.min((t - t0)/1400, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1-p, 3)));
      if(p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
},{threshold:.6});
document.querySelectorAll('.cnt').forEach(function(el){ cio.observe(el); });

var finePointer = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ================= carrot cursor ================= */
var cur = document.getElementById('cursor'), ring = document.getElementById('ring');
if(ring) ring.remove();
if(finePointer && !reducedMotion && cur){
  document.body.classList.add('cursor-on');
  /* carrot drawn diagonally: tip (the pointer hotspot) at upper-left */
  cur.innerHTML =
    '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">' +
      '<g transform="rotate(-45 24 24)">' +
        '<path d="M24 4 C20.5 10 17 19 17 27 C17 35.5 20 40 24 40 C28 40 31 35.5 31 27 C31 19 27.5 10 24 4 Z" fill="#ff8c42" stroke="#e2660e" stroke-width="1.4" stroke-linejoin="round"/>' +
        '<path d="M19.5 17 Q24 19 28.5 17" fill="none" stroke="#e2660e" stroke-width="1.3" stroke-linecap="round"/>' +
        '<path d="M18.5 25 Q24 27 29.5 25" fill="none" stroke="#e2660e" stroke-width="1.3" stroke-linecap="round"/>' +
        '<path d="M20 32 Q24 33.6 28 32" fill="none" stroke="#e2660e" stroke-width="1.2" stroke-linecap="round"/>' +
        '<path d="M24 39 C21 41 19.5 44.5 19 47 C22 45.5 23.5 43 24 41 Z" fill="#3da050"/>' +
        '<path d="M24 39 C24 42 24 45 24 47.5 C26 45 26.5 42 25.5 39.5 Z" fill="#58c15c"/>' +
        '<path d="M25 39 C27.5 41 29.5 44 30 46.5 C26.8 45.2 25.2 42.5 24.8 40.5 Z" fill="#2e8b44"/>' +
      '</g>' +
    '</svg>';
  var ang = 0, tAng = 0, sc = 1, tSc = 1, lastX = null;
  addEventListener('mousemove', function(e){
    if(lastX !== null){
      var dx = e.clientX - lastX;
      tAng = Math.max(-24, Math.min(24, dx * 1.6));
    }
    lastX = e.clientX;
    cur.style.left = (e.clientX - 9) + 'px';
    cur.style.top  = (e.clientY - 9) + 'px';
  });
  (function carrotLoop(){
    requestAnimationFrame(carrotLoop);
    ang += (tAng - ang) * .18;
    tAng += (0 - tAng) * .08;           /* swing back upright */
    sc  += (tSc - sc) * .25;
    cur.style.transform = 'rotate(' + ang.toFixed(2) + 'deg) scale(' + sc.toFixed(3) + ')';
  })();
  var hovering = false;
  document.querySelectorAll('a,button,.yt').forEach(function(el){
    el.addEventListener('mouseenter', function(){ hovering = true; tSc = 1.28; });
    el.addEventListener('mouseleave', function(){ hovering = false; tSc = 1; });
  });
  addEventListener('mousedown', function(){ tSc = .72; });
  addEventListener('mouseup', function(){ tSc = hovering ? 1.28 : 1; });
}else{
  if(cur) cur.remove();
}

/* ================= magnetic buttons ================= */
if(finePointer && !reducedMotion){
  document.querySelectorAll('.magnet').forEach(function(el){
    el.addEventListener('mousemove', function(e){
      var r = el.getBoundingClientRect();
      var dx = e.clientX - (r.left + r.width/2), dy = e.clientY - (r.top + r.height/2);
      el.style.transform = 'translate(' + dx*.22 + 'px,' + dy*.22 + 'px)';
    });
    el.addEventListener('mouseleave', function(){ el.style.transform = ''; });
  });
}

/* ================= 3D tilt cards ================= */
if(finePointer && !reducedMotion){
  document.querySelectorAll('.tilt').forEach(function(el){
    el.addEventListener('mousemove', function(e){
      var r = el.getBoundingClientRect();
      var px = (e.clientX - r.left)/r.width, py = (e.clientY - r.top)/r.height;
      el.style.transform = 'rotateY(' + ((px-.5)*10) + 'deg) rotateX(' + ((.5-py)*10) + 'deg) translateZ(6px)';
      el.style.setProperty('--gx', (px*100)+'%');
      el.style.setProperty('--gy', (py*100)+'%');
    });
    el.addEventListener('mouseleave', function(){ el.style.transform = ''; });
  });
}

/* ================= hero parallax ================= */
var heroTitle = document.getElementById('heroTitle');
if(finePointer && !reducedMotion && heroTitle){
  addEventListener('mousemove', function(e){
    var dx = (e.clientX/innerWidth - .5), dy = (e.clientY/innerHeight - .5);
    heroTitle.style.transform = 'translate(' + dx*-16 + 'px,' + dy*-10 + 'px)';
  });
}

/* ================= scroll progress + back to top ================= */
(function(){
  var prog = document.getElementById('progress');
  var toTop = document.getElementById('toTop');
  function onScroll(){
    var h = document.documentElement.scrollHeight - innerHeight;
    if(prog) prog.style.width = (h > 0 ? (scrollY / h * 100) : 0) + '%';
    if(toTop) toTop.classList.toggle('show', scrollY > 600);
  }
  addEventListener('scroll', onScroll, {passive:true});
  onScroll();
  if(toTop) toTop.addEventListener('click', function(){ scrollTo({top:0, behavior:'smooth'}); });
})();

/* ================= tabs ================= */
document.querySelectorAll('.tabs').forEach(function(tabs){
  var btns = tabs.querySelectorAll('button[data-tab]');
  btns.forEach(function(b){
    b.addEventListener('click', function(){
      btns.forEach(function(x){ x.classList.remove('on'); });
      b.classList.add('on');
      document.querySelectorAll('.tab-pane').forEach(function(p){
        p.classList.toggle('on', p.id === b.dataset.tab);
      });
    });
  });
});

/* ================= contact form (builds an email) ================= */
function sendForm(e){
  e.preventDefault();
  var f = e.target;
  var lang = document.documentElement.getAttribute('data-lang');
  var name = f.elements['name'].value.trim();
  var comp = f.elements['company'].value.trim();
  var mail = f.elements['email'].value.trim();
  var type = f.elements['type'].value;
  var msg  = f.elements['message'].value.trim();
  var subject = (lang==='jp' ? '【お問い合わせ】' : '[Inquiry] ') + type + (name ? ' — ' + name : '');
  var body = (lang==='jp'
    ? 'お名前: ' + name + '\n会社名: ' + (comp||'-') + '\nメール: ' + mail + '\nご相談内容: ' + type + '\n\n' + msg
    : 'Name: ' + name + '\nCompany: ' + (comp||'-') + '\nEmail: ' + mail + '\nTopic: ' + type + '\n\n' + msg);
  location.href = 'mailto:kanaworksai@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  return false;
}
function copyMail(btn){
  var t = 'kanaworksai@gmail.com';
  function done(){ var o = btn.textContent; btn.textContent = btn.dataset.ok || 'Copied!'; setTimeout(function(){ btn.textContent = o; }, 1600); }
  if(navigator.clipboard){ navigator.clipboard.writeText(t).then(done); }
  else{ var i=document.createElement('input'); i.value=t; document.body.appendChild(i); i.select(); document.execCommand('copy'); i.remove(); done(); }
}

/* ================= cursor flow field + crisp particle trail ================= */
(function(){
  if(reducedMotion) return;
  var cvs = document.getElementById('fx');
  if(!cvs) return;
  var ctx = cvs.getContext('2d');
  var DPR = Math.min(window.devicePixelRatio || 1, 2);
  var W, H, NX, NY, sz, u, v, u0, v0, p, div;

  function alloc(){
    W = innerWidth; H = innerHeight;
    cvs.width = W * DPR; cvs.height = H * DPR;
    cvs.style.width = W + 'px'; cvs.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    NX = 110; NY = Math.max(40, Math.round(NX * H / W));
    if(NY > 130) NY = 130;
    sz = (NX+2)*(NY+2);
    u = new Float32Array(sz); v = new Float32Array(sz);
    u0 = new Float32Array(sz); v0 = new Float32Array(sz);
    p = new Float32Array(sz); div = new Float32Array(sz);
  }
  function IX(x,y){ return x + (NX+2)*y; }

  function advect(d, d0, uu, vv, dt){
    var dtx = dt*NX, dty = dt*NY;
    for(var j=1;j<=NY;j++){
      for(var i=1;i<=NX;i++){
        var idx = IX(i,j);
        var x = i - dtx*uu[idx], y = j - dty*vv[idx];
        if(x<0.5)x=0.5; if(x>NX+0.5)x=NX+0.5;
        if(y<0.5)y=0.5; if(y>NY+0.5)y=NY+0.5;
        var i0=x|0, i1=i0+1, j0=y|0, j1=j0+1;
        var s1=x-i0, s0=1-s1, t1=y-j0, t0=1-t1;
        d[idx] = s0*(t0*d0[IX(i0,j0)] + t1*d0[IX(i0,j1)]) + s1*(t0*d0[IX(i1,j0)] + t1*d0[IX(i1,j1)]);
      }
    }
  }
  function project(){
    var i,j,k,idx;
    for(j=1;j<=NY;j++) for(i=1;i<=NX;i++){
      idx=IX(i,j);
      div[idx] = -0.5*((u[IX(i+1,j)]-u[IX(i-1,j)])/NX + (v[IX(i,j+1)]-v[IX(i,j-1)])/NY);
      p[idx]=0;
    }
    for(k=0;k<14;k++){
      for(j=1;j<=NY;j++) for(i=1;i<=NX;i++){
        idx=IX(i,j);
        p[idx] = (div[idx] + p[IX(i-1,j)] + p[IX(i+1,j)] + p[IX(i,j-1)] + p[IX(i,j+1)])/4;
      }
    }
    for(j=1;j<=NY;j++) for(i=1;i<=NX;i++){
      idx=IX(i,j);
      u[idx] -= 0.5*NX*(p[IX(i+1,j)]-p[IX(i-1,j)]);
      v[idx] -= 0.5*NY*(p[IX(i,j+1)]-p[IX(i,j-1)]);
    }
  }

  /* velocity splat (drives the letter disturbance) */
  function splat(cx, cy, dx, dy){
    var gx = cx/W*NX, gy = cy/H*NY;
    for(var j=-3;j<=3;j++){
      for(var i=-3;i<=3;i++){
        var x = Math.round(gx)+i, y = Math.round(gy)+j;
        if(x<1||x>NX||y<1||y>NY) continue;
        var fall = Math.exp(-(i*i+j*j)/2.25);
        var idx = IX(x,y);
        u[idx] += dx*fall*.06; v[idx] += dy*fall*.06;
      }
    }
  }

  /* crisp particles riding the flow */
  var parts = [], MAXP = 150;
  var COLORS = ['#ffd84d','#ffd84d','#ffd84d','#ff7ab8','#ff7ab8','#62e6ff','#fff3c4'];
  function spawn(x, y, dx, dy){
    var speed = Math.hypot(dx, dy);
    var n = Math.min(3, 1 + (speed/16|0));
    for(var i=0; i<n && parts.length < MAXP; i++){
      parts.push({
        x: x + (Math.random()-.5)*8,
        y: y + (Math.random()-.5)*8,
        vx: dx*5 + (Math.random()-.5)*50,
        vy: dy*5 + (Math.random()-.5)*50,
        life: 0,
        ttl: .8 + Math.random()*.9,
        r: 1.1 + Math.random()*1.9,
        tw: 2 + Math.random()*7,            /* twinkle rate */
        c: COLORS[(Math.random()*COLORS.length)|0]
      });
    }
  }

  var lastX = -1, lastY = -1;
  addEventListener('mousemove', function(e){
    if(lastX>=0){
      splat(e.clientX, e.clientY, e.clientX-lastX, e.clientY-lastY);
      spawn(e.clientX, e.clientY, e.clientX-lastX, e.clientY-lastY);
    }
    lastX = e.clientX; lastY = e.clientY;
  });
  addEventListener('touchmove', function(e){
    var t = e.touches[0];
    if(lastX>=0){
      splat(t.clientX, t.clientY, t.clientX-lastX, t.clientY-lastY);
      spawn(t.clientX, t.clientY, t.clientX-lastX, t.clientY-lastY);
    }
    lastX = t.clientX; lastY = t.clientY;
  }, {passive:true});

  var FCONV = 150; /* grid velocity -> px/s */
  function step(dt){
    project();
    u0.set(u); v0.set(v);
    advect(u, u0, u0, v0, dt); advect(v, v0, u0, v0, dt);
    project();
    for(var k=0;k<sz;k++){ u[k]*=.985; v[k]*=.985; }

    ctx.clearRect(0,0,W,H);
    ctx.globalCompositeOperation = 'lighter';
    for(var n=parts.length-1; n>=0; n--){
      var pt = parts[n];
      pt.life += dt;
      if(pt.life >= pt.ttl){ parts.splice(n,1); continue; }
      var gx = Math.round(pt.x/W*NX), gy = Math.round(pt.y/H*NY);
      if(gx<1)gx=1; if(gx>NX)gx=NX; if(gy<1)gy=1; if(gy>NY)gy=NY;
      var idx = IX(gx,gy);
      pt.vx += (u[idx]*FCONV - pt.vx)*.09;
      pt.vy += (v[idx]*FCONV - pt.vy)*.09 - 14*dt;  /* gentle rise */
      pt.vx *= .988; pt.vy *= .988;
      pt.x += pt.vx*dt; pt.y += pt.vy*dt;
      var t = pt.life/pt.ttl;
      var a = (1-t)*(1-t);
      a *= .7 + .3*Math.sin(pt.life*pt.tw*6.283);  /* twinkle */
      var r = pt.r*(1-t*.4);
      /* soft halo */
      ctx.globalAlpha = a*.18;
      ctx.fillStyle = pt.c;
      ctx.beginPath(); ctx.arc(pt.x, pt.y, r*3.2, 0, 6.283); ctx.fill();
      /* crisp core */
      ctx.globalAlpha = a;
      ctx.beginPath(); ctx.arc(pt.x, pt.y, r, 0, 6.283); ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }

  var last = 0, hidden = false;
  document.addEventListener('visibilitychange', function(){ hidden = document.hidden; });
  function frame(t){
    requestAnimationFrame(frame);
    if(hidden) return;
    var dt = Math.min((t-last)/1000, 0.033) || 0.016;
    last = t;
    step(dt);
  }
  alloc();
  var rsT;
  addEventListener('resize', function(){ clearTimeout(rsT); rsT = setTimeout(alloc, 200); });
  requestAnimationFrame(frame);

  /* expose field sampling for fluid-text */
  window.FLUID = {
    sample: function(px, py){
      var gx = Math.round(px/W*NX), gy = Math.round(py/H*NY);
      if(gx<1) gx=1; if(gx>NX) gx=NX; if(gy<1) gy=1; if(gy>NY) gy=NY;
      var idx = IX(gx,gy);
      var uu = u[idx], vv = v[idx];
      return { u: uu, v: vv, d: Math.sqrt(uu*uu+vv*vv)*.7 };
    }
  };
})();

/* ================= fluid text: letters disturbed by the flow ================= */
(function(){
  if(reducedMotion) return;
  /* which text reacts to the fluid */
  var roots = document.querySelectorAll('#heroTitle, .page-hero h1, .sec-head h2, .contact h2, .cta-strip h2');

  function wrapChars(node){
    if(node.nodeType === 3){
      var frag = document.createDocumentFragment();
      node.textContent.split('').forEach(function(ch){
        if(ch.trim() === ''){ frag.appendChild(document.createTextNode(ch)); return; }
        var s = document.createElement('i');
        s.className = 'fl'; s.textContent = ch;
        frag.appendChild(s);
      });
      node.parentNode.replaceChild(frag, node);
    } else if(node.nodeType === 1){
      Array.prototype.slice.call(node.childNodes).forEach(wrapChars);
    }
  }

  var groups = [];
  roots.forEach(function(root){
    wrapChars(root);
    groups.push({
      root: root,
      letters: Array.prototype.map.call(root.querySelectorAll('.fl'), function(el){
        return { el: el, x: 0, y: 0, r: 0, sc: 1, idle: true };
      })
    });
  });

  var MAXD = 30, K = 19, EASE = 0.16;
  function loop(){
    requestAnimationFrame(loop);
    if(!window.FLUID) return;
    groups.forEach(function(g){
      var rect = g.root.getBoundingClientRect();
      var off = rect.width === 0 || rect.bottom < -40 || rect.top > innerHeight + 40;
      g.letters.forEach(function(L){
        if(off || !L.el.offsetParent){
          if(!L.idle){
            L.x += (0-L.x)*EASE; L.y += (0-L.y)*EASE; L.r += (0-L.r)*EASE; L.sc += (1-L.sc)*EASE;
            if(Math.abs(L.x)<.05 && Math.abs(L.y)<.05 && Math.abs(L.r)<.05 && Math.abs(L.sc-1)<.005){
              L.x=L.y=L.r=0; L.sc=1; L.idle=true; L.el.style.transform='';
            } else {
              L.el.style.transform = 'translate('+L.x.toFixed(2)+'px,'+L.y.toFixed(2)+'px) rotate('+L.r.toFixed(2)+'deg) scale('+L.sc.toFixed(3)+')';
            }
          }
          return;
        }
        var r = L.el.getBoundingClientRect();
        var cx = r.left + r.width/2 - L.x, cy = r.top + r.height/2 - L.y;
        var s = window.FLUID.sample(cx, cy);
        var tx = Math.max(-MAXD, Math.min(MAXD, s.u * K));
        var ty = Math.max(-MAXD, Math.min(MAXD, s.v * K));
        var tr = Math.max(-16, Math.min(16, s.u * 6));
        var tsc = 1 + Math.min(.32, s.d * .11);
        L.x += (tx-L.x)*EASE; L.y += (ty-L.y)*EASE; L.r += (tr-L.r)*EASE; L.sc += (tsc-L.sc)*EASE;
        var still = Math.abs(L.x)<.05 && Math.abs(L.y)<.05 && Math.abs(L.r)<.05 && Math.abs(L.sc-1)<.005;
        if(still && L.idle) return;
        if(still){ L.idle = true; L.el.style.transform = ''; return; }
        L.idle = false;
        L.el.style.transform = 'translate('+L.x.toFixed(2)+'px,'+L.y.toFixed(2)+'px) rotate('+L.r.toFixed(2)+'deg) scale('+L.sc.toFixed(3)+')';
      });
    });
  }
  requestAnimationFrame(loop);
})();
