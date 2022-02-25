import {createButton} from './/btn'
import {drawGrid} from '../grid/index'
import {animateMove} from '../grid/dominoMove'
import {animateSpawn} from '../grid/dominoSpawn'
import {animateRemoveBlocking, removeBlockingDominos} from '../grid/dominoRemoveBlocking'
import { createSwitch } from './switch'

let nextStep: Step = 'spawn'
let started = false
const controls = document.querySelector('[data-controls]')!
const nextStepButton = createButton('Start')
const temp = createSwitch('Animate', 'animate')
let positions: DominoPair[] = []

const createControls = () => {
    controls.append(nextStepButton, temp)
    nextStepButton.addEventListener('click', () => {
        if (!started) {
            started = true
            drawGrid()
        }
        if (nextStep === 'spawn') {
            return spawnStep()
        }
        if (nextStep === 'move') {
            return moveStep()
        }
        removeBlockingStep()
    })
}

const spawnStep = () => {
    animateSpawn(() => nextStepButton.disabled = false)
    nextStepButton.disabled = true

    positions = removeBlockingDominos()
    if (positions.length) {
        nextStepButton.setText('Remove')
        return nextStep = 'remove'
    }
    nextStepButton.setText('Move')
    return nextStep = 'move'
}

const moveStep = () => {
    animateMove(() => nextStepButton.disabled = false)
    nextStepButton.disabled = true
    nextStepButton.setText('Spawn')
    nextStep = 'spawn'
}

const removeBlockingStep = () => {
    animateRemoveBlocking(positions, () => nextStepButton.disabled = false)
    nextStepButton.disabled = true
    nextStepButton.setText('Move')
    nextStep = 'move'
}


export {
    createControls
}