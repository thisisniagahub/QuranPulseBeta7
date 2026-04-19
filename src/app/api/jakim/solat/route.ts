import { NextRequest, NextResponse } from 'next/server'
import { jakimService } from '@/lib/jakim-service'

export const dynamic = 'force-dynamic'

// GET /api/jakim/solat?zone=WPKL01&date=2024-01-15
// JAKIM prayer times for a specific zone and date
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const zone = searchParams.get('zone')
    const date = searchParams.get('date') || undefined

    if (!zone) {
      return NextResponse.json(
        { success: false, error: 'Zone parameter is required. Use /api/jakim/zones to get available zones.' },
        { status: 400 }
      )
    }

    // Validate zone format
    const validZones = jakimService.getZones()
    const zoneExists = validZones.some(z => z.code === zone.toUpperCase())

    if (!zoneExists) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid zone code: "${zone}". Use /api/jakim/zones to get available zones.`,
        },
        { status: 400 }
      )
    }

    // Validate date format if provided
    if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { success: false, error: 'Date must be in YYYY-MM-DD format' },
        { status: 400 }
      )
    }

    const prayerTimes = await jakimService.getPrayerTimes(zone.toUpperCase(), date)

    return NextResponse.json({
      success: true,
      data: prayerTimes,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch prayer times'
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
