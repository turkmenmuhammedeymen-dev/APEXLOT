import * as THREE from 'three';

const canvas=document.querySelector('#world');
const scene=new THREE.Scene();
scene.background=new THREE.Color(0x83c9ef);
scene.fog=new THREE.Fog(0x9bd4f2,190,520);
const camera=new THREE.PerspectiveCamera(68,innerWidth/innerHeight,.1,900);
const renderer=new THREE.WebGLRenderer({canvas,antialias:false,powerPreference:'high-performance',alpha:false});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.25));
renderer.setSize(innerWidth,innerHeight);
renderer.shadowMap.enabled=false;
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.15;

scene.add(new THREE.HemisphereLight(0xe5f6ff,0x7d936c,2.0));
const sun=new THREE.DirectionalLight(0xfff1d5,2.6);
sun.position.set(-90,140,70);scene.add(sun);

const mat=(color,roughness=.8,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
const M={
 grass:mat(0x79a95e),road:mat(0x424b51),line:mat(0xf6e9b8),sidewalk:mat(0xd2d2c7),
 glass:mat(0x8fc5d8,.18,.32),tower:mat(0xd8d6ce),stone:mat(0xe6ddca),roof:mat(0x626b70),
 white:mat(0xf1eee6,.28,.2),black:mat(0x151c22,.35,.25),chrome:mat(0xc4d0d6,.2,.85),
 tire:mat(0x17191b,.95),wood:mat(0x79543a),door:mat(0x4c3528),pool:mat(0x43b8d4,.18,.3),
 green:mat(0x2f6d3c),gold:mat(0xd6b46b,.24,.8),interior:mat(0x292b2d,.8)
};
const boxGeo=new THREE.BoxGeometry(1,1,1);
function box(parent,w,h,d,material,x,y,z){const mesh=new THREE.Mesh(boxGeo,material);mesh.scale.set(w,h,d);mesh.position.set(x,y,z);mesh.castShadow=false;mesh.receiveShadow=false;parent.add(mesh);return mesh}
function group(parent=scene,x=0,y=0,z=0){const g=new THREE.Group();g.position.set(x,y,z);parent.add(g);return g}
const ground=new THREE.Mesh(new THREE.PlaneGeometry(900,900),M.grass);ground.rotation.x=-Math.PI/2;ground.position.y=-.18;scene.add(ground);

function road(x,z,w,d){box(scene,w,.16,d,M.road,x,0,z);if(w>d){box(scene,w,.025,.25,M.line,x,.09,z);for(let p=-w/2+5;p<w/2;p+=13)box(scene,5,.03,.16,M.line,x+p,.1,z)}else{box(scene,.25,.025,d,M.line,x,.09,z);for(let p=-d/2+5;p<d/2;p+=13)box(scene,.16,.03,5,M.line,x,.1,z+p)}}
road(0,0,310,19);road(0,0,19,310);road(0,-76,260,15);road(0,76,260,15);road(-76,0,15,260);road(76,0,15,260);
for(const x of [-145,-105,-47,47,105,145])road(x,0,9,255);
for(const z of [-145,-105,-47,47,105,145])road(0,z,255,9);
function tree(x,z,s=1){const g=group(scene,x,0,z);const trunk=mat(0x79543a);box(g,.55,3*s,.55,trunk,0,1.5*s,0);for(let i=0;i<3;i++){const crown=new THREE.Mesh(new THREE.SphereGeometry((2.0-i*.22)*s,7,6),M.green);crown.position.set(0,(3.4+i*.65)*s,0);g.add(crown)}}
for(let x=-180;x<=180;x+=18){tree(x,-17,.8);tree(x,17,.8);tree(x,-91,1);tree(x,91,1)}
function windows(parent,w,h,d,floors,cols){for(let f=0;f<floors;f++)for(let c=0;c<cols;c++){const x=-w/2+1.6+c*(w-3.2)/Math.max(1,cols-1);const y=2.2+f*3.15;box(parent,1.35,1.65,.06,M.glass,x,y,d/2+.04);box(parent,1.35,1.65,.06,M.glass,x,y,-d/2-.04)}}
const interactables=[];
function tower(x,z,w,d,h){const g=group(scene,x,0,z);box(g,w,h,d,M.tower,0,h/2,0);box(g,w+.8,.7,d+.8,M.roof,0,h+.35,0);windows(g,w,h,d,Math.floor(h/3.15)-1,Math.max(2,Math.floor(w/3.3)));box(g,w+.4,1.2,d+.4,M.stone,0,.6,0);box(g,2.5,3.2,.16,M.door,0,1.65,d/2+.13);box(g,3.5,.3,.3,M.gold,0,3.35,d/2+.25);interactables.push({x,z,doorZ:z+d/2+3,type:'tower',name:'SKYLINE RESIDENCE',floors:Math.max(5,Math.floor(h/3))});}
function villa(x,z,w=19,d=15){const g=group(scene,x,0,z);box(g,w,5.5,d,M.stone,0,2.75,0);const roof= new THREE.Mesh(new THREE.ConeGeometry(w*.78,3.5,4),M.roof);roof.rotation.y=Math.PI/4;roof.position.set(0,7,0);g.add(roof);for(let a of [-w*.28,0,w*.28])box(g,3.1,2.4,.12,M.glass,a,2.8,d/2+.08);box(g,2.2,3,.2,M.door,0,1.5,d/2+.15);box(g,w+7,.2,d+8,M.sidewalk,0,.05,0);const pool=box(g,w*.48,.35,d*.22,M.pool,-w*.68,.22,-d*.12);pool.rotation.y=.1;interactables.push({x,z,doorZ:z+d/2+3,type:'villa',name:'PRIVATE VILLA',floors:2});}
function mansion(x,z){const g=group(scene,x,0,z);box(g,29,8,22,M.stone,0,4,0);box(g,31,1,24,M.roof,0,8.5,0);for(const xx of [-10,-5,0,5,10]){box(g,2.5,3.4,.13,M.glass,xx,4,11.1);box(g,.35,5,.35,M.gold,xx-1.55,2.5,11.2);box(g,.35,5,.35,M.gold,xx+1.55,2.5,11.2)}box(g,3.5,4,.25,M.door,0,2,11.3);for(const xx of [-8,8]){const c=new THREE.Mesh(new THREE.CylinderGeometry(1.0,1.0,7,10),M.stone);c.position.set(xx,3.5,11.5);g.add(c)}interactables.push({x,z,doorZ:z+15,type:'mansion',name:'GRAND MANOR',floors:3});}
for(const [x,z,h] of [[-126,-126,39],[-84,-126,54],[84,-126,66],[126,-126,48],[-126,126,60],[-84,126,45],[84,126,57],[126,126,72]])tower(x,z,22,22,h);
for(const [x,z] of [[-126,-47],[-84,-47],[84,-47],[126,-47],[-126,47],[-84,47],[84,47],[126,47]])villa(x,z,18,15);
mansion(-47,-126);mansion(47,126);villa(-47,126,25,19);villa(47,-126,25,19);

// Luxury flagship sedan: original APEXLOT design with long-wheelbase proportions and detailed cabin.
const car=group(scene,0,0,25);
const paint=mat(0x202a32,.2,.78), paintDark=mat(0x10171d,.22,.7), leather=mat(0x9b8062,.72), trim=mat(0x252a2d,.25,.8);
box(car,2.18,.55,5.25,paint,0,.88,0);
box(car,2.12,.36,2.1,paint,0,1.18,-1.35);
box(car,2.05,.32,1.55,paint,0,1.12,1.8);
box(car,1.78,.82,2.55,M.glass,0,1.65,-.25);
box(car,1.72,.18,2.3,paintDark,0,2.06,-.25);
box(car,1.86,.12,1.05,paint,0,2.08,-.92);
box(car,1.86,.12,.85,paint,0,2.08,.58);
// bonnet details, chrome grille and signature light strips
box(car,1.0,.36,.12,M.chrome,0,.95,2.66);
for(let i=0;i<9;i++)box(car,.045,.25,.025,M.chrome,-.43+i*.108,.96,2.73);
box(car,.66,.23,.06,M.gold,-.72,1.02,2.67);box(car,.66,.23,.06,M.gold,.72,1.02,2.67);
box(car,1.85,.12,.12,M.chrome,0,.58,2.68);
box(car,1.8,.08,.12,M.chrome,0,.63,-2.67);
for(const x of [-1.12,1.12])for(const z of [-1.72,1.72]){
 const wheel=new THREE.Mesh(new THREE.CylinderGeometry(.48,.48,.28,20),M.tire);wheel.rotation.z=Math.PI/2;wheel.position.set(x,.48,z);car.add(wheel);
 const rim=new THREE.Mesh(new THREE.CylinderGeometry(.29,.29,.3,12),M.chrome);rim.rotation.z=Math.PI/2;rim.position.set(x*1.005,.48,z);car.add(rim);
 const hub=new THREE.Mesh(new THREE.CylinderGeometry(.12,.12,.31,12),M.black);hub.rotation.z=Math.PI/2;hub.position.set(x*1.01,.48,z);car.add(hub);
}
for(const x of [-.72,.72]){box(car,.08,.08,2.2,M.chrome,x,1.29,-.25);box(car,.13,.12,.12,M.chrome,x,1.27,1.02)}
// cabin seats, dashboard, steering wheel and center console visible in cockpit
for(const x of [-.48,.48]){box(car,.48,.65,.48,leather,x,1.35,-.62);box(car,.48,.55,.45,leather,x,1.27,.42)}
box(car,1.62,.25,.42,trim,0,1.38,1.02);box(car,.16,.16,.16,M.chrome,-.53,1.46,.99);
const steering=new THREE.Mesh(new THREE.TorusGeometry(.22,.035,8,20),M.chrome);steering.position.set(-.55,1.55,.88);car.add(steering);

car.position.set(0,0,25);

// On-foot avatar: original stylized suited character, with separate movement state.
const avatar=group(scene,0,0,18);
const suit=mat(0x172432,.72),shirt=mat(0xe8e5dc,.8),skin=mat(0xb98562,.8),shoe=mat(0x17191d,.65),hair=mat(0x29211d,.9);
function limb(parent,w,h,d,material,x,y,z){return box(parent,w,h,d,material,x,y,z)}
limb(avatar,.62,.82,.34,suit,0,1.15,0);
limb(avatar,.42,.18,.3,shirt,0,1.62,.015);
const head=new THREE.Mesh(new THREE.SphereGeometry(.22,12,10),skin);head.position.set(0,1.82,0);avatar.add(head);
const hairCap=new THREE.Mesh(new THREE.SphereGeometry(.225,12,8,0,Math.PI*2,0,Math.PI*.55),hair);hairCap.position.set(0,1.91,0);avatar.add(hairCap);
const tie=limb(avatar,.09,.34,.035,M.black,0,1.38,.18);
const armL=group(avatar,-.39,1.45,0),armR=group(avatar,.39,1.45,0);
limb(armL,.17,.62,.19,suit,0,-.25,0);limb(armR,.17,.62,.19,suit,0,-.25,0);
const legL=group(avatar,-.17,.78,0),legR=group(avatar,.17,.78,0);
limb(legL,.2,.65,.23,suit,0,-.27,0);limb(legR,.2,.65,.23,suit,0,-.27,0);
limb(legL,.22,.13,.36,shoe,0,-.62,.06);limb(legR,.22,.13,.36,shoe,0,-.62,.06);
avatar.visible=false;
let onFoot=false,walkPhase=0;


let speed=0,heading=0,steer=0,interiorView=false,inBuilding=false,nearby=null;
const keys=new Set();
addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code))e.preventDefault();keys.add(e.code);if(e.code==='Escape'){if(inBuilding)exitBuilding();else closePanel()}if(e.code==='KeyC')toggleCamera();if(e.code==='KeyE')interact();if(/^Digit[1-9]$/.test(e.code)&&inBuilding)moveElevator(Number(e.code.slice(5)))});
addEventListener('keyup',e=>keys.delete(e.code));
document.querySelectorAll('[data-key]').forEach(b=>{const k=b.dataset.key;const down=e=>{e.preventDefault();keys.add(k)},up=e=>{e.preventDefault();keys.delete(k)};b.addEventListener('pointerdown',down);b.addEventListener('pointerup',up);b.addEventListener('pointerleave',up);b.addEventListener('pointercancel',up)});
function toggleCamera(){interiorView=!interiorView;const label=document.querySelector('#camera-mode');if(label)label.textContent=interiorView?'CABIN VIEW':'CHASE VIEW'}
document.querySelector('#camera-toggle').addEventListener('click',toggleCamera);
function openPanel(title,kicker,html){document.querySelector('#panel-title').textContent=title;document.querySelector('#panel-kicker').textContent=kicker;document.querySelector('#panel-content').innerHTML=html;document.querySelector('#panel').classList.add('open')}
function closePanel(){document.querySelector('#panel').classList.remove('open')}
document.querySelector('#panel-close').addEventListener('click',closePanel);
function item(title,desc,action,label='OPEN'){return '<div class="panel-item"><div><b>'+title+'</b><small>'+desc+'</small></div><button class="action-button" data-panel-action="'+action+'">'+label+'</button></div>'}
const maps=[['Sunshore City','Sunny coast and skyline'],['Palm Avenue','Luxury villas and mansions'],['Skyline District','Skyscrapers and elevators'],['Marina Boulevard','Waterfront promenade'],['Garden Estates','Private homes and gardens']];
document.querySelectorAll('[data-action]').forEach(b=>b.addEventListener('click',()=>showSection(b.dataset.action)));
document.querySelector('#settings-open').addEventListener('click',()=>showSection('settings'));
function showSection(section){
 const views={
 map:['WORLD MAP','SELECT DESTINATION',maps.map((m,i)=>item(m[0],m[1],'map:'+i)).join('')],
 garage:['GARAGE','VEHICLE MANAGEMENT',item('APEXLOT Grand Tourer','Long-wheelbase luxury sedan · prototype','vehicle')+item('Vehicle setup','Paint, wheels and suspension','tuning')],
 events:['EVENTS','DRIVING CHALLENGES',item('Coastal Cruise','Explore the sunny boulevard','event:coast')+item('Precision Parking','Practice controlled parking','event:park')],
 profile:['DRIVER PROFILE','LOCAL DEMO PROFILE','<p class="panel-note">Guest Driver · Local prototype profile</p>'+item('Account services','Back4App configuration required','account')],
 settings:['SETTINGS','GAME PREFERENCES','<label class="setting-row">Low graphics mode <input id="low-graphics" type="checkbox"></label><p class="panel-note">Low graphics mode reduces render resolution for smoother play.</p>']
 };
 const v=views[section]||views.map;openPanel(v[0],v[1],v[2]);
 document.querySelectorAll('[data-panel-action]').forEach(el=>el.addEventListener('click',()=>panelAction(el.dataset.panelAction)));
 const low=document.querySelector('#low-graphics');if(low)low.addEventListener('change',()=>renderer.setPixelRatio(Math.min(devicePixelRatio,low.checked?.8:1.25)));
}
function panelAction(action){if(action.startsWith('map:')){document.querySelector('#location-name').textContent=maps[Number(action.split(':')[1])][0].toUpperCase();closePanel();return}if(action==='vehicle'){closePanel();return}if(action==='tuning'){openPanel('VEHICLE SETUP','GARAGE',item('Paint finish','Midnight graphite','paint')+item('Wheel setup','Luxury multi-spoke','wheels'));return}if(action.startsWith('event:')){openPanel('DRIVE SESSION','EVENT CONTROL','<p class="panel-note">Free-drive session ready. Follow the boulevard and explore the estate district.</p>'+item('Start driving','Return to the open world','practice','START'));return}if(action==='practice'){closePanel();return}openPanel('ACCOUNT SERVICES','CLOUD BACKEND','<p class="panel-note">Configure APEXLOT Back4App credentials before enabling accounts.</p>')}
function interact(){if(inBuilding){exitBuilding();return}if(onFoot){if(Math.hypot(avatar.position.x-car.position.x,avatar.position.z-car.position.z)<4){onFoot=false;avatar.visible=false;car.visible=true;closePanel();return}if(nearby){enterBuilding(nearby);return}}else if(Math.hypot(avatar.position.x-car.position.x,avatar.position.z-car.position.z)<5){onFoot=true;avatar.visible=true;car.visible=false;avatar.position.set(car.position.x+2,0,car.position.z);avatar.rotation.y=heading;speed=0;closePanel();return}if(nearby){enterBuilding(nearby);return}openPanel('INTERACTION','NO ENTRANCE NEARBY','<p class="panel-note">Drive or walk closer to a marked building entrance.</p>')}
let interiorGroup=null,elevatorFloor=1;
function enterBuilding(b){inBuilding=true;interiorGroup=group(scene,car.position.x,0,car.position.z);box(interiorGroup,16,.2,16,M.stone,0,0,0);box(interiorGroup,16,5,.2,M.white,0,2.5,-8);box(interiorGroup,.2,5,16,M.white,-8,2.5,0);box(interiorGroup,.2,5,16,M.white,8,2.5,0);box(interiorGroup,16,5,.2,M.white,0,2.5,8);box(interiorGroup,4,.25,2,M.wood,-3,.3,-3);box(interiorGroup,2,.8,1.4,leather,-3,.8,-3);box(interiorGroup,2,.8,1.4,leather,-1,.8,-3);box(interiorGroup,2,.2,1,M.wood,3,.2,-3);box(interiorGroup,1.2,2.4,.12,M.door,0,1.2,7.85);box(interiorGroup,2.5,2.5,2,M.chrome,5,1.25,5);document.querySelector('#location-name').textContent=b.name+' / INTERIOR';openPanel('BUILDING INTERIOR','ELEVATOR · FLOOR 1','<p class="panel-note">You entered '+b.name+'. Select a floor to ride the elevator. Press E to leave.</p>'+[1,2,3,4,5].map(n=>item('Floor '+n,'Elevator destination','floor:'+n,'GO')).join('')+item('Exit building','Return outside','exit','EXIT'));document.querySelectorAll('[data-panel-action]').forEach(el=>el.addEventListener('click',()=>panelAction(el.dataset.panelAction)))}
function moveElevator(n){elevatorFloor=n;openPanel('ELEVATOR','FLOOR '+n,'<p class="panel-note">Elevator arrived at floor '+n+'. Press E to exit the building.</p>'+[1,2,3,4,5].map(k=>item('Floor '+k,'Select destination','floor:'+k,'GO')).join('')+item('Exit building','Return outside','exit','EXIT'));document.querySelectorAll('[data-panel-action]').forEach(el=>el.addEventListener('click',()=>panelAction(el.dataset.panelAction)))}
function exitBuilding(){inBuilding=false;if(interiorGroup){scene.remove(interiorGroup);interiorGroup=null}closePanel();document.querySelector('#location-name').textContent='SUNSHORE CITY / CENTRAL'}
const originalPanelAction=panelAction;
panelAction=function(action){if(action.startsWith('floor:')){moveElevator(Number(action.split(':')[1]));return}if(action==='exit'){exitBuilding();return}originalPanelAction(action)};
function update(dt){
 if(inBuilding)return;
 if(onFoot){const f=keys.has('KeyW')||keys.has('ArrowUp'),b=keys.has('KeyS')||keys.has('ArrowDown'),l=keys.has('KeyA')||keys.has('ArrowLeft'),r=keys.has('KeyD')||keys.has('ArrowRight');const move=(f?1:0)-(b?1:0);const turn=(r?1:0)-(l?1:0);avatar.rotation.y+=turn*2.3*dt;const pace=(keys.has('ShiftLeft')||keys.has('ShiftRight'))?7:3.8;avatar.position.x+=Math.sin(avatar.rotation.y)*move*pace*dt;avatar.position.z+=Math.cos(avatar.rotation.y)*move*pace*dt;walkPhase+=Math.abs(move)*dt*9;legL.rotation.x=Math.sin(walkPhase)*.55;legR.rotation.x=-Math.sin(walkPhase)*.55;armL.rotation.x=-legL.rotation.x*.7;armR.rotation.x=-legR.rotation.x*.7;nearby=null;let nearest=Infinity;for(const bld of interactables){const d=Math.hypot(avatar.position.x-bld.x,avatar.position.z-bld.doorZ);if(d<nearest){nearest=d;nearby=bld}}document.querySelector('#interaction-hint').textContent=Math.hypot(avatar.position.x-car.position.x,avatar.position.z-car.position.z)<4?'E ENTER CAR':'E INTERACT';return}
 const forward=keys.has('ArrowUp')||keys.has('KeyW'),reverse=keys.has('ArrowDown')||keys.has('KeyS');
 const left=keys.has('ArrowLeft')||keys.has('KeyA'),right=keys.has('ArrowRight')||keys.has('KeyD');
 steer=(right?1:0)-(left?1:0);
 if(forward)speed=Math.min(27,speed+12*dt);else if(reverse)speed=Math.max(-8,speed-17*dt);else speed*=Math.pow(.94,dt*60);
 if(keys.has('Space'))speed*=Math.pow(.78,dt*60);
 const steeringStrength=(.35+Math.min(Math.abs(speed)/27,1)*.9);
 heading+=steer*steeringStrength*dt*(speed>=0?1:-1);
 car.rotation.y=heading;
 car.position.x+=Math.sin(heading)*speed*dt;
 car.position.z+=Math.cos(heading)*speed*dt;
 nearby=null;let best=Infinity;
 for(const b of interactables){const dx=car.position.x-b.x,dz=car.position.z-b.doorZ;const dist=Math.hypot(dx,dz);if(dist<best){best=dist;nearby=b}}
 document.querySelector('#interaction-hint').textContent=best<12?'E  ENTER / INTERACT':'E  INTERACT';
 document.querySelector('#speed').textContent=String(Math.round(Math.abs(speed)*3.6)).padStart(3,'0');
 document.querySelector('#gear').textContent=Math.abs(speed)<.5?'P':speed<0?'R':speed<9?'1':speed<18?'2':'D';
}
const chaseOffset=new THREE.Vector3();
let last=performance.now(),fpsFrames=0,fpsTime=0;
function animate(now){const dt=Math.min((now-last)/1000,.033);last=now;update(dt);
 if(onFoot){const forward=new THREE.Vector3(Math.sin(avatar.rotation.y),0,Math.cos(avatar.rotation.y));const target=avatar.position.clone().add(new THREE.Vector3(0,3.4,0)).add(forward.clone().multiplyScalar(-6));camera.position.lerp(target,.12);camera.lookAt(avatar.position.x,1.2,avatar.position.z)}
 else if(inBuilding&&interiorGroup){camera.position.lerp(new THREE.Vector3(car.position.x+9,4,car.position.z+12),.08);camera.lookAt(car.position.x,1.4,car.position.z)}
 else if(interiorView){const forward=new THREE.Vector3(Math.sin(heading),0,Math.cos(heading));const target=car.position.clone().add(new THREE.Vector3(0,1.95,0)).add(forward.clone().multiplyScalar(3.8));camera.position.lerp(target,.22);camera.lookAt(car.position.clone().add(new THREE.Vector3(0,1.55,0)).add(forward.clone().multiplyScalar(24)))}
 else{chaseOffset.set(-Math.sin(heading)*10,5.5,-Math.cos(heading)*10);const target=car.position.clone().add(chaseOffset);camera.position.lerp(target,1-Math.pow(.0005,dt));camera.lookAt(car.position.x,1.1,car.position.z)}
 renderer.render(scene,camera);if(!window.__apexlotFirstFrame){window.__apexlotFirstFrame=true;const boot=document.querySelector('#boot');if(boot)boot.classList.add('done')}fpsFrames++;fpsTime+=dt;if(fpsTime>2){document.querySelector('#world-status').textContent='WORLD: READY';fpsFrames=0;fpsTime=0}requestAnimationFrame(animate)}
requestAnimationFrame(animate);
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.25))});
document.querySelector('#clock').textContent='SUNNY / 12:00';
// Splash dismissal is driven by the first successful rendered frame.
