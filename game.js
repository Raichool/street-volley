import * as THREE from './three.module.js';
const W=4.2,L=8.5; // court half-width (x), half-length (z). Home at z>0 (bottom)
const G=-16, R=0.36, NETH=2.3;
const renderer=new THREE.WebGLRenderer({antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));document.body.prepend(renderer.domElement);
const scene=new THREE.Scene();scene.background=new THREE.Color(0xf3f6f9);scene.fog=new THREE.Fog(0xf3f6f9,14,55);
const cam=new THREE.PerspectiveCamera(50,1,0.1,200);
scene.add(new THREE.HemisphereLight(0xffffff,0xbfe6ff,1.1));const dl=new THREE.DirectionalLight(0xffffff,1.2);dl.position.set(5,20,10);scene.add(dl);
const fx=document.getElementById('fx'),fc=fx.getContext('2d');
function resize(){const w=innerWidth,h=innerHeight;renderer.setSize(w,h);cam.aspect=w/h;cam.fov=w<h?62:55;cam.updateProjectionMatrix();fx.width=w;fx.height=h;}
addEventListener('resize',resize);resize();
const cv=(w,h,f)=>{const c=document.createElement('canvas');c.width=w;c.height=h;f(c.getContext('2d'));const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t};
// clouds
const cloudT=cv(256,128,g=>{g.fillStyle='#fff';g.strokeStyle='#dbeeff';g.lineWidth=6;[[70,80,45],[128,60,60],[190,82,42]].forEach(([x,y,r])=>{g.beginPath();g.arc(x,y,r,0,7);g.fill();});});
// court
const snowT=cv(128,128,g=>{g.fillStyle='#f7f9fc';g.fillRect(0,0,128,128);g.fillStyle='#ecf1f8';g.fillRect(0,0,64,64);g.fillRect(64,64,64,64);});snowT.wrapS=snowT.wrapT=THREE.RepeatWrapping;snowT.repeat.set(75,75);snowT.anisotropy=8;
const ground=new THREE.Mesh(new THREE.PlaneGeometry(300,300),new THREE.MeshBasicMaterial({map:snowT}));ground.rotation.x=-Math.PI/2;ground.position.y=-.01;scene.add(ground);
const court=new THREE.Mesh(new THREE.PlaneGeometry(W*2+2,L*2+2),new THREE.MeshBasicMaterial({color:0xd6e6f7,transparent:true,opacity:.35}));court.rotation.x=-Math.PI/2;court.position.y=.002;scene.add(court);
const lineM=new THREE.MeshBasicMaterial({color:0x4a6aa8});
const line=(w,d,x,z)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,d),lineM);m.rotation.x=-Math.PI/2;m.position.set(x,0.01,z);scene.add(m)};
line(W*2,.06,0,L);line(W*2,.06,0,-L);line(.06,L*2,W,0);line(.06,L*2,-W,0);line(W*2,.04,0,3);line(W*2,.04,0,-3);line(.04,L*2,0,0);
// net
const net=new THREE.Mesh(new THREE.PlaneGeometry(W*2+.6,0.9),new THREE.MeshBasicMaterial({map:(()=>{const t=cv(128,32,g=>{g.clearRect(0,0,128,32);g.strokeStyle='rgba(60,60,70,.7)';g.lineWidth=1;for(let i=0;i<128;i+=8){g.beginPath();g.moveTo(i,0);g.lineTo(i,32);g.stroke()}for(let j=0;j<32;j+=8){g.beginPath();g.moveTo(0,j);g.lineTo(128,j);g.stroke()}g.fillStyle='#fff';g.fillRect(0,0,128,3);g.fillStyle='#333';g.fillRect(0,3,128,1)});t.wrapS=THREE.RepeatWrapping;t.repeat.set(4,1);return t})(),transparent:true,side:THREE.DoubleSide}));net.position.set(0,NETH-.45,0);scene.add(net);
for(const x of[-W-.4,W+.4]){const p=new THREE.Mesh(new THREE.CylinderGeometry(.05,.05,NETH),new THREE.MeshBasicMaterial({map:(()=>{const t=cv(4,32,g=>{for(let i=0;i<8;i++){g.fillStyle=i%2?'#fff':'#d8343c';g.fillRect(0,i*4,4,4)}});return t})()}));p.position.set(x,NETH/2,0);scene.add(p);}
// characters
const NAMES=['TOI','Bibi','Zouz','Kroko','Mimi','Gogo'];
function chibi(seed,col,back){return cv(128,160,g=>{g.lineWidth=6;g.strokeStyle='#000';g.lineJoin='round';
 const r=n=>((Math.sin(seed*99+n*37)+1)/2);
 g.fillStyle=col;g.beginPath();g.ellipse(64,122,30,28,0,0,7);g.fill();g.stroke(); // body
 g.fillStyle='#000';g.fillRect(44,140,12,18);g.fillRect(72,140,12,18);
 const skin=['#ffe6cf','#f6d2b0','#ffe0c2','#e9c39f'][seed%4];g.fillStyle=skin;g.beginPath();g.ellipse(64,62,46,42,0,0,7);g.fill();g.stroke();// head
 g.fillStyle=['#1d1d24','#2a2230','#3a2a20','#1d1d24','#262a3a','#1d1d24'][seed%6];// hair/hat
 if(r(1)>.5){g.beginPath();g.arc(64,50,46,Math.PI,0);g.fill();g.stroke();}else{for(let i=0;i<5;i++){g.beginPath();g.moveTo(26+i*19,32);g.lineTo(34+i*19,4+r(i)*10);g.lineTo(44+i*19,32);g.fill();g.stroke();}}
 if(back){g.beginPath();g.ellipse(64,58,47,44,0,0,7);g.fill();g.stroke();return;}g.fillStyle='#000';const ey=66;g.beginPath();g.ellipse(46,ey,6+r(2)*4,9,0,0,7);g.ellipse(82,ey,6+r(3)*4,9,0,0,7);g.fill();g.fillStyle='#fff';g.fillRect(44,60,4,4);g.fillRect(80,60,4,4);
 g.beginPath();g.lineWidth=4;if(r(4)>.5)g.arc(64,82,10,0.2,Math.PI-.2);else{g.moveTo(54,86);g.lineTo(74,86);}g.stroke();
 g.fillStyle='rgba(255,120,150,.5)';g.beginPath();g.arc(32,80,7,0,7);g.arc(96,80,7,0,7);g.fill();});}
