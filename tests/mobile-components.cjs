const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
let Slider,Testimonials,width=390,frameId=0;const frames=new Map(),observers=[];
class Element extends EventTarget {constructor(){super();this.dataset={};this.isConnected=true;this.inert=false;this.attrs={};this.classes=new Set();this.classList={add:c=>this.classes.add(c),remove:c=>this.classes.delete(c),contains:c=>this.classes.has(c),toggle:(c,v)=>v?this.classes.add(c):this.classes.delete(c)};this.props={};this.style={setProperty:(k,v)=>this.props[k]=v,removeProperty:k=>delete this.props[k],getPropertyValue:k=>this.props[k]||''}}setAttribute(k,v){this.attrs[k]=v}getAttribute(k){return this.attrs[k]}}
class ResizeObserver {constructor(fn){this.fn=fn;observers.push(this)}observe(){}disconnect(){this.disconnected=true}}
const window=new EventTarget();window.matchMedia=()=>({get matches(){return width<=768}});
const document=new EventTarget();const context={window,document,HTMLElement:Element,ResizeObserver,AbortController,setTimeout,clearTimeout,requestAnimationFrame(fn){const id=++frameId;frames.set(id,fn);return id},cancelAnimationFrame:id=>frames.delete(id),customElements:{get(){},define(n,c){Slider=c}}};vm.runInNewContext(fs.readFileSync('assets/auralink-slider.js','utf8'),context);
const slider=new Slider();slider.events=new AbortController();slider.slides=[Object.assign(new Element(),{offsetHeight:760}),Object.assign(new Element(),{offsetHeight:980})];slider.initSizing();function drain(){const batch=Array.from(frames.values());frames.clear();batch.forEach(f=>f())}drain();assert.equal(slider.props['--slide-stage-height'],'760px');slider.currentIndex=1;observers[0].fn();drain();assert.equal(slider.props['--slide-stage-height'],'980px');width=1280;window.dispatchEvent(new Event('resize'));drain();assert.equal(slider.props['--slide-stage-height'],undefined);
let next=0,prev=0;slider.next=()=>next++;slider.prev=()=>prev++;
slider.handleTouchStart({touches:[{clientX:0,clientY:0}]});slider.handleTouchMove({touches:[{clientX:70,clientY:160}]});slider.handleTouchEnd({});assert.equal(next+prev,0);
slider.handleTouchStart({touches:[{clientX:120,clientY:0}]});slider.handleTouchMove({touches:[{clientX:0,clientY:10}]});slider.handleTouchEnd({});assert.equal(next,1);
slider.disconnectedCallback();assert.equal(observers[0].disconnected,true);assert.equal(frames.size,0);
// Merchant can remove every slide, leave one, or reconnect after reordering.
for (const count of [0, 1]) {
 const item=new Slider();const items=Array.from({length:count},()=>Object.assign(new Element(),{offsetHeight:650}));
 item.querySelector=()=>null;item.querySelectorAll=()=>items;
 item.connectedCallback();drain();item.next();item.prev();item.goTo(NaN);item.goTo(-1);item.goTo(50);
 assert.equal(item.currentIndex,0);item.disconnectedCallback();
 if(count){item.connectedCallback();drain();assert.equal(item.currentIndex,0);item.disconnectedCallback();}
}
// Testimonials keep native vertical scrolling and stop offscreen/hidden timers.
let timerId=0;const timers=new Map();let view;
window.matchMedia=()=>({matches:false});document.hidden=false;
class IO{constructor(fn){this.fn=fn;view=this}observe(){}disconnect(){this.disconnected=true}}
const slides=[new Element(),new Element(),new Element()],dots=slides.map(()=>new Element());slides[0].classes.add('is-active');
const testContext={window,document,HTMLElement:Element,AbortController,IntersectionObserver:IO,CustomEvent:class extends Event{constructor(n,o){super(n,o)}},setInterval(fn){const id=++timerId;timers.set(id,fn);return id},clearInterval:id=>timers.delete(id),customElements:{get(){},define(n,c){Testimonials=c}}};vm.runInNewContext(fs.readFileSync('assets/auralink-testimonials.js','utf8'),testContext);
const testimonials=new Testimonials();testimonials.querySelectorAll=s=>s.includes('__slide')?slides:dots;testimonials.connectedCallback();assert.equal(timers.size,1);assert.equal(slides[1].inert,true);
function touch(name,x,y){const e=new Event(name);e.touches=[{clientX:x,clientY:y}];testimonials.dispatchEvent(e)}
touch('touchstart',0,0);touch('touchmove',70,160);touch('touchend',70,160);assert.equal(testimonials.currentIndex,0);
touch('touchstart',120,0);touch('touchmove',0,8);touch('touchend',0,8);assert.equal(testimonials.currentIndex,1);assert.equal(slides[1].inert,false);assert.equal(slides[0].inert,true);
view.fn([{isIntersecting:false}]);assert.equal(timers.size,0);view.fn([{isIntersecting:true}]);assert.equal(timers.size,1);
document.hidden=true;document.dispatchEvent(new Event('visibilitychange'));assert.equal(timers.size,0);document.hidden=false;document.dispatchEvent(new Event('visibilitychange'));assert.equal(timers.size,1);
testimonials.disconnectedCallback();assert.equal(timers.size,0);assert.equal(view.disconnected,true);const index=testimonials.currentIndex;touch('touchstart',120,0);touch('touchmove',0,0);touch('touchend',0,0);assert.equal(testimonials.currentIndex,index);
for (const count of [0,1]) {
 const item=new Testimonials();const items=Array.from({length:count},()=>new Element());
 item.querySelectorAll=()=>items;item.connectedCallback();item.next();item.prev();item.goTo(NaN);
 assert.equal(item.currentIndex,0);item.disconnectedCallback();assert.equal(timers.size,0);
}
console.log('PASS mobile components: natural 760/980px card heights, desktop reset, vertical-vs-horizontal swipes, inactive-slide focus guards, offscreen/hidden autoplay suspension and disconnect cleanup.');
