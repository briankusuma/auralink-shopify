// Run from the theme root: node tests/impact-motion.cjs
// Real GSAP with a controlled layout; this does not replace browser visual QA.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const { gsap: realGsap } = require(process.cwd() + '/assets/gsap.js');
function node(extra = {}) { return Object.assign({ x: 0, y: 0, width:0,height:0,autoAlpha: 1, scaleX: 1, scaleY: 1, borderRadius: 24, backgroundColor: '#F5F3F0', minWidth:0, transformOrigin:'center', '--impact-scene-bg':'#F5F3F0', offsetLeft: 0, offsetTop: 0, offsetWidth: 100, offsetHeight: 100 }, extra); }
const classes = new Set();
const section = node();
const wrapper = node({clientWidth:1470,clientHeight:801,isConnected:true,dataset:{gsapUrl:'gsap.js',scrolltriggerUrl:'ScrollTrigger.js'},classList:{add:c=>classes.add(c),remove:c=>classes.delete(c)}});
const container = node({offsetLeft:31,offsetTop:48,offsetParent:wrapper});
const card = node({offsetParent:container,offsetWidth:1408,offsetHeight:600});
const row = node({offsetLeft:64,offsetTop:48,offsetWidth:1280,offsetHeight:188,offsetParent:card});
const author = node({offsetWidth:150,offsetHeight:188,offsetParent:row});
const quote = node({offsetParent:row});
const quoteDivider = node();
const divider = node();
const metrics = [node(),node(),node()];
const logos = node();
const tiles = Array.from({length:8},()=>node());
const metricTexts = Array.from({length:3},()=>node());
const originals = ['80M+','50+','$120M+'];
const stats = originals.map(textContent=>node({textContent}));
const contents = metrics.map(()=>node());
const boxes = metrics.map(parentElement=>node({offsetWidth:160,parentElement}));
metrics.forEach((metric,index)=>{
 metric.offsetWidth=350;
 metric.contains=el=>el===metricTexts[index]||el===stats[index];
 metric.querySelector=selector=>selector==='.auralink-impact-metric__stat'?stats[index]:null;
});
const one = {'.auralink-impact-card':card,'.auralink-impact-quote-row':row,'.auralink-impact-author':author,'.auralink-impact-quote-text':quote,'.auralink-impact-quote-divider':quoteDivider,'.auralink-impact-divider':divider,'.auralink-impact-logos':logos};
const many = {'.auralink-impact-metric-item':metrics,'.auralink-impact-metric__box':boxes,'.auralink-impact-metric__content':contents,'.auralink-impact-logo-card':tiles,'.auralink-impact-quote-text, .auralink-impact-metric__label':[quote,...metricTexts]};
const surface=node({style:{},removeAttribute(){this.restored=true}});one['[data-impact-surface]']=surface;wrapper.querySelector = s=>one[s] || null;
wrapper.querySelectorAll = s=>many[s] || [];
wrapper.closest = ()=>section;
let onMediaChange;
const media = {matches:true,addEventListener:(e,f)=>onMediaChange=f,removeEventListener(){}};
const timelines = [];
const tweens = [];
let triggerConfig;
const refreshCallbacks = [];
let destroyed = 0;
const controlled = [];
const gsap = {
 registerPlugin(){},
 context:(fn,scope)=>realGsap.context(fn,scope),
 set:(...args)=>realGsap.set(...args),
 timeline(config){
   const t=realGsap.timeline({...config,paused:true});timelines.push(t);return t;
 },
 to(target,config){
   const {scrollTrigger,...props}=config;
   const t=realGsap.to(target,{...props,paused:true});tweens.push(t);
   if(scrollTrigger){triggerConfig=scrollTrigger;refreshCallbacks.push(scrollTrigger.onRefreshInit);t.scrollTrigger={isActive:false,progress:0,kill(){}};}
   return t;
 }

};
const document = {createElement:()=>node({style:{},setAttribute(){},remove(){this.removed=true}}),readyState:'complete',documentElement:{clientHeight:801},querySelectorAll:s=>s==='.auralink-impact-wrapper'?[wrapper]:[],addEventListener(){}};
const window = {gsap,ScrollTrigger:{sort(){},refresh(){refreshCallbacks.forEach(f=>f())}},matchMedia:()=>media,AuraLinkLiquidReveal:{createControlled(el){const r={el,progress:0,render(p){this.progress=p},destroy(){destroyed++}};controlled.push(r);return r;}}};
vm.runInNewContext(fs.readFileSync('assets/auralink-impact-motion.js','utf8'),{window,document,URL,Map,Promise});
(async()=>{
 await new Promise(setImmediate);
 assert.equal(timelines.length,2);
 assert.notEqual(triggerConfig.invalidateOnRefresh,true, "fixed scroll driver must retain its zero start");
 const [timeline,intro]=timelines;
 const [release,driver]=tweens;
 const drive=time=>driver.progress(time/timeline.duration());
 assert.equal(author.x,565);assert.equal(row.y,210.5);assert.equal(quote.autoAlpha,0);assert.equal(wrapper.backgroundColor,'#FFFFFF');assert.equal(surface.autoAlpha,1);
 // Fast scroll cannot advance the content while the timed intro is incomplete.
 driver.progress(1);assert.ok(metrics.every(m=>m.autoAlpha===0));assert.equal(timeline.time(),0);
 triggerConfig.onEnter();intro.pause();
 intro.time(.7);assert.ok(author.x>0 && author.x<565);assert.equal(quote.autoAlpha,0);assert.equal(quoteDivider.autoAlpha,0);assert.equal(wrapper.backgroundColor,'#FFFFFF');
 assert.equal(surface.autoAlpha,1);intro.time(1.6);assert.equal(author.x,0);assert.equal(quote.autoAlpha,0);assert.equal(quoteDivider.autoAlpha,0);
 intro.time(1.8);assert.ok(quoteDivider.autoAlpha>0);assert.equal(quote.autoAlpha,0);
 intro.time(2.3);assert.ok(quote.autoAlpha>0);assert.ok(metrics.every(m=>m.autoAlpha===0));
 driver.progress(0);intro.time(intro.duration());release.pause().progress(1);
 assert.equal(author.x,0);assert.equal(quote.autoAlpha,1);assert.equal(wrapper.backgroundColor,'#FFFFFF');
 triggerConfig.onEnter();assert.equal(intro.time(),intro.duration());
 drive(3);assert.ok(surface.width>1408 && surface.width<1470);assert.ok(surface.height>600 && surface.height<801);assert.ok(metrics[0].y>metrics[1].y && metrics[1].y>=metrics[2].y);assert.ok(contents.every(c=>c.autoAlpha===0));
 drive(timeline.labels.metrics-.001);assert.equal(wrapper.backgroundColor,'#FFFFFF');
 drive(timeline.labels.metrics);assert.equal(surface.width,1408);assert.equal(surface.height,600);assert.equal(surface.x,31);assert.equal(surface.y,48);assert.equal(surface.borderRadius,32);assert.equal(wrapper.backgroundColor,'#FFFFFF');assert.ok(metrics.every(m=>m.y===0 && m.autoAlpha===1));assert.ok(contents.every(c=>c.autoAlpha===0));assert.deepEqual(stats.map(s=>s.textContent),['0M+','0+','$0M+']);
 drive(timeline.labels.metricText);assert.equal(logos.autoAlpha,1);assert.equal(logos.backgroundColor,'#F5F3F0');assert.ok(contents.every(c=>c.autoAlpha===0));
 drive(timeline.labels.metricText+.4);assert.ok(parseFloat(stats[0].textContent)>0 && parseFloat(stats[0].textContent)<80);
 // Layout refreshes at every stage must preserve geometry, then reverse cleanly.
 for (const time of [0, 2.3, 2.8, 3.2, 4.2, 4.6, 5.5, timeline.duration()]) {
   drive(time);
   const snapshot = () => JSON.stringify([row.y, ...boxes.map(b=>b.x), ...metrics.map(m=>[m.y,m.autoAlpha]), ...contents.map(c=>[c.y,c.autoAlpha]), surface.width,surface.height,surface.x,surface.y]);
   const before=snapshot();
   for(let refresh=0;refresh<3;refresh++) { refreshCallbacks.forEach(f=>f());assert.equal(snapshot(),before, 'geometry must survive refresh at '+time); }
 }
 driver.progress(1);assert.deepEqual(stats.map(s=>s.textContent),originals);assert.ok(tiles.every(t=>t.borderRadius===24));
 refreshCallbacks.forEach(f=>f()); assert.equal(row.y,0, 'refresh must keep quote above metrics'); assert.ok(boxes.every(b=>b.x===0), 'refresh must keep icons beside text'); driver.progress(0);assert.equal(surface.width,1470);assert.equal(surface.height,801);assert.equal(author.x,0);assert.equal(quote.autoAlpha,1);assert.equal(wrapper.backgroundColor,'#FFFFFF');assert.ok(metrics.every(m=>m.autoAlpha===0));
 // Returning to the opening boundary reverses the timed intro, including liquid text.
 triggerConfig.onUpdate({direction:-1,progress:.01});intro.pause();
 assert.equal(intro.reversed(),true);
 intro.time(1.6);assert.equal(quote.autoAlpha,0);assert.equal(quoteDivider.autoAlpha,0);assert.equal(author.x,0);assert.equal(controlled[0].progress,0);
 intro.time(.7);assert.ok(author.x>0 && author.x<565);
 intro.time(0);assert.equal(author.x,565);assert.equal(quote.autoAlpha,0);assert.equal(wrapper.backgroundColor,'#FFFFFF');assert.equal(surface.autoAlpha,1);
 assert.ok(metrics.every(m=>m.autoAlpha===0));assert.deepEqual(stats.map(s=>s.textContent),['0M+','0+','$0M+']);
 // No replay while stationary or reversing; resume from the current time on direction changes.
 triggerConfig.onUpdate({direction:-1,progress:0});assert.equal(intro.time(),0);
 triggerConfig.onUpdate({direction:1,progress:.03});intro.pause().time(.8);
 const midway=intro.time();triggerConfig.onLeaveBack();intro.pause();assert.equal(intro.time(),midway);assert.equal(intro.reversed(),true);
 intro.time(.5);triggerConfig.onEnter();intro.pause();assert.equal(intro.time(),.5);assert.equal(intro.reversed(),false);
 intro.time(intro.duration());release.pause().progress(1);driver.progress(1);assert.deepEqual(stats.map(s=>s.textContent),originals);
 triggerConfig.onLeaveBack();intro.pause().time(0);assert.equal(author.x,565);assert.equal(quote.autoAlpha,0);assert.equal(wrapper.backgroundColor,'#FFFFFF');assert.equal(surface.autoAlpha,1);
 wrapper.clientWidth=1600;wrapper.clientHeight=900;refreshCallbacks.forEach(f=>f());assert.equal(author.x,630);assert.equal(row.y,260);
 triggerConfig.onEnter();intro.pause().time(intro.duration());release.pause().progress(1);driver.progress(1);assert.deepEqual(stats.map(s=>s.textContent),originals);
 media.matches=false;onMediaChange();assert.ok(!classes.has('is-impact-sequenced'));assert.equal(destroyed,4);assert.equal(surface.restored,true);assert.deepEqual(stats.map(s=>s.textContent),originals);
 wrapper._impactMotionDestroy();realGsap.ticker.sleep();
 console.log('PASS impact: repeated refresh at eight animation stages, reverse, photo/quote order, counters, overlay geometry, resize and cleanup.');
})().catch(e=>{realGsap.ticker.sleep();console.error(e);process.exitCode=1});