function tag(t,c){return cv(128,40,g=>{g.fillStyle=c;g.strokeStyle='#000';g.lineWidth=4;g.beginPath();g.roundRect(4,4,120,32,16);g.fill();g.stroke();g.fillStyle='#fff';g.font='600 20px sans-serif';g.textAlign='center';g.fillText(t,64,28);});}
const badgeT={};function badge(n){return badgeT[n]||(badgeT[n]=cv(64,64,g=>{g.fillStyle='#ffd83a';g.strokeStyle='#333';g.lineWidth=4;g.beginPath();g.arc(32,32,27,0,7);g.fill();g.stroke();g.fillStyle='#222';g.font='700 26px sans-serif';g.textAlign='center';g.fillText('x'+n,32,42);}));}
const players=[];
function mkPlayer(i){const team=i<3?0:1,me=i===0;
 const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:chibi(i+3,['#ff9f2e','#2f6fd8','#f2f2f2','#d8344c','#3a3a44','#ffd23a'][i],team===0),transparent:true,alphaTest:.1}));sp.scale.set(.85,1.08,1);sp.center.set(.5,0);scene.add(sp);
 const tg=new THREE.Sprite(new THREE.SpriteMaterial({map:tag(NAMES[i],team?'#ff6fae':'#3ecf5a'),depthTest:false}));tg.scale.set(.75,.23,1);tg.center.set(.5,0);scene.add(tg);
 const ring=new THREE.Mesh(new THREE.RingGeometry(me?.38:.36,me?.52:.4,40),new THREE.MeshBasicMaterial({color:me?0x22c8ee:team?0xff6fae:0x3ecf5a,transparent:true,opacity:.9}));ring.rotation.x=-Math.PI/2;scene.add(ring);
 if(me){const r2=new THREE.Mesh(new THREE.RingGeometry(.6,.7,40,1,0,Math.PI*1.3),new THREE.MeshBasicMaterial({color:0x2a9d8f,transparent:true,opacity:.9}));r2.position.z=0;ring.add(r2);ring.material.color.set(0x5fd8e8);}
 const sh=new THREE.Mesh(new THREE.CircleGeometry(.4,20),new THREE.MeshBasicMaterial({color:0x8090b0,transparent:true,opacity:.3}));sh.rotation.x=-Math.PI/2;scene.add(sh);
 const bd=new THREE.Sprite(new THREE.SpriteMaterial({depthTest:false,transparent:true}));bd.scale.setScalar(.35);bd.visible=false;scene.add(bd);
 const p={bdT:0,bd,i,team,me,sp,tg,ring,sh,x:0,y:0,z:0,vy:0,vx:0,vz:0,tx:0,tz:0,state:'run',st:0,cd:0,hx:0,hz:0};players.push(p);return p;}
