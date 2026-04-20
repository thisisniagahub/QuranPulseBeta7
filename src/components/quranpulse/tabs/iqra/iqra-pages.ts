import { HARAKAT_COLORS } from './types'

// === IQRA Page Content Data Types ===
export interface IqraPageItem {
  display: string
  transliteration?: string
  audioText?: string
  harakatType?: 'fathah' | 'kasrah' | 'dhammah' | 'sukun' | 'shaddah' | 'tanwin-fath' | 'tanwin-kasr' | 'tanwin-dham'
  rule?: string
  color?: string
}

export interface IqraPageData {
  book: number
  page: number
  title: string
  titleMs: string
  type: 'letters' | 'harakat' | 'words' | 'verses' | 'rules' | 'practice' | 'review'
  instruction: string
  items: IqraPageItem[]
  ruleFocus?: string
}

// === 28 Hijaiyah Letters ===
const L = [
  'ا','ب','ت','ث','ج','ح','خ','د','ذ','ر','ز','س','ش','ص','ض','ط','ظ','ع','غ','ف','ق','ك','ل','م','ن','ه','و','ي'
]
const LN = [
  'alif','ba','ta','tsa','jim','ha','kho','dal','dzal','ra','zai','sin','syin','shod','dhod','tho','zho','ain','ghoin','fa','qof','kaf','lam','mim','nun','ha','wau','ya'
]

// Fathah helper: letter + َ
const f = (l: string, name: string): IqraPageItem => ({
  display: `${l}\u064E`, transliteration: `${name}a`, audioText: `${name}a`,
  harakatType: 'fathah', color: HARAKAT_COLORS.fathah,
})

// Kasrah helper: letter + ِ
const k = (l: string, name: string): IqraPageItem => ({
  display: `${l}\u0650`, transliteration: `${name}i`, audioText: `${name}i`,
  harakatType: 'kasrah', color: HARAKAT_COLORS.kasrah,
})

// Dhammah helper: letter + ُ
const d = (l: string, name: string): IqraPageItem => ({
  display: `${l}\u064F`, transliteration: `${name}u`, audioText: `${name}u`,
  harakatType: 'dhammah', color: HARAKAT_COLORS.dhammah,
})

// Sukun helper: letter + ْ
const sk = (l: string, name: string, rule?: string): IqraPageItem => ({
  display: `${l}\u0652`, transliteration: `${name}`, audioText: `${name}`,
  harakatType: 'sukun', color: HARAKAT_COLORS.sukun, rule,
})

// Shaddah helper: letter + ّ
const sh = (l: string, name: string): IqraPageItem => ({
  display: `${l}\u0651`, transliteration: `${name}${name}`, audioText: `${name}${name}`,
  harakatType: 'shaddah', color: HARAKAT_COLORS.shaddah,
})

// Tanwin Fathah: letter + ًا
const tf = (l: string, name: string): IqraPageItem => ({
  display: `${l}\u064B\u0627`, transliteration: `${name}an`, audioText: `${name}an`,
  harakatType: 'tanwin-fath', color: HARAKAT_COLORS.tanwinFath,
})

// Tanwin Kasrah: letter + ٍ
const tk = (l: string, name: string): IqraPageItem => ({
  display: `${l}\u064D`, transliteration: `${name}in`, audioText: `${name}in`,
  harakatType: 'tanwin-kasr', color: HARAKAT_COLORS.tanwinKasr,
})

// Tanwin Dhammah: letter + ٌ
const td = (l: string, name: string): IqraPageItem => ({
  display: `${l}\u064C`, transliteration: `${name}un`, audioText: `${name}un`,
  harakatType: 'tanwin-dham', color: HARAKAT_COLORS.tanwinDham,
})

// Generic item helper
const item = (display: string, trans: string, rule?: string, color?: string): IqraPageItem => ({
  display, transliteration: trans, audioText: trans, rule, color,
})

// ============================================
// BOOK 1: Huruf Hijaiyah & Fathah (29 pages)
// ============================================
const BOOK1: IqraPageData[] = [
  // Pages 1-5: Individual 28 Hijaiyah letters (~6 per page)
  { book:1, page:1, title:'Huruf Hijaiyah 1', titleMs:'Huruf Hijaiyah (1/5)', type:'letters',
    instruction:'Kenali huruf-huruf Al-Quran. Sebut setiap huruf dengan jelas.',
    items: L.slice(0,6).map((l,i) => ({ display:l, transliteration:LN[i], audioText:LN[i] })) },
  { book:1, page:2, title:'Huruf Hijaiyah 2', titleMs:'Huruf Hijaiyah (2/5)', type:'letters',
    instruction:'Teruskan mengenali huruf hijaiyah. Ulangi sebutan.',
    items: L.slice(6,12).map((l,i) => ({ display:l, transliteration:LN[i+6], audioText:LN[i+6] })) },
  { book:1, page:3, title:'Huruf Hijaiyah 3', titleMs:'Huruf Hijaiyah (3/5)', type:'letters',
    instruction:'Perhatikan bentuk setiap huruf. Ada yang mirip, bezakan dengan teliti.',
    items: L.slice(12,18).map((l,i) => ({ display:l, transliteration:LN[i+12], audioText:LN[i+12] })) },
  { book:1, page:4, title:'Huruf Hijaiyah 4', titleMs:'Huruf Hijaiyah (4/5)', type:'letters',
    instruction:'Huruf-huruf ini memerlukan perhatian khas pada sebutan tekak.',
    items: L.slice(18,24).map((l,i) => ({ display:l, transliteration:LN[i+18], audioText:LN[i+18] })) },
  { book:1, page:5, title:'Huruf Hijaiyah 5', titleMs:'Huruf Hijaiyah (5/5)', type:'letters',
    instruction:'Huruf terakhir. Hafalkan susunan huruf hijaiyah.',
    items: L.slice(24,28).map((l,i) => ({ display:l, transliteration:LN[i+24], audioText:LN[i+24] })) },

  // Pages 6-15: Letters with Fathah (~6 per page)
  { book:1, page:6, title:'Fathah 1', titleMs:'Harakat Fathah (1/10)', type:'harakat',
    instruction:'Fathah = baris atas. Bunyi "a". Baca huruf + fathah.',
    items: L.slice(0,6).map((l,i) => f(l, LN[i])), ruleFocus:'fathah' },
  { book:1, page:7, title:'Fathah 2', titleMs:'Harakat Fathah (2/10)', type:'harakat',
    instruction:'Ulangi fathah pada huruf seterusnya.',
    items: L.slice(6,12).map((l,i) => f(l, LN[i+6])), ruleFocus:'fathah' },
  { book:1, page:8, title:'Fathah 3', titleMs:'Harakat Fathah (3/10)', type:'harakat',
    instruction:'Fathah pada huruf tengah tekak.',
    items: L.slice(12,18).map((l,i) => f(l, LN[i+12])), ruleFocus:'fathah' },
  { book:1, page:9, title:'Fathah 4', titleMs:'Harakat Fathah (4/10)', type:'harakat',
    instruction:'Perhatikan bunyi fathah pada huruf tebal.',
    items: L.slice(18,24).map((l,i) => f(l, LN[i+18])), ruleFocus:'fathah' },
  { book:1, page:10, title:'Fathah 5', titleMs:'Harakat Fathah (5/10)', type:'harakat',
    instruction:'Fathah pada huruf terakhir.',
    items: L.slice(24,28).map((l,i) => f(l, LN[i+24])), ruleFocus:'fathah' },

  // Pages 11-15: Fathah mixed review
  { book:1, page:11, title:'Fathah Ulangan 1', titleMs:'Ulangan Fathah (1/5)', type:'practice',
    instruction:'Baca campuran huruf dengan fathah. Jangan tergesa-gesa.',
    items: [f('ب','b'), f('ت','t'), f('ث','ts'), f('ج','j'), f('ح','h'), f('خ','kh')] },
  { book:1, page:12, title:'Fathah Ulangan 2', titleMs:'Ulangan Fathah (2/5)', type:'practice',
    instruction:'Pastikan bunyi fathah "a" keluar dengan jelas.',
    items: [f('د','d'), f('ذ','dz'), f('ر','r'), f('ز','z'), f('س','s'), f('ش','sy')] },
  { book:1, page:13, title:'Fathah Ulangan 3', titleMs:'Ulangan Fathah (3/5)', type:'practice',
    instruction:'Perhatikan perbezaan huruf yang mirip.',
    items: [f('ص','sh'), f('ض','dh'), f('ط','th'), f('ظ','zh'), f('ع','a'), f('غ','gh')] },
  { book:1, page:14, title:'Fathah Ulangan 4', titleMs:'Ulangan Fathah (4/5)', type:'practice',
    instruction:'Baca dengan kadar perlahan dan jelas.',
    items: [f('ف','f'), f('ق','q'), f('ك','k'), f('ل','l'), f('م','m'), f('ن','n')] },
  { book:1, page:15, title:'Fathah Ulangan 5', titleMs:'Ulangan Fathah (5/5)', type:'practice',
    instruction:'Baca semua huruf dengan fathah tanpa berhenti.',
    items: [f('ه','h'), f('و','w'), f('ي','y'), f('ب','b'), f('س','s'), f('ل','l')] },

  // Pages 16-25: Simple syllable reading
  { book:1, page:16, title:'Suku Kata 1', titleMs:'Bacaan Suku Kata (1/10)', type:'words',
    instruction:'Gabungkan dua huruf dengan fathah. Baca berterusan.',
    items: [item('بَتَ','bata'), item('تَبَ','taba'), item('ثَجَ','tsaja'), item('جَحَ','jaha'), item('حَخَ','hakha'), item('خَدَ','khada')] },
  { book:1, page:17, title:'Suku Kata 2', titleMs:'Bacaan Suku Kata (2/10)', type:'words',
    instruction:'Gabungan huruf seterusnya.',
    items: [item('دَذَ','dadza'), item('رَزَ','raza'), item('سَشَ','sasya'), item('صَضَ','shadha'), item('طَظَ','thazha'), item('عَغَ','agha')] },
  { book:1, page:18, title:'Suku Kata 3', titleMs:'Bacaan Suku Kata (3/10)', type:'words',
    instruction:'Baca lancar tanpa memutuskan suku kata.',
    items: [item('فَقَ','faqa'), item('كَلَ','kala'), item('مَنَ','mana'), item('هَوَ','hawa'), item('يَبَ','yaba'), item('لَمَ','lama')] },
  { book:1, page:19, title:'Suku Kata 4', titleMs:'Bacaan Suku Kata (4/10)', type:'words',
    instruction:'Bacaan 3 huruf berturut-turut.',
    items: [item('بَتَثَ','batatsa'), item('جَحَخَ','jahakha'), item('دَذَرَ','dadzara'), item('سَشَصَ','sasyasha'), item('ضَطَظَ','dhathazha'), item('عَغَفَ','aghafa')] },
  { book:1, page:20, title:'Suku Kata 5', titleMs:'Bacaan Suku Kata (5/10)', type:'words',
    instruction:'Bacaan lebih panjang. Jaga kelancaran.',
    items: [item('قَكَلَ','qakala'), item('مَنَهَ','manaha'), item('وَيَبَ','wayaba'), item('تَجَدَ','tajada'), item('رَسَمَ','rasama'), item('عَلَمَ','alama')] },
  { book:1, page:21, title:'Suku Kata 6', titleMs:'Bacaan Suku Kata (6/10)', type:'words',
    instruction:'Bacaan perkataan ringkas.',
    items: [item('أَكَلَ','akala'), item('عَلِمَ','alima'), item('كَتَبَ','kataba'), item('ذَكَرَ','zakara'), item('نَزَلَ','nazala'), item('رَحِمَ','rahima')] },
  { book:1, page:22, title:'Suku Kata 7', titleMs:'Bacaan Suku Kata (7/10)', type:'words',
    instruction:'Bacaan perkataan dengan huruf tekak.',
    items: [item('حَمَدَ','hamada'), item('خَلَقَ','khalaqa'), item('غَفَرَ','ghafara'), item('عَظُمَ','azhuma'), item('حَسُنَ','hasuna'), item('صَبَرَ','sabara')] },
  { book:1, page:23, title:'Suku Kata 8', titleMs:'Bacaan Suku Kata (8/10)', type:'words',
    instruction:'Bacaan lebih pantas — jaga mutu bacaan.',
    items: [item('شَكَرَ','shakara'), item('ضَرَبَ','dharaba'), item('طَلَبَ','thalaba'), item('ظَنَّ','zhanma'), item('فَتَحَ','fataha'), item('قَرَأَ','qara-a')] },
  { book:1, page:24, title:'Suku Kata 9', titleMs:'Bacaan Suku Kata (9/10)', type:'words',
    instruction:'Bacaan perkataan Al-Quran ringkas.',
    items: [item('كِتَاب','kitaab'), item('رَبِّ','rabbi'), item('عَالَم','aalàm'), item('حَمْد','hamd'), item('نَاس','naas'), item('بَاب','baab')] },
  { book:1, page:25, title:'Suku Kata 10', titleMs:'Bacaan Suku Kata (10/10)', type:'words',
    instruction:'Ulangi semua bacaan suku kata.',
    items: [item('مَال','maal'), item('قَال','qaal'), item('سَال','saal'), item('جَاء','jaa-a'), item('شَاء','shaa-a'), item('بَلَد','balad')] },

  // Pages 26-29: Review mixed
  { book:1, page:26, title:'Ulangan Campuran 1', titleMs:'Ulangan Am 1', type:'review',
    instruction:'Ulangi semua huruf dan fathah yang dipelajari.',
    items: [item('ا','alif'), item('بَ','ba'), item('تَجَ','taja'), item('كَتَبَ','kataba'), item('حَمَدَ','hamada'), item('عَلِمَ','alima')] },
  { book:1, page:27, title:'Ulangan Campuran 2', titleMs:'Ulangan Am 2', type:'review',
    instruction:'Baca semua dengan lancar dan betul.',
    items: [item('خَلَقَ','khalaqa'), item('رَحِمَ','rahima'), item('شَكَرَ','shakara'), item('غَفَرَ','ghafara'), item('صَبَرَ','sabara'), item('فَتَحَ','fataha')] },
  { book:1, page:28, title:'Ulangan Campuran 3', titleMs:'Ulangan Am 3', type:'review',
    instruction:'Pastikan semua huruf dan fathah dikuasai.',
    items: [item('نَزَلَ','nazala'), item('ضَرَبَ','dharaba'), item('طَلَبَ','thalaba'), item('أَكَلَ','akala'), item('ذَكَرَ','zakara'), item('قَرَأَ','qara-a')] },
  { book:1, page:29, title:'Ujian Buku 1', titleMs:'Ujian Akhir Buku 1', type:'review',
    instruction:'Ujian keseluruhan Buku 1. Baca dengan teliti.',
    items: [item('ا ب ت ث ج ح','alif ba ta tsa jim ha'), item('بَ تَ ثَ جَ','ba ta tsa ja'), item('كَتَبَ عَلِمَ','kataba alima'), item('حَمَدَ رَحِمَ','hamada rahima'), item('خَلَقَ غَفَرَ','khalaqa ghafara'), item('صَبَرَ شَكَرَ','sabara shakara')] },
]

