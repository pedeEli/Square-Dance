import {delay, waitForEvent} from '@ts/util'
import {gridRef} from '@ts/grid/util'

const animateMove = async () => {
    gridRef.classList.add('shrink')
    gridRef.style.removeProperty('--transition-speed')
    await waitForEvent(gridRef, 'transitionend')
    
    gridRef.classList.add('animate-move')
    await delay()
    await waitForEvent(gridRef, 'transitionend')

    gridRef.classList.remove('animate-move', 'shrink')
    gridRef.style.setProperty('--transition-speed', '0')
}

export {
    animateMove
}