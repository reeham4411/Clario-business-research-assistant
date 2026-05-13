'use client'

import { useState, useCallback, useRef }  from 'react'
import { sendResearchQuery } from "@/app/utils/api";
import type {
  AgentStep,
  AgentId,
  ChatMessage,
  MessageMeta
} from "@/app/utils/types";

const AGENT_PIPELINE: AgentStep[] = [
  { id: 'clarity',   label: 'Clarity',   icon: '◈' },
  { id: 'planning',  label: 'Planning',  icon: '◉' },
  { id: 'research',  label: 'Research',  icon: '◎' },
  { id: 'validator', label: 'Validator', icon: '◆' },
  { id: 'synthesis', label: 'Synthesis', icon: '◈' },
]

const AGENT_DELAYS: Record<AgentId, number> = {
  clarity:   0,
  planning:  800,
  research:  2000,
  validator: 3500,
  synthesis: 5500,
}

interface UseChatReturn {
  messages:              ChatMessage[]
  isLoading:             boolean
  activeAgent:           AgentId | null
  agentPipeline:         AgentStep[]
  needsClarification:    boolean
  clarificationQuestion: string
  lastMeta:              MessageMeta | null
  sendMessage:           (query: string) => Promise<void>
  submitClarification:   (text: string)  => Promise<void>
  dismissClarification:  () => void
}

export function useChat(): UseChatReturn {
  const [messages,              setMessages]              = useState<ChatMessage[]>([])
  const [isLoading,             setIsLoading]             = useState(false)
  const [activeAgent,           setActiveAgent]           = useState<AgentId | null>(null)
  const [sessionId,             setSessionId]             = useState<string | null>(null)
  const [needsClarification,    setNeedsClarification]    = useState(false)
  const [clarificationQuestion, setClarificationQuestion] = useState('')
  const [pendingQuery,          setPendingQuery]          = useState('')
  const [lastMeta,              setLastMeta]              = useState<MessageMeta | null>(null)

  const sessionRef = useRef<string | null>(sessionId)
  // eslint-disable-next-line react-hooks/refs
  sessionRef.current = sessionId

  const simulateAgentProgress = useCallback(
    (signal: AbortSignal) => {
      ;(Object.entries(AGENT_DELAYS) as [AgentId, number][]).forEach(
        ([agentId, delay]) => {
          setTimeout(() => {
            if (!signal.aborted) setActiveAgent(agentId)
          }, delay)
        }
      )
    },
    []
  )

  const sendMessage = useCallback(
    async (query: string) => {
      if (!query.trim() || isLoading) return

      const userMsg: ChatMessage = { id: Date.now(), role: 'user', content: query }
      setMessages(prev => [...prev, userMsg])
      setIsLoading(true)
      setActiveAgent(null)

      const controller = new AbortController()
      simulateAgentProgress(controller.signal)

      try {
        let sid = sessionRef.current
        if (!sid) {
          sid = `session_${Date.now()}_${Math.random().toString(36).slice(2)}`
          setSessionId(sid)
        }

        const data = await sendResearchQuery({ query, session_id: sid })

        controller.abort()
        setActiveAgent('synthesis')

        if (data.needs_clarification) {
          setPendingQuery(query)
          setClarificationQuestion(
            data.clarification_question ?? 'Could you clarify your query?'
          )
          setNeedsClarification(true)
          setIsLoading(false)
          setActiveAgent(null)
          return
        }

        const meta: MessageMeta = {
          confidence: data.confidence_score,
          attempts:   data.research_attempts,
          validation: data.validation_result,
          company:    data.company_name,
          aspects:    data.research_aspects ?? [],
        }

        const assistantMsg: ChatMessage = {
          id:                 Date.now() + 1,
          role:               'assistant',
          content:            data.final_response ?? 'No response generated.',
          meta,
          suggestedQuestions: data.suggested_questions ?? [],
        }

        setMessages(prev => [...prev, assistantMsg])
        setLastMeta(meta)
      } catch (err) {
        controller.abort()
        const message = err instanceof Error ? err.message : 'Unknown error'
        const errMsg: ChatMessage = {
          id:      Date.now() + 1,
          role:    'error',
          content: `Connection error: ${message}`,
        }
        setMessages(prev => [...prev, errMsg])
      } finally {
        setIsLoading(false)
        setTimeout(() => setActiveAgent(null), 800)
      }
    },
    [isLoading, simulateAgentProgress]
  )

  const submitClarification = useCallback(
    async (clarificationText: string) => {
      setNeedsClarification(false)
      await sendMessage(`${pendingQuery} — ${clarificationText}`)
    },
    [pendingQuery, sendMessage]
  )

  const dismissClarification = useCallback(() => {
    setNeedsClarification(false)
    setPendingQuery('')
    setClarificationQuestion('')
  }, [])

  return {
    messages,
    isLoading,
    activeAgent,
    agentPipeline: AGENT_PIPELINE,
    needsClarification,
    clarificationQuestion,
    lastMeta,
    sendMessage,
    submitClarification,
    dismissClarification,
  }
}