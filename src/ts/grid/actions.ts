import {
    fromIndex, toIndex,
    downIndex, upIndex,
    oldToNewIndex,
    drawGrid} from '@ts/grid/util'
import {animateMove} from '@ts/animate/grid/move'
import {animateSpawn, replaceWithDominoPair} from '@ts/animate/grid/spawn'
import {animateRemove, makeInvisible} from '@ts/animate/grid/remove'
import {animateReset} from '@ts/animate/grid/reset'
import {delay} from '@ts/util'

// spawn --------------------------------------
const spawn = async <S extends GridState>(ref: HTMLElement, animate: boolean, withDelay: boolean, positions: DominoPair[], state: State<S>) => {
    if (animate) {
        await delay(1)
        await animateSpawn(ref, withDelay, positions)
    }
    saveSpawn(positions, state)
    positions.forEach(replaceWithDominoPair(ref))
}
const saveSpawn = <S extends GridState>(positions: DominoPair[], {getState, saveState}: State<S>) => {
    const grid = getState('grid')
    const cells = getState('cells')
    positions.forEach(([i1, i2, dir]) => {
        const [x1, y1] = fromIndex(i1, cells)
        const [x2, y2] = fromIndex(i2, cells)

        if (dir === 'horizontal') {
            grid[y1][x1] = 'up'
            grid[y1][x1 + 1] = 'up'
            grid[y2][x2] = 'down'
            grid[y2][x2 + 1] = 'down'
            return
        }
        grid[y1][x1] = 'left'
        grid[y1][x1 + 1] = 'right'
        grid[y2][x2] = 'left'
        grid[y2][x2 + 1] = 'right'
    })
    saveState('grid', grid)
}
// --------------------------------------------

// move ---------------------------------------
const move = async <S extends GridState>(ref: HTMLElement, animate: boolean, state: State<S>) => {
    if (animate)
        await animateMove(ref)
    saveMove(state)
    drawGrid(ref, state)
}
const saveMove = <S extends GridState>({getState, saveState}: State<S>) => {
    const grid = getState('grid')
    const cells = getState('cells')
    const ncells = cells + 2

    const newRows: GridRow[] = grid.map(row => Array(row.length + 2).fill(''))
    const newGrid: Grid = [['', ''], ...newRows, ['', '']]

    grid.forEach((row, y_) => {
        row.forEach((cell, x_) => {
            if (!cell) return

            const i1 = toIndex(x_, y_, cells)
            const i2 = oldToNewIndex(i1, cells, ncells)
            const [x1, y1] = fromIndex(i2, ncells)
            if (cell === 'up') {
                const x2 = upIndex(x1, y1, ncells)
                const y2 = y1 - 1
                newGrid[y2][x2] = 'up'
                return
            }
            if (cell === 'down') {
                const x2 = downIndex(x1, y1, ncells)
                const y2 = y1 + 1
                newGrid[y2][x2] = 'down'
                return
            }
            if (cell === 'left') {
                newGrid[y1][x1 - 1] = 'left'
                return
            }
            newGrid[y1][x1 + 1] = 'right'
        })
    })
    saveState('grid', newGrid)
    saveState('cells', ncells)
}
// --------------------------------------------

// remove -------------------------------------
const remove = async <S extends GridState>(ref: HTMLElement, animate: boolean, delay: boolean, positions: DominoPair[], state: State<S>) => {
    if (animate)
        await animateRemove(ref, delay, positions)
    saveRemove(positions, state)
    positions.forEach(makeInvisible(ref))
}
const saveRemove = <S extends GridState>(positions: DominoPair[], {getState, saveState}: State<S>) => {
    const grid = getState('grid')
    const cells = getState('cells')
    positions.forEach(([i1, i2, _]) => {
        const [x1, y1] = fromIndex(i1, cells)
        const [x2, y2] = fromIndex(i2, cells)
        grid[y1][x1] = ''
        grid[y1][x1 + 1] = ''
        grid[y2][x2] = ''
        grid[y2][x2 + 1] = ''
    })
    saveState('grid', grid)
}
// --------------------------------------------

// reset --------------------------------------
const reset = async <S extends GridState, D extends DeepReadonly<GridState>>(ref: HTMLElement, animate: boolean, delay: boolean, state: State<S>, defaultState: D) => {
    if (animate)
        await animateReset(ref, delay)
    saveReset(state, defaultState)
    ref.classList.remove('low-detail')
    drawGrid(ref, state)
}
const saveReset = <S extends GridState, D extends DeepReadonly<GridState>>({saveState}: State<S>, defaultState: D) => {
    saveState('cells', defaultState.cells)
    saveState('grid', [...defaultState.grid.map(row => [...row])])
}
// --------------------------------------------

export {
    move,
    spawn,
    remove,
    reset
}