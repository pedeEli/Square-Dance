/// <reference types="vite/client" />


declare type Dir = 'up' | 'down' | 'left' | 'right'
declare type GridRow = (Dir | '')[]
declare type Grid = GridRow[]
declare type Orientation = 'horizontal' | 'vertical'
declare type Step = 'move' | 'spawn' | 'remove'
declare type DominoPair = [number, number, Orientation]
declare type Domino = [number, Dir]

declare interface State {
    animate: boolean,
    delay: boolean,
    grid: GridRow[],
    cells: number,
    nextStep: Step
}
