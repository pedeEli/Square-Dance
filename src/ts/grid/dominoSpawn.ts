import {grid, downIndex, cells, gridRef, createDomino} from './index'

const spawnDominos = (): [number, number, Orientation][] => {
    const positions: [number, number, Orientation][] = []
    for (let y = 0; y < grid.value.length; y++) {
        const row = grid.value[y]
        for (let x = 0; x < row.length; x++) {
            if (row[x]) continue

            const x_ = downIndex(y, x)
            const y_ = y + 1

            const i1 = y  * cells.value + x
            const i2 = y_ * cells.value + x_

            if (Math.random() > .5) {
                row[x] = 'up'
                row[x + 1] = 'up'
                grid.value[y_][x_] = 'down'
                grid.value[y_][x_ + 1] = 'down'
                positions.push([i1, i2, 'horizontal'])
                continue
            }
            positions.push([i1, i2, 'vertical'])
            row[x] = 'left'
            row[x + 1] = 'right'
            grid.value[y_][x_] = 'left'
            grid.value[y_][x_ + 1] = 'right'
        }
    }
    return positions
}

const animateSpawn = (callback?: () => void) => {
    const spawnPositions = spawnDominos()
    spawnPositions.forEach(([i1, i2, dir], index) => {
        setTimeout(() => {
            if (index === spawnPositions.length - 1)
                return animateSpawnDomino(i1, i2, dir, callback)
            animateSpawnDomino(i1, i2, dir)
        }, index * 200)
    })
}

const animateSpawnDomino = (i1: number, i2: number, dir: Orientation, callback?: () => void) => {
    const c1 = gridRef.querySelector(`[data-index="${i1}"]`)!

    c1.classList.add('orange-box')
    c1.addEventListener('animationend', () => {
        const domino = fillOrangeBoxWithDominos(c1, dir)
        animateSpawnDominoFadeIn(domino, i1, i2, dir, c1 as HTMLElement, callback)
    }, {once: true})
}

const animateSpawnDominoFadeIn = (domino: Element, i1: number, i2: number, dir: Orientation, c1: HTMLElement, callback?: () => void) => {
    const c2 = c1.nextElementSibling!
    const c3 = gridRef.querySelector(`[data-index="${i2}"]`)!
    const c4 = c3.nextElementSibling!

    domino.addEventListener('animationend', () => {
        c1.style.backgroundColor = 'hsl(var(--orange-clr) / 0)'
        c1.addEventListener('transitionend', () => {
            replaceEmptiesWithDominos(c1, c3, i1, i2, dir)
            c1.remove()
            c2.remove()
            c3.remove()
            c4.remove()
            if (typeof callback === 'function') callback()
        }, {once: true})
    }, {once: true})
}

const fillOrangeBoxWithDominos = (c1: Element, dir: Orientation) => {
    if (dir === 'horizontal') {
        const domino = createDomino('up')
        c1.append(domino, createDomino('down'))
        return domino
    }
    if (dir === 'vertical') {
        const domino = createDomino('left')
        c1.append(domino, createDomino('right'))
        return domino
    }
    throw new Error(`${dir} is not a valid direction. Must be 'horizontal' or 'vertical'`)
}

const replaceEmptiesWithDominos = (c1: Element, c3: Element, i1: number, i2: number, dir: Orientation) => {
    if (dir === 'horizontal') {
        c1.after(createDomino('up', i1))
        c3.after(createDomino('down', i2))
        return
    }
    if (dir === 'vertical') {
        c1.after(createDomino('right', i1 + 1))
        c1.after(createDomino('left', i1))
        return
    }
    throw new Error(`${dir} is not a valid direction. Must be 'horizontal' or 'vertical'`)
}

export {
    animateSpawn
}