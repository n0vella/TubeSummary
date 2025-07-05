import { render } from 'preact'
import { useState } from 'preact/hooks'
import { useChat } from './modules/chat'
import { marked } from 'marked'
import { useEffect } from 'react'
import { brain, send } from './Icons'

function SummaryPanel() {
  const [chat, ask, isResponding] = useChat()
  const avatarUrl = document.querySelector<HTMLImageElement>('#img')?.src

  return (
    <div id="yt-summary-panel" className="description-like !mt-8 flex w-full flex-col gap-10">
      {chat.length === 0 && <div className="flex !h-24 animate-pulse justify-center">{brain}</div>}
      {chat.map(({ role, content }) => {
        switch (role) {
          case 'assistant':
            return (
              <div className="flex gap-5 align-top">
                <span className="chat-avatar !bg-red-500 !p-1 !text-white">{brain}</span>
                <div dangerouslySetInnerHTML={{ __html: marked.parse(content) as string }} className="markdown-box" />
              </div>
            )
          case 'user':
            return (
              <div className="flex w-full justify-end gap-5 text-right align-top">
                <div dangerouslySetInnerHTML={{ __html: marked.parse(content) as string }} className="markdown-box justify-end" />
                <img src={avatarUrl} className="chat-avatar" />
              </div>
            )
        }
      })}

      <form
        id="chat-box"
        className="mx-4 flex h-12 w-full"
        hidden={isResponding}
        onSubmit={(e) => {
          e.preventDefault()
          ask(e.currentTarget.userInput.value)
          e.currentTarget.userInput.value = ''
        }}
      >
        <input name="userInput" autoComplete="off" className="!mx-2 w-full !px-1 !py-0.5" placeholder="Ask about the video"></input>
        <button className="w-10 cursor-pointer">{send}</button>
      </form>
    </div>
  )
}

function loadDialog() {
  const bottomRow = document.querySelector<HTMLDivElement>('#bottom-row')!

  const panel = bottomRow.querySelector<HTMLDivElement>('#yt-summary-panel')

  if (!panel) {
    const container = document.createElement('div')
    bottomRow.insertBefore(container, bottomRow.firstChild)
    render(<SummaryPanel />, container)
  }
}

export default function App() {
  return (
    <button title="Generate summary" className="yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono ml-3 flex aspect-square w-14 cursor-pointer items-center justify-center rounded-full p-2" onClick={loadDialog}>
      {brain}
    </button>
  )
}

// yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-button yt-spec-button-shape-next--enable-backdrop-filter-experiment
