'use client'
import React, { useState, useEffect } from 'react'

interface LexicalNode {
  type: string
  version: number
  children?: LexicalNode[]
  text?: string
  format?: number
  style?: string
  mode?: string
  detail?: number
  indent?: number
  tag?: string
  listType?: string
  [key: string]: any
}

const formatText = (node: LexicalNode) => {
  let content: React.ReactNode = node.text

  if (typeof node.format === 'number') {
    if (node.format & 1) content = <strong key="bold">{content}</strong>
    if (node.format & 2) content = <em key="italic">{content}</em>
    if (node.format & 4) content = <u key="underline">{content}</u>
    if (node.format & 8) content = <code key="code">{content}</code>
    if (node.format & 16) content = <span key="sub" className="align-sub text-xs">{content}</span>
    if (node.format & 32) content = <span key="sup" className="align-sup text-xs">{content}</span>
  }

  return content
}

const renderNode = (node: LexicalNode, index: number): React.ReactNode => {
  if (node.type === 'text') {
    return formatText(node)
  }

  const children = node.children ? node.children.map((child, i) => renderNode(child, i)) : null

  switch (node.type) {
    case 'paragraph':
      return <p key={index} className="mb-4">{children}</p>
    case 'heading':
      const Tag = node.tag as keyof React.JSX.IntrinsicElements
      return <Tag key={index} className="font-bold mb-2">{children}</Tag>
    case 'list':
      const ListTag = node.listType === 'number' ? 'ol' : 'ul'
      return (
        <ListTag key={index} className={`mb-4 ml-6 ${node.listType === 'number' ? 'list-decimal' : 'list-disc'}`}>
          {children}
        </ListTag>
      )
    case 'listitem':
      return <li key={index} className="mb-1">{children}</li>
    case 'quote':
      return <blockquote key={index} className="border-l-4 border-gray-300 pl-4 italic my-4">{children}</blockquote>
    case 'linebreak':
      return <br key={index} />
    case 'link':
      return (
        <a key={index} href={node.fields?.url} className="text-blue-600 hover:underline" target={node.fields?.newTab ? '_blank' : undefined}>
          {children}
        </a>
      )
    default:
      return children
  }
}

export const RichTextRenderer: React.FC<{ content: any }> = ({ content }) => {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return null
  }

  if (!content || !content.root) return null
  return <div className="rich-text-content">{content.root.children.map((node: LexicalNode, i: number) => renderNode(node, i))}</div>
}
