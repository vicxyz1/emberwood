export const TYPES = [
 {name:'Ranger Tower',cost:75,damage:15,range:165,rate:1.6,color:'#d5ce88',description:'Swift, single target damage.'},
 {name:'Cannon Tower',cost:125,damage:50,range:190,rate:0.55,color:'#f0b358',description:'Heavy area damage.'},
 {name:'Frost Tower',cost:100,damage:10,range:145,rate:1,color:'#80dcf4',description:'Slows enemies by 45%.'}
];
export const PADS=[[.18,.43],[.38,.48],[.43,.21],[.65,.46],[.85,.29],[.65,.72],[.35,.82],[.36,.13],[.88,.61]];
// Centerline follows the painted trail, in a 1000 x 604 world.
export const PATH=[[-25,165],[260,165],[270,185],[270,385],[290,405],[505,405],[525,385],[525,205],[545,182],[735,182],[750,202],[750,250],[775,273],[925,273],[955,255],[967,218]];
const lengths=PATH.slice(1).map((p,i)=>Math.hypot(p[0]-PATH[i][0],p[1]-PATH[i][1]));
export const TOTAL=lengths.reduce((a,b)=>a+b,0);
export function position(distance){for(let i=0;i<lengths.length;i++){if(distance<=lengths[i]){const t=distance/lengths[i];return {x:PATH[i][0]+(PATH[i+1][0]-PATH[i][0])*t,y:PATH[i][1]+(PATH[i+1][1]-PATH[i][1])*t};}distance-=lengths[i];}return {x:967,y:218};}
export function createGame(){return {gold:250,lives:20,wave:0,kills:0,towers:[],enemies:[],effects:[],status:'ready',spawned:0,total:0,spawnTimer:0,time:0,nextId:1,speed:1,selected:null,building:0,message:'Select a tower, then choose a clearing.'};}
export function stats(t){const b=TYPES[t.type];return {...b,damage:Math.round(b.damage*(1+t.damageLevel*.5)),rate:b.rate*(1+t.rateLevel*.35)};}
export function upgradeCost(t,kind){return Math.round(TYPES[t.type].cost*.6)*(t[kind+'Level']+1);}
export function place(g,pad){if(g.status==='lost'||g.status==='won')return false;const old=g.towers.find(t=>t.pad===pad);if(old){g.selected=old.id;g.building=null;return true;}if(g.building===null){g.message='Choose a tower from the build panel first.';return false;}const b=TYPES[g.building];if(g.gold<b.cost){g.message='Not enough gold. Defeat enemies to earn more.';return false;}const t={id:g.nextId++,type:g.building,pad,x:PADS[pad][0]*1000,y:PADS[pad][1]*604,damageLevel:0,rateLevel:0,cooldown:0,spent:b.cost};g.towers.push(t);g.gold-=b.cost;g.selected=t.id;g.building=null;g.message=b.name+' built. Select it to upgrade.';return true;}
export function upgrade(g,kind){const t=g.towers.find(t=>t.id===g.selected);if(!t||!['damage','rate'].includes(kind)||t[kind+'Level']>=3)return false;const cost=upgradeCost(t,kind);if(g.gold<cost)return false;g.gold-=cost;t.spent+=cost;t[kind+'Level']++;return true;}
export function sell(g){const t=g.towers.find(t=>t.id===g.selected);if(!t)return;g.gold+=Math.floor(t.spent*.65);g.towers=g.towers.filter(x=>x.id!==t.id);g.selected=null;g.message='Tower sold. 65% of invested gold returned.';}
export function start(g){if(g.status==='active'){g.status='paused';return;}if(g.status==='paused'){g.status='active';return;}if(g.status!=='ready')return;g.wave++;g.spawned=0;g.total=7+g.wave*2;g.spawnTimer=0;g.status='active';g.message=g.wave===10?'The elder ogre approaches. Hold the pass!':'The forest is under attack. Hold the line!';}
export function step(g,dt){if(g.status!=='active')return;dt*=g.speed;g.time+=dt;g.spawnTimer-=dt;if(g.spawned<g.total&&g.spawnTimer<=0){const boss=g.wave===10&&g.spawned===g.total-1;const type=boss?2:g.wave>=3&&g.spawned%4===0?1:0;const hp=(30+g.wave*14)*Math.pow(1.06,g.wave-1)*(type===2?9:type===1?2.5:1);g.enemies.push({id:g.nextId++,type,hp,maxHp:hp,distance:0,slow:0,speed:type===2?33:type===1?40:52+g.wave*1.5,...position(0)});g.spawned++;g.spawnTimer=Math.max(.45,1.05-g.wave*.035);}
 for(const e of g.enemies){e.slow=Math.max(0,e.slow-dt);e.distance+=e.speed*dt*(e.slow>0?.55:1);Object.assign(e,position(e.distance));if(e.distance>=TOTAL&&e.hp>0){g.lives=Math.max(0,g.lives-(e.type===2?5:1));e.escaped=true;}}
 for(const t of g.towers){t.cooldown-=dt;if(t.cooldown>0)continue;const b=stats(t);const target=g.enemies.filter(e=>e.hp>0&&!e.escaped&&Math.hypot(e.x-t.x,e.y-t.y)<=b.range).sort((a,b)=>b.distance-a.distance)[0];if(!target)continue;t.cooldown=1/b.rate;g.effects.push({x:t.x,y:t.y-26,tx:target.x,ty:target.y-12,life:.2,type:t.type});if(t.type===1){for(const e of g.enemies)if(!e.escaped&&Math.hypot(e.x-target.x,e.y-target.y)<65)e.hp-=b.damage;}else{target.hp-=b.damage;if(t.type===2)target.slow=2;}}
 for(const e of g.enemies)if(e.hp<=0&&!e.escaped){const reward=e.type===2?150:e.type===1?18:10;g.gold+=reward;g.kills++;g.effects.push({x:e.x,y:e.y,life:.8,reward});}
 g.enemies=g.enemies.filter(e=>e.hp>0&&!e.escaped);g.effects=g.effects.filter(e=>(e.life-=dt)>0);
 if(g.lives<=0){g.status='lost';return;}if(g.spawned===g.total&&g.enemies.length===0){g.gold+=25+g.wave*5;g.status=g.wave===10?'won':'ready';g.message=`Wave ${g.wave} cleared. +${25+g.wave*5} bonus gold. Prepare your defenses.`;}
}


