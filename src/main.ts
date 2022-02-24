import './styles/main.css'
import './styles/domino.css'
import './styles/grid.css'
import './styles/orangeBox.css'
import './styles/btn.css'

import {drawGrid} from './ts/grid/index'
import {animateMove} from './ts/grid/dominoMove'
import {animateSpawn} from './ts/grid/dominoSpawn'
import {animateRemoveBlocking} from './ts/grid/dominoRemoveBlocking'

drawGrid()

let nextStep: Step = 'spawn'

import {createButton} from './ts/btn'

const controls = document.querySelector('[data-controls]')!
const nextStepButton = createButton('Next step')
controls.append(nextStepButton)
nextStepButton.addEventListener('click', () => {
    if (nextStep === 'spawn') {
        animateSpawn(() => nextStepButton.disabled = false)
        nextStepButton.disabled = true
        nextStep = 'remove'
        return
    }
    if (nextStep === 'move') {
        animateMove(() => nextStepButton.disabled = false)
        nextStepButton.disabled = true
        nextStep = 'spawn'
        return
    }
    animateRemoveBlocking(() => nextStepButton.disabled = false)
    nextStepButton.disabled = true
    nextStep = 'move'
})