for(let i=0;i<6;i++)mkPlayer(i);
const home=[[0,5.5],[-2.6,2.6],[2.6,2.6]];
function resetPos(){players.forEach(p=>{const h=home[p.i%3];const s=p.team?-1:1;p.x=p.tx=h[0]*s;p.z=p.tz=h[1]*s;p.y=p.vy=0;p.state='run';p.st=0;});}
// ball
const ball=new THREE.Mesh(new THREE.SphereGeometry(R,24,16),new THREE.MeshBasicMaterial({map:cv(256,128,g=>{g.fillStyle='#ffffff';g.fillRect(0,0,256,128);g.fillStyle='#ffd21f';g.fillRect(0,0,256,42);g.fillStyle='#1f4fd8';g.fillRect(0,86,256,42);g.fillStyle='rgba(0,0,0,0)';g.fillRect(0,0,256,128);g.fillStyle='#1f4fd8';for(let i=0;i<3;i++){g.beginPath();g.moveTo(i*86,0);g.bezierCurveTo(i*86+40,40,i*86+10,90,i*86+43,128);g.lineTo(i*86+70,128);g.bezierCurveTo(i*86+40,90,i*86+70,40,i*86+30,0);g.fill();}})}));scene.add(ball);const glow=new THREE.Sprite(new THREE.SpriteMaterial({map:cv(64,64,g=>{const r=g.createRadialGradient(32,32,8,32,32,32);r.addColorStop(0,'rgba(120,190,255,.7)');r.addColorStop(1,'rgba(120,190,255,0)');g.fillStyle=r;g.fillRect(0,0,64,64)}),transparent:true,depthWrite:false}));glow.scale.setScalar(1.6);ball.add(glow);
const bo=new THREE.Mesh(new THREE.SphereGeometry(R*1.06,16,12),new THREE.MeshBasicMaterial({color:0,side:THREE.BackSide}));ball.add(bo);
const bsh=new THREE.Mesh(new THREE.CircleGeometry(R,20),new THREE.MeshBasicMaterial({color:0x2a6f9a,transparent:true,opacity:.3}));bsh.rotation.x=-Math.PI/2;scene.add(bsh);
const B={p:new THREE.Vector3(),v:new THREE.Vector3(),live:false,last:-1,team:-1,touches:0,hard:false};
// reticle
const ret=new THREE.Group();scene.add(ret);
const retIn=new THREE.Mesh(new THREE.PlaneGeometry(.9,.9),new THREE.MeshBasicMaterial({map:cv(64,64,g=>{g.strokeStyle='#ff4f6a';g.lineWidth=12;g.lineCap='round';g.beginPath();g.moveTo(12,12);g.lineTo(52,52);g.moveTo(52,12);g.lineTo(12,52);g.stroke();}),transparent:true}));
const retOut=new THREE.Mesh(new THREE.RingGeometry(.5,.56,40),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.9}));
[retIn,retOut].forEach(m=>{m.rotation.x=-Math.PI/2;m.position.y=.02;ret.add(m)});
// trail
const TN=24,trail=[];const tGeo=new THREE.BufferGeometry();tGeo.setAttribute('position',new THREE.BufferAttribute(new Float32Array(TN*2*3),3));
const tIdx=[];for(let i=0;i<TN-1;i++){const a=i*2;tIdx.push(a,a+1,a+2,a+1,a+3,a+2)}tGeo.setIndex(tIdx);
const tA=new Float32Array(TN*2);for(let i=0;i<TN;i++)tA[i*2]=tA[i*2+1]=i/TN;tGeo.setAttribute('a',new THREE.BufferAttribute(tA,1));
const tMat=new THREE.ShaderMaterial({uniforms:{c:{value:new THREE.Color(0x3fe08a)}},vertexShader:'attribute float a;varying float va;void main(){va=a;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'uniform vec3 c;varying float va;void main(){gl_FragColor=vec4(c,va*va*.45);}',transparent:true,depthWrite:false,blending:THREE.NormalBlending,side:THREE.DoubleSide});
const tMesh=new THREE.Mesh(tGeo,tMat);tMesh.frustumCulled=false;scene.add(tMesh);
// sparks + flash
const sparks=[];const sparkM=new THREE.SpriteMaterial({map:cv(32,32,g=>{const r=g.createRadialGradient(16,16,0,16,16,16);r.addColorStop(0,'#fff');r.addColorStop(.4,'#fff6a0');r.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=r;g.fillRect(0,0,32,32)}),blending:THREE.AdditiveBlending,transparent:true,depthWrite:false});
const flashT=cv(128,128,g=>{g.fillStyle='#fff';g.strokeStyle='#000';g.lineWidth=5;g.beginPath();for(let i=0;i<24;i++){const a=i/24*6.283,r=i%2?26:62;g.lineTo(64+Math.cos(a)*r,64+Math.sin(a)*r)}g.closePath();g.fill();g.stroke();});
const flashes=[];
function impact(pos,hard){for(let i=0;i<(hard?26:12);i++){const s=new THREE.Sprite(sparkM);s.position.copy(pos);s.scale.setScalar(.35);scene.add(s);sparks.push({s,v:new THREE.Vector3((Math.random()-.5)*9,Math.random()*7,(Math.random()-.5)*9),t:.5});}
 const f=new THREE.Sprite(new THREE.SpriteMaterial({map:flashT,transparent:true,depthTest:false,color:hard?0xbfe9ff:0xffffff}));f.position.copy(pos);scene.add(f);flashes.push({f,t:0,hard});
 if(hard){shake=.45;speed=.35;}else shake=Math.max(shake,.12);}
let shake=0,speed=0;
// pops
function pop(txt,pos,cls=''){const v=pos.clone().project(cam);const d=document.createElement('div');d.className='pop '+cls;d.textContent=txt;d.style.left=((v.x+1)/2*innerWidth)+'px';d.style.top=((1-v.y)/2*innerHeight)+'px';document.body.appendChild(d);setTimeout(()=>d.remove(),900);}
// audio
let AC=null,master;
function initAudio(){if(AC)return;AC=new(window.AudioContext||window.webkitAudioContext)();master=AC.createGain();master.gain.value=.5;master.connect(AC.destination);music();}
function tone(f,d,type='sine',vol=.3,slide=0,when=0){if(!AC)return;const t=AC.currentTime+when,o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(30,f*slide),t+d);g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(master);o.start(t);o.stop(t+d);}
function noise(d,vol=.3,hp=800){if(!AC)return;const b=AC.createBuffer(1,AC.sampleRate*d,AC.sampleRate),a=b.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=(Math.random()*2-1)*(1-i/a.length);const s=AC.createBufferSource();s.buffer=b;const f=AC.createBiquadFilter();f.type='highpass';f.frequency.value=hp;const g=AC.createGain();g.gain.value=vol;s.connect(f);f.connect(g);g.connect(master);s.start();}
const sfx={pop:()=>tone(660,.12,'sine',.35,1.8),thwack:()=>{noise(.15,.5,400);tone(180,.18,'square',.25,.4)},boing:()=>tone(220,.35,'sine',.35,2.5),whoosh:()=>noise(.3,.18,2000),point:()=>{[523,659,784,1046].forEach((f,i)=>tone(f,.15,'triangle',.2,1,i*.08))},combo:()=>tone(880,.2,'triangle',.3,1.5)};
function music(){const bass=[130.8,130.8,174.6,196,130.8,164.8,174.6,196],mel=[523,0,659,784,0,659,523,0,587,0,698,880,784,0,659,0];let step=0;const bpm=.18;
 setInterval(()=>{if(!AC||AC.state!=='running')return;if(step%2===0)tone(bass[(step/2|0)%8],.2,'triangle',.22,1);const m=mel[step%16];if(m)tone(m,.12,'square',.05);if(step%4===2)noise(.05,.08,5000);if(step%4===0)tone(90,.12,'sine',.3,.5);step++;},bpm*1000);}
// prediction
function landing(){const p=B.p,v=B.v;const a=.5*G,b=v.y,c=p.y-R;const t=(-b-Math.sqrt(b*b-4*a*c))/(2*a);return{t,x:p.x+v.x*t,z:p.z+v.z*t};}
function launch(tx,tz,T,from){const p=B.p;B.v.set((tx-p.x)/T,0,(tz-p.z)/T);B.v.y=(R-p.y-.5*G*T*T)/T;}
// hits
let score=[0,0],combo=0,serving=0,pause=0;
function hit(p,kind,aim){const opp=p.team?1:-1;// direction toward opponent z sign
 const lt=landing().t;const perfect=lt<.35&&lt>0;
 if(B.team!==p.team){B.team=p.team;B.touches=0;}B.touches++;B.last=p.i;
 let tx,tz,T;B.hard=false;
 if(kind==='spike'){aim=aim||{x:(Math.random()-.5),z:1};const n=Math.hypot(aim.x,aim.z)||1;tx=THREE.MathUtils.clamp(p.x+aim.x/n*7,-W+.3,W-.3);tz=-opp*-1*0+ (p.team?1:-1)*-(-1)*0;tz=(p.team? 1:-1)*THREE.MathUtils.clamp(3+Math.abs(aim.z/n)*5,2.5,L-.5);T=.42;B.hard=true;sfx.thwack();}
 else if(B.touches>=3||p.team!==0&&B.touches>=2&&Math.random()<.3){tx=(Math.random()-.5)*W*1.6;tz=(p.team?1:-1)*(2+Math.random()*5);T=1.25;sfx.boing();}
 else{const mates=players.filter(q=>q.team===p.team&&q!==p);const m=mates.sort((a,b)=>Math.abs(a.z)-Math.abs(b.z))[0];tx=m.x*.6;tz=(p.team?-1:1)*1.6;T=1.3;sfx.pop();}
 B.p.y=Math.max(B.p.y,.9);launch(tx,tz,T);tMat.uniforms.c.value.set(B.hard?0x4fa8ff:0x3fe08a);
 impact(B.p.clone(),B.hard);
 if(perfect||(kind==='spike'&&p.y>.8)){combo++;if(p.team===0){p.bd.material.map=badge(combo+1);p.bd.material.needsUpdate=true;p.bdT=1.5;sfx.combo();}}else if(p.team===0)combo=0;
 if(B.hard&&Math.random()<.6)pop(['Sho!','Bam!','Pow!'][Math.random()*3|0],B.p.clone());
 p.cd=.35;}
function serve(){resetPos();const s=players[serving?3:0];B.p.set(s.x,1.4,s.z+(serving?-0.5:0.5));B.v.set(0,7,0);B.live=true;B.team=-1;B.touches=0;trail.length=0;
 setTimeout(()=>{if(B.live&&B.team===-1){B.team=s.team;B.touches=2;B.p.set(s.x,1.6,s.z);launch((Math.random()-.5)*W,(s.team?1:-1)*(3+Math.random()*4),1.4);sfx.boing();}},700);}
function point(t){score[t]++;B.live=false;sfx.point();shake=.25;document.getElementById('score').textContent=score[0]+' - '+score[1];
 pop(t===0?'Point !':'Ouch!',B.p.clone().setY(1.5));serving=t;combo=0;renderDots();
 pause=1.4;if(score[t]>=11){setTimeout(()=>{pop(t===0?'VICTOIRE !':'Perdu...',new THREE.Vector3(0,3,0),'mul');score=[0,0];document.getElementById('score').textContent='0 - 0';renderDots();},500);pause=3;}}
function renderDots(){const d=document.getElementById('dots');d.innerHTML='';for(let i=0;i<11;i++){const e=document.createElement('i');if(i<score[0])e.style.background='#3ecf5a';else if(i>=11-score[1])e.style.background='#ff6fae';d.appendChild(e);}}
renderDots();
// input (gestures)
const me=players[0];let touch=null,holdTarget=null,ftrail=[];const ray=new THREE.Raycaster(),floor=new THREE.Plane(new THREE.Vector3(0,1,0),0);
function toFloor(x,y){ray.setFromCamera({x:x/innerWidth*2-1,y:-(y/innerHeight)*2+1},cam);const v=new THREE.Vector3();return ray.ray.intersectPlane(floor,v)?v:null;}
function jumpMe(){if(me.y<.05&&me.state==='run'){me.vy=7.2;sfx.whoosh();}}
function ballNear(p,r=2.6){return Math.hypot(B.p.x-p.x,B.p.z-p.z)<r&&B.p.y<4.5;}
function dash(p,dx,dz,kind){const n=Math.hypot(dx,dz)||1;p.state=kind;p.st=kind==='dive'?.55:.35;const s=kind==='dive'?11:13;p.vx=dx/n*s;p.vz=dz/n*s;sfx.whoosh();if(kind==='dive')pop('Hop!',new THREE.Vector3(p.x,1.5,p.z));}
let tutoShown=false;
addEventListener('touchstart',e=>{e.preventDefault();start();if(e.touches.length>=2){dashMeSide();touch=null;return}const t=e.changedTouches[0];touch={x0:t.clientX,y0:t.clientY,x:t.clientX,y:t.clientY,t0:performance.now(),moved:false};ftrail.push({x:t.clientX,y:t.clientY,a:1});},{passive:false});
addEventListener('touchmove',e=>{e.preventDefault();if(!touch)return;const t=e.changedTouches[0];touch.x=t.clientX;touch.y=t.clientY;if(Math.hypot(touch.x-touch.x0,touch.y-touch.y0)>12)touch.moved=true;ftrail.push({x:t.clientX,y:t.clientY,a:1});},{passive:false});
addEventListener('touchend',e=>{e.preventDefault();if(!touch)return;const dt=performance.now()-touch.t0,dx=touch.x-touch.x0,dy=touch.y-touch.y0,d=Math.hypot(dx,dy);
 if(d<15&&dt<250)jumpMe();
 else if(d>40&&dt<350){ // swipe
  const wdx=dx/d,wdz=dy/d; // screen up = -z (toward opponent)
  if(ballNear(me)){me.pendingSpike={x:wdx,z:wdz};if(me.y<.05)me.vy=7.6;}
  else if(Math.abs(dx)>Math.abs(dy)*1.5&&d<140)dash(me,Math.sign(dx),0,'slide');
  else dash(me,wdx,wdz,'dive');}
 touch=null;},{passive:false});
function dashMeSide(){const dx=B.p.x-me.x;dash(me,Math.sign(dx)||1,0,'slide');}
['gesturestart','dblclick','contextmenu'].forEach(ev=>addEventListener(ev,e=>e.preventDefault()));
// mouse for desktop testing
let md=null;addEventListener('mousedown',e=>{start();md={x0:e.clientX,y0:e.clientY,x:e.clientX,y:e.clientY,t0:performance.now()};touch=md;});addEventListener('mousemove',e=>{if(md){md.x=e.clientX;md.y=e.clientY;}});addEventListener('mouseup',e=>{if(md){const t=md;touch=t;dispatchEnd(t);md=null;touch=null}});
function dispatchEnd(t){const dt=performance.now()-t.t0,dx=t.x-t.x0,dy=t.y-t.y0,d=Math.hypot(dx,dy);if(d<15&&dt<250)jumpMe();else if(d>40&&dt<350){if(ballNear(me)){me.pendingSpike={x:dx/d,z:dy/d};if(me.y<.05)me.vy=7.6}else dash(me,dx/d,dy/d,'dive');}}
addEventListener('keydown',e=>{start();if(e.code==='Space')jumpMe();});
let started=false;function start(){initAudio();if(AC&&AC.state==='suspended')AC.resume();if(started)return;started=true;document.getElementById('start').style.display='none';
 if(!localStorage.getItem('sv_tuto')){const t=document.getElementById('tuto');t.style.display='block';setTimeout(()=>t.style.display='none',3500);localStorage.setItem('sv_tuto','1');}serve();}
// AI
function ai(p,dt,land){const side=p.team?-1:1;const onMySide=Math.sign(land.z)===side;const h=home[p.i%3];
 const mates=players.filter(q=>q.team===p.team&&!q.me);
 let chaser=null;if(onMySide&&B.live){const cands=players.filter(q=>q.team===p.team);chaser=cands.sort((a,b)=>Math.hypot(a.x-land.x,a.z-land.z)-Math.hypot(b.x-land.x,b.z-land.z))[0];if(p.team===0&&chaser.me&&Math.hypot(me.x-land.x,me.z-land.z)>2.5)chaser=mates.sort((a,b)=>Math.hypot(a.x-land.x,a.z-land.z)-Math.hypot(b.x-land.x,b.z-land.z))[0];}
 if(chaser===p){p.tx=land.x;p.tz=land.z+side*.3;const d=Math.hypot(p.x-land.x,p.z-land.z);if(d>2.2&&land.t<.4&&p.state==='run')dash(p,land.x-p.x,land.z-p.z,'dive');}
 else{p.tx=h[0]*side+(B.p.x*.25);p.tz=h[1]*side;}
 if(p.cd<=0&&B.live&&B.team!==p.team||B.touches<3&&B.last!==p.i){const d=Math.hypot(B.p.x-p.x,B.p.z-p.z);
  if(B.live&&p.cd<=0&&d<1.2&&B.p.y<2.6+p.y&&B.v.y<0&&!(B.team===p.team&&B.last===p.i)){
   if(B.team===p.team&&B.touches===2&&Math.abs(p.z)<4&&Math.random()<.8&&p.y<.05){p.vy=7.4;p.pendingSpike={x:(Math.random()-.5)*1.2,z:-side};}
   else hit(p,'bump');}}
 if(p.pendingSpike&&p.y>.6&&Math.hypot(B.p.x-p.x,B.p.z-p.z)<1.8&&B.p.y>1.8){hit(p,'spike',{x:p.pendingSpike.x,z:p.pendingSpike.z});p.pendingSpike=null;}}
// loop
let lastT=performance.now(),camX=0,camZ=0;
function step(dt){const land=B.live?landing():{x:0,z:0,t:9};
 players.forEach(p=>{p.cd-=dt;
  if(p.state!=='run'){p.st-=dt;p.x+=p.vx*dt;p.z+=p.vz*dt;p.vx*=.93;p.vz*=.93;if(p.st<=0)p.state='run';}
  else{if(p.me){if(touch&&(touch.moved||performance.now()-touch.t0>180)){const v=toFloor(touch.x,touch.y);if(v){p.tx=v.x;p.tz=v.z}}else{p.tx=p.x;p.tz=p.z}}else ai(p,dt,land);
   const dx=p.tx-p.x,dz=p.tz-p.z,d=Math.hypot(dx,dz),spd=p.me?7.5:6.4;if(d>.05){const m=Math.min(d,spd*dt);p.x+=dx/d*m;p.z+=dz/d*m;}}
  if(p.me&&!p.cd||p.me&&p.cd<=0){const d=Math.hypot(B.p.x-p.x,B.p.z-p.z),reach=p.state==='dive'||p.state==='slide'?1.7:1.25;
   if(B.live&&d<reach&&B.p.y<2.4+p.y&&B.p.y>.1&&!(B.team===0&&B.last===0)&&B.touches<3+(B.team!==0?3:0)){if(p.pendingSpike&&p.y>.5){hit(p,'spike',{x:p.pendingSpike.x,z:p.pendingSpike.z});p.pendingSpike=null}else if(B.v.y<0||B.team!==0)hit(p,'bump');}}
  p.vy+=G*.9*dt;p.y+=p.vy*dt;if(p.y<0){p.y=0;p.vy=0;if(p.pendingSpike&&!p.me)p.pendingSpike=null;}
  const side=p.team?-1:1;p.z=side>0?THREE.MathUtils.clamp(p.z,.4,L+1.5):THREE.MathUtils.clamp(p.z,-L-1.5,-.4);p.x=THREE.MathUtils.clamp(p.x,-W-1.5,W+1.5);
  const lie=p.state==='dive';p.sp.position.set(p.x,p.y+(lie?.0:0),p.z);p.sp.material.rotation=lie?(p.vx>=0?-1.3:1.3):p.state==='slide'?(p.vx>0?-.4:.4):0;p.sp.scale.set(.85,lie?.85:1.08,1);
  p.tg.position.set(p.x,p.y+1.2,p.z);p.ring.position.set(p.x,.02,p.z);p.bdT-=dt;p.bd.visible=p.bdT>0;p.bd.position.set(p.x-.55,p.y+1.33,p.z);p.sh.position.set(p.x,.015,p.z);p.ring.material.opacity=.9;});
 if(B.live){B.v.y+=G*dt;B.p.addScaledVector(B.v,dt);
  // net
  if(Math.abs(B.p.z)<R+.05&&B.p.y<NETH&&Math.abs(B.p.x)<W+.4){B.v.z*=-.4;B.p.z=Math.sign(B.v.z||1)*(R+.06);sfx.boing();}
  if(B.p.y<=R){B.p.y=R;impact(B.p.clone(),false);const inC=Math.abs(B.p.x)<=W&&Math.abs(B.p.z)<=L;const side=B.p.z>0?0:1;
   if(inC)point(1-side);else point(B.team===0?1:0);}
  ball.rotation.x+=dt*8;}
 else if(pause>0){pause-=dt;if(pause<=0&&started)serve();}
 ball.position.copy(B.p);bsh.position.set(B.p.x,.02,B.p.z);bsh.scale.setScalar(1+B.p.y*.1);
 // reticle
 ret.visible=B.live&&land.t>0&&land.t<3;if(ret.visible){ret.position.set(land.x,0,land.z);const k=THREE.MathUtils.clamp(land.t/1.2,0,1);retOut.scale.setScalar(.6+k*1.6);retOut.material.color.set(land.t<.35?0xff9a3c:0xffffff);}
 // trail
 trail.unshift(B.p.clone());if(trail.length>TN)trail.pop();const pos=tGeo.attributes.position.array;const w=B.hard?.45:.38;
 for(let i=0;i<TN;i++){const q=trail[Math.min(i,trail.length-1)]||B.p;const j=TN-1-i;const ww=w*(1-i/TN);pos.set([q.x,q.y+ww,q.z,q.x,q.y-ww,q.z],j*6);}tGeo.attributes.position.needsUpdate=true;
 sparks.forEach(s=>{s.t-=dt;s.v.y+=G*.5*dt;s.s.position.addScaledVector(s.v,dt);s.s.scale.setScalar(Math.max(.01,s.t*.8));if(s.t<=0)scene.remove(s.s)});for(let i=sparks.length-1;i>=0;i--)if(sparks[i].t<=0)sparks.splice(i,1);
 flashes.forEach(f=>{f.t+=dt;const k=f.hard?2.6:1.5;f.f.scale.setScalar(k*(.4+f.t*5));f.f.material.opacity=1-f.t*5;f.f.material.rotation+=dt*3;if(f.t>.2)scene.remove(f.f)});for(let i=flashes.length-1;i>=0;i--)if(flashes[i].t>.2)flashes.splice(i,1);
 // camera: high angle, portrait-friendly, slight pan
 const portrait=innerWidth<innerHeight;const fx_=me.x*.7+B.p.x*.15,fz_=me.z*.85+B.p.z*.05;camX+=(fx_-camX)*dt*3;camZ+=(fz_-camZ)*dt*3;
 shake=Math.max(0,shake-dt);const sx=(Math.random()-.5)*shake*.6,sy=(Math.random()-.5)*shake*.6;
 const back=portrait?8.8:7,up=portrait?5.2:4.5;cam.position.set(camX+sx,up+sy,camZ+back);cam.lookAt(camX*.8,.6,camZ-(portrait?5:7));}
function draw2d(dt){fc.clearRect(0,0,fx.width,fx.height);
 // speed lines
 if(speed>0){speed-=dt;const cx=fx.width/2,cy=fx.height/2;fc.strokeStyle='rgba(0,0,0,'+(speed*1.5)+')';fc.lineWidth=2;for(let i=0;i<40;i++){const a=Math.random()*6.283,r1=Math.min(cx,cy)*(.6+Math.random()*.3),r2=Math.max(cx,cy)*1.3;fc.beginPath();fc.moveTo(cx+Math.cos(a)*r1,cy+Math.sin(a)*r1);fc.lineTo(cx+Math.cos(a)*r2,cy+Math.sin(a)*r2);fc.stroke();}}
 // finger trail
 for(const p of ftrail)p.a-=dt*3;ftrail=ftrail.filter(p=>p.a>0).slice(-30);if(ftrail.length>1){fc.lineCap='round';for(let i=1;i<ftrail.length;i++){fc.strokeStyle='rgba(95,216,255,'+ftrail[i].a*.5+')';fc.lineWidth=10*ftrail[i].a;fc.beginPath();fc.moveTo(ftrail[i-1].x,ftrail[i-1].y);fc.lineTo(ftrail[i].x,ftrail[i].y);fc.stroke();}}}
function loop(now){const dt=Math.min(.033,(now-lastT)/1000);lastT=now;step(dt);renderer.render(scene,cam);draw2d(dt);requestAnimationFrame(loop);}
resetPos();requestAnimationFrame(loop);
window.__sv={B,players,score:()=>score,start};
