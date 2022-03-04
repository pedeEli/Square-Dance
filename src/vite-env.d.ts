/// <reference types="vite/client" />


declare type Dir = 'up' | 'down' | 'left' | 'right'
declare type GridRow = (Dir | '')[]
declare type Grid = GridRow[]
declare type Orientation = 'horizontal' | 'vertical'
declare type Step = 'move' | 'spawn' | 'remove'
declare type DominoPair = [number, number, Orientation]
declare type Domino = [number, Dir]

declare interface SaveState extends GridState {
    animate: boolean,
    delay: boolean,
    nextStep: Step,
}
declare interface GridState {
    grid: GridRow[],
    cells: number
}
declare interface State<S extends object> {
    saveState: <K extends keyof S>(key: K, value: S[K]) => void,
    getState: <K extends keyof S>(key: K) => S[K]
}


declare type DeepReadonly<O extends object> = {readonly [K in keyof O]: O[K] extends object ? DeepReadonly<O[K]> : O[K]}