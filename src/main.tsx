import App from './App'
import { awaitElement } from './utils'
import { render } from 'preact'
import './index.css'
import { createRoot } from 'preact/compat/client'

async function main() {
  const dotButton = (await awaitElement('#button-shape')) as HTMLDivElement

  let container = document.querySelector('#TubeSummary')
  if (container) {
    container.remove()
  }
  container = document.createElement('div')
  dotButton.insertAdjacentElement('afterend', container)

  const menu = dotButton.parentElement
  if (menu) {
    menu.style.alignItems = 'center'
  }

  render(<App />, container)
}

main()
