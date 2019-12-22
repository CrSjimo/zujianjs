import { Binder, ReadonlyBinder } from "./binder";
import { BeforeGetListener, BeforeSetListener, createGetter, createSetter } from "./listener";

export interface ComponentPropDescriptor<T>{
    initVal:T;
    beforeGetListener?:BeforeGetListener<T>;
    beforeSetListener?:BeforeSetListener<T>;
    binds?:Binder<T>[];
}

export interface ReadonlyComponentPropDescriptor<T>{
    initVal:T;
    beforeGetListener?:BeforeGetListener<T>;
    binds?:Binder<T>[];
}

export interface PropsTemplate{
    [property:string]:any;
}

export type ComponentPropDescriptorsTemplate<T extends PropsTemplate> = {
    [P in keyof T]:ComponentPropDescriptor<T[P]>;
}

export type ReadonlyComponentPropDescriptorsTemplate<T extends PropsTemplate> = {
    [P in keyof T]:ReadonlyComponentPropDescriptor<T[P]>;
}


export type ComponentPropsMap<Template> = {
    [P in keyof Template]:Template[P];
};

export type ReadonlyComponentPropsMap<ReadonlyTemplate> = {
    readonly [P in keyof ReadonlyTemplate]:ReadonlyTemplate[P];
};


export type ComponentBindersMap<Template> = {
    [P in keyof Template]:Binder<Template[P]>;
};

export type ReadonlyComponentBindersMap<ReadonlyTemplate> = {
    [P in keyof ReadonlyTemplate]:ReadonlyBinder<ReadonlyTemplate[P]>;
};

export type PropsMapTemplateType = {
    props:PropsTemplate;
    readonlyProps:PropsTemplate;
}

export type PropsMapType<T extends PropsMapTemplateType> = {
    props:ComponentPropDescriptorsTemplate<T['props']>;
    readonlyProps:ReadonlyComponentPropDescriptorsTemplate<T['readonlyProps']>
}

export abstract class __AbstractPropsAccessor{
    protected __props:any
}

export class BindableNode<T extends PropsMapTemplateType>{

    constructor(propsMap:PropsMapType<T>){

        (this.props as any) = {};
        (this.binders as any) = {};
        (this.__props as any) = {};

        for(let propName in propsMap.props){

            this.__props[propName] = propsMap.props[propName].initVal;
            
            Object.defineProperty(this.props,propName,{
                value:propsMap.props[propName].initVal,
                get:createGetter(
                    propsMap.props[propName].beforeGetListener,
                    propName,
                    this.__props
                ),
                set:createSetter(
                    propsMap.props[propName].beforeSetListener,
                    propsMap.props[propName].binds,
                    propName,
                    this.__props
                ),
            });
        }
        for(let propName in propsMap.readonlyProps){

            this.__props[propName] = propsMap.readonlyProps[propName].initVal;
            
            Object.defineProperty(this.props,propName,{
                value:propsMap.readonlyProps[propName].initVal,
                get:createGetter(
                    propsMap.readonlyProps[propName].beforeGetListener,
                    propName,
                    this
                )
            });
        }
    }

    props!: ComponentPropsMap<T['props']>&ReadonlyComponentPropsMap<T['readonlyProps']>;
    protected __props!: ComponentPropsMap<T['props']>&ComponentPropsMap<T['readonlyProps']>;

    binders!: ComponentBindersMap<T['props']>&ReadonlyComponentPropsMap<T['readonlyProps']>;
}