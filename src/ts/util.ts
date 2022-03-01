const delay = (time?: number) => new Promise(resolve => setTimeout(resolve, time))

const waitForEvent = <K extends keyof HTMLElementEventMap>(target: HTMLElement, type: K) => {
    return new Promise<HTMLElementEventMap[K]>(resolve => {
        target.addEventListener(type, resolve, {once: true})
    })
}

export {
    delay,
    waitForEvent
}