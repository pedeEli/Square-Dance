import {delay, waitForEvent} from '@ts/util'
import {createDomino, downIndex, fromIndex} from '@ts/grid/util'

const animateCreate = (ref: HTMLElement, withDelay: boolean, positions: Domino[], cells: number) => Promise.all(
    positions.map(async (domino, index) => {
        if (withDelay)
            await delay(index * 200)
        await animateSingle(ref, cells, domino)
    }))

const animateSingle = async (ref: HTMLElement, cells: number, [i1, dir]: Domino) => {
    debugger
    const c1 = ref.querySelector(`[data-index="${i1}"]`)!
    const [x, y] = fromIndex(i1, cells)
    const c2 = dir.match(/up|down/) ? c1.nextElementSibling! : ref.querySelector(`[data-index="${downIndex(x, y, cells)}"]`)!

    const domino = createDomino(dir, i1)
    c1.after(domino)
    c1.remove()
    c2.remove()

    domino.classList.add('animate-create')
    await waitForEvent(domino, 'animationend')
    domino.classList.remove('animate-create')
}

export {
    animateCreate
}