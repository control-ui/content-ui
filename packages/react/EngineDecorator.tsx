import React from 'react'

export class ReactDeco<TPropsGiven extends {}, TPropsGivenInternal extends {} = TPropsGiven, TPropsInjected extends {} = {}> {
    private readonly decorators: any[] = []

    public use<D extends (p: TPropsGiven) => unknown>(
        decorator: D,
    ): ReactDeco<
        D extends (p: any) => React.ReactElement<infer R> ? R & TPropsGiven :
            D extends (p: any) => React.ReactElement<infer R> | null ? R & TPropsGiven : TPropsGiven,
        TPropsGivenInternal,
        D extends (p: any) => React.ReactElement<infer R> ? Omit<R, keyof TPropsGiven> & TPropsInjected :
            D extends (p: any) => React.ReactElement<infer R> | null ? Omit<R, keyof TPropsGiven> & TPropsInjected : TPropsInjected
    > {
        // to allow omitting props, the TPropsGiven mustn't be used on inferring,
        // plugin typings require careful crafting to not have any/loose/missing props
        // BUT without it, the "collecting all yet existing" isn't possible here
        //     and this is impossible to type with the desired modularity inside the Plugins themselves (inside = not using TPropsGiven only R)
        this.decorators.push(decorator)
        return this
    }

    public next = (currentIndex: number) => {
        // note: it is important to use an arrow function here, this way it doesn't need extra `bind` calls
        return this.decorators[currentIndex]
    }
}

export type DecoratorPropsInjected<TDeco extends ReactDeco<{}, {}>> = TDeco extends ReactDeco<infer TPropsInjected, any> ? TPropsInjected : {}
export type DecoratorPropsDefault<TDeco extends ReactDeco<{}, {}>> = TDeco extends ReactDeco<any, infer TPropsDefault> ? TPropsDefault : {}
export type DecoratorProps<P extends {}, TDeco extends ReactDeco<{}, {}>> =
    Omit<
        P & DecoratorPropsDefault<TDeco>,
        keyof Omit<DecoratorPropsInjected<TDeco>, keyof DecoratorPropsDefault<TDeco>>
    >

/**
 * @internal do not use it to type decorators, as they must be generic on their own
 */
export type ReactBaseDecorator<P1 extends DecoratorPropsNext> = <P extends P1>(p: P) => React.ReactElement | null

export type DecoratorNextFn<P = {}> = <P2 extends P>(currentIndex: number) => ReactBaseDecorator<DecoratorPropsNext & P2>

export interface DecoratorPropsNext {
    decoIndex: number
    next: DecoratorNextFn
}
