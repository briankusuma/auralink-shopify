const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
let nextFrame=0,nextTimer=0;const frames=new Map(),timers=new Map(),observers=[];let eligible=true;
class Element extends EventTarget {
 constructor(){super();this.classList=new Set();this.classList.contains=this.classList.has.bind(this.classList);this.classList.remove=this.classList.delete.bind(this.classList);this.style={};this.scrollHeight=4200;this.scrollWidth=1280;this.clientWidth=1280;this.clientHeight=800;this.nodeType=1;this.tagName='DIV'}
 matches(selector){return this.nested===true}
}
class FakeWindow extends EventTarget {constructor(){super();this.innerWidth=1280;this.innerHeight=800;this.scrollY=0;this.scrollX=0;this.location={href:'https://example.test/'}}scrollTo(o){this.scrollY=o.top??this.scrollY;this.scrollX=o.left??this.scrollX}}
const window=new FakeWindow(),html=new Element(),body=new Element(),document=new EventTarget();Object.assign(document,{documentElement:html,body,readyState:'complete',hidden:false});
const query=new EventTarget();Object.defineProperty(query,'matches',{get:()=>eligible});window.matchMedia=s=>s.includes('prefers-reduced-motion: reduce')?{matches:false}:query;
const triggers=new Map();let updates=0;
window.ScrollTrigger={update(){updates++},addEventListener:(n,f)=>triggers.set(n,f),removeEventListener:n=>triggers.delete(n),refresh(){triggers.get('refresh')?.()}};
class RO {constructor(fn){this.fn=fn;this.elements=[];observers.push(this)}observe(el){this.elements.push(el)}disconnect(){this.elements=[]}}
class MO extends RO{}
const context={window,document,Window:FakeWindow,HTMLElement:Element,Element,navigator:{userAgent:'test'},ResizeObserver:RO,MutationObserver:MO,CustomEvent:class extends Event {constructor(n,o){super(n,o);this.detail=o?.detail}},Event,URL,performance:{now:()=>0},getComputedStyle:()=>({overflow:'visible',overflowY:'visible',overflowX:'visible',scrollBehavior:'auto'}),setTimeout(f){const id=++nextTimer;timers.set(id,f);return id},clearTimeout:id=>timers.delete(id),requestAnimationFrame(f){const id=++nextFrame;frames.set(id,f);return id},cancelAnimationFrame:id=>frames.delete(id),console};context.globalThis=context;
vm.createContext(context);vm.runInContext(fs.readFileSync('assets/lenis.js','utf8'),context);window.Lenis=context.Lenis;vm.runInContext(fs.readFileSync('assets/auralink-smooth-scroll.js','utf8'),context);
const service=window.AuraLinkSmoothScroll;let instance=service.instance;
assert.equal(service.active,true);assert.equal(instance.options.wrapper,window);assert.equal(instance.options.content,html);assert.equal(instance.options.syncTouch,false);assert.equal(instance.options.anchors,true);assert.equal(instance.options.infinite,false);assert.equal(instance.limit,3400);
function frame(){const pending=Array.from(frames.values());frames.clear();pending.forEach(fn=>fn(16))}
frame();html.scrollHeight=6400;observers.find(o=>o.elements.includes(body)&&o instanceof RO&&!(o instanceof MO)).fn();frame();assert.equal(instance.limit,5600);
instance.scrollTo('bottom',{immediate:true});assert.equal(window.scrollY,5600);assert.ok(updates>0);
html.scrollHeight=7100;window.ScrollTrigger.refresh();frame();assert.equal(instance.limit,6300);instance.scrollTo('bottom',{immediate:true});assert.equal(window.scrollY,6300);
assert.equal(instance.options.prevent(Object.assign(new Element(),{nested:true})),true);assert.equal(instance.options.virtualScroll({event:{defaultPrevented:true}}),false);assert.equal(instance.options.virtualScroll({event:{altKey:true}}),false);
const lockObserver=observers.find(o=>o instanceof MO);body.classList.add('overflow-hidden');lockObserver.fn();assert.equal(instance.isStopped,true);body.classList.delete('overflow-hidden');lockObserver.fn();assert.equal(instance.isStopped,false);
body.classList.add('loading-screen-active');lockObserver.fn();assert.equal(instance.isStopped,true);body.classList.delete('loading-screen-active');lockObserver.fn();assert.equal(instance.isStopped,false);
eligible=false;query.dispatchEvent(new Event('change'));assert.equal(service.active,false);assert.equal(html.classList.has('lenis'),false);
eligible=true;query.dispatchEvent(new Event('change'));assert.equal(service.active,true);assert.notEqual(service.instance,instance);instance=service.instance;
window.dispatchEvent(new Event('pagehide'));assert.equal(service.active,false);frame();assert.equal(frames.size,0);
const restored=new Event('pageshow');restored.persisted=true;window.dispatchEvent(restored);assert.equal(service.active,true);frame();assert.equal(service.instance.limit,6300);
window.dispatchEvent(new Event('pagehide'));
console.log('PASS real Lenis 1.3.27: document/footer/pin-spacer growth, exact bottom reach, ScrollTrigger sync, modal/loading locks, nested scroll exclusion, native mobile/reduced-motion teardown and BFCache restart.');
