let state: State

type DeepReadonly<O extends object> = {readonly [K in keyof O]: O[K] extends object ? DeepReadonly<O[K]> : O[K]}
type Optional<O extends object> = {[K in keyof O]?: O[K]}

const initState = () => {
    if (!localStorage.getItem('grid'))
        Object.entries(defaultState)
            .forEach(([key, value]) => localStorage.setItem(key, JSON.stringify(value)))
    
    let s: Optional<State> = {}
    const keys = Object.keys(defaultState) as Array<keyof State>
    keys.forEach((key) => {
        const value = JSON.parse(localStorage.getItem(key)!)
        s[key] = value
    })
    state = s as State
}

const saveState = <T extends keyof State>(key: T, value: State[T]) => {
    if (!state) throw new Error('state has to be initialized')
    state[key] = value
    localStorage.setItem(key, JSON.stringify(value))
}

const getState = <T extends keyof State>(key: T): State[T] => {
    if (!state) throw new Error('state has to be initialized')
    return state[key]
}

const defaultState: DeepReadonly<State> = {
    animate: true,
    delay: true,
    cells: 2,
    grid: [['', ''], ['', '']],
    nextStep: 'spawn'
}

export {
    initState,
    saveState,
    getState,
    defaultState
}