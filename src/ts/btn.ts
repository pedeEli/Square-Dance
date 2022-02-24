

const createButton = (...nodes: (string | Node)[]) => {
    const btn = document.createElement('button')
    const span = document.createElement('span')
    span.append(...nodes)
    btn.append(span)
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
    createButton
}