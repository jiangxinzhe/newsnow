// 自定义源(路线2 2026-09-26):懂球帝集锦子榜——与官方 dongqiudi.ts 同款接口,仅 tab id 不同
// tab id 为非公开接口枚举所得,失效表现为该源 500,修复=改这里的数字
interface Res {
  articles: {
    id: number
    title: string
    share?: string
    url?: string
    thumb?: string
    created_at?: string
    category?: string
  }[]
}

export default defineSource(async () => {
  const res: Res = await myFetch("https://api.dongqiudi.com/app/tabs/web/11.json")

  return res.articles
    .map(item => ({
      id: item.id,
      title: item.title,
      url: item.share || item.url || `https://www.dongqiudi.com/article/${item.id}`,
      pubDate: item.created_at,
      extra: {
        icon: item.thumb,
        info: item.category,
        date: item.created_at ? tranformToUTC(item.created_at) : 0,
      },
    }))
    .sort((a, b) => Number(b.extra.date) - Number(a.extra.date))
})
