import { BindableNode } from "./bindable_node";
import { Binder } from "./binder";

export type BeforeGetListener<T> = (originVal:T)=>T;
export type BeforeSetListener<T> = (val:T,oldVal:T)=>T;
export function createGetter<T>(
    listener:BeforeGetListener<T>|undefined,
    propName:string,
    targetPropsMap:BindableNode<any>['__props']
):()=>T{
    return ()=>{
        return listener?listener(targetPropsMap[propName]):targetPropsMap[propName];
    };
}
export function createSetter<T>(
    listener:BeforeSetListener<T>|undefined,
    binds:Binder<T>[]|undefined,
    propName:string,
    targetPropsMap:BindableNode<any>['__props'],
    //TODO targetBinders:BindableNode<any>['binders']
):(val:T)=>void{
    return (val)=>{
        targetPropsMap[propName] = listener?listener(val,targetPropsMap[propName]):val;
    };
}