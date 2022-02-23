/// <reference types="vite/client" />


declare type Dir = 'up' | 'down' | 'left' | 'right'
declare type GridRow = (Dir | '')[]
declare type Grid = GridRow[]
declare type Orientation = 'horizontal' | 'vertical'