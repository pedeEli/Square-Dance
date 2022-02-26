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
const playButton = createButton('Play')
fullCycleButton.disabled = true
playButton.disabled = true

const [animateSwitchLabel, animateSwitch] = createSwitch('Animate', 'animate')
const [delaySwitchLabel, delaySwitch] = createSwitch('Delay', 'delay')
animateSwitch.checked = true
delaySwitch.checked = true


const createControls = () => {
    controls.append(nextStepButton, fullCycleButton, playButton, animateSwitchLabel, delaySwitchLabel)

    animateSwitch.addEventListener('change', () => {
        delaySwitch.disabled = !animateSwitch.checked
    })

    nextStepButton.addEventListener('click', async () => {
        drawGrid()
        await handleNextStep()
        nextStepButton.addEventListener('click', handleNextStep)
    }, {once: true})

    fullCycleButton.addEventListener('click', async () => {
        disableButtons()
        if (nextStep === 'remove') {
            await removeBlockingStep()
            if (!animateSwitch.checked)
                nextStepButton.setText('Remove')
            await delay(1)
        }
        if (nextStep === 'move')
            await moveStep()
        if (nextStep === 'spawn')
            await spawnStep()
        enableButtons()
    })

    playButton.addEventListener('click', playInfinitely, {once: true})
}


const handleNextStep = async () => {
    disableButtons()
    if (nextStep === 'spawn') {
        await spawnStep()
    } else if (nextStep === 'move') {
        await moveStep()
    } else {
        await removeBlockingStep()
    }
    enableButtons()
}

const spawnStep = async () => {
    await spawn(animateSwitch.checked, delaySwitch.checked)
    positions = removeBlockingDominos()
    if (positions.length) {
        nextStepButton.setText('Remove')
        return nextStep = 'remove'
    }
    nextStepButton.setText('Move')
    return nextStep = 'move'
}

const moveStep = async () => {
    await move(animateSwitch.checked)
    nextStepButton.setText('Spawn')
    nextStep = 'spawn'
}

const removeBlockingStep = async () => {
    await removeBlocking(animateSwitch.checked, delaySwitch.checked, positions)
    nextStepButton.setText('Move')
    nextStep = 'move'
}


const playInfinitely = async () => {
    disableButtons()
    playButton.disabled = false
    let stop = false

    playButton.setText('Stop')
    playButton.addEventListener('click', () => {
        stop = true
        enableButtons()
        playButton.setText('Play')
        playButton.addEventListener('click', playInfinitely, {once: true})
    }, {once: true})

    while (true) {
        if (stop) break
        if (nextStep === 'remove') {
            await removeBlockingStep()
            await delay(1)
        }
        if (stop) break
        if (nextStep === 'move')
            await moveStep()
        if (stop) break
        if (nextStep === 'spawn') {
            await spawnStep()
            await delay(1)
        }
    }
}


const disableButtons = () => {
    nextStepButton.disabled = true
    fullCycleButton.disabled = true
    playButton.disabled = true
}
const enableButtons = () => {
    nextStepButton.disabled = false
    fullCycleButton.disabled = false
    playButton.disabled = false
}


export {
    createControls
}