// ============================================
// BOOK 2: Connected Letters & Mad Asli (28 pages)
// ============================================
const BOOK2: IqraPageData[] = [
  // Pages 1-8: Connected letters with Fathah
  { book:2, page:1, title:'Sambung Fathah 1', titleMs:'Huruf Bersambung + Fathah (1)', type:'harakat',
    instruction:'Baca huruf yang bersambung. Perhatikan bentuk awal dan tengah.',
    items: [item('بـَ','ba'), item('تـَ','ta'), item('ثـَ','tsa'), item('جـَ','ja'), item('حـَ','ha')], ruleFocus:'fathah' },
  { book:2, page:2, title:'Sambung Fathah 2', titleMs:'Huruf Bersambung + Fathah (2)', type:'harakat',
    instruction:'Huruf bersambung seterusnya dengan fathah.',
    items: [item('خـَ','kha'), item('دَ','da'), item('ذَ','dza'), item('رَ','ra'), item('زَ','za')], ruleFocus:'fathah' },
  { book:2, page:3, title:'Sambung Fathah 3', titleMs:'Huruf Bersambung + Fathah (3)', type:'harakat',
    instruction:'Bentuk awal huruf dengan fathah.',
    items: [item('سـَ','sa'), item('شـَ','sya'), item('صـَ','sha'), item('ضـَ','dha'), item('طـَ','tha')], ruleFocus:'fathah' },
  { book:2, page:4, title:'Sambung Fathah 4', titleMs:'Huruf Bersambung + Fathah (4)', type:'harakat',
    instruction:'Huruf tekak bersambung dengan fathah.',
    items: [item('ظـَ','zha'), item('عـَ','aa'), item('غـَ','gha'), item('فـَ','fa'), item('قـَ','qa')], ruleFocus:'fathah' },
  { book:2, page:5, title:'Sambung Fathah 5', titleMs:'Huruf Bersambung + Fathah (5)', type:'harakat',
    instruction:'Huruf akhir bersambung dengan fathah.',
    items: [item('كـَ','ka'), item('لـَ','la'), item('مـَ','ma'), item('نـَ','na'), item('هـَ','ha')], ruleFocus:'fathah' },
  { book:2, page:6, title:'Sambung Fathah 6', titleMs:'Gabungan Sambung + Fathah', type:'words',
    instruction:'Gabungkan dua huruf bersambung dengan fathah.',
    items: [item('ـبـَتـَ','bata'), item('ـتـَجـَ','taja'), item('ـجـَحـَ','jaha'), item('ـسـَمـَ','sama'), item('ـلـَمـَ','lama')] },
  { book:2, page:7, title:'Sambung Fathah 7', titleMs:'Bacaan Perkataan Sambung', type:'words',
    instruction:'Baca perkataan yang hurufnya bersambung.',
    items: [item('كَتَبَ','kataba'), item('عَلِمَ','alima'), item('جَلَسَ','jalasa'), item('حَمَدَ','hamada'), item('رَكَعَ','raka-a')], ruleFocus:'fathah' },
  { book:2, page:8, title:'Sambung Fathah 8', titleMs:'Ulangan Sambung', type:'practice',
    instruction:'Ulangi bacaan sambung dengan fathah.',
    items: [item('سَجَدَ','sajada'), item('ذَكَرَ','zakara'), item('غَفَرَ','ghafara'), item('خَلَقَ','khalaqa'), item('فَتَحَ','fataha')], ruleFocus:'fathah' },

  // Pages 9-15: Mad Asli (بَا تَا ثَا...)
  { book:2, page:9, title:'Mad Asli 1', titleMs:'Mad Asli — Alif (1)', type:'rules',
    instruction:'Mad Asli: Fathah + Alif = bunyi panjang 2 harakat. Contoh: بَا = "baa"',
    items: [item('بَا','baa'), item('تَا','taa'), item('ثَا','tsaa'), item('جَا','jaa'), item('حَا','haa')], ruleFocus:'Mad Thabi\'i' },
  { book:2, page:10, title:'Mad Asli 2', titleMs:'Mad Asli — Alif (2)', type:'rules',
    instruction:'Mad Asli pada huruf seterusnya.',
    items: [item('خَا','khaa'), item('دَا','daa'), item('ذَا','dzaa'), item('رَا','raa'), item('زَا','zaa')], ruleFocus:'Mad Thabi\'i' },
  { book:2, page:11, title:'Mad Asli 3', titleMs:'Mad Asli — Alif (3)', type:'rules',
    instruction:'Baca Mad Asli dengan tepat — 2 harakat.',
    items: [item('سَا','saa'), item('شَا','syaa'), item('صَا','shaa'), item('ضَا','dhaa'), item('طَا','thaa')], ruleFocus:'Mad Thabi\'i' },
  { book:2, page:12, title:'Mad Asli 4', titleMs:'Mad Asli — Alif (4)', type:'rules',
    instruction:'Pastikan elongasi 2 harakat. Jangan terlalu panjang atau pendek.',
    items: [item('ظَا','zhaa'), item('عَا','aaa'), item('غَا','ghaa'), item('فَا','faa'), item('قَا','qaa')], ruleFocus:'Mad Thabi\'i' },
  { book:2, page:13, title:'Mad Asli 5', titleMs:'Mad Asli — Alif (5)', type:'rules',
    instruction:'Mad Asli huruf terakhir.',
    items: [item('كَا','kaa'), item('لَا','laa'), item('مَا','maa'), item('نَا','naa'), item('هَا','haa')], ruleFocus:'Mad Thabi\'i' },
  { book:2, page:14, title:'Mad Asli Perkataan', titleMs:'Mad Asli dalam Perkataan', type:'words',
    instruction:'Baca perkataan yang mengandungi Mad Asli.',
    items: [item('قَالَ','qaala'), item('كَالَ','kaala'), item('مَالَ','maala'), item('بَالَ','baala'), item('سَالَ','saala')], ruleFocus:'Mad Thabi\'i' },
  { book:2, page:15, title:'Mad Asli Ulangan', titleMs:'Ulangan Mad Asli', type:'practice',
    instruction:'Ulangi semua Mad Asli. Pastikan 2 harakat.',
    items: [item('ذَارَ','daara'), item('نَارَ','naara'), item('تَارَ','taara'), item('جَارَ','jaara'), item('خَابَ','khaaba')], ruleFocus:'Mad Thabi\'i' },

  // Pages 16-22: Similar letter differentiation
  { book:2, page:16, title:'Beza Huruf 1', titleMs:'Beza Huruf Mirip — ب ت ث', type:'practice',
    instruction:'Perbezaan huruf yang mirip: ب (1 titik bawah), ت (2 titik atas), ث (3 titik atas)',
    items: [item('بَ تَ ثَ','ba ta tsa'), item('ـبـَ ـتـَ ـثـَ','ba ta tsa'), item('أَبَ أَتَ أَثَ','aba ata atha'), item('بَاب تَاب ثَاب','baab taab thaab'), item('كَتَبَ كَثُبَ','kataba kathuba')] },
  { book:2, page:17, title:'Beza Huruf 2', titleMs:'Beza Huruf Mirip — ج ح خ', type:'practice',
    instruction:'Perbezaan: ج (titik tengah), ح (tanpa titik), خ (titik atas)',
    items: [item('جَ حَ خَ','ja ha kha'), item('جَدَّ حَدَّ خَدَّ','jadda hadda khadda'), item('جَاءَ حَاءَ خَاءَ','jaa-a haa-a khaa-a'), item('أَجَدَ أَحَدَ أَخَذَ','ajada ahada akhadza'), item('مَجَدَ مَحَدَ مَخَدَ','majada mahada makhada')] },
  { book:2, page:18, title:'Beza Huruf 3', titleMs:'Beza Huruf Mirip — د ذ', type:'practice',
    instruction:'Perbezaan: د (tanpa titik), ذ (titik atas)',
    items: [item('دَ ذَ','da dza'), item('دَار ذَار','daar dzaar'), item('دَكَّ ذَكَّ','dakka zakka'), item('أَدَ أَذَ','ada adza'), item('حَدِيد ذَرِيع','hadiid dzarii')], ruleFocus:'Izhar' },
  { book:2, page:19, title:'Beza Huruf 4', titleMs:'Beza Huruf Mirip — ر ز', type:'practice',
    instruction:'Perbezaan: ر (tanpa titik), ز (titik atas)',
    items: [item('رَ زَ','ra za'), item('رَاب زَاب','raab zaab'), item('رَزَقَ','razaqa'), item('أَرَزَ أَرَبَ','araza araba'), item('كَرِيم رَزِيق','kariim raziiq')] },
  { book:2, page:20, title:'Beza Huruf 5', titleMs:'Beza Huruf Mirip — س ش', type:'practice',
    instruction:'Perbezaan: س (tanpa titik), ش (3 titik atas)',
    items: [item('سَ شَ','sa sya'), item('سَارَ شَارَ','saara syaara'), item('سَبَعَ شَبَعَ','sabaa-a syabaa-a'), item('مَسَدَ مَشَدَ','masada mashada'), item('أَسَد أَشَد','asad asyad')] },
  { book:2, page:21, title:'Beza Huruf 6', titleMs:'Beza Huruf Mirip — ص ض', type:'practice',
    instruction:'Perbezaan: ص (tebal, tanpa titik), ض (tebal, titik atas)',
    items: [item('صَ ضَ','sha dha'), item('صَارَ ضَارَ','shaara dhaara'), item('صَدَقَ ضَرَبَ','sadaqa dharaba'), item('أَصَدَ أَضَدَ','ashada adhada'), item('فَصْل فَضْل','fashl fadhl')] },
  { book:2, page:22, title:'Beza Huruf 7', titleMs:'Beza Huruf Mirip — ط ظ ع غ', type:'practice',
    instruction:'Perbezaan huruf tebal dan tekak.',
    items: [item('طَ ظَ','tha zha'), item('عَ غَ','aa gha'), item('طَالَ ظَالَ','thaala zhaala'), item('عَالَ غَالَ','aaala ghaala'), item('طَعَام غَلَام','ta-aam ghulaam')] },

  // Pages 23-28: Practice reading words
  { book:2, page:23, title:'Bacaan Perkataan 1', titleMs:'Latihan Bacaan (1)', type:'words',
    instruction:'Baca perkataan dengan lancar menggunakan semua yang dipelajari.',
    items: [item('كِتَابٌ','kitaabun'), item('مَسْجِدٌ','masjidun'), item('عَالِمٌ','aalimun'), item('رَحِيمٌ','rahiimun'), item('حَكِيمٌ','hakiimun')] },
  { book:2, page:24, title:'Bacaan Perkataan 2', titleMs:'Latihan Bacaan (2)', type:'words',
    instruction:'Baca dengan kadar sederhana.',
    items: [item('كَبِيرٌ','kabiirun'), item('سَعِيدٌ','saiiidun'), item('شَدِيدٌ','syadiidun'), item('قَرِيبٌ','qariibun'), item('عَظِيمٌ','azhiimun')] },
  { book:2, page:25, title:'Bacaan Perkataan 3', titleMs:'Latihan Bacaan (3)', type:'words',
    instruction:'Perkataan Al-Quran.',
    items: [item('اللَّهُ','Allaahu'), item('الرَّحْمَنُ','ar-Rahmanu'), item('الرَّحِيمُ','ar-Rahiimu'), item('مَالِكُ','maaliku'), item('يَوْمِ','yawmi')] },
  { book:2, page:26, title:'Bacaan Perkataan 4', titleMs:'Latihan Bacaan (4)', type:'words',
    instruction:'Bacaan dari Al-Fatihah.',
    items: [item('الْحَمْدُ','al-hamdu'), item('رَبِّ','rabbi'), item('الْعَالَمِينَ','al-aalamiina'), item('الرَّحْمَنِ','ar-Rahmani'), item('الرَّحِيمِ','ar-Rahiimi')] },
  { book:2, page:27, title:'Bacaan Perkataan 5', titleMs:'Latihan Bacaan (5)', type:'words',
    instruction:'Bacaan dari Al-Ikhlas.',
    items: [item('قُلْ','qul'), item('هُوَ','huwa'), item('أَحَدٌ','ahadun'), item('اللَّهُ','Allaahu'), item('الصَّمَدُ','ash-Shamadu')] },
  { book:2, page:28, title:'Ujian Buku 2', titleMs:'Ujian Akhir Buku 2', type:'review',
    instruction:'Ujian keseluruhan Buku 2.',
    items: [item('بَا تَا ثَا','baa taa tsaa'), item('كَتَبَ جَلَسَ','kataba jalasa'), item('قَالَ مَالَ','qaala maala'), item('بَ ت ث','ba ta tsa'), item('صَ ضَ طَ ظَ','sha dha tha zha'), item('الْحَمْدُ لِلَّهِ','al-hamdu lillaahi')] },
]

