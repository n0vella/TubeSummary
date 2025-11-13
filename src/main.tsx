import App from './App'
import { awaitElement } from './utils'
import { render } from 'preact'
import './index.css'
import { createRoot } from 'preact/compat/client'

async function main() {
  const dotButton = (await awaitElement('#button-shape')) as HTMLDivElement

  if (!dotButton) {
    return
  } else {
    observer.disconnect()
  }

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

// run using mutation observer
const observer = new MutationObserver(main)

observer.observe(document.body, {
  childList: true,
  subtree: true,
})
