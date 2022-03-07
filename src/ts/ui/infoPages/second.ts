import {createDomino, drawGrid} from '@ts/grid/util'
import {delay, waitForEvent} from '@ts/util'
import {create, move, reset, spawn} from '@ts/grid/actions'
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

    const horizontal = startAnimationLoop(horizontalAnimation, [[0, 'up'], [2, 'down']])
    const vertical = startAnimationLoop(verticalAnimation, [[0, 'left'], [1, 'right']])
    while (!hidden) {
        await Promise.all([horizontal.next(), vertical.next()])
    }
}

async function* startAnimationLoop(ref: HTMLElement, positions: [Domino, Domino]) {
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
        yield delay(500)
        yield create(ref, true, false, positions, stateModifier)
        yield delay(500)
        two.classList.add('opaque')
        four.classList.remove('opaque')
        four.classList.add('big')
        yield Promise.all([
            move(ref, true, stateModifier),
            waitForEvent(two, 'transitionend')
        ])
        four.classList.remove('big')
        yield delay(1000)
        two.classList.remove('opaque')
        four.classList.add('opaque')
        yield Promise.all([
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