// ============================================
// BOOK 3: Kasrah, Dhammah & Mad (28 pages)
// ============================================
const BOOK3: IqraPageData[] = [
  // Pages 1-8: Kasrah
  { book:3, page:1, title:'Kasrah 1', titleMs:'Harakat Kasrah (1)', type:'harakat',
    instruction:'Kasrah = baris bawah. Bunyi "i". Baca huruf + kasrah.',
    items: L.slice(0,5).map((l,i) => k(l, LN[i])), ruleFocus:'kasrah' },
  { book:3, page:2, title:'Kasrah 2', titleMs:'Harakat Kasrah (2)', type:'harakat',
    instruction:'Kasrah pada huruf seterusnya.',
    items: L.slice(5,10).map((l,i) => k(l, LN[i+5])), ruleFocus:'kasrah' },
  { book:3, page:3, title:'Kasrah 3', titleMs:'Harakat Kasrah (3)', type:'harakat',
    instruction:'Kasrah pada huruf tengah.',
    items: L.slice(10,15).map((l,i) => k(l, LN[i+10])), ruleFocus:'kasrah' },
  { book:3, page:4, title:'Kasrah 4', titleMs:'Harakat Kasrah (4)', type:'harakat',
    instruction:'Kasrah pada huruf tekak dan tebal.',
    items: L.slice(15,20).map((l,i) => k(l, LN[i+15])), ruleFocus:'kasrah' },
  { book:3, page:5, title:'Kasrah 5', titleMs:'Harakat Kasrah (5)', type:'harakat',
    instruction:'Kasrah pada huruf terakhir.',
    items: L.slice(20,25).map((l,i) => k(l, LN[i+20])), ruleFocus:'kasrah' },
  { book:3, page:6, title:'Kasrah 6', titleMs:'Kasrah — Gabungan', type:'words',
    instruction:'Gabungan dua huruf dengan kasrah.',
    items: [item('بِتِ','biti'), item('تِجِ','tiji'), item('سِمِ','simi'), item('كِلِ','kili'), item('مِنِ','mini')], ruleFocus:'kasrah' },
  { book:3, page:7, title:'Kasrah Perkataan', titleMs:'Kasrah dalam Perkataan', type:'words',
    instruction:'Perkataan dengan kasrah.',
    items: [item('كِتَاب','kitaab'), item('بِسْمِ','bismi'), item('مِنْ','min'), item('فِيهِ','fiihi'), item('عَلِيم','aliim')], ruleFocus:'kasrah' },
  { book:3, page:8, title:'Kasrah Ulangan', titleMs:'Ulangan Kasrah', type:'practice',
    instruction:'Ulangi semua kasrah.',
    items: [item('بِ تِ ثِ','bi ti tsi'), item('جِ حِ خِ','ji hi khi'), item('دِ ذِ رِ زِ','di dzi ri zi'), item('سِ شِ صِ','si syi shi'), item('كِ لِ مِ نِ','ki li mi ni')], ruleFocus:'kasrah' },

  // Pages 9-15: Dhammah
  { book:3, page:9, title:'Dhammah 1', titleMs:'Harakat Dhammah (1)', type:'harakat',
    instruction:'Dhammah = baris hadapan. Bunyi "u". Baca huruf + dhammah.',
    items: L.slice(0,5).map((l,i) => d(l, LN[i])), ruleFocus:'dhammah' },
  { book:3, page:10, title:'Dhammah 2', titleMs:'Harakat Dhammah (2)', type:'harakat',
    instruction:'Dhammah pada huruf seterusnya.',
    items: L.slice(5,10).map((l,i) => d(l, LN[i+5])), ruleFocus:'dhammah' },
  { book:3, page:11, title:'Dhammah 3', titleMs:'Harakat Dhammah (3)', type:'harakat',
    instruction:'Dhammah pada huruf tengah.',
    items: L.slice(10,15).map((l,i) => d(l, LN[i+10])), ruleFocus:'dhammah' },
  { book:3, page:12, title:'Dhammah 4', titleMs:'Harakat Dhammah (4)', type:'harakat',
    instruction:'Dhammah pada huruf tekak dan tebal.',
    items: L.slice(15,20).map((l,i) => d(l, LN[i+15])), ruleFocus:'dhammah' },
  { book:3, page:13, title:'Dhammah 5', titleMs:'Harakat Dhammah (5)', type:'harakat',
    instruction:'Dhammah pada huruf terakhir.',
    items: L.slice(20,25).map((l,i) => d(l, LN[i+20])), ruleFocus:'dhammah' },
  { book:3, page:14, title:'Dhammah Perkataan', titleMs:'Dhammah dalam Perkataan', type:'words',
    instruction:'Perkataan dengan dhammah.',
    items: [item('كُتُب','kutub'), item('يُؤْمِنُ','yu-minu'), item('يَعْلَمُ','ya-lamu'), item('رَبُّكُمْ','rabukum'), item('شُكْرٌ','shukrun')], ruleFocus:'dhammah' },
  { book:3, page:15, title:'Dhammah Ulangan', titleMs:'Ulangan Dhammah', type:'practice',
    instruction:'Ulangi semua dhammah.',
    items: [item('بُ تُ ثُ','bu tu tsu'), item('جُ حُ خُ','ju hu khu'), item('دُ ذُ رُ زُ','du dzu ru zu'), item('سُ شُ صُ','su syu shu'), item('كُ لُ مُ نُ','ku lu mu nu')], ruleFocus:'dhammah' },

  // Pages 16-22: Mad Ya + Mad Waw
  { book:3, page:16, title:'Mad Ya 1', titleMs:'Mad Ya — Kasrah + Ya (1)', type:'rules',
    instruction:'Mad Ya: Kasrah + Ya = bunyi panjang "ii" (2 harakat). Contoh: بِي = "bii"',
    items: [item('بِي','bii'), item('تِي','tii'), item('ثِي','tsii'), item('جِي','jii'), item('حِي','hii')], ruleFocus:'Mad Thabi\'i' },
  { book:3, page:17, title:'Mad Ya 2', titleMs:'Mad Ya — Kasrah + Ya (2)', type:'rules',
    instruction:'Mad Ya pada huruf seterusnya.',
    items: [item('خِي','khii'), item('دِي','dii'), item('ذِي','dzii'), item('رِي','rii'), item('سِي','sii')], ruleFocus:'Mad Thabi\'i' },
  { book:3, page:18, title:'Mad Ya 3', titleMs:'Mad Ya — Perkataan', type:'words',
    instruction:'Perkataan dengan Mad Ya.',
    items: [item('عَلِيم','aliim'), item('حَكِيم','hakiim'), item('رَحِيم','rahiim'), item('عَظِيم','azhiim'), item('كَرِيم','kariim')], ruleFocus:'Mad Thabi\'i' },
  { book:3, page:19, title:'Mad Waw 1', titleMs:'Mad Waw — Dhammah + Waw (1)', type:'rules',
    instruction:'Mad Waw: Dhammah + Waw = bunyi panjang "uu" (2 harakat). Contoh: بُو = "buu"',
    items: [item('بُو','buu'), item('تُو','tuu'), item('ثُو','tsuu'), item('جُو','juu'), item('حُو','huu')], ruleFocus:'Mad Thabi\'i' },
  { book:3, page:20, title:'Mad Waw 2', titleMs:'Mad Waw — Dhammah + Waw (2)', type:'rules',
    instruction:'Mad Waw pada huruf seterusnya.',
    items: [item('خُو','khuu'), item('دُو','duu'), item('رُو','ruu'), item('سُو','suu'), item('قُو','quu')], ruleFocus:'Mad Thabi\'i' },
  { book:3, page:21, title:'Mad Waw 3', titleMs:'Mad Waw — Perkataan', type:'words',
    instruction:'Perkataan dengan Mad Waw.',
    items: [item('يَقُول','yaquul'), item('الرُّوح','ar-ruuh'), item('صُوَر','suwar'), item('النُّور','an-nuur'), item('يَسُوق','yasuuq')], ruleFocus:'Mad Thabi\'i' },
  { book:3, page:22, title:'Mad Ya & Waw Ulangan', titleMs:'Ulangan Mad Ya & Waw', type:'practice',
    instruction:'Ulangi Mad Ya dan Mad Waw.',
    items: [item('بِي بُو','bii buu'), item('قِيل قُول','qiil quul'), item('عَلِيم يَقُول','aliim yaquul'), item('رَحِيم النُّور','rahiim an-nuur'), item('حَكِيم صُوَر','hakiim suwar')], ruleFocus:'Mad Thabi\'i' },

  // Pages 23-28: Combined practice
  { book:3, page:23, title:'Gabungan 1', titleMs:'Fathah + Kasrah + Dhammah', type:'practice',
    instruction:'Baca campuran ketiga-tiga harakat.',
    items: [item('بَ بِ بُ','ba bi bu'), item('تَ تِ تُ','ta ti tu'), item('جَ جِ جُ','ja ji ju'), item('سَ سِ سُ','sa si su'), item('كَ كِ كُ','ka ki ku')] },
  { book:3, page:24, title:'Gabungan 2', titleMs:'Harakat Campuran', type:'practice',
    instruction:'Baca dengan bertukar-tukar harakat.',
    items: [item('مَنِ مُنَ مِنُ','mina muna munu'), item('كَتَبِ كُتُبِ','katabi kutubi'), item('حَمِدُ رَحِمُ','hamidu rahimu'), item('عَلِمَ عَلَمُ','alima alamu'), item('فَتَحِ نَصَرُ','fatahi nasaru')] },
  { book:3, page:25, title:'Gabungan 3', titleMs:'Mad + Harakat Campuran', type:'practice',
    instruction:'Gabungan Mad dan harakat.',
    items: [item('قَالَ قِيلَ قُول','qaala qiila quul'), item('بَاب بِيب بُوب','baab biib buub'), item('كَار كِير كُور','kaar kiir kuur'), item('دَار دِير دُور','daar diir duur'), item('نَار نِير نُور','naar niir nuur')] },
  { book:3, page:26, title:'Gabungan 4', titleMs:'Bacaan Al-Quran', type:'verses',
    instruction:'Bacaan dari Al-Quran dengan ketiga-tiga harakat.',
    items: [item('بِسْمِ ٱللَّهِ','bismi Allaahi'), item('ٱلْحَمْدُ لِلَّهِ','al-hamdu lillaahi'), item('قُلْ هُوَ','qul huwa'), item('يَا أَيُّهَا','yaa ayyuhaa'), item('رَبِّ ٱلْعَالَمِينَ','rabbi al-aalamiina')] },
  { book:3, page:27, title:'Gabungan 5', titleMs:'Bacaan Al-Quran 2', type:'verses',
    instruction:'Bacaan Al-Quran lanjutan.',
    items: [item('ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ','ar-Rahmaani ar-Rahiimi'), item('مَـٰلِكِ يَوْمِ ٱلدِّينِ','maaliki yawmi ad-diini'), item('إِيَّاكَ نَعْبُدُ','iyyaaka na-budu'), item('وَإِيَّاكَ نَسْتَعِينُ','wa iyyaaka nasta-iinu'), item('ٱهْدِنَا ٱلصِّرَٰطَ','ihdinaa as-siraata')] },
  { book:3, page:28, title:'Ujian Buku 3', titleMs:'Ujian Akhir Buku 3', type:'review',
    instruction:'Ujian keseluruhan Buku 3.',
    items: [item('بِ تِ ثِ','bi ti tsi'), item('بُ تُ ثُ','bu tu tsu'), item('بِي بُو','bii buu'), item('عَلِيم رَحِيم','aliim rahiim'), item('يَقُول النُّور','yaquul an-nuur'), item('بِسْمِ ٱللَّهِ','bismi Allaahi')] },
]

