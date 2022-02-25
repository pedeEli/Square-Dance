import {grid, downIndex, cells, gridRef} from './index'

const removeBlockingDominos = (): DominoPair[] => {
    const positions: DominoPair[] = []
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

const animateRemoveBlocking = (positions: DominoPair[], callback?: () => void) => {
    positions.forEach(([i1, i2, dir], index) => {
        setTimeout(() => {
            if (index === positions.length - 1 && callback)
                return animateRemoveBlockingDomino(i1, i2, dir, callback)
            animateRemoveBlockingDomino(i1, i2, dir)
        }, index * 200)
    })
}

const animateRemoveBlockingDomino = (i1: number, i2: number, dir: Orientation, callback?: () => void) => {
    const [d1, d2] = getRemoveByIndex(i1, i2, dir)
    d1.classList.add('animate-move', 'fade-out')
    d2.classList.add('animate-move', 'fade-out')
    if (callback)
        d1.addEventListener('transitionend', callback, {once: true})
}

const getRemoveByIndex = (i1: number, i2: number, dir: Orientation): [HTMLElement, HTMLElement] => {
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

const removeBlocking = (animate: boolean, positions: DominoPair[], callback?: () => void) => {
    if (animate)
        return animateRemoveBlocking(positions, callback)
    positions.forEach(([i1, i2, dir]) => {
        const [d1, d2] = getRemoveByIndex(i1, i2, dir)
        d1.style.opacity = '0'
        d1.style.transition = 'none'
        d2.style.opacity = '0'
        d2.style.transition = 'none'
    })
}

export {
    removeBlockingDominos,
    animateRemoveBlockingDomino,
    removeBlocking
}