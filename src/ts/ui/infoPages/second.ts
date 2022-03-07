import {createDomino, drawGrid} from '@ts/grid/util'
import {delay, waitForEvent} from '@ts/util'
import {move, reset, spawn} from '@ts/grid/actions'
const horizontalExample = document.querySelector('[data-horizontal-example]') as HTMLElement
const verticalExample = document.querySelector('[data-vertical-example]') as HTMLElement

const horizontalAnimation = document.querySelector('[data-horizontal-animation]') as HTMLElement
const verticalAnimation = document.querySelector('[data-vertical-animation]') as HTMLElement

const init = () => {
    horizontalExample.append(createDomino('up'), createDomino('down'))
    verticalExample.append(createDomino('left'), createDomino('right'))
}

let hidden = true
const show = async () => {
    hidden = false
    startAnimationLoop(horizontalAnimation, 'horizontal')
    startAnimationLoop(verticalAnimation, 'vertical')
}

const startAnimationLoop = async (ref: HTMLElement, dir: Orientation) => {
    const two = ref.querySelector('[data-two]') as HTMLElement
    const four = ref.querySelector('[data-four]') as HTMLElement

    const state: GridState = {
        grid: [['', ''], ['', '']],
        cells: 2
    }
    const stateModifier: State<GridState> = {
        saveState: (key, value) => state[key] = value,
        getState: key => state[key]
    }
    
    two.classList.remove('opaque')
    four.classList.add('opaque')
    
    const gridElements = [...ref.querySelectorAll('div') as any as Element[]]
    gridElements.forEach(element => element.remove())

    drawGrid(ref, stateModifier)
    while (true) {
        await delay(1000)
        if (hidden) break
        await spawn(ref, true, false, [[0, 2, dir]], stateModifier)
        await delay(1000)
        if (hidden) break
        two.classList.add('opaque')
        four.classList.remove('opaque')
        four.classList.add('big')
        await Promise.all([
            move(ref, true, stateModifier),
            waitForEvent(two, 'transitionend')
        ])
        if (hidden) break
        four.classList.remove('big')
        await delay(1000)
        if (hidden) break
        two.classList.remove('opaque')
        four.classList.add('opaque')
        await Promise.all([
            reset(ref, true, false, stateModifier, {
                grid: [['', ''], ['', '']],
                cells: 2
            }),
            waitForEvent(two, 'transitionend')
        ])
    }
}

const hide = () => {
    hidden = true
}

const secondPage: InfoPage = {
    init,
    show,
    hide
}

export {
    secondPage
}