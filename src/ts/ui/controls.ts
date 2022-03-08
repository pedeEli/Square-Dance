import {findButton} from '@ts/ui/btn'
import {getSpawnPositions} from '@ts/animate/grid/spawn'
import {getRemovePositions} from '@ts/animate/grid/remove'
import {getCreatePositions} from '@ts/animate/grid/create'
import {delay} from '@ts/util'
import {defaultState, state} from '@ts/state'
import {move, spawn, remove, reset, create} from '@ts/grid/actions'
import {drawGrid} from '@ts/grid/util'

const {getState, saveState} = state
let positions: DominoPair[]

const gridRef = document.querySelector('[data-grid]') as HTMLDivElement

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
    if (!getState('animate')) {
        drawGrid(gridRef, state)
        return
    }

    const cells = getState('cells')
    const tempState: GridState = {
        cells,
        grid: Array<true>(cells).fill(true).map<GridRow>((_, i) => {
            const length = cells - 2 * Math.floor(Math.abs(i - cells / 2 + .5))
            return Array<''>(length).fill('')
        })
    }
    const tempStateModifier: State<GridState> = {
        getState: (key) => tempState[key],
        saveState: () => {}
    }
    drawGrid(gridRef, tempStateModifier)
    const positions = getCreatePositions(state)
    create(gridRef, true, getState('delay'), positions, state)
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
    drawGrid(gridRef, state)
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
    positions = getSpawnPositions(state)
    await spawn(gridRef, animateSwitch.checked, delaySwitch.checked, positions, state)
    positions = getRemovePositions(state)
    positions.length ? saveState('nextStep', 'remove') : saveState('nextStep', 'move')
    setNextStepButtonText()
}
const moveStep = async () => {
    await move(gridRef, animateSwitch.checked, state)
    if (getState('cells') >= 55)
        gridRef.classList.add('low-detail')
    saveState('nextStep', 'spawn')
    setNextStepButtonText()
}
const removeBlockingStep = async () => {
    if (!positions)
        positions = getRemovePositions(state)
    await remove(gridRef, animateSwitch.checked, delaySwitch.checked, positions, state)
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
    await reset(gridRef, animateSwitch.checked, delaySwitch.checked, state, defaultState)
    saveState('nextStep', defaultState.nextStep)
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