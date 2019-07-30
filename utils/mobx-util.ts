import "reflect-metadata";
import { useEffect } from "react";

export interface IMobxConstructor<T> {
    new (...args: any): T;
    _$$instance?: T;
}

export interface IRehydratable<T> {
    rehydrate(instance: T): void;
}

export const isServer = typeof window === "undefined";

/**
 * Instantiate a mobx store
 * Will return new instance every time in server side rendering
 * Will return singleton in client side rendering
 * @param storeConstructor Constructor of mobx store
 * @param args Constructor parameters
 */
export function instantiate<T>(
    storeConstructor: IMobxConstructor<T>,
    ...args: any[]
) {
    const isServer = typeof window === "undefined";
    if (isServer) {
        return new storeConstructor(...args);
    } else {
        if (!storeConstructor._$$instance) {
            storeConstructor._$$instance = new storeConstructor(...args);
        }
        return storeConstructor._$$instance!;
    }
}

/**
 * Rehydrate a client side store from server side store instance
 * @param storeConstructor Constructor of mobx store
 * @param instance Instance from server side rendering
 */
export function useRehydrated<T extends IRehydratable<T>>(
    storeConstructor: IMobxConstructor<T>,
    instance: InstanceType<IMobxConstructor<T>>
) {
    const store = isServer ? instance : instantiate(storeConstructor);
    useEffect(() => store.rehydrate(instance), []);
    return store;
}

/**
 * Inject a mobx store into class
 * Will inject as new instance every time in server side rendering
 * Will inject as singleton in client side rendering
 * @param args Injected constructor parameter
 */
export const inject: (...args: any[]) => PropertyDecorator = (...args) => (
    target,
    propertyKey
) => {
    const instance = instantiate(
        Reflect.getMetadata("design:type", target, propertyKey),
        ...args
    );
    Object.defineProperty(target, propertyKey, {
        get: () => instance,
        set: () => {},
        enumerable: true,
        configurable: true
    });
};
