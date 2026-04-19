import { NextResponse } from 'next/server'
import { jakimService } from '@/lib/jakim-service'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date') || undefined

    const khutbahList = await jakimService.getKhutbah(date)

    return NextResponse.json({
      success: true,
      data: khutbahList,
      count: khutbahList.length,
      source: 'JAKIM e-Khutbah',
    })
  } catch {
    return NextResponse.json(
      {
        success: false,
        data: [],
        error: 'Gagal mendapatkan data khutbah',
      },
      { status: 500 }
    )
  }
}
