const gridRef = document.querySelector('[data-grid]')
const arrows = {
    up: document.querySelector('[data-up-arrow]'),
    down: document.querySelector('[data-down-arrow]'),
    left: document.querySelector('[data-left-arrow]'),
    right: document.querySelector('[data-right-arrow]')
}

// let cells = 4
// let grid = [
//     ['', 'up', 'up', ''],
//     ['left', 'down', 'down', 'right'],
//     ['left', 'up', 'up', 'right'],
//     ['', 'down', 'down', '']
// ]

let cells = 2
let grid = [
    ['left', 'right'],
    ['left', 'right']
]

const createDomino = dir => {
    const div = document.createElement('div')
    div.classList.add('domino', dir)
    div.appendChild(arrows[dir].content.cloneNode(true))
    div.setAttribute(`data-${dir}`, '')
    return div
}

const createEmpty = l => {
    const div = document.createElement('div')
    div.style.gridColumn = `span ${l}`
    return div
}

const drawGrid = () => {
    gridRef.style.setProperty('--cells', cells)
    while (gridRef.firstChild)
        gridRef.firstChild.remove()
    const created = new Set()
    for (let y = 0; y < cells; y++) {
        const row = grid[y]
        for (let x = 0; x < cells; x++) {
            if (created.has(y * cells + x)) continue
            const cell = row[x]
            if (!cell) {
                gridRef.appendChild(createEmpty(1))
                continue
            }
            if (cell.match(/up|down/)) {
                gridRef.appendChild(createDomino(cell))
                x++
                continue
            }
            created.add(y * cells + cells + x)
            gridRef.appendChild(createDomino(cell))
        }
    }
}

const increaseGrid = () => {
    cells += 2

    let newGrid = [Array(cells).fill('')]
    for (let y = 0; y < grid.length; y++) {
        const row = grid[y]
        const newRow = ['']
        for (x = 0; x < row.length; x++) {
            newRow.push(row[x])
        }
        newRow.push('')
        newGrid.push(newRow)
    }
    newGrid.push(Array(cells).fill(''))
    grid = newGrid
    drawGrid()
}


drawGrid()


const btn = document.querySelector('[data-increase]')
btn.addEventListener('click', () => {
    increaseGrid()
})