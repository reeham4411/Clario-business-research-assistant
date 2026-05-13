export interface AgentStep {
  id:    string
  label: string
  icon:  string
}

export type AgentId = 'clarity' | 'planning' | 'research' | 'validator' | 'synthesis'

export type MessageRole = 'user' | 'assistant' | 'error'

export interface MessageMeta {
  confidence: number | null
  attempts:   number | null
  validation: string | null
  company:    string | null
  aspects:    string[]
}

export interface ChatMessage {
  id:                 number
  role:               MessageRole
  content:            string
  meta?:              MessageMeta
  suggestedQuestions?: string[]
}

export interface ResearchRequest {
  query:          string
  session_id:     string | null
  clarification?: string | null
}

export interface ResearchResponse {
  final_response:        string
  confidence_score:      number
  research_attempts:     number
  validation_result:     string
  company_name:          string
  research_aspects:      string[]
  needs_clarification:   boolean
  clarification_question: string
  suggested_questions:   string[]
}