import {createButton} from './/btn'
import {drawGrid} from '../grid/index'
import {move} from '../grid/dominoMove'
import {spawn} from '../grid/dominoSpawn'
import {removeBlocking, removeBlockingDominos} from '../grid/dominoRemoveBlocking'
import { createSwitch } from './switch'

let nextStep: Step = 'spawn'
let started = false
const controls = document.querySelector('[data-controls]')!
const nextStepButton = createButton('Start')
const [animateSwitchLabel, animateSwitch] = createSwitch('Animate', 'animate')
const [delaySwitchLabel, delaySwitch] = createSwitch('Delay', 'delay')
animateSwitch.checked = true
delaySwitch.checked = true
let positions: DominoPair[] = []

const createControls = () => {
    controls.append(nextStepButton, animateSwitchLabel, delaySwitchLabel)
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
    spawn(animateSwitch.checked, delaySwitch.checked, () => nextStepButton.disabled = false)
    if (animateSwitch.checked)
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
    move(animateSwitch.checked, () => nextStepButton.disabled = false)
    if (animateSwitch.checked)
        nextStepButton.disabled = true
    nextStepButton.setText('Spawn')
    nextStep = 'spawn'
}

const removeBlockingStep = () => {
    removeBlocking(animateSwitch.checked, delaySwitch.checked, positions, () => nextStepButton.disabled = false)
    if (animateSwitch.checked)
        nextStepButton.disabled = true
    nextStepButton.setText('Move')
    nextStep = 'move'
}


export {
    createControls
}