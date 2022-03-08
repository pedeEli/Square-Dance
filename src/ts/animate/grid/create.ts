import {delay, waitForEvent} from '@ts/util'
import {createDomino, downIndex, fromIndex, toIndex} from '@ts/grid/util'

const getCreatePositions = <S extends GridState>({getState}: State<S>): Domino[] => {
    const cells = getState('cells')
    const grid = getState('grid')

    const positions: Domino[] = []
    const created = new Set<number>()
    for (let y = 0; y < grid.length; y++) {
        const row = grid[y]
        for (let x = 0; x < row.length; x++) {
            const i1 = toIndex(x, y, cells)
            if (created.has(i1)) continue
            const cell = row[x]
            if (!cell) continue

            positions.push([i1, cell])
            if (cell.match(/up|down/)) {
                created.add(i1 + 1)
                continue
            }
            const x_ = downIndex(x, y, cells)
            const i2 = toIndex(x_, y + 1, cells)
            created.add(i2)
        }
    }

    return positions
}

const animateCreate = (ref: HTMLElement, withDelay: boolean, dominos: Domino[], cells: number) => Promise.all(
    dominos.map(async (domino, index) => {
        if (withDelay)
            await delay(index * 500 * Math.log(dominos.length) / dominos.length)
        await animateSingle(ref, cells, domino)
    }))

const animateSingle = async (ref: HTMLElement, cells: number, [i1, dir]: Domino) => {
    debugger
    const c1 = ref.querySelector(`[data-index="${i1}"]`)!
    const [x, y] = fromIndex(i1, cells)
    const x_ = downIndex(x, y, cells)
    const c2 = dir.match(/up|down/) ? c1.nextElementSibling! : ref.querySelector(`[data-index="${toIndex(x_, y + 1, cells)}"]`)!

    const domino = createDomino(dir, i1)
    c1.after(domino)
    c1.remove()
    c2.remove()

    domino.classList.add('animate-create')
    await waitForEvent(domino, 'animationend')
    domino.classList.remove('animate-create')
}

export {
    animateCreate,
    getCreatePositions
}