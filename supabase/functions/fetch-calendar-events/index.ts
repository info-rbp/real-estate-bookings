import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
}

interface CalendarEvent {
  id: string
  title: string
  start: string
  end: string
  isAllDay: boolean
}

function parseICS(icsContent: string): CalendarEvent[] {
  const events: CalendarEvent[] = []
  const lines = icsContent.split('\n')
  let currentEvent: Partial<CalendarEvent> | null = null
  let inEvent = false

  for (const line of lines) {
    const trimmedLine = line.trim()

    if (trimmedLine === 'BEGIN:VEVENT') {
      inEvent = true
      currentEvent = {}
    } else if (trimmedLine === 'END:VEVENT') {
      inEvent = false
      if (currentEvent && currentEvent.title && currentEvent.start) {
        events.push({
          id: currentEvent.id || Math.random().toString(),
          title: currentEvent.title,
          start: currentEvent.start,
          end: currentEvent.end || currentEvent.start,
          isAllDay: currentEvent.isAllDay || false,
        })
      }
      currentEvent = null
    } else if (inEvent && currentEvent) {
      if (trimmedLine.startsWith('DTSTART')) {
        const dateStr = trimmedLine.split(':')[1]
        currentEvent.start = parseICSDate(dateStr)
        currentEvent.isAllDay = !trimmedLine.includes('T')
      } else if (trimmedLine.startsWith('DTEND')) {
        const dateStr = trimmedLine.split(':')[1]
        currentEvent.end = parseICSDate(dateStr)
      } else if (trimmedLine.startsWith('SUMMARY')) {
        currentEvent.title = trimmedLine.split(':')[1] || 'Event'
      } else if (trimmedLine.startsWith('UID')) {
        currentEvent.id = trimmedLine.split(':')[1] || ''
      }
    }
  }

  return events
}

function parseICSDate(dateStr: string): string {
  // Format: 20260519T100000Z or 20260519
  if (dateStr.includes('T')) {
    const year = dateStr.substring(0, 4)
    const month = dateStr.substring(4, 6)
    const day = dateStr.substring(6, 8)
    const hour = dateStr.substring(9, 11)
    const minute = dateStr.substring(11, 13)
    return `${year}-${month}-${day}T${hour}:${minute}:00Z`
  } else {
    const year = dateStr.substring(0, 4)
    const month = dateStr.substring(4, 6)
    const day = dateStr.substring(6, 8)
    return `${year}-${month}-${day}`
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    })
  }

  try {
    const calendarUrl = "https://calendar.google.com/calendar/ical/c_ff8ad609a6dadffaed782682b2c46e87b40f0c6b9cdfc8d9c313c68682b411c8%40group.calendar.google.com/private-12982953dd4feae42ee1612644bbff39/basic.ics"

    const response = await fetch(calendarUrl)
    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch calendar" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    const icsContent = await response.text()
    const events = parseICS(icsContent)

    // Filter events for the next 90 days and format them
    const now = new Date()
    const futureDate = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000)

    const upcomingEvents = events.filter(event => {
      const eventDate = new Date(event.start)
      return eventDate >= now && eventDate <= futureDate
    }).sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())

    return new Response(
      JSON.stringify({ events: upcomingEvents, count: upcomingEvents.length }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    )
  }
})
