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
const animateSwitch = createSwitch('Animate', 'animate')
const delaySwitch = createSwitch('Delay', 'delay')
animateSwitch.on = true
delaySwitch.on = true
let positions: DominoPair[] = []

const createControls = () => {
    controls.append(nextStepButton, animateSwitch, delaySwitch)
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
    spawn(animateSwitch.on, delaySwitch.on, () => nextStepButton.disabled = false)
    if (animateSwitch.on)
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
    move(animateSwitch.on, () => nextStepButton.disabled = false)
    if (animateSwitch.on)
        nextStepButton.disabled = true
    nextStepButton.setText('Spawn')
    nextStep = 'spawn'
}

const removeBlockingStep = () => {
    removeBlocking(animateSwitch.on, delaySwitch.on, positions, () => nextStepButton.disabled = false)
    if (animateSwitch.on)
        nextStepButton.disabled = true
    nextStepButton.setText('Move')
    nextStep = 'move'
}


export {
    createControls
}