// ============================================
// BOOK 4: Tanwin, Qalqalah & Izhar (28 pages)
// ============================================
const BOOK4: IqraPageData[] = [
  // Pages 1-6: Tanwin Fathah
  { book:4, page:1, title:'Tanwin Fathah 1', titleMs:'Tanwin Fathah (1)', type:'rules',
    instruction:'Tanwin Fathah: Dua baris atas + Alif. Bunyi "an". Contoh: بًا = "ban"',
    items: [tf('ب','b'), tf('ت','t'), tf('ث','ts'), tf('ج','j'), tf('ح','h')], ruleFocus:'Tanwin Fathah' },
  { book:4, page:2, title:'Tanwin Fathah 2', titleMs:'Tanwin Fathah (2)', type:'rules',
    instruction:'Tanwin Fathah pada huruf seterusnya.',
    items: [tf('خ','kh'), tf('د','d'), tf('ذ','dz'), tf('ر','r'), tf('ز','z')], ruleFocus:'Tanwin Fathah' },
  { book:4, page:3, title:'Tanwin Fathah 3', titleMs:'Tanwin Fathah (3)', type:'rules',
    instruction:'Tanwin Fathah pada huruf tengah.',
    items: [tf('س','s'), tf('ش','sy'), tf('ص','sh'), tf('ض','dh'), tf('ط','th')], ruleFocus:'Tanwin Fathah' },
  { book:4, page:4, title:'Tanwin Fathah 4', titleMs:'Tanwin Fathah (4)', type:'rules',
    instruction:'Tanwin Fathah pada huruf tekak dan terakhir.',
    items: [tf('ظ','zh'), tf('ع','a'), tf('غ','gh'), tf('ف','f'), tf('ق','q')], ruleFocus:'Tanwin Fathah' },
  { book:4, page:5, title:'Tanwin Fathah Perkataan', titleMs:'Tanwin Fathah dalam Perkataan', type:'words',
    instruction:'Perkataan dengan Tanwin Fathah.',
    items: [item('عَلِيمًا','aliiman'), item('حَكِيمًا','hakiiman'), item('رَحِيمًا','rahiiman'), item('عَظِيمًا','azhiiman'), item('كَرِيمًا','kariiman')], ruleFocus:'Tanwin Fathah' },
  { book:4, page:6, title:'Tanwin Fathah Ulangan', titleMs:'Ulangan Tanwin Fathah', type:'practice',
    instruction:'Ulangi Tanwin Fathah.',
    items: [item('كِتَابًا','kitaaban'), item('مَسْجِدًا','masjidan'), item('قَرِيبًا','qariiban'), item('سَعِيدًا','saiidan'), item('شَدِيدًا','syadiidan')], ruleFocus:'Tanwin Fathah' },

  // Pages 7-12: Tanwin Kasrah + Dhammah
  { book:4, page:7, title:'Tanwin Kasrah 1', titleMs:'Tanwin Kasrah (1)', type:'rules',
    instruction:'Tanwin Kasrah: Dua baris bawah. Bunyi "in". Contoh: بٍ = "bin"',
    items: [tk('ب','b'), tk('ت','t'), tk('ث','ts'), tk('ج','j'), tk('ح','h')], ruleFocus:'Tanwin Kasrah' },
  { book:4, page:8, title:'Tanwin Kasrah 2', titleMs:'Tanwin Kasrah (2)', type:'rules',
    instruction:'Tanwin Kasrah seterusnya.',
    items: [tk('خ','kh'), tk('د','d'), tk('ذ','dz'), tk('ر','r'), tk('ز','z')], ruleFocus:'Tanwin Kasrah' },
  { book:4, page:9, title:'Tanwin Kasrah Perkataan', titleMs:'Tanwin Kasrah dalam Perkataan', type:'words',
    instruction:'Perkataan dengan Tanwin Kasrah.',
    items: [item('كِتَابٍ','kitaabin'), item('عَالِمٍ','aalimin'), item('رَبٍّ','rabbin'), item('حَقٍّ','haqqin'), item('نُورٍ','nuurin')], ruleFocus:'Tanwin Kasrah' },
  { book:4, page:10, title:'Tanwin Dhammah 1', titleMs:'Tanwin Dhammah (1)', type:'rules',
    instruction:'Tanwin Dhammah: Dua baris hadapan. Bunyi "un". Contoh: بٌ = "bun"',
    items: [td('ب','b'), td('ت','t'), td('ث','ts'), td('ج','j'), td('ح','h')], ruleFocus:'Tanwin Dhammah' },
  { book:4, page:11, title:'Tanwin Dhammah 2', titleMs:'Tanwin Dhammah (2)', type:'rules',
    instruction:'Tanwin Dhammah seterusnya.',
    items: [td('خ','kh'), td('د','d'), td('ذ','dz'), td('ر','r'), td('ز','z')], ruleFocus:'Tanwin Dhammah' },
  { book:4, page:12, title:'Tanwin Dhammah Perkataan', titleMs:'Tanwin Dhammah dalam Perkataan', type:'words',
    instruction:'Perkataan dengan Tanwin Dhammah.',
    items: [item('كِتَابٌ','kitaabun'), item('عَالِمٌ','aalimun'), item('مُسْلِمٌ','muslimun'), item('رَحِيمٌ','rahiimun'), item('عَظِيمٌ','azhiimun')], ruleFocus:'Tanwin Dhammah' },

  // Pages 13-18: Qalqalah letters
  { book:4, page:13, title:'Qalqalah 1', titleMs:'Qalqalah — قطب جد (1)', type:'rules',
    instruction:'Qalqalah: Bunyi pantulan pada huruf ق ط ب ج د. Contoh: قْ = "q" berdenting',
    items: [sk('ق','q','Qalqalah'), sk('ط','t','Qalqalah'), sk('ب','b','Qalqalah'), sk('ج','j','Qalqalah'), sk('د','d','Qalqalah')], ruleFocus:'Qalqalah' },
  { book:4, page:14, title:'Qalqalah Kubra', titleMs:'Qalqalah Kubra (Waqaf)', type:'rules',
    instruction:'Qalqalah Kubra: Di akhir kalimah (waqaf) — bunyi lebih kuat.',
    items: [item('اَلْحَقُّ','al-haqq','Qalqalah','#ef4444'), item('فَوْقَ','fawqa','Qalqalah','#ef4444'), item('عَزِيزٌ حَكِيمٌ','aziizun hakiimun','Qalqalah','#ef4444'), item('مُحِيطٌ','muhiitun','Qalqalah','#ef4444'), item('وَتَبَّ','wa tabba','Qalqalah','#ef4444')], ruleFocus:'Qalqalah Kubra' },
  { book:4, page:15, title:'Qalqalah Shugra', titleMs:'Qalqalah Shugra (Wasal)', type:'rules',
    instruction:'Qalqalah Shugra: Di tengah kalimah (wasal) — bunyi lebih halus.',
    items: [item('وَلَقَدْ','wa laqad','Qalqalah','#f97316'), item('يَدْرَكُ','yadraku','Qalqalah','#f97316'), item('أَبْصَارَهُمْ','absaarahum','Qalqalah','#f97316'), item('لَقَدْ','laqad','Qalqalah','#f97316'), item('يَجْعَلُ','yaj-alu','Qalqalah','#f97316')], ruleFocus:'Qalqalah Shugra' },
  { book:4, page:16, title:'Qalqalah Ulangan', titleMs:'Ulangan Qalqalah', type:'practice',
    instruction:'Ulangi semua huruf Qalqalah.',
    items: [item('قُلْ','qul','Qalqalah','#ef4444'), item('طُلُوع','tuluu-a','Qalqalah','#ef4444'), item('بَعْدَ','ba-da','Qalqalah','#f97316'), item('جَمْعٍ','jam-in','Qalqalah','#f97316'), item('دَرَجَاتٍ','darajaatin','Qalqalah','#f97316')], ruleFocus:'Qalqalah' },
  { book:4, page:17, title:'Qalqalah Al-Quran', titleMs:'Qalqalah dalam Al-Quran', type:'verses',
    instruction:'Ayat Al-Quran dengan Qalqalah.',
    items: [item('قُلْ هُوَ ٱللَّهُ أَحَدٌ','Qul huwa Allaahu ahadun'), item('لَمْ يَلِدْ وَلَمْ يُولَدْ','lam yalid wa lam yuulad'), item('أَلَمْ نَشْرَحْ','alam nashrah'), item('وَوَضَعْنَا','wa wada-naa'), item('خَلَقْنَا','khalaqnaa')], ruleFocus:'Qalqalah' },
  { book:4, page:18, title:'Qalqalah Lanjutan', titleMs:'Latihan Qalqalah Lanjutan', type:'practice',
    instruction:'Bacaan pantas dengan Qalqalah.',
    items: [item('حَقٌّ وَقَطْ','haqqun wa qat'), item('بَدِيعٌ بَدْرٌ','badii-un badrun'), item('طِبْقٌ','tibqun'), item('جَذْوَةٌ','jadhwatun'), item('دَفْعٌ','daf-un')], ruleFocus:'Qalqalah' },

  // Pages 19-24: Izhar Halqi
  { book:4, page:19, title:'Izhar Halqi 1', titleMs:'Izhar Halqi — أ ه ع ح غ خ (1)', type:'rules',
    instruction:'Izhar Halqi: Nun mati/Tanwin + huruf halqi = sebut jelas. Huruf halqi: أ ه ع ح غ خ',
    items: [item('مِنْ أَجْلٍ','min ajlin','Izhar Halqi','#9ca3af'), item('مِنْ هَادٍ','min haadin','Izhar Halqi','#9ca3af'), item('مِنْ عِلْمٍ','min ilmin','Izhar Halqi','#9ca3af'), item('مِنْ حَكِيمٍ','min hakiimin','Izhar Halqi','#9ca3af'), item('مِنْ غَفُورٍ','min ghafuurin','Izhar Halqi','#9ca3af')], ruleFocus:'Izhar Halqi' },
  { book:4, page:20, title:'Izhar Halqi 2', titleMs:'Izhar Halqi — أمثلة (2)', type:'rules',
    instruction:'Contoh Izhar Halqi dalam Al-Quran.',
    items: [item('يَنْأَوْنَ','yan-awna','Izhar Halqi','#9ca3af'), item('مَنْ عَمِلَ','man amila','Izhar Halqi','#9ca3af'), item('أَنْعَمْتَ','an-amta','Izhar Halqi','#9ca3af'), item('مِنْ خَلْفِهِمْ','min khalfihim','Izhar Halqi','#9ca3af'), item('عَذَابٌ أَلِيمٌ','adzaabun aliimun','Izhar Halqi','#9ca3af')], ruleFocus:'Izhar Halqi' },
  { book:4, page:21, title:'Izhar Halqi 3', titleMs:'Izhar Halqi — Latihan', type:'practice',
    instruction:'Latihan Izhar Halqi.',
    items: [item('عَلِيمٌ حَكِيمٌ','aliimun hakiimun','Izhar Halqi','#9ca3af'), item('رَحِيمٌ غَفُورٌ','rahiimun ghafuurun','Izhar Halqi','#9ca3af'), item('سَمِيعٌ عَلِيمٌ','samii-un aliimun','Izhar Halqi','#9ca3af'), item('غَفُورٌ حَلِيمٌ','ghafuurun haliimun','Izhar Halqi','#9ca3af'), item('خَبِيرٌ خَبِيرٌ','khabiirun khabiirun','Izhar Halqi','#9ca3af')], ruleFocus:'Izhar Halqi' },
  { book:4, page:22, title:'Izhar Halqi 4', titleMs:'Izhar Halqi — Al-Quran', type:'verses',
    instruction:'Ayat Al-Quran dengan Izhar Halqi.',
    items: [item('الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ','al-hamdu lillaahi rabbil aalamiina'), item('الرَّحْمَـٰنِ الرَّحِيمِ','ar-Rahmaani ar-Rahiimi'), item('مَالِكِ يَوْمِ الدِّينِ','maaliki yawmid diini'), item('إِيَّاكَ نَعْبُدُ','iyyaaka na-budu'), item('اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ','ihdinas siraatal mustaqiima')], ruleFocus:'Izhar Halqi' },
  { book:4, page:23, title:'Izhar Halqi 5', titleMs:'Izhar Halqi — Ulangan', type:'practice',
    instruction:'Ulangi Izhar Halqi — pastikan sebutan jelas.',
    items: [item('مِنْ أَمْرٍ','min amrin'), item('مِنْ هُوَ','min huwa'), item('مِنْ عِندِ','min indi'), item('مِنْ حَقٍّ','min haqqin'), item('مِنْ غَيْرِ','min ghayri')], ruleFocus:'Izhar Halqi' },
  { book:4, page:24, title:'Izhar Halqi 6', titleMs:'Izhar Halqi — Campuran', type:'practice',
    instruction:'Campuran Izhar Halqi dan Qalqalah.',
    items: [item('مِنْ حَقٍّ وَصَدَقْ','min haqqin wa sadaq'), item('أَنْعَمْتَ عَلَيْهِمْ','an-amta alayhim'), item('لَقَدْ خَلَقْنَا','laqad khalaqnaa'), item('مِنْ عَذَابٍ أَلِيمٍ','min adzaabin aliimin'), item('عَلِيمٌ حَكِيمٌ قَوِيٌّ','aliimun hakiimun qawiyyun')], ruleFocus:'Izhar Halqi' },

  // Pages 25-28: Sukun + Tasydid
  { book:4, page:25, title:'Sukun 1', titleMs:'Sukun — Huruf Mati (1)', type:'rules',
    instruction:'Sukun: Huruf tanpa harakat = huruf mati. Tidak ada bunyi vokal.',
    items: [sk('ب','b'), sk('ت','t'), sk('ق','q','Qalqalah'), sk('ط','t','Qalqalah'), sk('د','d','Qalqalah')], ruleFocus:'Sukun' },
  { book:4, page:26, title:'Sukun 2', titleMs:'Sukun — Perkataan', type:'words',
    instruction:'Sukun dalam perkataan.',
    items: [item('قُلْ','qul'), item('أَلَمْ','alam'), item('يَدْرَكْ','yadrak'), item('مِنْ','min'), item('عَنْ','an')], ruleFocus:'Sukun' },
  { book:4, page:27, title:'Tasydid 1', titleMs:'Tasydid — Huruf Ganda (1)', type:'rules',
    instruction:'Tasydid/Shaddah: Huruf ganda — bunyi dua kali. Contoh: بّ = "bb"',
    items: [sh('ب','b'), sh('ت','t'), sh('ل','l'), sh('م','m'), sh('ن','n')], ruleFocus:'Tasydid' },
  { book:4, page:28, title:'Ujian Buku 4', titleMs:'Ujian Akhir Buku 4', type:'review',
    instruction:'Ujian keseluruhan Buku 4.',
    items: [item('بًا تًا ثًا','ban tan tsan'), item('بٍ تٍ ثٍ','bin tin tsin'), item('بٌ تٌ ثٌ','bun tun tsun'), item('قُلْ أَلَمْ','qul alam'), item('مِنْ عِلْمٍ','min ilmin'), item('إِنَّ اللَّهَ','inna Allaha')], ruleFocus:'Tanwin, Qalqalah, Izhar' },
]

