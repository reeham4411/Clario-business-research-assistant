import type { ResearchRequest, ResearchResponse } from './types'

export async function sendResearchQuery(
  params: ResearchRequest
): Promise<ResearchResponse> {
  const response = await fetch('/api/research', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(params),
  })

  if (!response.ok) {
    const err = await response.json()
    throw new Error((err as { error?: string }).error ?? 'Request failed')
  }

  return response.json() as Promise<ResearchResponse>
}