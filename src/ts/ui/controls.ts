import {createButton} from './/btn'
import {drawGrid} from '../grid/index'
import {move} from '../grid/dominoMove'
import {spawn} from '../grid/dominoSpawn'
import {removeBlocking, removeBlockingDominos} from '../grid/dominoRemoveBlocking'
import { createSwitch } from './switch'

let nextStep: Step = 'spawn'
let positions: DominoPair[] = []

const controls = document.querySelector('[data-controls]')!

const nextStepButton = createButton('Start')
const fullCycleButton = createButton('Full cycle')
fullCycleButton.disabled = true

const [animateSwitchLabel, animateSwitch] = createSwitch('Animate', 'animate')
const [delaySwitchLabel, delaySwitch] = createSwitch('Delay', 'delay')
animateSwitch.checked = true
delaySwitch.checked = true


const createControls = () => {
    controls.append(nextStepButton, fullCycleButton, animateSwitchLabel, delaySwitchLabel)

    animateSwitch.addEventListener('change', () => {
        delaySwitch.disabled = !animateSwitch.checked
    })

    nextStepButton.addEventListener('click', () => {
        fullCycleButton.disabled = false
        drawGrid()
        handleNextStep()
        nextStepButton.addEventListener('click', handleNextStep)
    }, {once: true})

    fullCycleButton.addEventListener('click', () => {
        nextStepButton.disabled = true
        
    })
}


const handleNextStep = () => {
    if (nextStep === 'spawn') {
        return spawnStep()
    }
    if (nextStep === 'move') {
        return moveStep()
    }
    return removeBlockingStep()
}

const spawnStep = async () => {
    nextStepButton.disabled = true
    await spawn(animateSwitch.checked, delaySwitch.checked)
    nextStepButton.disabled = false

    positions = removeBlockingDominos()
    if (positions.length) {
        nextStepButton.setText('Remove')
        return nextStep = 'remove'
    }
    nextStepButton.setText('Move')
    return nextStep = 'move'
}

const moveStep = async () => {
    nextStepButton.disabled = true
    await move(animateSwitch.checked)
    nextStepButton.disabled = false
    nextStepButton.setText('Spawn')
    nextStep = 'spawn'
}

const removeBlockingStep = async () => {
    nextStepButton.disabled = true
    await removeBlocking(animateSwitch.checked, delaySwitch.checked, positions)
    nextStepButton.disabled = false
    nextStepButton.setText('Move')
    nextStep = 'move'
}


export {
    createControls
}