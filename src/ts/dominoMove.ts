import {grid, cells, upIndex, downIndex, gridRef, drawGrid} from "./grid";

const increaseGrid = () => {
    cells.value += 2
    let newGrid: Grid = [['', '']]

    for (let y = 0; y < grid.value.length; y++) {
        const row = grid.value[y]
        const newRow: GridRow = ['']
        for (let x = 0; x < row.length; x++) {
            newRow.push(row[x])
        }
        newRow.push('')
        newGrid.push(newRow)
    }
    newGrid.push(['', ''])
    grid.value = newGrid
}

const moveGrid = () => {
    const toAdd = new Map()
    const newGrid: Grid = []

    for (let y = 0; y < grid.value.length; y++) {
        const row = grid.value[y]
        const newRow: GridRow = []
        for (let x = 0; x < row.length; x++) {
            if (toAdd.has(y * cells.value + x))
                newRow.push(toAdd.get(y * cells.value + x))
            else 
                newRow.push('')
            
            const cell = row[x]
            if (cell === 'left') {
                newRow[x - 1] = 'left'
                continue
            }
            if (cell === 'right') {
                toAdd.set(y * cells.value + x + 1, 'right')
                continue
            }
            if (cell === 'up') {
                const x_ = upIndex(y, x)
                newGrid[y - 1][x_] = 'up'
                continue
            }
            if (cell === 'down') {
                const x_ = downIndex(y, x)
                toAdd.set((y + 1) * cells.value + x_, 'down')
            }
        }
        newGrid.push(newRow)
    }
    grid.value = newGrid
}

const animateMove = () => {
    const size = parseInt(getComputedStyle(gridRef).getPropertyValue('--size'))
    const targetCellSize = size / (cells.value + 2)
    gridRef.style.setProperty('--size', `${targetCellSize * cells.value}px`)
    gridRef.addEventListener('transitionend', () => {
        gridRef.classList.add('animate-move')
        setTimeout(() => {
            gridRef.addEventListener('transitionend', () => {
                gridRef.classList.remove('animate-move')
                gridRef.style.setProperty('--size', `${size}px`)
                increaseGrid()
                moveGrid()
                drawGrid()
            }, {once: true})
        })
    }, {once: true})
}

export {
    animateMove
}