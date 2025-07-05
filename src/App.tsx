import { render } from 'preact'
import { useState } from 'preact/hooks'
import { useChat } from './modules/chat'
import { marked } from 'marked'
import { useEffect, useRef } from 'react'
import { brain, closeIcon, gear, send } from './Icons'
import { createRoot } from 'preact/compat/client'

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
        className="!mx-4 flex h-12 w-full"
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

export default function App() {
  const [dialogLoaded, setDialogLoaded] = useState(false)
  const root = useRef<ReturnType<typeof createRoot>>(null)
  const [showContext, setShowContext] = useState(false)

  function closeDialog() {
    setDialogLoaded(false)
    root.current?.unmount()
  }

  function loadDialog() {
    setDialogLoaded(true)
    const bottomRow = document.querySelector<HTMLDivElement>('#bottom-row')!

    const panel = bottomRow.querySelector<HTMLDivElement>('#yt-summary-panel')

    if (!panel) {
      const container = document.createElement('div')
      root.current = createRoot(container)

      bottomRow.insertBefore(container, bottomRow.firstChild)

      root.current.render(<SummaryPanel />)
    }
  }

  return (
    <div className="relative">
      <button
        title={dialogLoaded ? 'Close summary' : 'Generate summary'}
        className="yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono ml-3 flex aspect-square w-14 cursor-pointer rounded-full p-2"
        onClick={dialogLoaded ? closeDialog : loadDialog}
        onContextMenu={(e) => {
          e.preventDefault()
          setShowContext(true)
        }}
      >
        {dialogLoaded ? closeIcon : brain}
      </button>
      {showContext && (
        <>
          <div className="context-close" onClick={() => setShowContext(false)} />

          <div className="context-menu absolute top-0 left-0 translate-8">
            <button
              className="flex items-center gap-2 px-2 text-lg"
              onClick={() => {
                setShowContext(false)
              }}
            >
              <span className="w-12">{gear}</span>
              <span>Settings</span>
            </button>
          </div>
        </>
      )}
    </div>
  )
}