// ============================================
// BOOK 5: Qamariyyah, Syamsiyyah & Idgham (28 pages)
// ============================================
const BOOK5: IqraPageData[] = [
  // Pages 1-5: Al-Qamariyyah
  { book:5, page:1, title:'Al-Qamariyyah 1', titleMs:'Al-Qamariyyah (1)', type:'rules',
    instruction:'Al-Qamariyyah: Alif Lam dibaca jelas "al". Huruf bulan: ا ب ج ح خ ع غ ف ق ك م ه و ي',
    items: [item('اَلْكِتَابُ','al-kitaabu','Al-Qamariyyah','#6a6ab6'), item('اَلْبَيْتُ','al-baytu','Al-Qamariyyah','#6a6ab6'), item('اَلْجَنَّةُ','al-jannatu','Al-Qamariyyah','#6a6ab6'), item('اَلْحَمْدُ','al-hamdu','Al-Qamariyyah','#6a6ab6')], ruleFocus:'Al-Qamariyyah' },
  { book:5, page:2, title:'Al-Qamariyyah 2', titleMs:'Al-Qamariyyah (2)', type:'rules',
    instruction:'Al-Qamariyyah pada huruf seterusnya.',
    items: [item('اَلْخَالِقُ','al-khaaliqu','Al-Qamariyyah','#6a6ab6'), item('اَلْعَلِيمُ','al-aliimu','Al-Qamariyyah','#6a6ab6'), item('اَلْغَفُورُ','al-ghafuuru','Al-Qamariyyah','#6a6ab6'), item('اَلْفَتَّاحُ','al-fattaahu','Al-Qamariyyah','#6a6ab6')], ruleFocus:'Al-Qamariyyah' },
  { book:5, page:3, title:'Al-Qamariyyah 3', titleMs:'Al-Qamariyyah (3)', type:'rules',
    instruction:'Latihan Al-Qamariyyah.',
    items: [item('اَلْقَدِيرُ','al-qadiiru','Al-Qamariyyah','#6a6ab6'), item('اَلْكَرِيمُ','al-kariimu','Al-Qamariyyah','#6a6ab6'), item('اَلْمَلِكُ','al-maliku','Al-Qamariyyah','#6a6ab6'), item('اَلْهَادِي','al-haadii','Al-Qamariyyah','#6a6ab6')], ruleFocus:'Al-Qamariyyah' },
  { book:5, page:4, title:'Al-Qamariyyah 4', titleMs:'Al-Qamariyyah (4)', type:'practice',
    instruction:'Al-Qamariyyah dalam ayat.',
    items: [item('اَلْوَاحِدُ','al-waahidu','Al-Qamariyyah','#6a6ab6'), item('اَلْيَوْمُ','al-yawmu','Al-Qamariyyah','#6a6ab6'), item('اَلْمُؤْمِنُ','al-mu-minu','Al-Qamariyyah','#6a6ab6'), item('اَلْقُرْآنُ','al-qur-aanu','Al-Qamariyyah','#6a6ab6')], ruleFocus:'Al-Qamariyyah' },
  { book:5, page:5, title:'Al-Qamariyyah 5', titleMs:'Ulangan Al-Qamariyyah', type:'practice',
    instruction:'Ulangi semua Al-Qamariyyah.',
    items: [item('اَلْإِسْلَامُ','al-islaamu','Al-Qamariyyah','#6a6ab6'), item('اَلْإِيمَانُ','al-iimaanu','Al-Qamariyyah','#6a6ab6'), item('اَلْأَمْرُ','al-amru','Al-Qamariyyah','#6a6ab6'), item('اَلْأَرْضُ','al-ardhu','Al-Qamariyyah','#6a6ab6')], ruleFocus:'Al-Qamariyyah' },

  // Pages 6-10: As-Syamsiyyah
  { book:5, page:6, title:'As-Syamsiyyah 1', titleMs:'As-Syamsiyyah (1)', type:'rules',
    instruction:'As-Syamsiyyah: Alif Lam dimasukkan/"diserap". Huruf matahari: ت ث د ذ ر ز س ش ص ض ط ظ ل ن',
    items: [item('الشَّمْسُ','asy-syamsu','As-Syamsiyyah','#d4af37'), item('التَّوَّابُ','at-tawwaabu','As-Syamsiyyah','#d4af37'), item('الثَّوَابُ','ats-tsawaabu','As-Syamsiyyah','#d4af37'), item('الدُّنْيَا','ad-dunyaa','As-Syamsiyyah','#d4af37')], ruleFocus:'As-Syamsiyyah' },
  { book:5, page:7, title:'As-Syamsiyyah 2', titleMs:'As-Syamsiyyah (2)', type:'rules',
    instruction:'As-Syamsiyyah seterusnya.',
    items: [item('الذَّاكِرُ','adz-dzaakiru','As-Syamsiyyah','#d4af37'), item('الرَّحْمَنُ','ar-Rahmanu','As-Syamsiyyah','#d4af37'), item('الزَّكِيُّ','az-zakiyyu','As-Syamsiyyah','#d4af37'), item('السَّلَامُ','as-salaamu','As-Syamsiyyah','#d4af37')], ruleFocus:'As-Syamsiyyah' },
  { book:5, page:8, title:'As-Syamsiyyah 3', titleMs:'As-Syamsiyyah (3)', type:'rules',
    instruction:'As-Syamsiyyah pada huruf tebal.',
    items: [item('الصَّادِقُ','ash-shaadiqu','As-Syamsiyyah','#d4af37'), item('الضَّارُّ','adh-dhaarru','As-Syamsiyyah','#d4af37'), item('الطُّورُ','at-thuuru','As-Syamsiyyah','#d4af37'), item('الظَّالِمُ','adh-dhaalimu','As-Syamsiyyah','#d4af37')], ruleFocus:'As-Syamsiyyah' },
  { book:5, page:9, title:'As-Syamsiyyah 4', titleMs:'As-Syamsiyyah (4)', type:'practice',
    instruction:'Latihan As-Syamsiyyah.',
    items: [item('اللَّيْلُ','al-laylu','As-Syamsiyyah','#d4af37'), item('النَّارُ','an-naaru','As-Syamsiyyah','#d4af37'), item('النُّورُ','an-nuuru','As-Syamsiyyah','#d4af37'), item('السَّمِيعُ','as-samiiu','As-Syamsiyyah','#d4af37')], ruleFocus:'As-Syamsiyyah' },
  { book:5, page:10, title:'Qamariyyah vs Syamsiyyah', titleMs:'Beza Qamariyyah & Syamsiyyah', type:'practice',
    instruction:'Beza bacaan Qamariyyah (jelas "al") vs Syamsiyyah (diserap).',
    items: [item('اَلْكِتَابُ — التَّوْبَةُ','al-kitaabu — at-tawbatu'), item('اَلْبَيْتُ — الثَّوَابُ','al-baytu — ats-tsawaabu'), item('اَلْحَمْدُ — الرَّحْمَنُ','al-hamdu — ar-Rahmanu'), item('اَلْقُرْآنُ — الصَّادِقُ','al-qur-aanu — ash-shaadiqu')], ruleFocus:'Qamariyyah vs Syamsiyyah' },

  // Pages 11-15: Tanda Wakaf
  { book:5, page:11, title:'Waqaf 1', titleMs:'Tanda Wakaf — م لا (1)', type:'rules',
    instruction:'Tanda Waqaf: م (wajib berhenti), لا (jangan berhenti)',
    items: [item('م — واقف لازم','Waqaf Lazim — wajib berhenti','Waqaf Lazim','#ef4444'), item('لا — لا وقف','Laa Waqaf — jangan berhenti','#ef4444'), item('ج — واقف جائز','Waqaf Jaiz — boleh berhenti/terus','Waqaf Jaiz','#d4af37'), item('ز — واقف جائز (terus)','Waqaf Jaiz — lebih baik terus','Waqaf Jaiz','#4a4aa6')], ruleFocus:'Waqaf' },
  { book:5, page:12, title:'Waqaf 2', titleMs:'Tanda Wakaf — Lanjutan', type:'rules',
    instruction:'Tanda Waqaf lanjutan.',
    items: [item('صلى — الصلب أولى','Lebih baik teruskan','Waqaf','#4a4aa6'), item('قلى — قيلا وقف','Dikatakan boleh berhenti','Waqaf','#d4af37'), item('⊃ — معانقة','Berhenti di salah satu','Waqaf','#6a6ab6'), item('طين — واقف طويل','Berhenti panjang','Waqaf','#6a6ab6')], ruleFocus:'Waqaf' },
  { book:5, page:13, title:'Waqaf 3', titleMs:'Latihan Wakaf', type:'practice',
    instruction:'Latihan berhenti di tanda waqaf.',
    items: [item('الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ۝','al-hamdu lillaahi rabbil aalamiina [waqaf]'), item('الرَّحْمَـٰنِ الرَّحِيمِ','ar-Rahmaani ar-Rahiimi [terus]'), item('مَالِكِ يَوْمِ الدِّينِ','maaliki yawmid-diini [waqaf]'), item('إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ','iyyaaka na-budu wa iyyaaka nasta-iinu [waqaf]')], ruleFocus:'Waqaf' },
  { book:5, page:14, title:'Waqaf 4', titleMs:'Wakaf dalam Al-Quran', type:'verses',
    instruction:'Ayat Al-Quran dengan tanda waqaf.',
    items: [item('قُلْ هُوَ اللَّهُ أَحَدٌ ۝','qul huwa Allaahu ahadun [waqaf]'), item('اللَّهُ الصَّمَدُ ۝','Allaahu as-Samadu [waqaf]'), item('لَمْ يَلِدْ وَلَمْ يُولَدْ ۝','lam yalid wa lam yuulad [waqaf]'), item('وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ ۝','wa lam yakun lahu kufuwan ahadun [waqaf]')], ruleFocus:'Waqaf' },
  { book:5, page:15, title:'Waqaf 5', titleMs:'Ulangan Wakaf', type:'practice',
    instruction:'Ulangi tanda-tanda wakaf.',
    items: [item('اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ','ihdinas siraatal mustaqiima [waqaf]'), item('صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ','siraatal-ladziina an-amta alayhim [waqaf]'), item('غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ','ghayril-maghdhuubi alayhim [waqaf]'), item('وَلَا الضَّالِّينَ','wa lad-daalliina [waqaf ameen]')], ruleFocus:'Waqaf' },

  // Pages 16-20: Mad Far'i + Lam Jalalah
  { book:5, page:16, title:'Mad Far\'i 1', titleMs:'Mad Wajib Muttashil (1)', type:'rules',
    instruction:'Mad Wajib Muttashil: Mad + Hamzah dalam 1 perkataan. Wajib 4-5 harakat.',
    items: [item('السَّمَاءِ','as-samaa-i','Mad Wajib','#ef4444'), item('جَاءَ','jaa-a','Mad Wajib','#ef4444'), item('الضُّحَى','adh-dhuhaa','Mad Wajib','#ef4444'), item('سُوءُ','suu-u','Mad Wajib','#ef4444')], ruleFocus:'Mad Wajib Muttashil' },
  { book:5, page:17, title:'Mad Far\'i 2', titleMs:'Mad Jaiz Munfashil (1)', type:'rules',
    instruction:'Mad Jaiz Munfashil: Mad + Hamzah dalam 2 perkataan. Harfiah 2-4 harakat.',
    items: [item('يَا أَيُّهَا','yaa ayyuhaa','Mad Jaiz','#f97316'), item('قُوا أَنْفُسَكُمْ','quu anfusakum','Mad Jaiz','#f97316'), item('فِيهَا أَبَدًا','fiihaa abadan','Mad Jaiz','#f97316'), item('قَالُوا أَلَمْ','qaaluu alam','Mad Jaiz','#f97316')], ruleFocus:'Mad Jaiz Munfashil' },
  { book:5, page:18, title:'Mad Far\'i 3', titleMs:'Mad \'Aridh Lil Sukun', type:'rules',
    instruction:'Mad Aridh Lil Sukun: Mad sebelum sukun di akhir (waqaf). 2-4 harakat.',
    items: [item('الْعَالَمِينَ','al-aalamiina','Mad Aridh','#d4af37'), item('الرَّحِيمِ','ar-Rahiimi','Mad Aridh','#d4af37'), item('يَعْلَمُونَ','ya-lamuuna','Mad Aridh','#d4af37'), item('الْمُتَّقِينَ','al-muttaqiina','Mad Aridh','#d4af37')], ruleFocus:'Mad Aridh Lil Sukun' },
  { book:5, page:19, title:'Lam Jalalah 1', titleMs:'Lam Jalalah — الله (1)', type:'rules',
    instruction:'Lam Jalalah: Lam dalam "الله" — dibaca tebal jika fathah/dhammah, nipis jika kasrah.',
    items: [item('اللَّهُ','Allaahu','Lam Jalalah','#8b5cf6'), item('لِلَّهِ','lillaahi','Lam Jalalah','#8b5cf6'), item('اللَّهَ','Allaaha','Lam Jalalah','#8b5cf6'), item('بِاللَّهِ','billaahi','Lam Jalalah','#8b5cf6')], ruleFocus:'Lam Jalalah' },
  { book:5, page:20, title:'Lam Jalalah 2', titleMs:'Lam Jalalah — Latihan', type:'practice',
    instruction:'Latihan Lam Jalalah.',
    items: [item('تَوَكَّلْتُ عَلَى اللَّهِ','tawakkaltu alaa Allaahi','Lam Jalalah','#8b5cf6'), item('لَا إِلَٰهَ إِلَّا اللَّهُ','laa ilaaha illa Allaahu','Lam Jalalah','#8b5cf6'), item('سُبْحَانَ اللَّهِ','subhaana Allaahi','Lam Jalalah','#8b5cf6'), item('بِسْمِ اللَّهِ','bismi Allaahi','Lam Jalalah','#8b5cf6')], ruleFocus:'Lam Jalalah' },

  // Pages 21-28: Idgham practice
  { book:5, page:21, title:'Idgham Bighunnah 1', titleMs:'Idgham Bighunnah — ينمو (1)', type:'rules',
    instruction:'Idgham Bighunnah: Nun mati + ي ن م و = masuk dengan dengung. Mnemonik: ينمو',
    items: [item('مِنْ يَدٍ','miy-yadin','Idgham Bighunnah','#22c55e'), item('مِنْ نِّعْمَةٍ','min-ni-matin','Idgham Bighunnah','#22c55e'), item('مِن مَّالٍ','mim-maalin','Idgham Bighunnah','#22c55e'), item('مِن وَلِيٍّ','miw-waliyyin','Idgham Bighunnah','#22c55e')], ruleFocus:'Idgham Bighunnah' },
  { book:5, page:22, title:'Idgham Bighunnah 2', titleMs:'Idgham Bighunnah — Latihan', type:'practice',
    instruction:'Latihan Idgham Bighunnah.',
    items: [item('مَنْ يَعْمَل','may-ya-mal','Idgham Bighunnah','#22c55e'), item('وَمَنْ نَّقَلَ','wa man-naqala','Idgham Bighunnah','#22c55e'), item('مِن مَّسَدٍ','mim-masad','Idgham Bighunnah','#22c55e'), item('مِن وَرَائِهِمْ','miw-waraa-ihim','Idgham Bighunnah','#22c55e')], ruleFocus:'Idgham Bighunnah' },
  { book:5, page:23, title:'Idgham Bilaghunnah', titleMs:'Idgham Bilaghunnah — ل ر', type:'rules',
    instruction:'Idgham Bilaghunnah: Nun mati + ل ر = masuk tanpa dengung.',
    items: [item('مِن لَّدُنْهُ','mil-ladunhu','Idgham Bilaghunnah','#4a4aa6'), item('مِن رَّبٍّ','mir-rabbin','Idgham Bilaghunnah','#4a4aa6'), item('مَنْ رَاقٍ','mar-raaqin','Idgham Bilaghunnah','#4a4aa6'), item('مِن لَّدُنْ','mil-ladun','Idgham Bilaghunnah','#4a4aa6')], ruleFocus:'Idgham Bilaghunnah' },
  { book:5, page:24, title:'Idgham Campuran', titleMs:'Idgham Campuran', type:'practice',
    instruction:'Campuran Idgham Bighunnah dan Bilaghunnah.',
    items: [item('مِنْ يَوْمٍ','miy-yawmin','Idgham Bighunnah','#22c55e'), item('مِنْ رَحْمَةٍ','mir-rahmatin','Idgham Bilaghunnah','#4a4aa6'), item('مِنْ مَلَائِكَةٍ','mim-mala-ikatin','Idgham Bighunnah','#22c55e'), item('مِنْ لَدُنَّا','mil-ladunnaa','Idgham Bilaghunnah','#4a4aa6')], ruleFocus:'Idgham' },
  { book:5, page:25, title:'Idgham Mimi', titleMs:'Idgham Mimi — Mim + Mim', type:'rules',
    instruction:'Idgham Mimi: Mim mati + Mim = masuk (1 mim panjang).',
    items: [item('وَمَا لَهُم مِّنْ','wa maa lahum min','Idgham Mimi','#22c55e'), item('أَمْ مَنْ','am man','Idgham Mimi','#22c55e'), item('لَهُم مَّغْفِرَةٌ','lahum maghfiratun','Idgham Mimi','#22c55e'), item('رَبُّكُم مَّعَكُمْ','rabukum ma-akum','Idgham Mimi','#22c55e')], ruleFocus:'Idgham Mimi' },
  { book:5, page:26, title:'Ikhfa Syafawi', titleMs:'Ikhfa Syafawi — Mim + Ba', type:'rules',
    instruction:'Ikhfa Syafawi: Mim mati + Ba = sembunyikan dengung mim.',
    items: [item('وَمَا بِهِمْ','wa maa bihim','Ikhfa Syafawi','#22c55e'), item('هُمْ بِهِ','hum bihi','Ikhfa Syafawi','#22c55e'), item('رَبُّهُم بِأَعْيُنِهِمْ','rabuhum bi-a-yunihim','Ikhfa Syafawi','#22c55e'), item('تَرْمِيهِم بِحِجَارَةٍ','tarmihim bi-hijaaratin','Ikhfa Syafawi','#22c55e')], ruleFocus:'Ikhfa Syafawi' },
  { book:5, page:27, title:'Izhar Syafawi', titleMs:'Izhar Syafawi — Mim + bukan Ba/Mim', type:'rules',
    instruction:'Izhar Syafawi: Mim mati + huruf selain Ba dan Mim = sebutan jelas.',
    items: [item('هُمْ فِيهَا','hum fiihaa','Izhar Syafawi','#9ca3af'), item('عَلَيْهِمْ وَلَا','alayhim wa laa','Izhar Syafawi','#9ca3af'), item('أَنْعَمْتَ','an-amta','Izhar Syafawi','#9ca3af'), item('لَهُمْ عَذَابٌ','lahum adzaabun','Izhar Syafawi','#9ca3af')], ruleFocus:'Izhar Syafawi' },
  { book:5, page:28, title:'Ujian Buku 5', titleMs:'Ujian Akhir Buku 5', type:'review',
    instruction:'Ujian keseluruhan Buku 5.',
    items: [item('اَلْكِتَابُ — الشَّمْسُ','al-kitaabu — asy-syamsu'), item('مِنْ يَدٍ — مِن رَّبٍّ','miy-yadin — mir-rabbin'), item('السَّمَاءِ — يَا أَيُّهَا','as-samaa-i — yaa ayyuhaa'), item('اللَّهُ — لِلَّهِ','Allaahu — lillaahi'), item('هُمْ بِهِ — هُمْ فِيهَا','hum bihi — hum fiihaa'), item('قُلْ هُوَ اللَّهُ أَحَدٌ','qul huwa Allaahu ahadun')], ruleFocus:'Qamariyyah, Syamsiyyah, Idgham' },
]

