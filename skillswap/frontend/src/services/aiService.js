const aiService = {
  askSupportAI: async (prompt) => {
    const response = await fetch('/api/ai-reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    })

    if (!response.ok) {
      const text = await response.text()
      throw new Error(text || 'AI request failed')
    }

    return response.json()
  },
}

export default aiService
