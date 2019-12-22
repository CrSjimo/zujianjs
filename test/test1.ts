import { BindableNode } from "../lib/bindable_node";

interface T1{
    a:number;
    b:number;
}
interface T2{
    c:string;
    d:boolean;
}
let a = new BindableNode<{props:T1,readonlyProps:T2}>({
    props:{
        a:{
            initVal:1,
        },
        b:{
            initVal:1,
        },
    },
    readonlyProps:{
        c:{
            initVal:"1",
        },
        d:{
            initVal:false,
        }
    }
});