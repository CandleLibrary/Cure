export default ((e,s,u,g)=>({
         fn : {}, 
/************** Maps **************/
    st:s,
    /* Types */ ty: {1:1,2:1,3:2,4:2,8:3,16:3,32:4,64:4,128:5,256:5,264:6,512:6,1025:7,2049:7,4097:8,8193:8,16385:9,32769:9,number:10,num:10,identifier:11,string:11,white_space:12,open_bracket:12,close_bracket:13,operator:13,symbol:14,new_line:14,data_link:15,number_bin:15,number_oct:16,number_hex:16,number_int:17,number_sci:17,number_flt:18,alpha_numeric:18,white_space_new_line:30,id:19,str:20,ws:20,ob:21,cb:21,op:22,sym:22,nl:23,dl:23,int:24,integer:24,bin:25,binary:25,oct:26,octal:26,hex:27,hexadecimal:27,flt:28,float:28,sci:29,scientific:29,any:31,keyword:32},
    /* Symbols To Inject into the Lexer */ sym : [],
    /* Symbol Lookup map */ lu : new Map([["num",1],["id",1],["alpha_numeric",2],["str",2],["ws",3],["ob",3],["cb",4],["op",4],["sym",5],["nl",5],["white_space_new_line",6],["dl",6],["binary",7],["octal",7],["hexadecimal",8],["integer",8],["scientific",9],["float",9],[1,10],[2,19],[4,20],[8,20],[16,21],[32,21],[64,22],[128,22],[256,23],[512,23],[1025,25],[2049,26],[4097,27],[8193,24],[16385,29],[32769,28],[3,18],[264,30],[200,31],[201,32],[",",34],["(",35],[")",36],["at",37],[null,10],[".",46],["<",40],["anonymous",41],[">",42],[":",43],["/",45]]),
    /* Reverse Symbol Lookup map */ rlu : new Map([[1,"num"],[1,"id"],[2,"alpha_numeric"],[2,"str"],[3,"ws"],[3,"ob"],[4,"cb"],[4,"op"],[5,"sym"],[5,"nl"],[6,"white_space_new_line"],[6,"dl"],[7,"binary"],[7,"octal"],[8,"hexadecimal"],[8,"integer"],[9,"scientific"],[9,"float"],[10,1],[19,2],[20,4],[20,8],[21,16],[21,32],[22,64],[22,128],[23,256],[23,512],[25,1025],[26,2049],[27,4097],[24,8193],[29,16385],[28,32769],[18,3],[30,264],[31,200],[32,201],[34,","],[35,"("],[36,")"],[37,"at"],[10,null],[46,"."],[40,"<"],[41,"anonymous"],[42,">"],[43,":"],[45,"/"]]),
    /* States */ sts : [0,1,2,3,4,5,6,6,7,8,9,10,11,12,13,14,15,16,17,18,19,19,20,19,21,22,23,11,24,25,26,27,28,29,30,31,32].map(i=>s[i]),
    /* Fork Map */fm: [],
    /*Goto Lookup Functions*/ gt:g[0].map(i=>i>=0?u[i]:[]),
/************ Functions *************/
    /* Error Functions */ eh : [e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e],
    /* Environment Functions*/ fns: [function (sym){const b = sym.length - 1,a = b - 2;if(sym[b] !== null)sym[a].push(sym[b]);sym[b] = sym[a];},function (sym){const b = sym.length - 1;sym[b] = ((sym[b] !== null) ? [sym[b]] : []);},sym=>({locations : sym[2].flat()}),sym=>sym[1].locations,sym=>({type : "URL",url : sym[0].url,protocol : sym[0].protocol,line : parseInt(sym[2]),col : parseInt(sym[4])}),sym=>({type : "ANON",line : parseInt(sym[4]),col : parseInt(sym[6])}),sym=>({url : sym[0],protocol : ""}),sym=>((sym[0].url += sym[1],sym[0])),sym=>({protocol : sym[0].url,url : ""})],
    /* State Action Functions */ sa : [e=>18,(a,b,c,e,f,g,p)=>(p.rn(1,a,b,c,e,f),9),e=>26,e=>66,(a,b,c,e,f,g,p)=>(p.rn(1,a,b,c,e,f),10251),e=>50,(a,b,c,e,f,g,p)=>(p.rn(2,a,b,c,e,f),8211),e=>58,(a,b,c,e,f,g,p)=>(p.rn(1,a,b,c,e,f),2059),(a,b,c,e,f,g,p)=>(p.rn(2,a,b,c,e,f),10259),e=>74,e=>82,(a,b,c,e,f,g,p)=>(p.rn(3,a,b,c,e,f),10267),e=>98,e=>154,e=>122,e=>218,e=>146,(a,b,c,e,f,g,p)=>(p.s(g[1],a,b,c,e,f),p.rn(1,a,b,c,e,f),4107),e=>138,e=>162,e=>178,e=>170,e=>186,e=>210,(a,b,c,e,f,g,p)=>(p.rv(g[2],4,0,a,b,c,e,f),6179),(a,b,c,e,f,g,p)=>(p.rv(g[6],1,0,a,b,c,e,f),14347),(a,b,c,e,f,g,p)=>(p.rv(g[7],2,0,a,b,c,e,f),14355),e=>202,e=>226,(a,b,c,e,f,g,p)=>(p.rv(g[3],2,0,a,b,c,e,f),12307),e=>234,e=>242,e=>258,e=>266,e=>274,(a,b,c,e,f,g,p)=>(p.s(g[0],a,b,c,e,f),p.rn(3,a,b,c,e,f),4123),(a,b,c,e,f,g,p)=>(p.rv(g[8],4,0,a,b,c,e,f),14371),(a,b,c,e,f,g,p)=>(p.rv(g[4],5,0,a,b,c,e,f),12331),e=>282,e=>290,(a,b,c,e,f,g,p)=>(p.rv(g[5],7,0,a,b,c,e,f),12347)],
    /* Get Token Function  */ gtk:function getToken(l, SYM_LU, IGNORE_KEYWORDS = false) {    if (l.END)        return 0;    if ((l.ty & 1)) {        if (!IGNORE_KEYWORDS && SYM_LU.has(l.tx))            return SYM_LU.get(l.tx);        switch (l.ty) {            case 16385:                return 29;            case 4097:                return 27;            case 2049:                return 26;            case 1025:                return 25;            case 32769:                return 28;            case 8193:                return 24;            default:            case 1:                return 10;        }    }    switch (l.ty) {        case 2:            if (!IGNORE_KEYWORDS && SYM_LU.has(l.tx))                return 32;            return 19;        case 4:            return 20;        case 256:            return 23;        case 8:            return 20;        case 512:            return 23;        default:            return SYM_LU.get(l.tx) || SYM_LU.get(l.ty);    }},
}))((tk,r,o,l,p)=>{if(l.END)l.throw("Unexpected end of input");else if(l.ty & (264)) l.throw(`Unexpected space character within input "${p.slice(l)}" `) ; else l.throw(`Unexpected token [${l.tx}]`)},...([
    [[-20,0,-2,0,-13,1],[2,-19,0,-2,0],[-19,3,0,-2,0,-16,4],[-19,5,0,-2,0,-11,5,-10,5],[-19,6,0,-2,0,-11,7,-10,8],[9,-19,0,-2,0],[-19,10,0,-2,0,-11,10,-10,10],[-20,0,-2,0,-17,11],[-20,0,-2,0,-18,12],[-19,13,0,-2,0,-11,13,-10,13],[-20,0,-2,0,-11,14],[-19,15,0,-2,0,-16,16],[-20,0,-2,0,-10,17,-1,18],[-20,0,-2,0,-10,19,-1,19],[-20,0,-2,0,-17,20],[-19,21,0,-2,0,-19,22,-1,23,24],[-20,0,-2,0,-18,25],[26,-19,0,-2,0,-10,26,-1,26],[-19,27,0,-2,0,-13,1,-5,27,-1,27,27],[-19,28,0,-2,0,-19,28,-1,28,28],[-10,29,-9,0,-2,0,-21,30],[-20,0,-2,0,-10,31,-1,31],[-20,0,-2,0,-19,32],[-20,0,-2,0,-19,33],[-20,0,-2,0,-21,34],[-10,35,-9,0,-2,0],[-10,36,-9,0,-2,0],[-20,0,-2,0,-10,37,-1,37],[-19,38,0,-2,0,-19,38,-1,38,38],[-20,0,-2,0,-10,39,-1,39],[-20,0,-2,0,-19,40],[-10,41,-9,0,-2,0],[-20,0,-2,0,-10,42,-1,42]],
    [[-1,1,-1,5,11],[-5,4],[-2,13,-3,14,16],[-3,24,11],[-6,31,16]],
    [[0,-1,1,-9,2,-6,3,-7,4,-9]]
    ]).map(e=>e.map(s=>s.flatMap(d=> d < 0 ? (new Array(-d)).fill(-1) : d)))
);