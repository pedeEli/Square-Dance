const gridRef = document.querySelector('[data-grid]')
const arrows = {
    up: document.querySelector('[data-up-arrow]'),
    down: document.querySelector('[data-down-arrow]'),
    left: document.querySelector('[data-left-arrow]'),
    right: document.querySelector('[data-right-arrow]')
}

let cells = 4
// let grid = [
//     ['', 'up', 'up', ''],
//     ['left', 'down', 'down', 'right'],
//     ['left', 'up', 'up', 'right'],
//     ['', 'down', 'down', '']
// ]
let grid = [
    ['', 'left', 'right', ''],
    ['', 'left', 'right', ''],
    ['', 'up', 'up', ''],
    ['', '', '', '']
]

// let cells = 2
// let grid = [
//     ['left', 'right'],
//     ['left', 'right']
// ]

const createDomino = dir => {
    const div = document.createElement('div')
    div.classList.add('domino', dir)
    div.appendChild(arrows[dir].content.cloneNode(true))
    div.setAttribute(`data-${dir}`, '')
    return div
}

const createEmpty = () => {
    const div = document.createElement('div')
    div.style.gridColumn = `span 1`
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
                gridRef.appendChild(createEmpty())
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
}

const moveGrid = () => {
    const moved = new Set()
    for (let i = 0; i < 2; i++) {
        for (let y = 0; y < cells; y++) {
            const row = grid[y]
            for (let x = 0; x < cells; x++) {
                if (moved.has(y * cells + x)) continue
                const cell = row[x]
                if (!cell) continue
                if (cell === 'up' && y > 0 && !grid[y - 1][x]) {
                    grid[y - 1][x] = 'up'
                    row[x] = ''
                    moved.add(y * cells - cells + x)
                    continue
                }
                if (cell === 'down' && y < cells - 1 && !grid[y + 1][x]) {
                    grid[y + 1][x] = 'down'
                    row[x] = ''
                    moved.add(y * cells + cells + x)
                    continue
                }
                if (cell === 'left' && x > 0 && !row[x - 1]) {
                    row[x - 1] = 'left'
                    row[x] = ''
                    moved.add(y * cells + x - 1)
                    continue
                }
                if (cell === 'right' && x < cells - 1  && !row[x + 1]) {
                    row[x + 1] = 'right'
                    row[x] = ''
                    moved.add(y * cells + x + 1)
                }
            }
        }
    }
}

drawGrid()


const increaseButton = document.querySelector('[data-increase]')
increaseButton.addEventListener('click', () => {
    increaseGrid()
    drawGrid()
})
const moveButton = document.querySelector('[data-move]')
moveButton.addEventListener('click', () => {
    moveGrid()
    drawGrid()
})