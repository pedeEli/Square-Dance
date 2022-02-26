type ButtonElement = HTMLButtonElement & {setText: (str: string) => void}

const findButton = (data: string) => {
    const btn = document.querySelector(`[data-${data}]`) as ButtonElement
    const txt = btn.querySelector('[data-text]') as HTMLElement
    btn.classList.add('btn')
    btn.addEventListener('click', event => {
        const {width, height, x, y} = btn.getBoundingClientRect()
        animateClick(Math.max(width, height) * 2, event.x - x, event.y - y, btn)
    })
    btn.addEventListener('keydown', event => {
        if (event.key !== 'Enter') return
        const {width, height} = btn.getBoundingClientRect()
        animateClick(Math.max(width, height) * 2, width / 2, height / 2, btn)
    })
    btn.setText = (str: string) => {
        txt.innerText = str
    }
    return btn
}

const animateClick = (size: number, x: number, y: number, btn: Element) => {
    const div = document.createElement('div')
    btn.append(div)
    btn.classList.add('clicked')
    div.style.setProperty('--x', `${x}px`)
    div.style.setProperty('--y', `${y}px`)
    div.style.setProperty('--size', `${size}px`)
    div.addEventListener('animationend', () => div.remove(), {once: true})
}

export {
    findButton
}