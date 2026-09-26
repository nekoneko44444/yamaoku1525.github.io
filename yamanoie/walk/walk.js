import * as THREE from 'three';
import {GLTFLoader} from '../3d/vendor/GLTFLoader.js';
import {WalkWorld,movementVector} from './movement.mjs?v=60b3682816cb';
import {Nagika} from './avatar.js?v=60b3682816cb';

const $=id=>document.getElementById(id);
const stage=$('stage'),keys=new Set(),touch={forward:0,right:0,turn:0};
let renderer,scene,camera,world,position,yaw=0,pitch=0,eye=1.48;
let ready=false,busy=false,lost=false,dirty=true,light=matchMedia('(pointer:coarse),(max-width:700px)').matches;
let last=0,sim=0,diagnosticTime=0,model,drag=null,padPointer=null;
let avatar,viewMode='follow',demoRoute=[],demoIndex=0,demo=false,renderedAt=0,walkYaw=0,cameraDistance=2.6;
const velocity={x:0,z:0},raycaster=new THREE.Raycaster();
const controller=new AbortController(),{signal}=controller;

function clearInput(){keys.clear();touch.forward=touch.right=touch.turn=0;velocity.x=velocity.z=0;drag=null;padPointer=null;$('stick').style.transform='';}
function showError(message){ready=false;stopDemo();$('loading').hidden=true;$('error').hidden=false;$('error-text').textContent=message;stage.dataset.state='error';}
function dispose(){
  ready=false;clearInput();renderer?.setAnimationLoop(null);
  avatar?.dispose();avatar=null;
  if(model){const textures=new Set(),materials=new Set();model.traverse(o=>{o.geometry?.dispose();for(const m of (Array.isArray(o.material)?o.material:[o.material])){if(!m)continue;materials.add(m);for(const v of Object.values(m))if(v?.isTexture)textures.add(v);}});textures.forEach(t=>t.dispose());materials.forEach(m=>m.dispose());}
  renderer?.dispose();renderer?.domElement.remove();renderer=null;model=null;scene=null;
}
function setSpawn(id){
  const s=world.data.spawns.find(p=>p.id===id);
  if(!s||!world.canStand(s.x,s.z))throw new Error('確認済みの開始位置が通れません: '+id);
  setView('follow');clearInput();position={x:s.x,z:s.z,floor:world.floor(s.x,s.z).height};yaw=s.yaw;pitch=0;eye=position.floor+world.data.eyeHeight;sim=0;last=0;dirty=true;cameraDistance=2.6;avatar?.reset(position,yaw);updateCamera();drawMap();
}
function setView(mode){
  if(viewMode==='portrait'&&mode!=='portrait')yaw=walkYaw;
  if(mode==='portrait'&&viewMode!=='portrait'){walkYaw=yaw;yaw=-avatar.heading;pitch=0;}
  viewMode=mode;stage.dataset.view=mode;$('view-mode').textContent=mode==='eyes'?'なぎかと歩く':'自分の目線にする';$('portrait').textContent=mode==='portrait'?'さんぽに戻る':'なぎかを見る';dirty=true;
}
function updateCamera(){
  if(viewMode==='eyes'){
    camera.position.set(position.x,eye,position.z);camera.rotation.order='YXZ';camera.rotation.set(pitch,-yaw,0);if(avatar){avatar.root.visible=false;avatar.shadow.visible=false;}
  }else{
    const target=new THREE.Vector3(position.x,position.floor+.92,position.z);
    const boom=viewMode==='portrait'?2.0:2.6;
    const desired=new THREE.Vector3(position.x-Math.sin(yaw)*boom,position.floor+1.32-pitch*.75,position.z+Math.cos(yaw)*boom);
    const offset=desired.clone().sub(target),length=offset.length(),direction=offset.clone().normalize();let distance=length;
    // Check the actual rendered walls, furniture and ceiling, with a small
    // camera margin. Keep the camera inside the modeled floor regions too.
    raycaster.near=0;raycaster.far=length;
    for(const shift of [new THREE.Vector3(),new THREE.Vector3(.09,0,0),new THREE.Vector3(-.09,0,0),new THREE.Vector3(0,.07,0)]){
      raycaster.set(target.clone().add(shift),direction);const hit=raycaster.intersectObject(model,true)[0];if(hit)distance=Math.min(distance,Math.max(.12,hit.distance-.12));
    }
    for(let d=.15;d<=distance;d+=.08){const p=target.clone().addScaledVector(direction,d);if(!world.floor(p.x,p.z)){distance=Math.max(.12,d-.10);break;}}
    cameraDistance=Math.min(distance,cameraDistance+(distance-cameraDistance)*.12);
    camera.position.copy(target).addScaledVector(direction,cameraDistance);camera.lookAt(target);
    if(avatar){avatar.root.visible=distance>.48;avatar.shadow.visible=avatar.root.visible;}
  }
  const floor=world.floor(position.x,position.z);$('place-name').textContent=floor?.label??'山の家';
}
function resize(){if(!renderer)return;const w=stage.clientWidth,h=stage.clientHeight;renderer.setPixelRatio(light?1:Math.min(devicePixelRatio,1.5));renderer.setSize(w,h,false);camera.aspect=w/h;camera.fov=w<h?68:62;camera.updateProjectionMatrix();dirty=true;}
function drawMap(){
  if($('map-content').hidden||!world)return;
  const c=$('map').getContext('2d'),scale=32,ox=393,oy=113;
  c.clearRect(0,0,660,216);
  const rect=o=>[(o.minX*scale+ox),(o.minZ*scale+oy),(o.maxX-o.minX)*scale,(o.maxZ-o.minZ)*scale];
  c.fillStyle='#f4e7bd22';c.strokeStyle='#c7d3b477';c.lineWidth=1.5;
  for(const f of world.data.floors){c.fillRect(...rect(f));c.strokeRect(...rect(f));}
  c.fillStyle='#eadcba55';for(const o of world.data.obstacles)c.fillRect(...rect(o));
  c.save();c.translate(position.x*scale+ox,position.z*scale+oy);c.rotate(yaw);c.fillStyle='#eed191';c.beginPath();c.moveTo(0,-16);c.lineTo(-10,9);c.lineTo(0,5);c.lineTo(10,9);c.closePath();c.fill();c.restore();
}
function tick(time){
  if(!ready||lost||document.hidden){last=0;return;}
  if(!last)last=time;
  const dt=Math.min((time-last)/1000,.10);last=time;sim+=dt;
  let moving=false;
  while(sim>=1/60){
    let f=Number(keys.has('KeyW')||keys.has('ArrowUp'))-Number(keys.has('KeyS')||keys.has('ArrowDown'))+touch.forward;
    let r=Number(keys.has('KeyD')||keys.has('ArrowRight'))-Number(keys.has('KeyA')||keys.has('ArrowLeft'))+touch.right;
    if((f||r)&&viewMode==='portrait')setView('follow');
    if((f||r)&&demo)stopDemo();
    const turn=Number(keys.has('KeyE'))-Number(keys.has('KeyQ'))+touch.turn;yaw+=turn*1.6/60;dirty ||= !!turn;
    const speed=(keys.has('ShiftLeft')||keys.has('ShiftRight'))?.38:.58;
    const v=movementVector(f,r,yaw,speed,1/60);
    if(demo&&demoRoute.length){
      let goal=demoRoute[demoIndex],dx=goal.x-position.x,dz=goal.z-position.z,d=Math.hypot(dx,dz);
      if(d<.012){demoIndex++;if(demoIndex>=demoRoute.length){stopDemo();}else {goal=demoRoute[demoIndex];dx=goal.x-position.x;dz=goal.z-position.z;d=Math.hypot(dx,dz);}}
      if(demo){const step=Math.min(.50/60,d);v.dx=dx/d*step;v.dz=dz/d*step;const targetYaw=Math.atan2(dx,-dz);yaw+=Math.atan2(Math.sin(targetYaw-yaw),Math.cos(targetYaw-yaw))*.10;}
      velocity.x=v.dx*60;velocity.z=v.dz*60;
    }else{const a=1-Math.exp(-12/60);velocity.x+=(v.dx*60-velocity.x)*a;velocity.z+=(v.dz*60-velocity.z)*a;if(Math.hypot(velocity.x,velocity.z)<.001)velocity.x=velocity.z=0;}
    if(velocity.x||velocity.z){const next=world.move(position,velocity.x/60,velocity.z/60);moving ||= Math.hypot(next.x-position.x,next.z-position.z)>.0001;position=next;}
    // Smooth the existing 0.12 / 0.18 steps; no head bob or jumping.
    const rise=position.floor+world.data.eyeHeight-eye;dirty ||= Math.abs(rise)>.0001;eye+=rise*(1-Math.exp(-12/60));sim-=1/60;
    avatar?.update(position,1/60);
  }
  const label=(avatar?.planner.speed??0)>.015?'歩く':'立ち止まる';if($('motion-state').textContent!==label)$('motion-state').textContent=label;
  if((dirty||moving||avatar)&&(!light||time-renderedAt>31)){updateCamera();drawMap();renderer.render(scene,camera);dirty=false;renderedAt=time;}
  if(time-diagnosticTime>250){diagnosticTime=time;const d={x:+position.x.toFixed(3),z:+position.z.toFixed(3),yaw:+yaw.toFixed(3),floor:position.floor,canStand:world.canStand(position.x,position.z),drawCalls:renderer.info.render.calls,triangles:renderer.info.render.triangles,quality:light?'light':'standard',avatar:!!avatar,viewMode,steps:avatar?.planner.steps,footReachError:avatar?.error,feet:avatar?.planner.feet.map(f=>({lift:+f.lift.toFixed(3),planted:!f.swing})),demo,demoIndex};stage.dataset.position=JSON.stringify(d);$('diagnostic').textContent=JSON.stringify(d);}
}
async function start(){
  if(busy)return;busy=true;ready=false;$('welcome').hidden=true;$('error').hidden=true;$('loading').hidden=false;$('hud').hidden=true;stage.dataset.state='loading';
  try{
    dispose();lost=false;
    const res=await fetch('./navigation.json?v=60b3682816cb');if(!res.ok)throw new Error('歩行データを取得できません');world=new WalkWorld(await res.json());
    renderer=new THREE.WebGLRenderer({antialias:!light,powerPreference:'default'});
    renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
    $('scene').append(renderer.domElement);
    scene=new THREE.Scene();scene.background=new THREE.Color('#dfe5df');camera=new THREE.PerspectiveCamera(66,1,.035,80);
    scene.add(new THREE.HemisphereLight(0xf2f2e8,0x656050,1.55));
    const sun=new THREE.DirectionalLight(0xffe8ca,1.25);sun.position.set(-10,18,8);scene.add(sun);
    const fill=new THREE.DirectionalLight(0xcce5ff,.7);fill.position.set(6,4,-2);scene.add(fill);
    for(const [x,y,z] of [[-2.55,-.4,3.36],[.6,1.35,3.3],[3.65,.1,3.15],[-6.2,-1.2,2.11],[-9.6,-1.25,2.1]]){const l=new THREE.PointLight(0xffe7c1,14,9,2);l.position.set(x,z,-y);scene.add(l);}
    renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();lost=true;light=true;showError('ブラウザーが描画を中断しました。復帰すれば自動で開き直します。戻らない場合は再試行できます。');});
    renderer.domElement.addEventListener('webglcontextrestored',()=>{if(lost){lost=false;light=true;start();}});
    const gltf=await new GLTFLoader().loadAsync('../3d/yamanoie-illustrated.glb?v=87efa2f094a8322f',e=>{$('progress').textContent=`読み込み ${Math.floor(Math.min(1,e.loaded/4332664)*100)}% · 表示を準備中`;});
    model=gltf.scene;model.traverse(o=>{if(!o.isMesh)return;for(const m of(Array.isArray(o.material)?o.material:[o.material])){m.side=THREE.DoubleSide;if('transmission'in m)m.transmission=0;if(/glass/i.test(m.name)){m.color.set('#c4d1ca');m.roughness=.8;m.metalness=0;m.emissive.set('#68766f');m.emissiveIntensity=.12;m.transparent=true;m.opacity=.25;m.depthWrite=false;}m.needsUpdate=true;}});scene.add(model);
    const manifestResponse=await fetch('./nagika-manifest.json?v=60b3682816cb');if(!manifestResponse.ok)throw new Error('なぎかのモデル情報を読み込めません');const manifest=await manifestResponse.json();
    const character=await new GLTFLoader().loadAsync('./nagika.glb?v='+manifest.sha256.slice(0,12),e=>{$('progress').textContent=`なぎかちゃんを準備中 ${Math.floor(Math.min(1,e.loaded/manifest.bytes)*100)}%`;});
    avatar=new Nagika(character.scene,world);scene.add(avatar.root,avatar.shadow);
    const routeResponse=await fetch('./demo-route.json?v=60b3682816cb');if(routeResponse.ok)demoRoute=(await routeResponse.json()).points;
    $('places').replaceChildren();for(const p of world.data.spawns){const b=document.createElement('button');b.textContent=p.label;b.onclick=()=>{stopDemo();setSpawn(p.id);stage.focus({preventScroll:true});};$('places').append(b);}
    setSpawn('entry');resize();if(lost)throw new Error('読み込み中に3Dの描画が中断されました。再試行してください。');ready=true;stage.dataset.state='ready';$('loading').hidden=true;$('hud').hidden=false;stage.focus({preventScroll:true});renderer.setAnimationLoop(tick);
  }catch(e){console.error(e);showError(e.message||'通信と、このブラウザーの3D対応を確認して再試行してください。');}
  finally{busy=false;}
}

