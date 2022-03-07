import {delay, waitForEvent} from '@ts/util'

const animateMove = async (ref: HTMLElement) => {
    ref.classList.add('shrink')
    await waitForEvent(ref, 'transitionend')
    
    ref.classList.add('animate-move')
    await delay()
    await waitForEvent(ref, 'transitionend')

    ref.classList.remove('animate-move', 'shrink')
}

export {
    animateMove
}