import {grid, downIndex, cells, gridRef, createDomino} from './index'

const spawnDominos = (): DominoPair[] => {
    const positions: DominoPair[] = []
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

const animateSpawn = (delay: boolean) => {
    return new Promise<void>(resolve => {
        const positions = spawnDominos()
        positions.forEach(async ([i1, i2, dir], index) => {
            if (!delay) {
                await animateSpawnDomino(i1, i2, dir)
                return resolve()
            }
            setTimeout(async () => {
                await animateSpawnDomino(i1, i2, dir)
                if (index === positions.length - 1)
                    resolve()
            }, index * 200)
        })
    })
}

const animateSpawnDomino = (i1: number, i2: number, dir: Orientation) => {
    return new Promise<void>(resolve => {
        const c1 = gridRef.querySelector(`[data-index="${i1}"]`)!
        
        c1.classList.add('orange-box')
        c1.addEventListener('animationend', async () => {
            fillOrangeBoxWithDominos(c1, dir)
            await animateSpawnDominoFadeIn(i1, i2, dir, c1 as HTMLElement)
            resolve()
        }, {once: true})
    })
}

const animateSpawnDominoFadeIn = (i1: number, i2: number, dir: Orientation, c1: HTMLElement) => {
    return new Promise<void>(resolve => {
        const c2 = c1.nextElementSibling!
        const c3 = gridRef.querySelector(`[data-index="${i2}"]`)!
        const c4 = c3.nextElementSibling!
        setTimeout(() => c1.style.backgroundColor = 'hsl(var(--orange-clr) / 0)', 100)
        c1.addEventListener('transitionend', () => {
            replaceEmptiesWithDominos(c1, c3, i1, i2, dir)
            c1.remove()
            c2.remove()
            c3.remove()
            c4.remove()
            resolve()
        }, {once: true})
    })
}

const fillOrangeBoxWithDominos = (c1: Element, dir: Orientation) => {
    if (dir === 'horizontal')
        return c1.append(createDomino('up'), createDomino('down'))
    if (dir === 'vertical')
        return c1.append(createDomino('left'), createDomino('right'))
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

const spawn = async (animate: boolean, delay: boolean) => {
    if (animate)
        return await animateSpawn(delay)
        
    const positions = spawnDominos()
    positions.forEach(([i1, i2, dir]) => {
        const c1 = gridRef.querySelector(`[data-index="${i1}"]`)!
        const c2 = c1.nextElementSibling!
        const c3 = gridRef.querySelector(`[data-index="${i2}"]`)!
        const c4 = c3.nextElementSibling!
        replaceEmptiesWithDominos(c1, c3, i1, i2, dir)
        c1.remove()
        c2.remove()
        c3.remove()
        c4.remove()
    })
}

export {
    spawn
}