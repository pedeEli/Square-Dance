import {createButton} from './/btn'
import {drawGrid} from '../grid/index'
import {move} from '../grid/dominoMove'
import {spawn} from '../grid/dominoSpawn'
import {removeBlocking, removeBlockingDominos} from '../grid/dominoRemoveBlocking'
import {createSwitch} from './switch'
import {delay} from '../util'

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

    nextStepButton.addEventListener('click', async () => {
        drawGrid()
        await handleNextStep()
        fullCycleButton.disabled = false
        nextStepButton.addEventListener('click', handleNextStep)
    }, {once: true})

    fullCycleButton.addEventListener('click', async () => {
        nextStepButton.disabled = true
        fullCycleButton.disabled = true
        
        if (nextStep === 'remove') {
            await removeBlockingStep()
            await delay(1)
        }
        if (nextStep === 'move')
            await moveStep()
        if (nextStep === 'spawn')
            await spawnStep()
        
        nextStepButton.disabled = false
        fullCycleButton.disabled = false
    })
}


const handleNextStep = async () => {
    if (nextStep === 'spawn') {
        return await spawnStep()
    }
    if (nextStep === 'move') {
        return await moveStep()
    }
    await removeBlockingStep()
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