import { useState, useRef, useEffect } from 'preact/hooks'
import { useChat } from './modules/chat'
import { marked } from 'marked'
import { brain, closeIcon, send } from './Icons'
import { createRoot } from 'preact/compat/client'
import { openSettingsPage } from './utils'

function SummaryPanel() {
  const [chat, ask, isResponding] = useChat()
  const avatarUrl = document.querySelector<HTMLImageElement>('#img')?.src

  function submit(e) {
    e.preventDefault()
    const value = e.currentTarget.userInput.value

    if (!value) {
      return
    }

    ask(value)
    e.currentTarget.userInput.value = ''
  }

  return (
    <div id="yt-summary-panel" className={`description-like !mt-8 flex w-full flex-col gap-10 ${chat.length > 0 && chat[0].role == 'error' ? '!bg-red-200' : ''}`}>
      {chat.length === 0 && <div className="flex !h-24 animate-pulse justify-center">{brain}</div>}
      {chat.map(({ role, content }) => {
        switch (role) {
          case 'assistant':
          case 'error':
            return (
              <div className="flex gap-5 align-top">
                <span className="chat-avatar !bg-red-500 !p-1 !text-white">{brain}</span>
                <div dangerouslySetInnerHTML={{ __html: marked.parse(content) as string }} className="markdown-box" />
              </div>
            )
          case 'user':
            return (
              <div className="flex w-full justify-end gap-5 text-right align-top">
                <div className="markdown-box justify-end whitespace-pre-line">{content}</div>
                <img src={avatarUrl} className="chat-avatar" />
              </div>
            )
        }
      })}

      <form
        id="chat-box"
        className="!mx-4 flex w-full"
        hidden={isResponding}
        onSubmit={submit}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            // allow multiple line writing with shift, send with enter
            submit(e)
          }
        }}
      >
        <textarea
          name="userInput"
          autoComplete="off"
          className="user-input !mx-2 w-full resize-none !px-1 !py-0.5"
          placeholder="Make your questions about this video"
          rows={1}
          onInput={(e) => {
            const self = e.currentTarget
            self.style.height = self.scrollHeight + 'px'
          }}
        ></textarea>
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

  useEffect(() => {
    window.addEventListener('yt-navigate-finish', closeDialog)

    return () => window.removeEventListener('yt-navigate-finish', closeDialog)
  }, [])

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
    <div id="TubeSummary" className="relative">
      <button
        title={'TubeSummary - ' + (dialogLoaded ? 'Close summary' : 'Generate summary') + '\nMiddle click to open settings'}
        className="yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono ml-3 flex aspect-square w-14 cursor-pointer rounded-full p-2"
        onMouseDown={(e: MouseEvent) => {
          if (e.button === 1) {
            e.preventDefault()
            openSettingsPage()
          } else {
            dialogLoaded ? closeDialog() : loadDialog()
          }
        }}
      >
        {dialogLoaded ? closeIcon : brain}
      </button>
    </div>
  )
}
