'use client'
import React from 'react'
import { Width } from '../Width'
import RichText from '@/components/RichText'
import type { SerializedEditorState, SerializedLexicalNode } from '@payloadcms/richtext-lexical/lexical'

export const Message: React.FC<{ message: SerializedEditorState<SerializedLexicalNode> }> = ({ message }) => {
  // ต้องแน่ใจว่า message ไม่เป็น null/undefined ก่อนที่จะส่ง data เข้าไปใน RichText
  const safeMessage = message || { root: { children: [], direction: null, format: "", indent: 0, type: "root", version: 1 } };
  
  return (
    <Width className="my-12" width="100">
      <RichText data={safeMessage} />
    </Width>
  )
}
