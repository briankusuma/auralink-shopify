// Actual local GSAP, controlled DOM geometry; no browser painting assertions.
const fs = require('node:fs'), vm = require('node:vm'), assert = require('node:assert/strict');
const { gsap: actual } = require(process.cwd() + '/assets/gsap.js');
const timelines = [], triggers = [];
function node(extra = {}) { return Object.assign({ x:0,y:0,autoAlpha:1,offsetWidth:100,offsetHeight:100,offsetLeft:0,offsetTop:0 }, extra); }
function fixture(hasHeading, complete = true) {
  const classes = new Set(), media = { matches:true, addEventListener(){}, removeEventListener(){} };
  const header = node({ offsetHeight:80, querySelectorAll:()=>[] });
  const grid = node({ clientWidth:1000 }), statNumber = node({ textContent:'99%' });
  const stat = node({ offsetLeft:800, offsetWidth:200, querySelector:()=>statNumber, querySelectorAll:()=>[] });
  const stacked = node({ offsetLeft:560, offsetWidth:200, querySelectorAll:()=>[] });
  const large = node({ querySelector:()=>null });
  const container = node({ offsetTop:40 });
  const selectors = { '.auralink-bento-header':hasHeading?header:null, '.auralink-bento-grid':grid, '.auralink-bento-card--stat':stat, '.auralink-bento-col--stacked':stacked, '.auralink-bento-card--large':complete?large:null, '.auralink-bento-container':container };
  const wrapper = node({ clientHeight:800,isConnected:true,dataset:{}, classList:{add:c=>classes.add(c),remove:c=>classes.delete(c)},querySelector:s=>selectors[s],querySelectorAll:()=>[],closest(){return this;} });
  return {wrapper,media,header,stat,stacked,large,statNumber,classes};
}
const a=fixture(true), b=fixture(false), incomplete=fixture(false,false);
const wrappers=[a.wrapper,b.wrapper,incomplete.wrapper]; let mediaIndex=0;
const gsap={registerPlugin(){},set:(...args)=>actual.set(...args),context:(...args)=>actual.context(...args),timeline(config){
  const {scrollTrigger,...rest}=config; const timeline=actual.timeline({...rest,paused:true});timelines.push(timeline);triggers.push(scrollTrigger);return timeline;
}};
const window={gsap,ScrollTrigger:{sort(){},refresh(){triggers.forEach(t=>t.onRefreshInit())}},matchMedia:()=>[a,b,incomplete][mediaIndex++].media};
const document={readyState:'complete',documentElement:{clientHeight:800},querySelectorAll:()=>wrappers,addEventListener(){}};
vm.runInNewContext(fs.readFileSync('assets/auralink-bento-motion.js','utf8'),{window,document,URL,Map,Promise,getComputedStyle:()=>({columnGap:'20px'})});
(async()=>{
 await new Promise(setImmediate);
 assert.equal(timelines.length,2, 'Incomplete content must fall back without a trigger');
 assert.equal(incomplete.classes.size,0);
 for(const [index,item] of [a,b].entries()) {
   const timeline=timelines[index];
   const snapshot=()=>JSON.stringify([item.stat.x,item.stat.y,item.stat.autoAlpha,item.stacked.x,item.stacked.y,item.stacked.autoAlpha,item.large.x,item.large.autoAlpha,item.header.y]);
   for(const time of [0,1.3,2.5,3.8,timeline.duration()]) {
     timeline.time(time);const before=snapshot();
     for(let pass=0;pass<3;pass++){triggers[index].onRefreshInit();assert.equal(snapshot(),before,'Refresh changed bento geometry at '+time);}
   }
   assert.equal(item.statNumber.textContent,'99%');
   timeline.time(0);assert.equal(item.stat.autoAlpha,0);assert.equal(item.statNumber.textContent,'0%');
 }
 const before=timelines[1].time();a.wrapper._bentoMotionDestroy();assert.equal(timelines[1].time(),before);
 assert.equal(a.statNumber.textContent,'99%');assert.equal(a.classes.size,0);
 b.wrapper._bentoMotionDestroy();incomplete.wrapper._bentoMotionDestroy();actual.ticker.sleep();
 console.log('PASS bento instances: independent duplicate timelines, absent heading/card fallback, repeated refresh, reverse, counter and isolated cleanup.');
})().catch(error=>{actual.ticker.sleep();console.error(error);process.exitCode=1;});
