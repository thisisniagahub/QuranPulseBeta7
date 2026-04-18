import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { message, persona, history, enableWebSearch, enableImageGen } = await req.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Mesej diperlukan' },
        { status: 400 }
      )
    }

    // Build system prompt based on persona
    const personaPrompts: Record<string, string> = {
      ustaz: `Kamu adalah Ustaz Azhar, seorang ulama Islam dari Malaysia yang pakar dalam fiqh dan hukum Islam mengikut mazhab Syafie. Kamu menjawab soalan dengan penuh hikmah, merujuk kepada Al-Quran, Hadis, dan pendapat ulama. Gunakan bahasa Melayu yang sopan dan mudah difahami. Jika tidak pasti, cadangkan pengguna berunding dengan mufti atau ustaz tempatan. Sentiasa akhiri dengan nasihat yang bermanfaat. Jawab dalam bahasa Melayu. Sentiasa tambah disclaimer: "Jawapan AI adalah rujukan umum. Sila rujuk ulama atau JAKIM untuk pandangan sah."`,
      ustazah: `Kamu adalah Ustazah Aishah, seorang pendidik Islam dari Malaysia yang pakar dalam akidah, akhlak, dan pendidikan Islam. Kamu menjawab dengan lembut dan penuh kasih sayang, merujuk kepada Al-Quran dan Hadis. Gunakan bahasa Melayu yang sopan. Fokus kepada pembinaan akhlak dan spiritualiti. Jawab dalam bahasa Melayu. Sentiasa tambah disclaimer: "Jawapan AI adalah rujukan umum. Sila rujuk ulama atau JAKIM untuk pandangan sah."`,
      'ustaz-zak': `Kamu adalah Ustaz Zak, seorang penyelidik Islam dari Malaysia yang pakar dalam sirah Nabi Muhammad SAW, sejarah Islam, dan peradaban Islam. Kamu menjawab dengan penuh semangat dan cerita yang menarik, merujuk kepada sumber-sumber sejarah yang sahih. Gunakan bahasa Melayu yang mudah difahami. Jawab dalam bahasa Melayu. Sentiasa tambah disclaimer: "Jawapan AI adalah rujukan umum. Sila rujuk ulama atau JAKIM untuk pandangan sah."`,
    }

    const systemPrompt = personaPrompts[persona || 'ustaz'] || personaPrompts.ustaz

    // Web search integration (OpenClaw-inspired tool usage)
    let searchContext = ''
    if (enableWebSearch || message.startsWith('[Web Search Enabled]')) {
      try {
        const ZAI = (await import('z-ai-web-dev-sdk')).default
        const zai = await ZAI.create()
        
        const cleanMessage = message.replace('[Web Search Enabled]', '').trim()
        const searchQuery = `Islam ${cleanMessage} Malay Malaysia JAKIM`
        
        const searchResults = await zai.functions.invoke('web_search', {
          query: searchQuery,
          num: 5,
        })
        
        if (Array.isArray(searchResults) && searchResults.length > 0) {
          searchContext = '\n\n[Rujukan Web yang ditemui]:\n' + 
            searchResults.slice(0, 3).map((r: { name: string; snippet: string; url: string }, i: number) => 
              `${i + 1}. ${r.name}: ${r.snippet}`
            ).join('\n')
        }
      } catch (searchError) {
        console.error('Web search failed:', searchError)
        // Continue without search context
      }
    }

    // Build messages array
    const enhancedMessage = message.replace('[Web Search Enabled]', '').trim()
    const messages = [
      { role: 'assistant' as const, content: systemPrompt + (searchContext ? '\n\nKamu mempunyai akses kepada carian web. Gunakan maklumat di bawah jika relevan:' + searchContext : '') },
      ...(Array.isArray(history) ? history.slice(-8) : []),
      { role: 'user' as const, content: enhancedMessage },
    ]

    // Use z-ai-web-dev-sdk
    const ZAI = (await import('z-ai-web-dev-sdk')).default
    const zai = await ZAI.create()

    const completion = await zai.chat.completions.create({
      messages,
      thinking: { type: 'disabled' },
    })

    const response = completion.choices[0]?.message?.content

    if (!response) {
      throw new Error('Tiada jawapan daripada AI')
    }

    // Image generation for Islamic art requests (OpenClaw-inspired)
    let imageUrl: string | null = null
    if (enableImageGen) {
      try {
        const imageResult = await zai.functions.invoke('image_generation', {
          prompt: `Islamic calligraphy art, Bismillah, gold on deep blue background, elegant Arabic script, decorative Islamic geometric patterns, high quality`,
          size: '1024x1024',
        })
        
        if (imageResult?.data?.url) {
          imageUrl = imageResult.data.url
        } else if (imageResult?.url) {
          imageUrl = imageResult.url
        }
      } catch (imgError) {
        console.error('Image generation failed:', imgError)
        // Continue without image
      }
    }

    return NextResponse.json({
      success: true,
      response,
      persona: persona || 'ustaz',
      imageUrl: imageUrl || undefined,
      searched: !!searchContext,
    })
  } catch (error) {
    console.error('Ustaz AI API Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Ralat berlaku',
        response: getFallbackResponse(),
      },
      { status: 500 }
    )
  }
}

function getFallbackResponse(): string {
  const fallbacks = [
    'Maaf, saya sedang mengalami masalah teknikal. Sila cuba lagi sebentar nanti. Sementara itu, anda boleh merujuk kepada Al-Quran dan Hadis untuk panduan.',
    'Saya tidak dapat memproses soalan anda sekarang. Cadangan saya, sila rujuk kepada ustaz di masjid anda untuk pandangan yang lebih tepat tentang perkara ini.',
    'Harap maaf, sistem sedang dalam penyelenggaraan. Untuk soalan agama, sila hubungi Jabatan Mufti atau rujuk laman web rasmi JAKIM.',
  ]
  return fallbacks[Math.floor(Math.random() * fallbacks.length)]
}
