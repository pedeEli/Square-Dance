import {delay, waitForEvent} from '@ts/util'
import {toIndex, downIndex, createDomino} from '@ts/grid/util'

const getSpawnPositions = <S extends GridState>({getState}: State<S>): DominoPair[] => {
    const cells = getState('cells')
    const grid = getState('grid')
    const positions: DominoPair[] = []
    const created = new Set<number>()
    for (let y = 0; y < grid.length; y++) {
        const row = grid[y]
        for (let x = 0; x < row.length; x++) {
            const i1 = toIndex(x , y, cells)
            if (created.has(i1)) continue
            if (row[x]) continue
            
            const x_ = downIndex(x, y, cells)
            const i2 = toIndex(x_, y + 1, cells)
            const dir = Math.random() > .5 ? 'horizontal' : 'vertical'

            positions.push([i1, i2, dir])
            created.add(i1 + 1).add(i2).add(i2 + 1)
        }
    }
    return positions
}

const animateSpawn = (ref: HTMLElement, withDelay: boolean, positions: DominoPair[]) => Promise.all(
    positions.map(async (dominoPair, index) => {
        if (withDelay)
            await delay(index * 200)
        await animateSingle(ref, dominoPair)
    }))

const animateSingle = async (ref: HTMLElement, [i1, _, dir]: DominoPair) => {
    const c1 = ref.querySelector(`[data-index="${i1}"]`) as HTMLElement
    
    c1.classList.add('orange-box')
    await waitForEvent(c1, 'animationend')
    
    fillOrangeBox(c1, dir)
    await delay(100)
    c1.style.backgroundColor = 'hsl(var(--orange-clr) / 0)'
    await waitForEvent(c1, 'transitionend')
}

const fillOrangeBox = (box: Element, dir: Orientation) => {
    if (dir === 'horizontal')
        return box.append(createDomino('up'), createDomino('down'))
    if (dir === 'vertical')
        return box.append(createDomino('left'), createDomino('right'))
    throw new Error(`${dir} is not a valid direction. Must be 'horizontal' or 'vertical'`)
}

const replaceWithDominoPair = (ref: HTMLElement) => ([i1, i2, dir]: DominoPair) => {
    const c1 = ref.querySelector(`[data-index="${i1}"]`)!
    const c2 = c1.nextElementSibling!
    const c3 = ref.querySelector(`[data-index="${i2}"]`)!
    const c4 = c3.nextElementSibling!
    if (dir === 'horizontal') {
        c1.after(createDomino('up', i1))
        c3.after(createDomino('down', i2))
    } else if (dir === 'vertical') {
        c1.after(createDomino('right', i1 + 1))
        c1.after(createDomino('left', i1))
    } else
        throw new Error(`${dir} is not a valid direction. Must be 'horizontal' or 'vertical'`)
    c1.remove()
    c2.remove()
    c3.remove()
    c4.remove()
}

export {
    animateSpawn,
    replaceWithDominoPair,
    getSpawnPositions
}