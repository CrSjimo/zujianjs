import { BindableNode, __AbstractPropsAccessor, PropsMapTemplateType } from "./bindable_node";

export abstract class AbstractBinder<T>{

    constructor(propName:string,targetPropsMap:BindableNode<any>['__props']){
        
        this.targetPropsMap = targetPropsMap;
        this.propName = propName;
    }

    targetPropsMap:BindableNode<any>['__props'];
    propName:string;
    bindedBinders:Set<Binder<T>> = new Set();

    bind(...binders:Binder<T>[]):void{
        for(let binder of binders){
            this.bindedBinders.add(binder);
        }
    }

    unbind(...binders:Binder<T>[]):void{
        for(let binder of binders){
            this.bindedBinders.delete(binder);
        }
    }

    protected __set(__val:T,__visitedBinders:Set<Binder<T>>):void{
        this.targetPropsMap[this.propName] = __val;
        for(let nextBinder of this.bindedBinders){
            if(!__visitedBinders.has(nextBinder)){
                __visitedBinders.add(nextBinder);
                nextBinder.__set(__val,__visitedBinders);
            }
        }
    }

}

export class Binder<T> extends AbstractBinder<T>{

    multiBind(binder:Binder<T>){
        this.bind(binder);
        binder.bind(this);
    }

}

export class ReadonlyBinder<T> extends AbstractBinder<T>{

}