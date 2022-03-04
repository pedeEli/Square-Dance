let stateObj: SaveState

type Optional<O extends object> = {[K in keyof O]?: O[K]}

const initState = () => {
    if (!localStorage.getItem('grid'))
        Object.entries(defaultState)
            .forEach(([key, value]) => localStorage.setItem(key, JSON.stringify(value)))
    
    let s: Optional<SaveState> = {}
    const keys = Object.keys(defaultState) as Array<keyof SaveState>
    keys.forEach((key) => {
        const value = JSON.parse(localStorage.getItem(key)!)
        s[key] = value
    })
    stateObj = s as SaveState
}

const saveState = <T extends keyof SaveState>(key: T, value: SaveState[T]) => {
    if (!saveState) throw new Error('SaveState has to be initialized')
    stateObj[key] = value
    localStorage.setItem(key, JSON.stringify(value))
}

const getState = <T extends keyof SaveState>(key: T): SaveState[T] => {
    if (!saveState) throw new Error('SaveState has to be initialized')
    return stateObj[key]
}

const defaultState: DeepReadonly<SaveState> = {
    animate: true,
    delay: true,
    cells: 2,
    grid: [['', ''], ['', '']],
    nextStep: 'spawn'
}

const state: State<SaveState> = {
    saveState, getState
}

export {
    initState,
    state,
    defaultState
}