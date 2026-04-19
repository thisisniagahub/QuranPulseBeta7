import { NextResponse } from 'next/server'
import { jakimService } from '@/lib/jakim-service'

export const dynamic = 'force-dynamic'

// GET /api/jakim/zones
// List all JAKIM prayer time zones in Malaysia
export async function GET() {
  try {
    const zones = jakimService.getZones()

    // Group by state for easier navigation
    const groupedByState = zones.reduce<Record<string, typeof zones>>((acc, zone) => {
      if (!acc[zone.state]) {
        acc[zone.state] = []
      }
      acc[zone.state].push(zone)
      return acc
    }, {})

    return NextResponse.json({
      success: true,
      total: zones.length,
      data: zones,
      groupedByState,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch zones'
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
