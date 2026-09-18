import type { NoteColor } from './utils/note-colors'

export type Note = {
  id: string
  title: string
  content: string
  color: NoteColor
  createdAt: string
  updatedAt: string
}
