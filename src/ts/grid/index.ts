const gridRef = document.querySelector('[data-grid]') as HTMLDivElement
const arrows = {
    up: document.querySelector('[data-up-arrow]') as HTMLTemplateElement,
    down: document.querySelector('[data-down-arrow]') as HTMLTemplateElement,
    left: document.querySelector('[data-left-arrow]') as HTMLTemplateElement,
    right: document.querySelector('[data-right-arrow]') as HTMLTemplateElement
}

let cells = {value: 2}
let grid: {value: Grid} = {value: [['', ''], ['', '']]}

const createDomino = (dir: Dir, index: number = -1) => {
    const div = document.createElement('div')
    div.classList.add('domino', dir)
    div.appendChild(arrows[dir].content.cloneNode(true))
    div.dataset.index = index.toString()
    return div
}

const createEmpty = (l: number, index?: number) => {
    const div = document.createElement('div')
    div.style.gridColumn = `span ${l}`
    if (index !== undefined)
        div.dataset.index = index.toString()
    return div
}

const upIndex = (y: number, x: number) => {
    return x + Math.sign(y - cells.value / 2)
}

const downIndex = (y: number, x: number) => {
    return x - Math.sign(y - cells.value / 2 + 1)
}

const drawGrid = () => {
    gridRef.style.setProperty('--cells', cells.value.toString())
    while (gridRef.firstChild)
        gridRef.firstChild.remove()
    const created = new Set()

    for (let y = 0; y < grid.value.length; y++) {
        const row = grid.value[y]
        const emptySize = Math.floor(Math.abs(y - cells.value / 2 + .5))
        if (emptySize)
            gridRef.appendChild(createEmpty(emptySize))

        for (let x = 0; x < row.length; x++) {
            if (created.has(y * cells.value + x)) continue
            const cell = row[x]
            if (!cell) {
                gridRef.appendChild(createEmpty(1, y * cells.value + x))
                continue
            }
            
            gridRef.appendChild(createDomino(cell, y * cells.value + x))
            if (cell.match(/up|down/)) {
                created.add(y * cells.value + x + 1)
                continue
            }
            const x_ = downIndex(y, x)
            created.add(y * cells.value + cells.value + x_)
        }
        
        if (emptySize)
            gridRef.appendChild(createEmpty(emptySize))
    }
}


export {
    gridRef,
    arrows,
    cells,
    grid,
    createDomino,
    createEmpty,
    upIndex,
    downIndex,
    drawGrid
}