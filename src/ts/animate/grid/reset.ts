import {delay, waitForEvent} from '@ts/util'

const animateReset = (ref: HTMLElement, withDelay: boolean) => {
    const dominos = [...(ref.querySelectorAll('.domino') as any as HTMLElement[])]
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