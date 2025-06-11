import { render } from 'preact'
import { useState } from 'preact/hooks'

function SummaryPanel() {
  return (
    <div id="yt-summary-panel" className="m-2 flex min-h-20 w-full flex-col gap-2 rounded-lg bg-red-300 !p-3">
      <div className="bg-background w-full rounded-lg !p-2 !px-3">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Totam nisi officia velit ratione, natus reiciendis odio at illo sed excepturi eveniet deserunt. Saepe, non maiores ipsum sapiente aspernatur ipsa odit.</div>
      <div className="bg-background flex h-12 w-full rounded-lg">
        <input className="w-full !p-2 !px-3" placeholder="Ask about the video"></input>
        <button className="w-12 rounded-r-lg bg-sky-600 !text-white">{'>'}</button>
      </div>
    </div>
  )
}

function loadDialog() {
  const description = document.querySelector<HTMLDivElement>('#bottom-row > #description')

  if (!description) {
    throw new Error("Couldn't find description <div>")
  }

  const panel = description.querySelector<HTMLDivElement>('#yt-summary-panel')

  if (!panel) {
    const container = document.createElement('div')
    console.log(description.firstChild)
    description.insertBefore(container, description.firstChild)
    render(<SummaryPanel />, container)
  }
}

export default function App() {
  return (
    <button title="Generate summary" className="yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono ml-3 flex aspect-square w-14 cursor-pointer items-center justify-center rounded-full p-2" onClick={loadDialog}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className="icon-tabler">
        <path d="M14 3v4a1 1 0 0 0 1 1h4" />
        <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
      </svg>
    </button>
  )
}

// yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-button yt-spec-button-shape-next--enable-backdrop-filter-experiment