// ============================================
// BOOK 6: Tajwid Lengkap & Bacaan Quran (28 pages)
// ============================================
const BOOK6: IqraPageData[] = [
  // Pages 1-5: Ikhfa' Haqiqi
  { book:6, page:1, title:'Ikhfa\' 1', titleMs:'Ikhfa\' Haqiqi — 15 Huruf (1)', type:'rules',
    instruction:'Ikhfa\': Nun mati/Tanwin + 15 huruf = sembunyikan bunyi nun. Huruf: ص ذ ث ك ج ش ق س د ط ز ف ت ض ظ',
    items: [item('مِن تَحْتِهَا','min-tahtihaa','Ikhfa\'','#22c55e'), item('مِن جِهَنَّمَ','min-jahannama','Ikhfa\'','#22c55e'), item('مِن صَلْصَالٍ','min-salsaal','Ikhfa\'','#22c55e'), item('مِن ذَهَبٍ','min-zahabin','Ikhfa\'','#22c55e')], ruleFocus:'Ikhfa\'' },
  { book:6, page:2, title:'Ikhfa\' 2', titleMs:'Ikhfa\' Haqiqi — Latihan (2)', type:'rules',
    instruction:'Latihan Ikhfa\' dengan huruf seterusnya.',
    items: [item('مِن كِتَابٍ','min-kitaabin','Ikhfa\'','#22c55e'), item('مِن شَرٍّ','min-sharrin','Ikhfa\'','#22c55e'), item('مِن قَبْلُ','min-qablu','Ikhfa\'','#22c55e'), item('مِن سُوءٍ','min-suu-in','Ikhfa\'','#22c55e')], ruleFocus:'Ikhfa\'' },
  { book:6, page:3, title:'Ikhfa\' 3', titleMs:'Ikhfa\' Haqiqi — Al-Quran', type:'verses',
    instruction:'Ikhfa\' dalam ayat Al-Quran.',
    items: [item('مِن شَرِّ الْوَسْوَاسِ','min-sharriil-waswaasi'), item('الْخَنَّاسِ','al-khannaasi'), item('مِن طَرَفٍ خَفِيٍّ','min-tarafin khafiyyin'), item('مِن ضُرٍّ','min-dhurrin')], ruleFocus:'Ikhfa\'' },
  { book:6, page:4, title:'Ikhfa\' 4', titleMs:'Ikhfa\' Haqiqi — Campuran', type:'practice',
    instruction:'Campuran Ikhfa\' dengan hukum lain.',
    items: [item('مِن تَحْتِهَا الْأَنْهَارُ','min-tahtihaal-anhaaru'), item('مِن فَضْلِهِ','min-fadhlihi'), item('مِن طِينٍ','min-tiinin'), item('مِن ظُلُمَاتٍ','min-zulumaatin')], ruleFocus:'Ikhfa\'' },
  { book:6, page:5, title:'Ikhfa\' 5', titleMs:'Ulangan Ikhfa\'', type:'practice',
    instruction:'Ulangi semua Ikhfa\'.',
    items: [item('أَنْتُمْ','antum'), item('عَنْ تَوَلَّى','an-tawallaa'), item('مِن ذَكَرٍ','min-zakarin'), item('مِن ضَعْفٍ','min-dha-f-in')], ruleFocus:'Ikhfa\'' },

  // Pages 6-10: Iqlab
  { book:6, page:6, title:'Iqlab 1', titleMs:'Iqlab — Nun + Ba (1)', type:'rules',
    instruction:'Iqlab: Nun mati/Tanwin + Ba = tukar bunyi nun jadi mim.',
    items: [item('مِن بَعْدِ','mim-ba-di','Iqlab','#8b5cf6'), item('أَنۢبِئْهُمْ','ambihim','Iqlab','#8b5cf6'), item('مِن بَيْنِ','mim-bayni','Iqlab','#8b5cf6'), item('يُنۢبِتُ','yunbitu','Iqlab','#8b5cf6')], ruleFocus:'Iqlab' },
  { book:6, page:7, title:'Iqlab 2', titleMs:'Iqlab — Latihan', type:'practice',
    instruction:'Latihan Iqlab.',
    items: [item('مِن بَاطِلٍ','mim-baatin'), item('سُنۢبُلَةٍ','sunbulatin'), item('أَنۢبَأَهُمْ','amba-ahum'), item('مِن بَابٍ','mim-baabin')], ruleFocus:'Iqlab' },
  { book:6, page:8, title:'Iqlab 3', titleMs:'Iqlab dalam Al-Quran', type:'verses',
    instruction:'Iqlab dalam ayat Al-Quran.',
    items: [item('يُنۢبِتُ لَكُمْ','yunbitu lakum'), item('مِن بَعْدِ مَا','mim-ba-di maa'), item('فَمَنۢ بَغَى','fa mam-baghaa'), item('وَمَنۢ بَخِلَ','wa mam-bakhila')], ruleFocus:'Iqlab' },
  { book:6, page:9, title:'Iqlab 4', titleMs:'Iqlab — Ulangan', type:'practice',
    instruction:'Ulangi Iqlab — pastikan bunyi mim tersembunyi.',
    items: [item('ذَنۢبٍ','dhanbin'), item('لَيُنۢبَذَنَّ','layunbadzanna'), item('مِنۢ بَصِيرَةٍ','mim-bashiiratin'), item('أَنۢبِئُونِ','ambi-uuni')], ruleFocus:'Iqlab' },
  { book:6, page:10, title:'Iqlab 5', titleMs:'Iqlab — Campuran', type:'practice',
    instruction:'Campuran Iqlab dengan Ikhfa\'.',
    items: [item('مِن بَعْدِ — مِن تَحْتِ','mim-ba-di — min-tahti'), item('أَنۢبِئْهُمْ — مِن جِهَنَّمَ','ambihum — min-jahannama'), item('مِن بَيْنِ — مِن صَلْصَالٍ','mim-bayni — min-salsaal'), item('فَمَنۢ بَغَى — مِن ذَهَبٍ','fa mam-baghaa — min-zahabin')], ruleFocus:'Iqlab, Ikhfa\'' },

  // Pages 11-15: Complete Tajwid review
  { book:6, page:11, title:'Tajwid Ulangan 1', titleMs:'Ulangan Tajwid — Nun Sakinah', type:'review',
    instruction:'Ulangi semua hukum Nun Sakinah/Tanwin.',
    items: [item('مِنْ أَجْلٍ — إِظْهَار','min ajlin — Izhar'), item('مِن يَدٍ — إِدْغَام','miy-yadin — Idgham'), item('مِن تَحْتِ — إِخْفَاء','min-tahti — Ikhfa\''), item('مِن بَعْدِ — إِقْلَاب','mim-ba-di — Iqlab')], ruleFocus:'Nun Sakinah' },
  { book:6, page:12, title:'Tajwid Ulangan 2', titleMs:'Ulangan Tajwid — Mim Sakinah', type:'review',
    instruction:'Ulangi semua hukum Mim Sakinah.',
    items: [item('هُمْ فِيهَا — إِظْهَار شَفَوِي','hum fiihaa — Izhar Syafawi'), item('لَهُم مَّغْفِرَةٌ — إِدْغَام مِيمِي','lahum maghfiratun — Idgham Mimi'), item('هُمْ بِهِ — إِخْفَاء شَفَوِي','hum bihi — Ikhfa Syafawi'), item('أَمْ مَنْ — إِدْغَام مِيمِي','am man — Idgham Mimi')], ruleFocus:'Mim Sakinah' },
  { book:6, page:13, title:'Tajwid Ulangan 3', titleMs:'Ulangan Tajwid — Mad', type:'review',
    instruction:'Ulangi semua hukum Mad.',
    items: [item('قَالَ — مَد طَبِيعِي','qaala — Mad Thabi\'i'), item('السَّمَاءِ — مَد وَاجِب','as-samaa-i — Mad Wajib'), item('يَا أَيُّهَا — مَد جَائِز','yaa ayyuhaa — Mad Jaiz'), item('الْعَالَمِينَ — مَد عَارِض','al-aalamiina — Mad Aridh')], ruleFocus:'Mad' },
  { book:6, page:14, title:'Tajwid Ulangan 4', titleMs:'Ulangan Tajwid — Qalqalah', type:'review',
    instruction:'Ulangi Qalqalah — قطب جد',
    items: [item('قُلْ — قَلْقَلَة كُبْرَى','qul — Qalqalah Kubra'), item('وَلَقَدْ — قَلْقَلَة صُغْرَى','wa laqad — Qalqalah Shugra'), item('أَحَدٌ — قَلْقَلَة كُبْرَى','ahadun — Qalqalah Kubra'), item('يَدْرَكُ — قَلْقَلَة صُغْرَى','yadraku — Qalqalah Shugra')], ruleFocus:'Qalqalah' },
  { book:6, page:15, title:'Tajwid Ulangan 5', titleMs:'Ulangan Tajwid — Campuran', type:'review',
    instruction:'Campuran semua hukum tajwid.',
    items: [item('بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ','bismi Allaahi ar-Rahmaani ar-Rahiimi'), item('الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ','al-hamdu lillaahi rabbil aalamiina'), item('قُلْ هُوَ اللَّهُ أَحَدٌ','qul huwa Allaahu ahadun'), item('مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ','min-sharriil-waswaasil-khannaasi')], ruleFocus:'Tajwid Lengkap' },

  // Pages 16-22: Quran verses practice
  { book:6, page:16, title:'Al-Fatihah', titleMs:'Surah Al-Fatihah', type:'verses',
    instruction:'Baca Al-Fatihah dengan tajwid lengkap.',
    items: [item('بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ','bismi Allaahi ar-Rahmaani ar-Rahiimi'), item('الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ','al-hamdu lillaahi rabbil aalamiina')] },
  { book:6, page:17, title:'Al-Fatihah 2', titleMs:'Surah Al-Fatihah (2)', type:'verses',
    instruction:'Al-Fatihah ayat 3-5.',
    items: [item('الرَّحْمَنِ الرَّحِيمِ','ar-Rahmaani ar-Rahiimi'), item('مَالِكِ يَوْمِ الدِّينِ','maaliki yawmid-diini')] },
  { book:6, page:18, title:'Al-Fatihah 3', titleMs:'Surah Al-Fatihah (3)', type:'verses',
    instruction:'Al-Fatihah ayat 5-7.',
    items: [item('إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ','iyyaaka na-budu wa iyyaaka nasta-iinu'), item('اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ','ihdinas siraatal mustaqiima')] },
  { book:6, page:19, title:'Al-Ikhlas', titleMs:'Surah Al-Ikhlas', type:'verses',
    instruction:'Baca Al-Ikhlas dengan tajwid lengkap.',
    items: [item('قُلْ هُوَ اللَّهُ أَحَدٌ','qul huwa Allaahu ahadun'), item('اللَّهُ الصَّمَدُ','Allaahu as-Samadu')] },
  { book:6, page:20, title:'Al-Falaq', titleMs:'Surah Al-Falaq', type:'verses',
    instruction:'Baca Al-Falaq dengan tajwid lengkap.',
    items: [item('قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ','qul a-uudhu bi-rabbil-falaqi'), item('مِن شَرِّ مَا خَلَقَ','min-sharri maa khalaqa')] },
  { book:6, page:21, title:'An-Nas', titleMs:'Surah An-Nas', type:'verses',
    instruction:'Baca An-Nas dengan tajwid lengkap.',
    items: [item('قُلْ أَعُوذُ بِرَبِّ النَّاسِ','qul a-uudhu bi-rabbin-naasi'), item('مَلِكِ النَّاسِ','malikin-naasi')] },
  { book:6, page:22, title:'Al-Asr', titleMs:'Surah Al-Asr', type:'verses',
    instruction:'Baca Al-Asr dengan tajwid lengkap.',
    items: [item('وَالْعَصْرِ','wal-asri'), item('إِنَّ الْإِنسَانَ لَفِي خُسْرٍ','innal-insaana lafii khusrin')] },

  // Pages 23-28: Juz Amma transition
  { book:6, page:23, title:'Juz Amma 1', titleMs:'Juz Amma — An-Nasr', type:'verses',
    instruction:'Pengenalan Juz 30 — Surah An-Nasr.',
    items: [item('إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ','idzaa jaa-a nasrullaahi wal-fathu'), item('وَرَأَيْتَ النَّاسَ يَدْخُلُونَ','wa ra-aytan-naasa yadkhuluuna')] },
  { book:6, page:24, title:'Juz Amma 2', titleMs:'Juz Amma — Al-Kafirun', type:'verses',
    instruction:'Surah Al-Kafirun.',
    items: [item('قُلْ يَا أَيُّهَا الْكَافِرُونَ','qul yaa ayyuhaal-kaafiruuna'), item('لَا أَعْبُدُ مَا تَعْبُدُونَ','laa a-budu maa ta-buduun')] },
  { book:6, page:25, title:'Juz Amma 3', titleMs:'Juz Amma — Al-Kawthar', type:'verses',
    instruction:'Surah Al-Kawthar.',
    items: [item('إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ','innaa a-taynaakal-kawthar'), item('فَصَلِّ لِرَبِّكَ وَانْحَرْ','fa salli li-rabbika wan-har')] },
  { book:6, page:26, title:'Juz Amma 4', titleMs:'Juz Amma — Al-Maun', type:'verses',
    instruction:'Surah Al-Maun.',
    items: [item('أَرَأَيْتَ الَّذِي يُكَذِّبُ بِالدِّينِ','ara-aytal-ladzi yukadzdzibu bid-diini'), item('فَذَلِكَ الَّذِي يَدُعُّ الْيَتِيمَ','fa dzaalikal-ladzi yadu- ul-yatiim')] },
  { book:6, page:27, title:'Juz Amma 5', titleMs:'Juz Amma — Quraisy', type:'verses',
    instruction:'Surah Quraisy.',
    items: [item('لِإِيلَافِ قُرَيْشٍ','li-iilaafi qurayshin'), item('إِيلَافِهِمْ رِحْلَةَ الشِّتَاءِ وَالصَّيْفِ','iilaafihim rihlatash-shitaa-i was-sayf')] },
  { book:6, page:28, title:'Ujian Buku 6', titleMs:'Ujian Akhir Buku 6 — Siap!', type:'review',
    instruction:'Ujian akhir — anda hampir siap menguasai Iqra! Baca dengan tajwid lengkap.',
    items: [item('مِن تَحْتِهَا — إِخْفَاء','min-tahtihaa — Ikhfa\''), item('مِن بَعْدِ — إِقْلَاب','mim-ba-di — Iqlab'), item('اللَّهُ — لَام جَلَالَة','Allaahu — Lam Jalalah'), item('قُلْ — قَلْقَلَة','qul — Qalqalah'), item('السَّمَاءِ — مَد وَاجِب','as-samaa-i — Mad Wajib'), item('بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ','bismi Allaahi ar-Rahmaani ar-Rahiimi — Tajwid Lengkap!')] },
]

// === Export combined page content ===
export const IQRA_PAGE_CONTENT: Record<string, IqraPageData> = {}

// Register all pages
const ALL_BOOKS = [...BOOK1, ...BOOK2, ...BOOK3, ...BOOK4, ...BOOK5, ...BOOK6]
ALL_BOOKS.forEach(page => {
  IQRA_PAGE_CONTENT[`${page.book}-${page.page}`] = page
})

// Helper: get page data
export function getIqraPage(book: number, page: number): IqraPageData | undefined {
  return IQRA_PAGE_CONTENT[`${book}-${page}`]
}

// Helper: get all pages for a book
export function getIqraBookPages(book: number): IqraPageData[] {
  return ALL_BOOKS.filter(p => p.book === book)
}

// Helper: get total page count
export function getTotalPages(): number {
  return ALL_BOOKS.length
}
