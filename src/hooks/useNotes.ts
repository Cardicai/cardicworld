'use client'
import { useCallback, useEffect, useState } from 'react'

export type NoteTopic = { id: string; title: string; createdAt: number; updatedAt: number }
export type NotesState = {
  topics: NoteTopic[]
  activeId: string | null
  contentMap: Record<string, string>
}

const KEY = 'cn_notes_v1'

const seed = (): NotesState => {
  const id = `n_${Math.random().toString(36).slice(2,9)}`
  return {
    topics: [{ id, title: 'My first note', createdAt: Date.now(), updatedAt: Date.now() }],
    activeId: id,
    contentMap: { [id]: '' }
  }
}

export function useNotes(){
  const [state, setState] = useState<NotesState>(seed())

  useEffect(()=>{
    try{
      const raw = localStorage.getItem(KEY)
      if(raw){
        const parsed = JSON.parse(raw) as NotesState
        if (parsed && parsed.topics?.length) setState(parsed)
      }
    }catch{}
  },[])
  useEffect(()=>{
    try{ localStorage.setItem(KEY, JSON.stringify(state)) }catch{}
  },[state])

  const createTopic = useCallback((title: string) => {
    const id = `n_${Math.random().toString(36).slice(2,9)}`
    setState(s => ({
      topics: [{ id, title: title || 'Untitled note', createdAt: Date.now(), updatedAt: Date.now() }, ...s.topics],
      activeId: id,
      contentMap: { ...s.contentMap, [id]: '' }
    }))
    return id
  },[])

  const renameTopic = useCallback((id: string, title: string) => {
    setState(s => ({
      ...s,
      topics: s.topics.map(t => t.id === id ? { ...t, title, updatedAt: Date.now() } : t)
    }))
  },[])

  const deleteTopic = useCallback((id: string) => {
    setState(s => {
      const topics = s.topics.filter(t => t.id !== id)
      const { [id]: _, ...rest } = s.contentMap
      const activeId = s.activeId === id ? (topics[0]?.id ?? null) : s.activeId
      return { topics, activeId, contentMap: rest }
    })
  },[])

  const setActive = useCallback((id: string) => setState(s => ({ ...s, activeId: id })),[])
  const saveContent = useCallback((id: string, content: string) => {
    setState(s => ({
      ...s,
      contentMap: { ...s.contentMap, [id]: content },
      topics: s.topics.map(t => t.id === id ? { ...t, updatedAt: Date.now() } : t)
    }))
  },[])

  const activeContent = (state.activeId ? state.contentMap[state.activeId] ?? '' : '')
  const activeTopic = state.topics.find(t => t.id === state.activeId) ?? null

  return { ...state, createTopic, renameTopic, deleteTopic, setActive, saveContent, activeContent, activeTopic } as const
}
