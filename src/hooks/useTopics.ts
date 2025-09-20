'use client'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Message, Topic } from '@/types/chat'
const STORAGE_KEY='cngpt_topics_v1', MESSAGES_KEY='cngpt_messages_v1'
const now=()=>Date.now()
export function useTopics(){
  const [topics,setTopics]=useState<Topic[]>([])
  const [messagesMap,setMessagesMap]=useState<Record<string,Message[]>>({})
  useEffect(()=>{ try{ const t=localStorage.getItem(STORAGE_KEY), m=localStorage.getItem(MESSAGES_KEY); if(t) setTopics(JSON.parse(t)); if(m) setMessagesMap(JSON.parse(m)); }catch{} },[])
  useEffect(()=>{ try{ localStorage.setItem(STORAGE_KEY,JSON.stringify(topics)); localStorage.setItem(MESSAGES_KEY,JSON.stringify(messagesMap)); }catch{} },[topics,messagesMap])
  const createTopic=useCallback((title:string)=>{ const id=`t_${Math.random().toString(36).slice(2,9)}`; const t={id,title,createdAt:now(),lastAt:now()}; setTopics(p=>[t,...p]); setMessagesMap(p=>({...p,[id]:[]})); return t },[])
  const deleteTopic=useCallback((id:string)=>{ setTopics(p=>p.filter(t=>t.id!==id)); setMessagesMap(p=>{ const c={...p}; delete c[id]; return c }) },[])
  const renameTopic=useCallback((id:string,title:string)=>{ setTopics(p=>p.map(t=>t.id===id?{...t,title}:t)) },[])
  const addMessage=useCallback((tid:string,m:Message)=>{ setMessagesMap(p=>{ const arr=p[tid]??[]; return {...p,[tid]:[...arr,m]} }); setTopics(p=>p.map(t=>t.id===tid?{...t,lastAt:now()}:t)) },[])
  const getMessages=useCallback((tid:string)=>messagesMap[tid]??[],[messagesMap])
  const listTopics=useMemo(()=>[...topics].sort((a,b)=>b.lastAt-a.lastAt),[topics])
  const seedIfEmpty=useCallback(()=>{ if(topics.length===0){ const id=`t_${Math.random().toString(36).slice(2,9)}`; setTopics([{id,title:'Getting started',createdAt:now(),lastAt:now()}]); setMessagesMap({[id]:[{id:`m_${Math.random().toString(36).slice(2,9)}`,role:'mentor',type:'text',content:'Welcome — ask anything about trading or open History.',createdAt:now()}]}) } },[topics.length])
  const clearAll=useCallback(()=>{ setTopics([]); setMessagesMap({}) },[])
  return { topics:listTopics, createTopic, deleteTopic, renameTopic, addMessage, getMessages, seedIfEmpty, clearAll } as const
}
