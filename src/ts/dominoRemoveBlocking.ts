import {grid, downIndex, cells, gridRef} from './grid'

const removeBlockingDominos = (): [number, number, Orientation][] => {
    const positions: [number, number, Orientation][] = []
    for (let y = 0; y < grid.value.length; y++) {
        const row = grid.value[y]
        for (let x = 0; x < row.length; x++) {
            const cell = row[x]
            if (!cell) continue

            const x_ = downIndex(y, x)
            const y_ = y + 1

            const i1 = y  * cells.value + x
            const i2 = y_ * cells.value + x_

            if (cell === 'right' && x < row.length - 1 && row[x + 1] === 'left') {
                positions.push([i1, i2, 'vertical'])
                row[x] = ''
                row[x + 1] = ''
                grid.value[y_][x_] = ''
                grid.value[y_][x_ + 1] = ''
                continue
            }
            if (cell === 'down' && y < grid.value.length - 1 && grid.value[y + 1][x_] === 'up') {
                positions.push([i1, i2, 'horizontal'])
                row[x] = ''
                row[x + 1] = ''
                grid.value[y_][x_] = ''
                grid.value[y_][x_ + 1] = ''
            }
        }
    }
    return positions
}

const animateRemoveBlocking = () => {
    const positions = removeBlockingDominos()
    positions.forEach(([i1, i2, dir], index) => {
        setTimeout(() => {
            const ds = getRemoveByIndex(i1, i2, dir)
            ds.forEach(d => d.classList.add('animate-move', 'fade-out'))
        }, index * 200)
    })
}

const getRemoveByIndex = (i1: number, i2: number, dir: Orientation) => {
    if (dir === 'horizontal') {
        const d1 = gridRef.querySelector(`[data-index="${i1}"]`)!
        const d2 = gridRef.querySelector(`[data-index="${i2}"]`)!
        return [d1, d2]
    }
    if (dir === 'vertical') {
        const d1 = gridRef.querySelector(`[data-index="${i1}"]`)!
        const d2 = gridRef.querySelector(`[data-index="${i1 + 1}"]`)!
        return [d1, d2]
    }
    throw new Error(`${dir} is not a valid direction. Must be 'horizontal' or 'vertical'`)
}

export {
    animateRemoveBlocking
}