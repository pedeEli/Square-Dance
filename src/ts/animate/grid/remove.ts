import {delay, waitForEvent} from '@ts/util'
import {downIndex, toIndex, gridRef} from '@ts/grid/util'
import {getState} from '@ts/state'

const getRemovePositions = (): DominoPair[] => {
    const cells = getState('cells')
    const grid = getState('grid')
    const positions: DominoPair[] = []
    const removed = new Set<number>()
    for (let y = 0; y < grid.length; y++) {
        const row = grid[y]
        for (let x = 0; x < row.length; x++) {
            const i1 = toIndex(x, y, cells)
            if (removed.has(i1)) continue
            const cell = row[x]
            if (!cell) continue

            const x_ = downIndex(x, y, cells)
            const y_ = y + 1
            const i2 = toIndex(x_, y_, cells)

            if (cell === 'right' && x < row.length - 1 && row[x + 1] === 'left') {
                positions.push([i1, i2, 'vertical'])
                removed.add(i2)
                continue
            }
            if (cell === 'down' && y < grid.length - 1 && grid[y + 1][x_] === 'up') {
                positions.push([i1, i2, 'horizontal'])
                removed.add(toIndex(x + 1, y, cells))
            }
        }
    }
    return positions
}

const animateRemove = (withDelay: boolean, positions: DominoPair[]) => Promise.all(
    positions.map(async (dominoPair, index) => {
        if (withDelay)
            await delay(index * 200)
        await animateSingle(dominoPair)
    }))

const animateSingle = async (dominoPair: DominoPair) => {
    const [d1, d2] = fromDominoPair(dominoPair)
    d1.classList.add('animate-move', 'fade-out')
    d2.classList.add('animate-move', 'fade-out')
    await waitForEvent(d1, 'transitionend')
}

const makeInvisible = (dominoPair: DominoPair) => {
    const [d1, d2] = fromDominoPair(dominoPair)
    d1.classList.add('removed')
    d2.classList.add('removed')
}

const fromDominoPair = ([i1, i2, dir]: DominoPair): [HTMLElement, HTMLElement] => {
    if (dir === 'horizontal') {
        const d1 = gridRef.querySelector(`[data-index="${i1}"]`) as HTMLElement
        const d2 = gridRef.querySelector(`[data-index="${i2}"]`) as HTMLElement
        return [d1, d2]
    }
    if (dir === 'vertical') {
        const d1 = gridRef.querySelector(`[data-index="${i1}"]`) as HTMLElement
        const d2 = gridRef.querySelector(`[data-index="${i1 + 1}"]`) as HTMLElement
        return [d1, d2]
    }
    throw new Error(`${dir} is not a valid direction. Must be 'horizontal' or 'vertical'`)
}

export {
    animateRemove,
    makeInvisible,
    getRemovePositions
}