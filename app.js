import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js';

const canvas=document.querySelector('#world');
const scene=new THREE.Scene();scene.background=new THREE.Color(0x9bb8c4);scene.fog=new THREE.Fog(0x9bb8c4,85,260);
const camera=new THREE.PerspectiveCamera(62,innerWidth/innerHeight,.1,500);
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
scene.add(new THREE.HemisphereLight(0xdceeff,0x52604b,2.1));
const sun=new THREE.DirectionalLight(0xfff0d4,2.3);sun.position.set(-45,75,35);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);scene.add(sun);
const mats={road:new THREE.MeshStandardMaterial({color:0x343b40,roughness:.96}),line:new THREE.MeshStandardMaterial({color:0xd9d6bd}),grass:new THREE.MeshStandardMaterial({color:0x687d60}),concrete:new THREE.MeshStandardMaterial({color:0x92999a}),glass:new THREE.MeshStandardMaterial({color:0x476575,metalness:.35,roughness:.2}),white:new THREE.MeshStandardMaterial({color:0xe4e0d5}),dark:new THREE.MeshStandardMaterial({color:0x1c252b}),accent:new THREE.MeshStandardMaterial({color:0xc6e34d,metalness:.35,roughness:.3})};
function box(w,h,d,mat,x,y,z,parent=scene){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
const ground=new THREE.Mesh(new THREE.PlaneGeometry(500,500),mats.grass);ground.rotation.x=-Math.PI/2;ground.position.y=-.12;ground.receiveShadow=true;scene.add(ground);
function road(x,z,w,d){box(w,.12,d,mats.road,x,0,z);if(w>d){for(let p=-w/2+4;p<w/2;p+=8)box(3,.015,.13,mats.line,x+p,.07,z)}else{for(let p=-d/2+4;p<d/2;p+=8)box(.13,.015,3,mats.line,x,.07,z+p)}}
road(0,0,190,15);road(0,0,15,190);road(0,-48,150,12);road(0,48,150,12);road(-48,0,12,150);road(48,0,12,150);
function building(x,z,w,d,h,seed=0){const base=box(w,h,d,new THREE.MeshStandardMaterial({color:[0xaaa99c,0x8f9b9c,0xb4a994,0x777f83][seed%4],roughness:.9}),x,h/2,z);box(w+.5,.5,d+.5,mats.dark,x,h+.25,z);for(let y=2.5;y<h-1;y+=3){for(let a=-w/2+1.5;a<w/2-1;a+=3){box(1.25,1.2,.06,mats.glass,x+a,y,z+d/2+.035);box(1.25,1.2,.06,mats.glass,x+a,y,z-d/2-.035)}}return base}
for(let x=-85;x<=85;x+=22){for(let z=-85;z<=85;z+=22){if(Math.abs(x)<14||Math.abs(z)<14||Math.abs(x)===44||Math.abs(z)===44)continue;const h=8+((Math.abs(x*3+z*7)%5)*3);building(x,z,12,12,h,Math.abs(x+z)%4)}}
function lamp(x,z){const g=new THREE.Group();g.position.set(x,0,z);box(.18,5,.18,mats.dark,0,2.5,0,g);box(1.3,.12,.12,mats.dark,.55,5,0,g);const l=new THREE.PointLight(0xffe5ad,.35,12);l.position.set(.8,4.7,0);g.add(l);scene.add(g)}
for(let x=-80;x<=80;x+=20){lamp(x,-10);lamp(x,10);lamp(-10,x);lamp(10,x)}
// Small original service station landmark
box(17,3,10,mats.white,-29,1.5,-29);box(18,.5,11,mats.accent,-29,3.2,-29);box(1,.2,8,mats.dark,-29,4,-29);
for(let i=0;i<3;i++){box(1.1,2.1,1.1,mats.white,-34+i*4,1.05,-20);box(1.15,.12,1.15,mats.accent,-34+i*4,2.2,-20)}
const car=new THREE.Group();const body=box(2.1,.62,4.2,mats.accent,0,.75,0,car);box(1.72,.58,1.9,mats.glass,0,1.28,-.15,car);box(2.04,.18,1.1,mats.dark,0,.53,1.45,car);
const wheels=[];for(const x of [-1.08,1.08])for(const z of [-1.35,1.35]){const wh=new THREE.Mesh(new THREE.CylinderGeometry(.39,.39,.23,20),mats.dark);wh.rotation.z=Math.PI/2;wh.position.set(x,.4,z);wh.castShadow=true;car.add(wh);wheels.push(wh)}
car.position.set(0,0,24);scene.add(car);
const keys=new Set();let speed=0,heading=0,steer=0;const maxSpeed=35;
addEventListener('keydown',e=>{keys.add(e.code);if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code))e.preventDefault();if(e.code==='Escape')closePanel()});
addEventListener('keyup',e=>keys.delete(e.code));
document.querySelectorAll('[data-key]').forEach(b=>{const k=b.dataset.key;const down=e=>{e.preventDefault();keys.add(k)},up=e=>{e.preventDefault();keys.delete(k)};b.addEventListener('pointerdown',down);b.addEventListener('pointerup',up);b.addEventListener('pointerleave',up);b.addEventListener('pointercancel',up)});
function openPanel(title,kicker,html){document.querySelector('#panel-title').textContent=title;document.querySelector('#panel-kicker').textContent=kicker;document.querySelector('#panel-content').innerHTML=html;document.querySelector('#panel').classList.add('open')}
function closePanel(){document.querySelector('#panel').classList.remove('open')}
document.querySelector('#panel-close').addEventListener('click',closePanel);
function item(title,desc,action,label='OPEN'){return '<div class="panel-item"><div><b>'+title+'</b><small>'+desc+'</small></div><button class="action-button" data-panel-action="'+action+'">'+label+'</button></div>'}
const maps=[['Apex City','Central urban district'],['Coastal Route','Seaside roads and overlooks'],['Alpine Pass','Mountain roads and switchbacks'],['Industrial Yard','Warehouses and loading zones'],['Italian Quarter','Original Mediterranean-inspired district']];
document.querySelectorAll('[data-action]').forEach(b=>b.addEventListener('click',()=>showSection(b.dataset.action)));
document.querySelector('#settings-open').addEventListener('click',()=>showSection('settings'));
function showSection(section){
 const views={
 map:['WORLD MAP','SELECT DESTINATION',maps.map((m,i)=>item(m[0],m[1],'map:'+i)).join('')+'<p class="panel-note">Harita bölgeleri bu prototipte özgün blok geometrileriyle temsil edilir. Ayrıntılı çevre üretimi geliştirme aşamasındadır.</p>'],
 garage:['GARAGE','VEHICLE MANAGEMENT',item('Apex GT','Starter vehicle · RWD','vehicle')+item('Vehicle setup','Paint, wheels and suspension settings','tuning')+'<p class="panel-note">Araç kataloğu ve lisanslı/özgün 3D araç varlıkları sonraki içerik paketlerinde genişletilecek.</p>'],
 events:['EVENTS','DRIVING CHALLENGES',item('Construction Precision','Tight-space parking challenge','event:construction')+item('Time Attack','Beat the target time','event:time')+item('Italian Tour','Scenic route discovery','event:italy')+item('Parking Academy','Learn precision parking','event:academy')],
 profile:['DRIVER PROFILE','LOCAL DEMO PROFILE','<p class="panel-note">Guest Driver<br>Level 01 · 0 XP<br>Cloud account connection is not configured yet.</p>'+item('Account services','Sign-in and cloud save setup','account')],
 settings:['SETTINGS','GAME PREFERENCES','<label class="setting-row">Shadows <input id="shadows" type="checkbox" checked></label><label class="setting-row">Show driving hints <input id="hints" type="checkbox" checked></label><label class="setting-row">Graphics quality <select id="quality"><option>High</option><option>Medium</option><option>Low</option></select></label><p class="panel-note">Graphics options apply locally in this prototype.</p>']
 };
 const v=views[section]||views.map;openPanel(v[0],v[1],v[2]);
 document.querySelectorAll('[data-panel-action]').forEach(el=>el.addEventListener('click',()=>panelAction(el.dataset.panelAction)));
 const sh=document.querySelector('#shadows');if(sh)sh.addEventListener('change',()=>sun.castShadow=sh.checked);
 const q=document.querySelector('#quality');if(q)q.addEventListener('change',()=>renderer.setPixelRatio(Math.min(devicePixelRatio,q.value==='High'?1.7:q.value==='Medium'?1.2:.8)));
}
function panelAction(action){
 if(action.startsWith('map:')){const i=Number(action.split(':')[1]);document.querySelector('#location-name').textContent=maps[i][0].toUpperCase();closePanel();return}
 if(action==='vehicle'){closePanel();return}
 if(action==='tuning'){openPanel('VEHICLE SETUP','GARAGE',item('Paint finish','Factory lime · selected','paint')+item('Wheel setup','Sport alloy · standard','wheels')+'<p class="panel-note">Detailed tuning controls will be connected to the vehicle physics configuration.</p>');return}
 if(action.startsWith('event:')){const name=action.split(':')[1];openPanel('CHALLENGE BRIEFING','EVENT CONTROL','<p class="panel-note">This challenge interface is a prototype. Mission scoring, checkpoints, timers and rewards are planned for the gameplay systems milestone.</p>'+item('Start practice','Local free-drive practice session','practice','PRACTICE'));return}
 if(action==='practice'){closePanel();return}
 openPanel('ACCOUNT SERVICES','CLOUD BACKEND','<p class="panel-note">Back4App Cloud Code endpoint stubs are included in cloud/main.js. Configure Parse credentials and class permissions before enabling account services. No credentials are embedded in the client.</p>');
}
function update(dt){
 const accel=keys.has('ArrowUp')||keys.has('KeyW'),brake=keys.has('Space')||keys.has('ArrowDown')||keys.has('KeyS');
 steer=(keys.has('ArrowLeft')||keys.has('KeyA')?-1:0)+(keys.has('ArrowRight')||keys.has('KeyD')?1:0);
 if(accel)speed=Math.min(maxSpeed,speed+20*dt);else speed*=Math.pow(.985,dt*60);
 if(brake)speed=Math.max(0,speed-38*dt);
 heading+=steer*(.7+Math.min(speed/maxSpeed,1)*1.25)*dt*(speed>=0?1:-1);
 car.rotation.y=heading;car.position.x+=Math.sin(heading)*speed*dt;car.position.z+=Math.cos(heading)*speed*dt;
 camera.position.lerp(new THREE.Vector3(car.position.x-Math.sin(heading)*9,5.2,car.position.z-Math.cos(heading)*9),1-Math.pow(.001,dt));camera.lookAt(car.position.x,1.1,car.position.z);
 document.querySelector('#speed').textContent=String(Math.round(speed*3.6)).padStart(3,'0');document.querySelector('#gear').textContent=speed<.5?'N':speed<12?'1':speed<23?'2':'3';
}
let last=performance.now();function animate(now){const dt=Math.min((now-last)/1000,.04);last=now;update(dt);renderer.render(scene,camera);requestAnimationFrame(animate)}requestAnimationFrame(animate);
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.7))});
document.querySelector('#clock').textContent='DAY / 12:00';
setTimeout(()=>document.querySelector('#boot').classList.add('done'),850);
