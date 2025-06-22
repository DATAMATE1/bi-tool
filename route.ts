import { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  const { data } = await req.json()

  // Call Qwen3 API
  const response = await fetch("https://api.qwen.com/v1/services/aigc/text-generation/generation",  {
    method: "POST",
    headers: {
      "Authorization": `Bearer YOUR_QWEN3_API_KEY`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      input: `Analyze: ${JSON.stringify(data).substring(0, 10000)}`
    })
  })

  const result = await response.json()
  return new Response(JSON.stringify({ insights: result.output.text }))
}