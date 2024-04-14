export function GET() {
  return new Response('Blocked', { status: 429 })
}
