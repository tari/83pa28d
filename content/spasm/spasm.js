var qa;qa||(qa=typeof Module !== 'undefined' ? Module : {});
window.SPASM=function(){function ha(){return(ha=k.asm.w).apply(null,arguments)}function ra(){return(ra=k.asm.t).apply(null,arguments)}function sa(a,b,d,e){a||(a=this);this.parent=a;this.G=a.G;this.ma=null;this.id=c.Lb++;this.name=b;this.mode=d;this.A={};this.C={};this.rdev=e}function ta(a){var b=document.createElement("span");b.innerHTML=a.replace(/[<>&]/,function(d){return{"<":"&lt;",">":"&gt;","&":"&amp;"}[d]});window.log.push(b);return b}function Ka(a){return k.locateFile?k.locateFile(a,E):E+a}
function F(a,b,d){var e=b+d;for(d=b;a[d]&&!(d>=e);)++d;if(16<d-b&&a.buffer&&ua)return ua.decode(a.subarray(b,d));for(e="";b<d;){var f=a[b++];if(f&128){var g=a[b++]&63;if(192==(f&224))e+=String.fromCharCode((f&31)<<6|g);else{var h=a[b++]&63;f=224==(f&240)?(f&15)<<12|g<<6|h:(f&7)<<18|g<<12|h<<6|a[b++]&63;65536>f?e+=String.fromCharCode(f):(f-=65536,e+=String.fromCharCode(55296|f>>10,56320|f&1023))}}else e+=String.fromCharCode(f)}return e}function U(a,b,d,e){if(!(0<e))return 0;var f=d;e=d+e-1;for(var g=
0;g<a.length;++g){var h=a.charCodeAt(g);if(55296<=h&&57343>=h){var m=a.charCodeAt(++g);h=65536+((h&1023)<<10)|m&1023}if(127>=h){if(d>=e)break;b[d++]=h}else{if(2047>=h){if(d+1>=e)break;b[d++]=192|h>>6}else{if(65535>=h){if(d+2>=e)break;b[d++]=224|h>>12}else{if(d+3>=e)break;b[d++]=240|h>>18;b[d++]=128|h>>12&63}b[d++]=128|h>>6&63}b[d++]=128|h&63}}b[d]=0;return d-f}function V(a){for(var b=0,d=0;d<a.length;++d){var e=a.charCodeAt(d);127>=e?b++:2047>=e?b+=2:55296<=e&&57343>=e?(b+=4,++d):b+=3}return b}function W(){M++;
k.monitorRunDependencies&&k.monitorRunDependencies(M)}function Q(){M--;k.monitorRunDependencies&&k.monitorRunDependencies(M);if(0==M&&(null!==ia&&(clearInterval(ia),ia=null),R)){var a=R;R=null;a()}}function G(a){if(k.onAbort)k.onAbort(a);a="Aborted("+a+")";H(a);ja=!0;X=1;throw new WebAssembly.RuntimeError(a+". Build with -sASSERTIONS for more info.");}function va(a){return a.startsWith("data:application/octet-stream;base64,")}function wa(a){try{if(a==C&&S)return new Uint8Array(S);if(ka)return ka(a);
throw"both async and sync fetching of the wasm failed";}catch(b){G(b)}}function La(){if(!S&&(xa||O)){if("function"==typeof fetch&&!C.startsWith("file://"))return fetch(C,{credentials:"same-origin"}).then(function(a){if(!a.ok)throw"failed to load wasm binary file at '"+C+"'";return a.arrayBuffer()}).catch(function(){return wa(C)});if(Y)return new Promise(function(a,b){Y(C,function(d){a(new Uint8Array(d))},b)})}return Promise.resolve().then(function(){return wa(C)})}function Z(a){this.name="ExitStatus";
this.message="Program terminated with exit("+a+")";this.status=a}function aa(a){for(;0<a.length;)a.shift()(k)}function Ma(){if("object"==typeof crypto&&"function"==typeof crypto.getRandomValues){var a=new Uint8Array(1);return()=>{crypto.getRandomValues(a);return a[0]}}if(ba)try{var b=require("crypto");return()=>b.randomBytes(1)[0]}catch(d){}return()=>G("randomDevice")}function la(a,b,d){d=0<d?d:V(a)+1;d=Array(d);a=U(a,d,0,d.length);b&&(d.length=a);return d}function Na(a,b,d,e){var f=e?"":"al "+a;
Y(a,g=>{g||G('Loading data file "'+a+'" failed (no arrayBuffer).');b(new Uint8Array(g));f&&Q(f)},()=>{if(d)d();else throw'Loading data file "'+a+'" failed.';});f&&W(f)}function ya(a){X=X=a;if(!za){if(k.onExit)k.onExit(a);ja=!0}ca(a,new Z(a))}function Aa(a=[]){var b=Ba;a.unshift(ma);var d=a.length,e=ha(4*(d+1)),f=e>>2;a.forEach(h=>{var m=v,q=f++,l=V(h)+1,n=ha(l);U(h,N,n,l);m[q]=n});v[f]=0;try{var g=b(d,e);ya(g,!0);return g}catch(h){return h instanceof Z||"unwind"==h?a=X:(ca(1,h),a=void 0),a}}function Ca(a=
na){function b(){if(!da&&(da=!0,k.calledRun=!0,!ja)){k.noFSInit||c.aa.Da||c.aa();c.hb=!1;K.aa();aa(Da);aa(Oa);if(k.onRuntimeInitialized)k.onRuntimeInitialized();Ea&&Aa(a);if(k.postRun)for("function"==typeof k.postRun&&(k.postRun=[k.postRun]);k.postRun.length;)Fa.unshift(k.postRun.shift());aa(Fa)}}if(!(0<M)){if(k.preRun)for("function"==typeof k.preRun&&(k.preRun=[k.preRun]);k.preRun.length;)Ga.unshift(k.preRun.shift());aa(Ga);0<M||(k.setStatus?(k.setStatus("Running..."),setTimeout(function(){setTimeout(function(){k.setStatus("")},
1);b()},1)):b())}}var k={print:ta,printErr:function(a){ta(a).className+=" error"}},Ha=Object.assign({},k),na=[],ma="./this.program",ca=(a,b)=>{throw b;},xa="object"==typeof window,O="function"==typeof importScripts,ba="object"==typeof process&&"object"==typeof process.versions&&"string"==typeof process.versions.node,E="";if(ba){var oa=require("fs"),pa=require("path");E=O?pa.dirname(E)+"/":__dirname+"/";var ea=(a,b)=>{a=a.startsWith("file://")?new URL(a):pa.normalize(a);return oa.readFileSync(a,b?
void 0:"utf8")};var ka=a=>{a=ea(a,!0);a.buffer||(a=new Uint8Array(a));return a};var Y=(a,b,d)=>{a=a.startsWith("file://")?new URL(a):pa.normalize(a);oa.readFile(a,function(e,f){e?d(e):b(f.buffer)})};1<process.argv.length&&(ma=process.argv[1].replace(/\\/g,"/"));na=process.argv.slice(2);"undefined"!=typeof module&&(module.exports=k);process.on("uncaughtException",function(a){if(!(a instanceof Z))throw a;});if(15>process.version.match(/^v(\d+)\./)[1])process.on("unhandledRejection",function(a){throw a;
});ca=(a,b)=>{if(za)throw process.exitCode=a,b;b instanceof Z||H("exiting due to exception: "+b);process.exit(a)};k.inspect=function(){return"[Emscripten Module object]"}}else if(xa||O)O?E=self.location.href:"undefined"!=typeof document&&document.currentScript&&(E=document.currentScript.src),E=0!==E.indexOf("blob:")?E.substr(0,E.replace(/[?#].*/,"").lastIndexOf("/")+1):"",ea=a=>{var b=new XMLHttpRequest;b.open("GET",a,!1);b.send(null);return b.responseText},O&&(ka=a=>{var b=new XMLHttpRequest;b.open("GET",
a,!1);b.responseType="arraybuffer";b.send(null);return new Uint8Array(b.response)}),Y=(a,b,d)=>{var e=new XMLHttpRequest;e.open("GET",a,!0);e.responseType="arraybuffer";e.onload=()=>{200==e.status||0==e.status&&e.response?b(e.response):d()};e.onerror=d;e.send(null)};var fa=k.print||console.log.bind(console),H=k.printErr||console.warn.bind(console);Object.assign(k,Ha);Ha=null;k.arguments&&(na=k.arguments);k.thisProgram&&(ma=k.thisProgram);k.quit&&(ca=k.quit);var S;k.wasmBinary&&(S=k.wasmBinary);var za=
k.noExitRuntime||!0;"object"!=typeof WebAssembly&&G("no native wasm support detected");var Ia,ja=!1,X,ua="undefined"!=typeof TextDecoder?new TextDecoder("utf8"):void 0,N,I,Ja,v,B,Ga=[],Da=[],Oa=[],Fa=[],M=0,ia=null,R=null;var C="spasm.wasm";va(C)||(C=Ka(C));var r,x,t={Fa:a=>"/"===a.charAt(0),Sb:a=>/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/.exec(a).slice(1),jb:(a,b)=>{for(var d=0,e=a.length-1;0<=e;e--){var f=a[e];"."===f?a.splice(e,1):".."===f?(a.splice(e,1),d++):d&&(a.splice(e,
1),d--)}if(b)for(;d;d--)a.unshift("..");return a},normalize:a=>{var b=t.Fa(a),d="/"===a.substr(-1);(a=t.jb(a.split("/").filter(e=>!!e),!b).join("/"))||b||(a=".");a&&d&&(a+="/");return(b?"/":"")+a},dirname:a=>{var b=t.Sb(a);a=b[0];b=b[1];if(!a&&!b)return".";b&&(b=b.substr(0,b.length-1));return a+b},basename:a=>{if("/"===a)return"/";a=t.normalize(a);a=a.replace(/\/$/,"");var b=a.lastIndexOf("/");return-1===b?a:a.substr(b+1)},join:function(){var a=Array.prototype.slice.call(arguments);return t.normalize(a.join("/"))},
Y:(a,b)=>t.normalize(a+"/"+b)},J={resolve:function(){for(var a="",b=!1,d=arguments.length-1;-1<=d&&!b;d--){b=0<=d?arguments[d]:c.cwd();if("string"!=typeof b)throw new TypeError("Arguments to path.resolve must be strings");if(!b)return"";a=b+"/"+a;b=t.Fa(b)}a=t.jb(a.split("/").filter(e=>!!e),!b).join("/");return(b?"/":"")+a||"."},relative:(a,b)=>{function d(h){for(var m=0;m<h.length&&""===h[m];m++);for(var q=h.length-1;0<=q&&""===h[q];q--);return m>q?[]:h.slice(m,q-m+1)}a=J.resolve(a).substr(1);b=
J.resolve(b).substr(1);a=d(a.split("/"));b=d(b.split("/"));for(var e=Math.min(a.length,b.length),f=e,g=0;g<e;g++)if(a[g]!==b[g]){f=g;break}e=[];for(g=f;g<a.length;g++)e.push("..");e=e.concat(b.slice(f));return e.join("/")}},K={lb:[],aa:function(){},lc:function(){},register:function(a,b){K.lb[a]={input:[],output:[],ea:b};c.Na(a,K.C)},C:{open:function(a){var b=K.lb[a.node.rdev];if(!b)throw new c.v(43);a.tty=b;a.seekable=!1},close:function(a){a.tty.ea.fsync(a.tty)},fsync:function(a){a.tty.ea.fsync(a.tty)},
read:function(a,b,d,e){if(!a.tty||!a.tty.ea.cb)throw new c.v(60);for(var f=0,g=0;g<e;g++){try{var h=a.tty.ea.cb(a.tty)}catch(m){throw new c.v(29);}if(void 0===h&&0===f)throw new c.v(6);if(null===h||void 0===h)break;f++;b[d+g]=h}f&&(a.node.timestamp=Date.now());return f},write:function(a,b,d,e){if(!a.tty||!a.tty.ea.Ka)throw new c.v(60);try{for(var f=0;f<e;f++)a.tty.ea.Ka(a.tty,b[d+f])}catch(g){throw new c.v(29);}e&&(a.node.timestamp=Date.now());return f}},Bb:{cb:function(a){if(!a.input.length){var b=
null;if(ba){var d=Buffer.alloc(256),e=0;try{e=oa.readSync(process.stdin.fd,d,0,256,-1)}catch(f){if(f.toString().includes("EOF"))e=0;else throw f;}0<e?b=d.slice(0,e).toString("utf-8"):b=null}else"undefined"!=typeof window&&"function"==typeof window.prompt?(b=window.prompt("Input: "),null!==b&&(b+="\n")):"function"==typeof readline&&(b=readline(),null!==b&&(b+="\n"));if(!b)return null;a.input=la(b,!0)}return a.input.shift()},Ka:function(a,b){null===b||10===b?(fa(F(a.output,0)),a.output=[]):0!=b&&a.output.push(b)},
fsync:function(a){a.output&&0<a.output.length&&(fa(F(a.output,0)),a.output=[])}},Ab:{Ka:function(a,b){null===b||10===b?(H(F(a.output,0)),a.output=[]):0!=b&&a.output.push(b)},fsync:function(a){a.output&&0<a.output.length&&(H(F(a.output,0)),a.output=[])}}},p={P:null,G:function(){return p.createNode(null,"/",16895,0)},createNode:function(a,b,d,e){if(c.Gb(d)||c.isFIFO(d))throw new c.v(63);p.P||(p.P={dir:{node:{M:p.A.M,I:p.A.I,lookup:p.A.lookup,S:p.A.S,rename:p.A.rename,unlink:p.A.unlink,rmdir:p.A.rmdir,
readdir:p.A.readdir,symlink:p.A.symlink},stream:{N:p.C.N}},file:{node:{M:p.A.M,I:p.A.I},stream:{N:p.C.N,read:p.C.read,write:p.C.write,ha:p.C.ha,ba:p.C.ba,da:p.C.da}},link:{node:{M:p.A.M,I:p.A.I,readlink:p.A.readlink},stream:{}},Sa:{node:{M:p.A.M,I:p.A.I},stream:c.tb}});d=c.createNode(a,b,d,e);c.H(d.mode)?(d.A=p.P.dir.node,d.C=p.P.dir.stream,d.B={}):c.isFile(d.mode)?(d.A=p.P.file.node,d.C=p.P.file.stream,d.F=0,d.B=null):c.la(d.mode)?(d.A=p.P.link.node,d.C=p.P.link.stream):c.pa(d.mode)&&(d.A=p.P.Sa.node,
d.C=p.P.Sa.stream);d.timestamp=Date.now();a&&(a.B[b]=d,a.timestamp=d.timestamp);return d},ac:function(a){return a.B?a.B.subarray?a.B.subarray(0,a.F):new Uint8Array(a.B):new Uint8Array(0)},Za:function(a,b){var d=a.B?a.B.length:0;d>=b||(b=Math.max(b,d*(1048576>d?2:1.125)>>>0),0!=d&&(b=Math.max(b,256)),d=a.B,a.B=new Uint8Array(b),0<a.F&&a.B.set(d.subarray(0,a.F),0))},Qb:function(a,b){if(a.F!=b)if(0==b)a.B=null,a.F=0;else{var d=a.B;a.B=new Uint8Array(b);d&&a.B.set(d.subarray(0,Math.min(b,a.F)));a.F=b}},
A:{M:function(a){var b={};b.dev=c.pa(a.mode)?a.id:1;b.ino=a.id;b.mode=a.mode;b.nlink=1;b.uid=0;b.gid=0;b.rdev=a.rdev;c.H(a.mode)?b.size=4096:c.isFile(a.mode)?b.size=a.F:c.la(a.mode)?b.size=a.link.length:b.size=0;b.atime=new Date(a.timestamp);b.mtime=new Date(a.timestamp);b.ctime=new Date(a.timestamp);b.rb=4096;b.blocks=Math.ceil(b.size/b.rb);return b},I:function(a,b){void 0!==b.mode&&(a.mode=b.mode);void 0!==b.timestamp&&(a.timestamp=b.timestamp);void 0!==b.size&&p.Qb(a,b.size)},lookup:function(){throw c.za[44];
},S:function(a,b,d,e){return p.createNode(a,b,d,e)},rename:function(a,b,d){if(c.H(a.mode)){try{var e=c.R(b,d)}catch(g){}if(e)for(var f in e.B)throw new c.v(55);}delete a.parent.B[a.name];a.parent.timestamp=Date.now();a.name=d;b.B[d]=a;b.timestamp=a.parent.timestamp;a.parent=b},unlink:function(a,b){delete a.B[b];a.timestamp=Date.now()},rmdir:function(a,b){var d=c.R(a,b),e;for(e in d.B)throw new c.v(55);delete a.B[b];a.timestamp=Date.now()},readdir:function(a){var b=[".",".."],d;for(d in a.B)a.B.hasOwnProperty(d)&&
b.push(d);return b},symlink:function(a,b,d){a=p.createNode(a,b,41471,0);a.link=d;return a},readlink:function(a){if(!c.la(a.mode))throw new c.v(28);return a.link}},C:{read:function(a,b,d,e,f){var g=a.node.B;if(f>=a.node.F)return 0;a=Math.min(a.node.F-f,e);if(8<a&&g.subarray)b.set(g.subarray(f,f+a),d);else for(e=0;e<a;e++)b[d+e]=g[f+e];return a},write:function(a,b,d,e,f,g){if(!e)return 0;a=a.node;a.timestamp=Date.now();if(b.subarray&&(!a.B||a.B.subarray)){if(g)return a.B=b.subarray(d,d+e),a.F=e;if(0===
a.F&&0===f)return a.B=b.slice(d,d+e),a.F=e;if(f+e<=a.F)return a.B.set(b.subarray(d,d+e),f),e}p.Za(a,f+e);if(a.B.subarray&&b.subarray)a.B.set(b.subarray(d,d+e),f);else for(g=0;g<e;g++)a.B[f+g]=b[d+g];a.F=Math.max(a.F,f+e);return e},N:function(a,b,d){1===d?b+=a.position:2===d&&c.isFile(a.node.mode)&&(b+=a.node.F);if(0>b)throw new c.v(28);return b},ha:function(a,b,d){p.Za(a.node,b+d);a.node.F=Math.max(a.node.F,b+d)},ba:function(a,b,d,e,f){if(!c.isFile(a.node.mode))throw new c.v(43);a=a.node.B;if(f&2||
a.buffer!==N.buffer){if(0<d||d+b<a.length)a.subarray?a=a.subarray(d,d+b):a=Array.prototype.slice.call(a,d,d+b);d=!0;G();b=void 0;if(!b)throw new c.v(48);N.set(a,b)}else d=!1,b=a.byteOffset;return{ic:b,Wb:d}},da:function(a,b,d,e){p.C.write(a,b,0,e,d,!1);return 0}}},c={root:null,na:[],Xa:{},streams:[],Lb:1,O:null,Wa:"/",Da:!1,hb:!0,v:null,za:{},Db:null,ta:0,D:(a,b={})=>{a=J.resolve(a);if(!a)return{path:"",node:null};b=Object.assign({xa:!0,Ma:0},b);if(8<b.Ma)throw new c.v(32);a=a.split("/").filter(h=>
!!h);for(var d=c.root,e="/",f=0;f<a.length;f++){var g=f===a.length-1;if(g&&b.parent)break;d=c.R(d,a[f]);e=t.Y(e,a[f]);c.X(d)&&(!g||g&&b.xa)&&(d=d.ma.root);if(!g||b.K)for(g=0;c.la(d.mode);)if(d=c.readlink(e),e=J.resolve(t.dirname(e),d),d=c.D(e,{Ma:b.Ma+1}).node,40<g++)throw new c.v(32);}return{path:e,node:d}},U:a=>{for(var b;;){if(c.qa(a))return a=a.G.ib,b?"/"!==a[a.length-1]?a+"/"+b:a+b:a;b=b?a.name+"/"+b:a.name;a=a.parent}},Ca:(a,b)=>{for(var d=0,e=0;e<b.length;e++)d=(d<<5)-d+b.charCodeAt(e)|0;return(a+
d>>>0)%c.O.length},fb:a=>{var b=c.Ca(a.parent.id,a.name);a.$=c.O[b];c.O[b]=a},gb:a=>{var b=c.Ca(a.parent.id,a.name);if(c.O[b]===a)c.O[b]=a.$;else for(b=c.O[b];b;){if(b.$===a){b.$=a.$;break}b=b.$}},R:(a,b)=>{var d=c.Ib(a);if(d)throw new c.v(d,a);for(d=c.O[c.Ca(a.id,b)];d;d=d.$){var e=d.name;if(d.parent.id===a.id&&e===b)return d}return c.lookup(a,b)},createNode:(a,b,d,e)=>{a=new c.nb(a,b,d,e);c.fb(a);return a},wa:a=>{c.gb(a)},qa:a=>a===a.parent,X:a=>!!a.ma,isFile:a=>32768===(a&61440),H:a=>16384===(a&
61440),la:a=>40960===(a&61440),pa:a=>8192===(a&61440),Gb:a=>24576===(a&61440),isFIFO:a=>4096===(a&61440),isSocket:a=>49152===(a&49152),Eb:{r:0,"r+":2,w:577,"w+":578,a:1089,"a+":1090},Kb:a=>{var b=c.Eb[a];if("undefined"==typeof b)throw Error("Unknown file open mode: "+a);return b},$a:a=>{var b=["r","w","rw"][a&3];a&512&&(b+="w");return b},V:(a,b)=>{if(c.hb)return 0;if(!b.includes("r")||a.mode&292){if(b.includes("w")&&!(a.mode&146)||b.includes("x")&&!(a.mode&73))return 2}else return 2;return 0},Ib:a=>
{var b=c.V(a,"x");return b?b:a.A.lookup?0:2},Ja:(a,b)=>{try{return c.R(a,b),20}catch(d){}return c.V(a,"wx")},ra:(a,b,d)=>{try{var e=c.R(a,b)}catch(f){return f.J}if(a=c.V(a,"wx"))return a;if(d){if(!c.H(e.mode))return 54;if(c.qa(e)||c.U(e)===c.cwd())return 10}else if(c.H(e.mode))return 31;return 0},Jb:(a,b)=>a?c.la(a.mode)?32:c.H(a.mode)&&("r"!==c.$a(b)||b&512)?31:c.V(a,c.$a(b)):44,ob:4096,Mb:(a=0,b=c.ob)=>{for(;a<=b;a++)if(!c.streams[a])return a;throw new c.v(33);},ja:a=>c.streams[a],Va:(a,b,d)=>{c.oa||
(c.oa=function(){this.T={}},c.oa.prototype={},Object.defineProperties(c.oa.prototype,{object:{get:function(){return this.node},set:function(e){this.node=e}},flags:{get:function(){return this.T.flags},set:function(e){this.T.flags=e}},position:{get:function(){return this.T.position},set:function(e){this.T.position=e}}}));a=Object.assign(new c.oa,a);b=c.Mb(b,d);a.fd=b;return c.streams[b]=a},ub:a=>{c.streams[a]=null},tb:{open:a=>{a.C=c.Fb(a.node.rdev).C;a.C.open&&a.C.open(a)},N:()=>{throw new c.v(70);
}},Ia:a=>a>>8,dc:a=>a&255,Z:(a,b)=>a<<8|b,Na:(a,b)=>{c.Xa[a]={C:b}},Fb:a=>c.Xa[a],ab:a=>{var b=[];for(a=[a];a.length;){var d=a.pop();b.push(d);a.push.apply(a,d.na)}return b},kb:(a,b)=>{function d(h){c.ta--;return b(h)}function e(h){if(h){if(!e.Cb)return e.Cb=!0,d(h)}else++g>=f.length&&d(null)}"function"==typeof a&&(b=a,a=!1);c.ta++;1<c.ta&&H("warning: "+c.ta+" FS.syncfs operations in flight at once, probably just doing extra work");var f=c.ab(c.root.G),g=0;f.forEach(h=>{if(!h.type.kb)return e(null);
h.type.kb(h,a,e)})},G:(a,b,d)=>{var e="/"===d,f=!d;if(e&&c.root)throw new c.v(10);if(!e&&!f){var g=c.D(d,{xa:!1});d=g.path;g=g.node;if(c.X(g))throw new c.v(10);if(!c.H(g.mode))throw new c.v(54);}b={type:a,hc:b,ib:d,na:[]};a=a.G(b);a.G=b;b.root=a;e?c.root=a:g&&(g.ma=b,g.G&&g.G.na.push(b));return a},mc:a=>{a=c.D(a,{xa:!1});if(!c.X(a.node))throw new c.v(28);a=a.node;var b=a.ma,d=c.ab(b);Object.keys(c.O).forEach(e=>{for(e=c.O[e];e;){var f=e.$;d.includes(e.G)&&c.wa(e);e=f}});a.ma=null;a.G.na.splice(a.G.na.indexOf(b),
1)},lookup:(a,b)=>a.A.lookup(a,b),S:(a,b,d)=>{var e=c.D(a,{parent:!0}).node;a=t.basename(a);if(!a||"."===a||".."===a)throw new c.v(28);var f=c.Ja(e,a);if(f)throw new c.v(f);if(!e.A.S)throw new c.v(63);return e.A.S(e,a,b,d)},create:(a,b)=>c.S(a,(void 0!==b?b:438)&4095|32768,0),mkdir:(a,b)=>c.S(a,(void 0!==b?b:511)&1023|16384,0),ec:(a,b)=>{a=a.split("/");for(var d="",e=0;e<a.length;++e)if(a[e]){d+="/"+a[e];try{c.mkdir(d,b)}catch(f){if(20!=f.J)throw f;}}},sa:(a,b,d)=>{"undefined"==typeof d&&(d=b,b=438);
return c.S(a,b|8192,d)},symlink:(a,b)=>{if(!J.resolve(a))throw new c.v(44);var d=c.D(b,{parent:!0}).node;if(!d)throw new c.v(44);b=t.basename(b);var e=c.Ja(d,b);if(e)throw new c.v(e);if(!d.A.symlink)throw new c.v(63);return d.A.symlink(d,b,a)},rename:(a,b)=>{var d=t.dirname(a),e=t.dirname(b),f=t.basename(a),g=t.basename(b);var h=c.D(a,{parent:!0});var m=h.node;h=c.D(b,{parent:!0});h=h.node;if(!m||!h)throw new c.v(44);if(m.G!==h.G)throw new c.v(75);var q=c.R(m,f);a=J.relative(a,e);if("."!==a.charAt(0))throw new c.v(28);
a=J.relative(b,d);if("."!==a.charAt(0))throw new c.v(55);try{var l=c.R(h,g)}catch(n){}if(q!==l){b=c.H(q.mode);if(f=c.ra(m,f,b))throw new c.v(f);if(f=l?c.ra(h,g,b):c.Ja(h,g))throw new c.v(f);if(!m.A.rename)throw new c.v(63);if(c.X(q)||l&&c.X(l))throw new c.v(10);if(h!==m&&(f=c.V(m,"w")))throw new c.v(f);c.gb(q);try{m.A.rename(q,h,g)}catch(n){throw n;}finally{c.fb(q)}}},rmdir:a=>{var b=c.D(a,{parent:!0}).node;a=t.basename(a);var d=c.R(b,a),e=c.ra(b,a,!0);if(e)throw new c.v(e);if(!b.A.rmdir)throw new c.v(63);
if(c.X(d))throw new c.v(10);b.A.rmdir(b,a);c.wa(d)},readdir:a=>{a=c.D(a,{K:!0}).node;if(!a.A.readdir)throw new c.v(54);return a.A.readdir(a)},unlink:a=>{var b=c.D(a,{parent:!0}).node;if(!b)throw new c.v(44);a=t.basename(a);var d=c.R(b,a),e=c.ra(b,a,!1);if(e)throw new c.v(e);if(!b.A.unlink)throw new c.v(63);if(c.X(d))throw new c.v(10);b.A.unlink(b,a);c.wa(d)},readlink:a=>{a=c.D(a).node;if(!a)throw new c.v(44);if(!a.A.readlink)throw new c.v(28);return J.resolve(c.U(a.parent),a.A.readlink(a))},stat:(a,
b)=>{a=c.D(a,{K:!b}).node;if(!a)throw new c.v(44);if(!a.A.M)throw new c.v(63);return a.A.M(a)},lstat:a=>c.stat(a,!0),chmod:(a,b,d)=>{a="string"==typeof a?c.D(a,{K:!d}).node:a;if(!a.A.I)throw new c.v(63);a.A.I(a,{mode:b&4095|a.mode&-4096,timestamp:Date.now()})},lchmod:(a,b)=>{c.chmod(a,b,!0)},fchmod:(a,b)=>{a=c.ja(a);if(!a)throw new c.v(8);c.chmod(a.node,b)},chown:(a,b,d,e)=>{a="string"==typeof a?c.D(a,{K:!e}).node:a;if(!a.A.I)throw new c.v(63);a.A.I(a,{timestamp:Date.now()})},lchown:(a,b,d)=>{c.chown(a,
b,d,!0)},fchown:(a,b,d)=>{a=c.ja(a);if(!a)throw new c.v(8);c.chown(a.node,b,d)},truncate:(a,b)=>{if(0>b)throw new c.v(28);a="string"==typeof a?c.D(a,{K:!0}).node:a;if(!a.A.I)throw new c.v(63);if(c.H(a.mode))throw new c.v(31);if(!c.isFile(a.mode))throw new c.v(28);var d=c.V(a,"w");if(d)throw new c.v(d);a.A.I(a,{size:b,timestamp:Date.now()})},$b:(a,b)=>{a=c.ja(a);if(!a)throw new c.v(8);if(0===(a.flags&2097155))throw new c.v(28);c.truncate(a.node,b)},nc:(a,b,d)=>{a=c.D(a,{K:!0}).node;a.A.I(a,{timestamp:Math.max(b,
d)})},open:(a,b,d)=>{if(""===a)throw new c.v(44);b="string"==typeof b?c.Kb(b):b;d=b&64?("undefined"==typeof d?438:d)&4095|32768:0;if("object"==typeof a)var e=a;else{a=t.normalize(a);try{e=c.D(a,{K:!(b&131072)}).node}catch(g){}}var f=!1;if(b&64)if(e){if(b&128)throw new c.v(20);}else e=c.S(a,d,0),f=!0;if(!e)throw new c.v(44);c.pa(e.mode)&&(b&=-513);if(b&65536&&!c.H(e.mode))throw new c.v(54);if(!f&&(d=c.Jb(e,b)))throw new c.v(d);b&512&&!f&&c.truncate(e,0);b&=-131713;e=c.Va({node:e,path:c.U(e),flags:b,
seekable:!0,position:0,C:e.C,Ub:[],error:!1});e.C.open&&e.C.open(e);!k.logReadFiles||b&1||(c.La||(c.La={}),a in c.La||(c.La[a]=1));return e},close:a=>{if(c.ka(a))throw new c.v(8);a.Ba&&(a.Ba=null);try{a.C.close&&a.C.close(a)}catch(b){throw b;}finally{c.ub(a.fd)}a.fd=null},ka:a=>null===a.fd,N:(a,b,d)=>{if(c.ka(a))throw new c.v(8);if(!a.seekable||!a.C.N)throw new c.v(70);if(0!=d&&1!=d&&2!=d)throw new c.v(28);a.position=a.C.N(a,b,d);a.Ub=[];return a.position},read:(a,b,d,e,f)=>{if(0>e||0>f)throw new c.v(28);
if(c.ka(a))throw new c.v(8);if(1===(a.flags&2097155))throw new c.v(8);if(c.H(a.node.mode))throw new c.v(31);if(!a.C.read)throw new c.v(28);var g="undefined"!=typeof f;if(!g)f=a.position;else if(!a.seekable)throw new c.v(70);b=a.C.read(a,b,d,e,f);g||(a.position+=b);return b},write:(a,b,d,e,f,g)=>{if(0>e||0>f)throw new c.v(28);if(c.ka(a))throw new c.v(8);if(0===(a.flags&2097155))throw new c.v(8);if(c.H(a.node.mode))throw new c.v(31);if(!a.C.write)throw new c.v(28);a.seekable&&a.flags&1024&&c.N(a,0,
2);var h="undefined"!=typeof f;if(!h)f=a.position;else if(!a.seekable)throw new c.v(70);b=a.C.write(a,b,d,e,f,g);h||(a.position+=b);return b},ha:(a,b,d)=>{if(c.ka(a))throw new c.v(8);if(0>b||0>=d)throw new c.v(28);if(0===(a.flags&2097155))throw new c.v(8);if(!c.isFile(a.node.mode)&&!c.H(a.node.mode))throw new c.v(43);if(!a.C.ha)throw new c.v(138);a.C.ha(a,b,d)},ba:(a,b,d,e,f)=>{if(0!==(e&2)&&0===(f&2)&&2!==(a.flags&2097155))throw new c.v(2);if(1===(a.flags&2097155))throw new c.v(2);if(!a.C.ba)throw new c.v(43);
return a.C.ba(a,b,d,e,f)},da:(a,b,d,e,f)=>a.C.da?a.C.da(a,b,d,e,f):0,fc:()=>0,Ea:(a,b,d)=>{if(!a.C.Ea)throw new c.v(59);return a.C.Ea(a,b,d)},readFile:(a,b={})=>{b.flags=b.flags||0;b.encoding=b.encoding||"binary";if("utf8"!==b.encoding&&"binary"!==b.encoding)throw Error('Invalid encoding type "'+b.encoding+'"');var d,e=c.open(a,b.flags);a=c.stat(a).size;var f=new Uint8Array(a);c.read(e,f,0,a,0);"utf8"===b.encoding?d=F(f,0):"binary"===b.encoding&&(d=f);c.close(e);return d},writeFile:(a,b,d={})=>{d.flags=
d.flags||577;a=c.open(a,d.flags,d.mode);if("string"==typeof b){var e=new Uint8Array(V(b)+1);b=U(b,e,0,e.length);c.write(a,e,0,b,void 0,d.sb)}else if(ArrayBuffer.isView(b))c.write(a,b,0,b.byteLength,void 0,d.sb);else throw Error("Unsupported data type");c.close(a)},cwd:()=>c.Wa,chdir:a=>{a=c.D(a,{K:!0});if(null===a.node)throw new c.v(44);if(!c.H(a.node.mode))throw new c.v(54);var b=c.V(a.node,"x");if(b)throw new c.v(b);c.Wa=a.path},wb:()=>{c.mkdir("/tmp");c.mkdir("/home");c.mkdir("/home/web_user")},
vb:()=>{c.mkdir("/dev");c.Na(c.Z(1,3),{read:()=>0,write:(b,d,e,f)=>f});c.sa("/dev/null",c.Z(1,3));K.register(c.Z(5,0),K.Bb);K.register(c.Z(6,0),K.Ab);c.sa("/dev/tty",c.Z(5,0));c.sa("/dev/tty1",c.Z(6,0));var a=Ma();c.L("/dev","random",a);c.L("/dev","urandom",a);c.mkdir("/dev/shm");c.mkdir("/dev/shm/tmp")},yb:()=>{c.mkdir("/proc");var a=c.mkdir("/proc/self");c.mkdir("/proc/self/fd");c.G({G:()=>{var b=c.createNode(a,"fd",16895,73);b.A={lookup:(d,e)=>{var f=c.ja(+e);if(!f)throw new c.v(8);d={parent:null,
G:{ib:"fake"},A:{readlink:()=>f.path}};return d.parent=d}};return b}},{},"/proc/self/fd")},zb:()=>{k.stdin?c.L("/dev","stdin",k.stdin):c.symlink("/dev/tty","/dev/stdin");k.stdout?c.L("/dev","stdout",null,k.stdout):c.symlink("/dev/tty","/dev/stdout");k.stderr?c.L("/dev","stderr",null,k.stderr):c.symlink("/dev/tty1","/dev/stderr");c.open("/dev/stdin",0);c.open("/dev/stdout",1);c.open("/dev/stderr",1)},Ya:()=>{c.v||(c.v=function(a,b){this.node=b;this.Rb=function(d){this.J=d};this.Rb(a);this.message=
"FS error"},c.v.prototype=Error(),c.v.prototype.constructor=c.v,[44].forEach(a=>{c.za[a]=new c.v(a);c.za[a].stack="<generic error, no stack>"}))},Tb:()=>{c.Ya();c.O=Array(4096);c.G(p,{},"/");c.wb();c.vb();c.yb();c.Db={MEMFS:p}},aa:(a,b,d)=>{c.aa.Da=!0;c.Ya();k.stdin=a||k.stdin;k.stdout=b||k.stdout;k.stderr=d||k.stderr;c.zb()},jc:()=>{c.aa.Da=!1;for(var a=0;a<c.streams.length;a++){var b=c.streams[a];b&&c.close(b)}},Aa:(a,b)=>{var d=0;a&&(d|=365);b&&(d|=146);return d},Zb:(a,b)=>{a=c.ua(a,b);return a.exists?
a.object:null},ua:(a,b)=>{try{var d=c.D(a,{K:!b});a=d.path}catch(f){}var e={qa:!1,exists:!1,error:0,name:null,path:null,object:null,Nb:!1,Pb:null,Ob:null};try{d=c.D(a,{parent:!0}),e.Nb=!0,e.Pb=d.path,e.Ob=d.node,e.name=t.basename(a),d=c.D(a,{K:!b}),e.exists=!0,e.path=d.path,e.object=d.node,e.name=d.node.name,e.qa="/"===d.path}catch(f){e.error=f.J}return e},va:(a,b)=>{a="string"==typeof a?a:c.U(a);for(b=b.split("/").reverse();b.length;){var d=b.pop();if(d){var e=t.Y(a,d);try{c.mkdir(e)}catch(f){}a=
e}}return e},xb:(a,b,d,e,f)=>{a=t.Y("string"==typeof a?a:c.U(a),b);return c.create(a,c.Aa(e,f))},ia:(a,b,d,e,f,g)=>{var h=b;a&&(a="string"==typeof a?a:c.U(a),h=b?t.Y(a,b):a);a=c.Aa(e,f);h=c.create(h,a);if(d){if("string"==typeof d){b=Array(d.length);e=0;for(f=d.length;e<f;++e)b[e]=d.charCodeAt(e);d=b}c.chmod(h,a|146);b=c.open(h,577);c.write(b,d,0,d.length,0,g);c.close(b);c.chmod(h,a)}return h},L:(a,b,d,e)=>{a=t.Y("string"==typeof a?a:c.U(a),b);b=c.Aa(!!d,!!e);c.L.Ia||(c.L.Ia=64);var f=c.Z(c.L.Ia++,
0);c.Na(f,{open:g=>{g.seekable=!1},close:()=>{e&&e.buffer&&e.buffer.length&&e(10)},read:(g,h,m,q)=>{for(var l=0,n=0;n<q;n++){try{var u=d()}catch(A){throw new c.v(29);}if(void 0===u&&0===l)throw new c.v(6);if(null===u||void 0===u)break;l++;h[m+n]=u}l&&(g.node.timestamp=Date.now());return l},write:(g,h,m,q)=>{for(var l=0;l<q;l++)try{e(h[m+l])}catch(n){throw new c.v(29);}q&&(g.node.timestamp=Date.now());return l}});return c.sa(a,b,f)},ya:a=>{if(a.Ga||a.Hb||a.link||a.B)return!0;if("undefined"!=typeof XMLHttpRequest)throw Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
if(ea)try{a.B=la(ea(a.url),!0),a.F=a.B.length}catch(b){throw new c.v(29);}else throw Error("Cannot load without read() or XMLHttpRequest.");},Ta:(a,b,d,e,f)=>{function g(){this.Ha=!1;this.T=[]}g.prototype.get=function(l){if(!(l>this.length-1||0>l)){var n=l%this.chunkSize;return this.eb(l/this.chunkSize|0)[n]}};g.prototype.mb=function(l){this.eb=l};g.prototype.Qa=function(){var l=new XMLHttpRequest;l.open("HEAD",d,!1);l.send(null);if(!(200<=l.status&&300>l.status||304===l.status))throw Error("Couldn't load "+
d+". Status: "+l.status);var n=Number(l.getResponseHeader("Content-length")),u,A=(u=l.getResponseHeader("Accept-Ranges"))&&"bytes"===u;l=(u=l.getResponseHeader("Content-Encoding"))&&"gzip"===u;var z=1048576;A||(z=n);var y=this;y.mb(L=>{var T=L*z,P=(L+1)*z-1;P=Math.min(P,n-1);if("undefined"==typeof y.T[L]){var Pa=y.T;if(T>P)throw Error("invalid range ("+T+", "+P+") or no bytes requested!");if(P>n-1)throw Error("only "+n+" bytes available! programmer error!");var D=new XMLHttpRequest;D.open("GET",d,
!1);n!==z&&D.setRequestHeader("Range","bytes="+T+"-"+P);D.responseType="arraybuffer";D.overrideMimeType&&D.overrideMimeType("text/plain; charset=x-user-defined");D.send(null);if(!(200<=D.status&&300>D.status||304===D.status))throw Error("Couldn't load "+d+". Status: "+D.status);T=void 0!==D.response?new Uint8Array(D.response||[]):la(D.responseText||"",!0);Pa[L]=T}if("undefined"==typeof y.T[L])throw Error("doXHR failed!");return y.T[L]});if(l||!n)z=n=1,z=n=this.eb(0).length,fa("LazyFiles on gzip forces download of the whole file when length is accessed");
this.qb=n;this.pb=z;this.Ha=!0};if("undefined"!=typeof XMLHttpRequest){if(!O)throw"Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";var h=new g;Object.defineProperties(h,{length:{get:function(){this.Ha||this.Qa();return this.qb}},chunkSize:{get:function(){this.Ha||this.Qa();return this.pb}}});h={Ga:!1,B:h}}else h={Ga:!1,url:d};var m=c.xb(a,b,h,e,f);h.B?m.B=h.B:h.url&&(m.B=null,m.url=h.url);Object.defineProperties(m,{F:{get:function(){return this.B.length}}});
var q={};Object.keys(m.C).forEach(l=>{var n=m.C[l];q[l]=function(){c.ya(m);return n.apply(null,arguments)}});q.read=(l,n,u,A,z)=>{c.ya(m);l=l.node.B;if(z>=l.length)n=0;else{A=Math.min(l.length-z,A);if(l.slice)for(var y=0;y<A;y++)n[u+y]=l[z+y];else for(y=0;y<A;y++)n[u+y]=l.get(z+y);n=A}return n};q.ba=()=>{c.ya(m);G();throw new c.v(48);};m.C=q;return m},Ua:(a,b,d,e,f,g,h,m,q,l)=>{function n(z){function y(L){l&&l();m||c.ia(a,b,L,e,f,q);g&&g();Q(A)}Qa.bc(z,u,y,()=>{h&&h();Q(A)})||y(z)}var u=b?J.resolve(t.Y(a,
b)):a,A="cp "+u;W(A);"string"==typeof d?Na(d,z=>n(z),h):n(d)},indexedDB:()=>window.indexedDB||window.mozIndexedDB||window.webkitIndexedDB||window.msIndexedDB,Oa:()=>"EM_FS_"+window.location.pathname,Pa:20,ga:"FILE_DATA",kc:(a,b=()=>{},d=()=>{})=>{var e=c.indexedDB();try{var f=e.open(c.Oa(),c.Pa)}catch(g){return d(g)}f.onupgradeneeded=()=>{fa("creating db");f.result.createObjectStore(c.ga)};f.onsuccess=()=>{var g=f.result.transaction([c.ga],"readwrite"),h=g.objectStore(c.ga),m=0,q=0,l=a.length;a.forEach(n=>
{n=h.put(c.ua(n).object.B,n);n.onsuccess=()=>{m++;m+q==l&&(0==q?b():d())};n.onerror=()=>{q++;m+q==l&&(0==q?b():d())}});g.onerror=d};f.onerror=d},cc:(a,b=()=>{},d=()=>{})=>{var e=c.indexedDB();try{var f=e.open(c.Oa(),c.Pa)}catch(g){return d(g)}f.onupgradeneeded=d;f.onsuccess=()=>{var g=f.result;try{var h=g.transaction([c.ga],"readonly")}catch(u){d(u);return}var m=h.objectStore(c.ga),q=0,l=0,n=a.length;a.forEach(u=>{var A=m.get(u);A.onsuccess=()=>{c.ua(u).exists&&c.unlink(u);c.ia(t.dirname(u),t.basename(u),
A.result,!0,!0,!0);q++;q+l==n&&(0==l?b():d())};A.onerror=()=>{l++;q+l==n&&(0==l?b():d())}});h.onerror=d};f.onerror=d}},w={Vb:5,Ra:function(a,b,d){if(t.Fa(b))return b;a=-100===a?c.cwd():w.W(a).path;if(0==b.length){if(!d)throw new c.v(44);return a}return t.Y(a,b)},Yb:function(a,b,d){try{var e=a(b)}catch(g){if(g&&g.node&&t.normalize(b)!==t.normalize(c.U(g.node)))return-54;throw g;}v[d>>2]=e.dev;v[d+8>>2]=e.ino;v[d+12>>2]=e.mode;B[d+16>>2]=e.nlink;v[d+20>>2]=e.uid;v[d+24>>2]=e.gid;v[d+28>>2]=e.rdev;x=
[e.size>>>0,(r=e.size,1<=+Math.abs(r)?0<r?(Math.min(+Math.floor(r/4294967296),4294967295)|0)>>>0:~~+Math.ceil((r-+(~~r>>>0))/4294967296)>>>0:0)];v[d+40>>2]=x[0];v[d+44>>2]=x[1];v[d+48>>2]=4096;v[d+52>>2]=e.blocks;a=e.atime.getTime();b=e.mtime.getTime();var f=e.ctime.getTime();x=[Math.floor(a/1E3)>>>0,(r=Math.floor(a/1E3),1<=+Math.abs(r)?0<r?(Math.min(+Math.floor(r/4294967296),4294967295)|0)>>>0:~~+Math.ceil((r-+(~~r>>>0))/4294967296)>>>0:0)];v[d+56>>2]=x[0];v[d+60>>2]=x[1];B[d+64>>2]=a%1E3*1E3;x=
[Math.floor(b/1E3)>>>0,(r=Math.floor(b/1E3),1<=+Math.abs(r)?0<r?(Math.min(+Math.floor(r/4294967296),4294967295)|0)>>>0:~~+Math.ceil((r-+(~~r>>>0))/4294967296)>>>0:0)];v[d+72>>2]=x[0];v[d+76>>2]=x[1];B[d+80>>2]=b%1E3*1E3;x=[Math.floor(f/1E3)>>>0,(r=Math.floor(f/1E3),1<=+Math.abs(r)?0<r?(Math.min(+Math.floor(r/4294967296),4294967295)|0)>>>0:~~+Math.ceil((r-+(~~r>>>0))/4294967296)>>>0:0)];v[d+88>>2]=x[0];v[d+92>>2]=x[1];B[d+96>>2]=f%1E3*1E3;x=[e.ino>>>0,(r=e.ino,1<=+Math.abs(r)?0<r?(Math.min(+Math.floor(r/
4294967296),4294967295)|0)>>>0:~~+Math.ceil((r-+(~~r>>>0))/4294967296)>>>0:0)];v[d+104>>2]=x[0];v[d+108>>2]=x[1];return 0},Xb:function(a,b,d,e,f){if(!c.isFile(b.node.mode))throw new c.v(43);if(e&2)return 0;a=I.slice(a,a+d);c.da(b,a,f,d,e)},fa:void 0,get:function(){w.fa+=4;return v[w.fa-4>>2]},bb:function(a){return a?F(I,a,void 0):""},W:function(a){a=c.ja(a);if(!a)throw new c.v(8);return a}};Object.defineProperties(sa.prototype,{read:{get:function(){return 365===(this.mode&365)},set:function(a){a?
this.mode|=365:this.mode&=-366}},write:{get:function(){return 146===(this.mode&146)},set:function(a){a?this.mode|=146:this.mode&=-147}},Hb:{get:function(){return c.H(this.mode)}},Ga:{get:function(){return c.pa(this.mode)}}});c.nb=sa;c.Tb();var Qa;k.FS_createPath=c.va;k.FS_createDataFile=c.ia;k.FS_createPreloadedFile=c.Ua;k.FS_unlink=c.unlink;k.FS_createLazyFile=c.Ta;k.FS_createDevice=c.L;var Ra={q:function(a,b,d,e){G("Assertion failed: "+(a?F(I,a,void 0):"")+", at: "+[b?b?F(I,b,void 0):"":"unknown filename",
d,e?e?F(I,e,void 0):"":"unknown function"])},h:function(a,b,d){try{b=w.bb(b);b=w.Ra(a,b);if(d&-8)return-28;var e=c.D(b,{K:!0}).node;if(!e)return-44;a="";d&4&&(a+="r");d&2&&(a+="w");d&1&&(a+="x");return a&&c.V(e,a)?-2:0}catch(f){if("undefined"==typeof c||!(f instanceof c.v))throw f;return-f.J}},c:function(a,b,d){w.fa=d;try{var e=w.W(a);switch(b){case 0:var f=w.get();return 0>f?-28:c.Va(e,f).fd;case 1:case 2:return 0;case 3:return e.flags;case 4:return f=w.get(),e.flags|=f,0;case 5:return f=w.get(),
Ja[f+0>>1]=2,0;case 6:case 7:return 0;case 16:case 8:return-28;case 9:return v[ra()>>2]=28,-1;default:return-28}}catch(g){if("undefined"==typeof c||!(g instanceof c.v))throw g;return-g.J}},m:function(a,b){try{if(0===b)return-28;var d=c.cwd(),e=V(d)+1;if(b<e)return-68;U(d,I,a,b);return e}catch(f){if("undefined"==typeof c||!(f instanceof c.v))throw f;return-f.J}},f:function(a,b,d){w.fa=d;try{var e=w.W(a);switch(b){case 21509:case 21505:return e.tty?0:-59;case 21510:case 21511:case 21512:case 21506:case 21507:case 21508:return e.tty?
0:-59;case 21519:if(!e.tty)return-59;var f=w.get();return v[f>>2]=0;case 21520:return e.tty?-28:-59;case 21531:return f=w.get(),c.Ea(e,b,f);case 21523:return e.tty?0:-59;case 21524:return e.tty?0:-59;default:return-28}}catch(g){if("undefined"==typeof c||!(g instanceof c.v))throw g;return-g.J}},g:function(a,b,d,e){w.fa=e;try{b=w.bb(b);b=w.Ra(a,b);var f=e?w.get():0;return c.open(b,d,f).fd}catch(g){if("undefined"==typeof c||!(g instanceof c.v))throw g;return-g.J}},i:function(a){do{var b=B[a>>2];a+=4;
var d=B[a>>2];a+=4;var e=B[a>>2];a+=4;b=b?F(I,b,void 0):"";c.va("/",t.dirname(b),!0,!0);c.ia(b,null,N.subarray(e,e+d),!0,!0,!0)}while(B[a>>2])},n:function(){return!0},k:function(){G("")},o:function(){return Date.now()},p:function(a,b,d){I.copyWithin(a,b,b+d)},l:function(){G("OOM")},a:ya,b:function(a){try{var b=w.W(a);c.close(b);return 0}catch(d){if("undefined"==typeof c||!(d instanceof c.v))throw d;return d.J}},e:function(a,b,d,e){try{a:{var f=w.W(a);a=b;b=void 0;for(var g=0,h=0;h<d;h++){var m=B[a>>
2],q=B[a+4>>2];a+=8;var l=c.read(f,N,m,q,b);if(0>l){var n=-1;break a}g+=l;if(l<q)break;"undefined"!==typeof b&&(b+=l)}n=g}B[e>>2]=n;return 0}catch(u){if("undefined"==typeof c||!(u instanceof c.v))throw u;return u.J}},j:function(a,b,d,e,f){try{b=d+2097152>>>0<4194305-!!b?(b>>>0)+4294967296*d:NaN;if(isNaN(b))return 61;var g=w.W(a);c.N(g,b,e);x=[g.position>>>0,(r=g.position,1<=+Math.abs(r)?0<r?(Math.min(+Math.floor(r/4294967296),4294967295)|0)>>>0:~~+Math.ceil((r-+(~~r>>>0))/4294967296)>>>0:0)];v[f>>
2]=x[0];v[f+4>>2]=x[1];g.Ba&&0===b&&0===e&&(g.Ba=null);return 0}catch(h){if("undefined"==typeof c||!(h instanceof c.v))throw h;return h.J}},d:function(a,b,d,e){try{a:{var f=w.W(a);a=b;b=void 0;for(var g=0,h=0;h<d;h++){var m=B[a>>2],q=B[a+4>>2];a+=8;var l=c.write(f,N,m,q,b);if(0>l){var n=-1;break a}g+=l;"undefined"!==typeof b&&(b+=l)}n=g}B[e>>2]=n;return 0}catch(u){if("undefined"==typeof c||!(u instanceof c.v))throw u;return u.J}}};(function(){function a(f){k.asm=f.exports;Ia=k.asm.r;f=Ia.buffer;k.HEAP8=
N=new Int8Array(f);k.HEAP16=Ja=new Int16Array(f);k.HEAP32=v=new Int32Array(f);k.HEAPU8=I=new Uint8Array(f);k.HEAPU16=new Uint16Array(f);k.HEAPU32=B=new Uint32Array(f);k.HEAPF32=new Float32Array(f);k.HEAPF64=new Float64Array(f);Da.unshift(k.asm.s);Q("wasm-instantiate")}function b(f){a(f.instance)}function d(f){return La().then(function(g){return WebAssembly.instantiate(g,e)}).then(function(g){return g}).then(f,function(g){H("failed to asynchronously prepare wasm: "+g);G(g)})}var e={a:Ra};W("wasm-instantiate");
if(k.instantiateWasm)try{return k.instantiateWasm(e,a)}catch(f){return H("Module.instantiateWasm callback failed with error: "+f),!1}(function(){return S||"function"!=typeof WebAssembly.instantiateStreaming||va(C)||C.startsWith("file://")||ba||"function"!=typeof fetch?d(b):fetch(C,{credentials:"same-origin"}).then(function(f){return WebAssembly.instantiateStreaming(f,e).then(b,function(g){H("wasm streaming compile failed: "+g);H("falling back to ArrayBuffer instantiation");return d(b)})})})();return{}})();
var Ba=k._main=function(){return(Ba=k._main=k.asm.u).apply(null,arguments)};k.___emscripten_embedded_file_data=421496;k.addRunDependency=W;k.removeRunDependency=Q;k.FS_createPath=c.va;k.FS_createDataFile=c.ia;k.FS_createPreloadedFile=c.Ua;k.FS_createLazyFile=c.Ta;k.FS_createDevice=c.L;k.FS_unlink=c.unlink;k.callMain=Aa;var da;R=function b(){da||Ca();da||(R=b)};if(k.preInit)for("function"==typeof k.preInit&&(k.preInit=[k.preInit]);0<k.preInit.length;)k.preInit.pop()();var Ea=!0;k.noInitialRun&&(Ea=
!1);Ca();return{Module:k,FS:{writeFile:c.writeFile,readFile:c.readFile}}}();
