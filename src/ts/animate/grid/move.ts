import {delay, waitForEvent} from '@ts/util'

const animateMove = async (ref: HTMLElement) => {
    ref.classList.add('shrink')
    ref.style.removeProperty('--transition-speed')
    await waitForEvent(ref, 'transitionend')
    
    ref.classList.add('animate-move')
    await delay()
    await waitForEvent(ref, 'transitionend')

    ref.classList.remove('animate-move', 'shrink')
    ref.style.setProperty('--transition-speed', '0')
}

export {
    animateMove
}