import {gridRef} from '@ts/grid/util'
import {delay, waitForEvent} from '@ts/util'

const animateReset = (withDelay: boolean) => {
    const dominos = [...(gridRef.querySelectorAll('.domino') as any as HTMLElement[])]
    return Promise.all(dominos.map(async (domino, index) => {
        if (withDelay)
            await delay(index * 500 * Math.log(dominos.length) / dominos.length)
        domino.classList.add('reset')

        if (index !== dominos.length - 1) return
        await waitForEvent(domino, 'transitionend')
    }))
}

export {
    animateReset
}