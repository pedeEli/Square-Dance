import {findButton} from '@ts/ui/btn'
import {secondPage} from '@ts/ui/infoPages/second'

const info = document.querySelector('[data-info]') as HTMLElement
const sections = [...info.querySelectorAll('[data-section]') as any as HTMLElement[]]
let sectionIndex = 1

const nextButton = findButton('next')
const previousButton = findButton('previous')

const pages: InfoPage[] = [
    {},
    secondPage
]

const initInfo = () => {
    updateSections()
    // previousButton.disabled = true
    pages.forEach(page => page.init?.call(null))
    pages[sectionIndex].show?.call(null)

    nextButton.addEventListener('click', () => {
        pages[sectionIndex].hide?.call(null)
        sectionIndex++
        pages[sectionIndex].show?.call(null)
        previousButton.disabled = false
        if (sectionIndex === sections.length - 1)
            nextButton.disabled = true
        updateSections()
    })
    previousButton.addEventListener('click', () => {
        pages[sectionIndex].hide?.call(null)
        sectionIndex--
        pages[sectionIndex].show?.call(null)
        nextButton.disabled = false
        if (sectionIndex === 0)
            previousButton.disabled = true
        updateSections()
    })
}

const updateSections = () => {
    sections.forEach((section, index) => {
        section.classList.toggle('hidden', index !== sectionIndex)
    })
}

export {
    initInfo
}