'use client'
import { Badge } from '@/components/ui/badge'
import { EditorElement, useEditor } from '@/providers/editor/editor-provider'
import clsx from 'clsx'
import { Trash } from 'lucide-react'
import React, { useEffect, useRef } from 'react'

type Props = {
  element: EditorElement
}

// Helper function to sanitize styles
const sanitizeStyles = (styles: Record<string, any>) => {
  const sanitized: Record<string, any> = {}
  for (const [key, value] of Object.entries(styles)) {
    const camelCaseKey = key.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
    sanitized[camelCaseKey] = value
  }
  return sanitized
}

const TextComponent = ({ element }: Props) => {
  const { dispatch, state } = useEditor()
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (textRef.current && !Array.isArray(element.content) && element.content.innerText) {
      textRef.current.innerText = element.content.innerText
    }
  }, [element.content])

  const handleContentChange = () => {
    if (textRef.current) {
      dispatch({
        type: 'UPDATE_ELEMENT',
        payload: {
          elementDetails: {
            ...element,
            content: {
              innerText: textRef.current.innerText
            }
          }
        }
      })
    }
  }

  const handleOnClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    dispatch({
      type: 'CHANGE_CLICKED_ELEMENT',
      payload: {
        elementDetails: element,
      },
    })
  }

  const handleDeleteElement = (e: React.MouseEvent) => {
    e.stopPropagation()
    dispatch({
      type: 'DELETE_ELEMENT',
      payload: { elementDetails: element },
    })
  }

  const getContent = () => {
    if (Array.isArray(element.content)) return ''
    return element.content.innerText || ''
  }

  const sanitizedStyles = sanitizeStyles(element.styles)

  return (
    <div
      ref={textRef}
      contentEditable={!state.editor.liveMode}
      onBlur={handleContentChange}
      onClick={handleOnClick}
      className={clsx(
        'relative p-4 w-full hover:outline-blue-500 hover:outline hover:outline-1',
        {
          'outline-blue-500 outline outline-1':
            state.editor.selectedElement.id === element.id &&
            !state.editor.liveMode,
          '!pointer-events-none': state.editor.liveMode,
        }
      )}
      style={sanitizedStyles}
      suppressContentEditableWarning={true}
    >
      {getContent()}
      {!state.editor.liveMode && state.editor.selectedElement.id === element.id && (
        <>
          <Badge className="absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg">
            {element.name}
          </Badge>
          <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg">
            <Trash
              size={16}
              onClick={handleDeleteElement}
            />
          </div>
        </>
      )}
    </div>
  )
}

export default TextComponent