$('start').onclick=start;$('retry').onclick=()=>{light=true;start();};$('home').onclick=()=>{if(ready){stopDemo();setSpawn('entry');stage.focus({preventScroll:true});}};
function stopDemo(){demo=false;$('demo').textContent='歩く様子を見る';clearInput();}
$('demo').onclick=()=>{if(!ready)return;if(demo){stopDemo();return;}setSpawn('entry');demoIndex=0;demo=true;$('demo').textContent='さんぽを止める';stage.focus({preventScroll:true});};
$('view-mode').onclick=()=>{setView(viewMode==='eyes'?'follow':'eyes');stage.focus({preventScroll:true});};
$('portrait').onclick=()=>{if(!ready)return;stopDemo();setView(viewMode==='portrait'?'follow':'portrait');stage.focus({preventScroll:true});};
$('help-toggle').onclick=()=>{$('guide').hidden=!$('guide').hidden;$('help-toggle').setAttribute('aria-expanded',String(!$('guide').hidden));clearInput();};
$('map-toggle').onclick=()=>{$('map-content').hidden=!$('map-content').hidden;$('map-toggle').setAttribute('aria-expanded',String(!$('map-content').hidden));$('map-toggle').lastElementChild.textContent=$('map-content').hidden?'＋':'−';drawMap();};
$('map-toggle').click();
const controls=new Set(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowLeft','ArrowDown','ArrowRight','KeyQ','KeyE','ShiftLeft','ShiftRight']);
stage.addEventListener('keydown',e=>{if(!ready||e.altKey||e.ctrlKey||e.metaKey||e.target.closest('button,a'))return;if(controls.has(e.code)){e.preventDefault();keys.add(e.code);}}, {signal});
window.addEventListener('keyup',e=>keys.delete(e.code),{signal});window.addEventListener('blur',clearInput,{signal});document.addEventListener('visibilitychange',()=>{clearInput();last=0;sim=0;},{signal});
stage.addEventListener('focusout',e=>{if(!stage.contains(e.relatedTarget))clearInput();},{signal});
new ResizeObserver(resize).observe(stage);
$('scene').addEventListener('pointerdown',e=>{if(!ready||drag||e.button!==0)return;drag={id:e.pointerId,x:e.clientX,y:e.clientY};e.currentTarget.setPointerCapture(e.pointerId);stage.focus({preventScroll:true});});
$('scene').addEventListener('pointermove',e=>{if(drag?.id!==e.pointerId)return;yaw+=(e.clientX-drag.x)*.004;pitch=THREE.MathUtils.clamp(pitch-(e.clientY-drag.y)*.004,-1.15,1.15);drag.x=e.clientX;drag.y=e.clientY;dirty=true;});
for(const event of ['pointerup','pointercancel','lostpointercapture'])$('scene').addEventListener(event,e=>{if(drag?.id===e.pointerId)drag=null;});
function pad(e){const b=$('joystick').getBoundingClientRect(),limit=b.width*.31;let x=e.clientX-b.left-b.width/2,y=e.clientY-b.top-b.height/2;const length=Math.hypot(x,y);if(length>limit){x*=limit/length;y*=limit/length;}touch.right=x/limit;touch.forward=-y/limit;$('stick').style.transform=`translate(${x}px,${y}px)`;}
$('joystick').addEventListener('pointerdown',e=>{if(!ready||padPointer!==null)return;padPointer=e.pointerId;e.currentTarget.setPointerCapture(e.pointerId);stage.focus({preventScroll:true});pad(e);});
$('joystick').addEventListener('pointermove',e=>{if(e.pointerId===padPointer)pad(e);});
for(const event of ['pointerup','pointercancel','lostpointercapture'])$('joystick').addEventListener(event,e=>{if(e.pointerId===padPointer){padPointer=null;touch.forward=touch.right=0;$('stick').style.transform='';}});
for(const [id,direction] of [['turn-left',-1],['turn-right',1]]){const b=$(id);b.onpointerdown=e=>{b.setPointerCapture(e.pointerId);touch.turn=direction;};for(const event of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(event,()=>touch.turn=0);b.onclick=e=>{if(e.detail===0){yaw+=direction*.25;dirty=true;}};}
window.addEventListener('pagehide',dispose);
window.addEventListener('pageshow',e=>{if(e.persisted)start();});

// Local QA only. Exercise the same real context-loss events that phones emit.
if(new URLSearchParams(location.search).has('qa')){
  const b=document.createElement('button');b.textContent='QA: 描画の中断と復帰';b.style.cssText='position:absolute;bottom:16px;right:22px;z-index:10;padding:12px';
  b.onclick=()=>{if(!ready)return;const ext=renderer.getContext().getExtension('WEBGL_lose_context');if(!ext)throw new Error('Context-loss simulation is unavailable');ext.loseContext();setTimeout(()=>ext.restoreContext(),600);};stage.append(b);
}
