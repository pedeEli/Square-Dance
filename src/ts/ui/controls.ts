import {findButton} from '@ts/ui/btn'
import {getSpawnPositions} from '@ts/animate/grid/spawn'
import {getRemovePositions} from '@ts/animate/grid/remove'
import {delay} from '@ts/util'
import {getState, saveState} from '@ts/state'
import {move, spawn, remove, reset} from '@ts/grid/actions'
import {drawGrid, gridRef} from '@ts/grid/util'

let positions: DominoPair[]

const nextStepButton = findButton('next-step')
const fullCycleButton = findButton('full-cycle')
const playButton = findButton('play')
const resetButton = findButton('reset')

const animateSwitch = document.querySelector('[data-animate]') as HTMLInputElement
const delaySwitch = document.querySelector('[data-delay]') as HTMLInputElement


// init ---------------------------------------
const initControls = () => {
    const start = getState('nextStep') === 'spawn' && getState('cells') === 2
    initButtons(start)
    initSwitches()
    
    if (getState('cells') >= 55)
        gridRef.classList.add('low-detail')
    if (start) return
    drawGrid()
}
const initSwitches = () => {
    animateSwitch.checked = getState('animate')
    delaySwitch.checked = getState('delay')
    getState('animate') || (delaySwitch.disabled = true)

    animateSwitch.addEventListener('change', () => delaySwitch.disabled = !animateSwitch.checked)
    animateSwitch.addEventListener('change', () => saveState('animate', animateSwitch.checked))
    delaySwitch.addEventListener('change', () => saveState('delay', delaySwitch.checked))
}
const initButtons = (start: boolean) => {
    fullCycleButton.addEventListener('click', fullCycleHandler)
    playButton.addEventListener('click', playHandler, {once: true})
    resetButton.addEventListener('click', resetHandler)
    if (start) {
        nextStepButton.addEventListener('click', nextStepHandler, {once: true})
        fullCycleButton.disabled = true
        playButton.disabled = true
        resetButton.disabled = true
        return
    }
    nextStepButton.addEventListener('click', executeNextStep)
    setNextStepButtonText()
}
// --------------------------------------------


// next step ----------------------------------
const nextStepHandler = async () => {
    drawGrid()
    if (getState('cells') === 2 && getState('nextStep') === 'spawn')
        await executeNextStep()
    enableButtons()
    setNextStepButtonText()
    nextStepButton.addEventListener('click', executeNextStep)
}
const executeNextStep = async () => {
    disableButtons()
    const nextStep = getState('nextStep')
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
    positions = getSpawnPositions()
    await spawn(animateSwitch.checked, delaySwitch.checked, positions)
    positions = getRemovePositions()
    positions.length ? saveState('nextStep', 'remove') : saveState('nextStep', 'move')
    setNextStepButtonText()
}
const moveStep = async () => {
    await move(animateSwitch.checked)
    if (getState('cells') >= 55)
        gridRef.classList.add('low-detail')
    saveState('nextStep', 'spawn')
    setNextStepButtonText()
}
const removeBlockingStep = async () => {
    if (!positions)
        positions = getRemovePositions()
    await remove(animateSwitch.checked, delaySwitch.checked, positions)
    saveState('nextStep', 'move')
    setNextStepButtonText()
}
// --------------------------------------------

// full cycle ---------------------------------
const fullCycleHandler = async () => {
    disableButtons()
    if (getState('nextStep') === 'remove') {
        await removeBlockingStep()
        if (!animateSwitch.checked)
            nextStepButton.setText('Remove')
        else
            await delay(1)
    }
    if (getState('nextStep') === 'move')
        await moveStep()
    if (getState('nextStep') === 'spawn')
        await spawnStep()
    enableButtons()
}
// --------------------------------------------

// reset --------------------------------------
const resetHandler = async () => {
    disableButtons()
    await reset(animateSwitch.checked, delaySwitch.checked)
    nextStepButton.disabled = false
    setNextStepButtonText()
    nextStepButton.removeEventListener('click', executeNextStep)
    nextStepButton.addEventListener('click', nextStepHandler, {once: true})
}
// --------------------------------------------

// play ---------------------------------------
const playHandler = async () => {
    disableButtons()
    playButton.disabled = false
    let running = true

    playButton.setText('Stop')
    playButton.addEventListener('click', () => {
        playButton.disabled = true
        running = false
    }, {once: true})

    const stop = () => {
        if (running) return false
        enableButtons()
        playButton.setText('Play')
        playButton.addEventListener('click', playHandler, {once: true})
        return true
    }

    while (true) {
        if (stop()) break
        if (getState('nextStep') === 'remove') {
            await removeBlockingStep()
            if (animateSwitch.checked)
                await delay(1)
        }
        if (stop()) break
        if (getState('nextStep') === 'move')
            await moveStep()
        if (stop()) break
        if (getState('nextStep') === 'spawn') {
            await spawnStep()
            if (animateSwitch.checked)
                await delay(1)
        }
        if (!animateSwitch.checked)
            await delay(200)
    }
}
// --------------------------------------------

// buttons util -------------------------------
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
const setNextStepButtonText = () => {
    const nextStep = getState('nextStep')
    if (getState('cells') === 2 && nextStep === 'spawn')
        return nextStepButton.setText('Start')
    if (nextStep === 'spawn')
        return nextStepButton.setText('Spawn')
    if (nextStep === 'move')
        return nextStepButton.setText('Move')
    if (nextStep === 'remove')
        return nextStepButton.setText('Remove')
}
// --------------------------------------------


export {
    initControls
}