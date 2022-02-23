import './styles/main.css'
import './styles/domino.css'
import './styles/grid.css'
import './styles/orangeBox.css'
import './styles/btn.css'

import {drawGrid} from './ts/grid/index'
import {animateMove} from './ts/grid/dominoMove'
import {animateSpawn} from './ts/grid/dominoSpawn'
import {animateRemoveBlocking} from './ts/grid/dominoRemoveBlocking'

drawGrid()

import {createButton} from './ts/btn'

const controls = document.querySelector('[data-controls]')!
const moveButton = createButton('Move')
const spawnButton = createButton('Spawn')
const removeButton = createButton('Remove')
moveButton.addEventListener('click', () => {
    animateMove()
})
spawnButton.addEventListener('click', () => {
    animateSpawn()
})
removeButton.addEventListener('click', () => {
    animateRemoveBlocking()
})
controls.append(moveButton, spawnButton, removeButton)