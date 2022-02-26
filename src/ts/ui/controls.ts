import {findButton} from './btn'
import {cells, drawGrid, grid, gridRef} from '../grid/index'
import {move} from '../grid/dominoMove'
import {spawn} from '../grid/dominoSpawn'
import {removeBlocking, removeBlockingDominos} from '../grid/dominoRemoveBlocking'
import {reset} from '../grid/reset'
import {delay} from '../util'

let nextStep: Step = 'spawn'
let positions: DominoPair[] = []

const nextStepButton = findButton('next-step')
const fullCycleButton = findButton('full-cycle')
const playButton = findButton('play')
const resetButton = findButton('reset')
fullCycleButton.disabled = true
playButton.disabled = true
resetButton.disabled = true

const animateSwitch = document.querySelector('[data-animate]') as HTMLInputElement
const delaySwitch = document.querySelector('[data-delay]') as HTMLInputElement
animateSwitch.checked = true
delaySwitch.checked = true


const createControls = () => {
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

    resetButton.addEventListener('click', async () => {
        grid.value = [['', ''], ['', '']]
        cells.value = 2
        nextStep = 'spawn'
        nextStepButton.setText('Start')
        disableButtons()
        await reset()
        nextStepButton.disabled = false
    })
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
    if (cells.value >= 55)
        gridRef.classList.add('low-detail')
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
    resetButton.disabled = true
}
const enableButtons = () => {
    nextStepButton.disabled = false
    fullCycleButton.disabled = false
    playButton.disabled = false
    resetButton.disabled = false
}


export {
    createControls
}