// 自定义源(路线2 2026-09-26):懂球帝各联赛子榜——与官方 dongqiudi.ts 同款接口,仅 tab id 不同
// 多 getter 单文件(仿官方 cls/index.ts):源 id 键名含连字符,故文件名不能用连字符(glob 导入标识符限制)
// tab id 为非公开接口枚举所得(3=英超 4=意甲 5=西甲 6=德甲 12=法甲 11=集锦),失效表现为该源 500,修复=改数字
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

const tabId: Record<string, number> = {
  "dongqiudi-toutiao": 1,
  "dongqiudi-epl": 3,
  "dongqiudi-seriea": 4,
  "dongqiudi-laliga": 5,
  "dongqiudi-bundesliga": 6,
  "dongqiudi-ligue1": 12,
  "dongqiudi-highlights": 11,
}

function league(id: string) {
  return defineSource(async () => {
    const res: Res = await myFetch(`https://api.dongqiudi.com/app/tabs/web/${tabId[id]}.json`)

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
}

export default defineSource({
  "dongqiudi-toutiao": league("dongqiudi-toutiao"),
  "dongqiudi-epl": league("dongqiudi-epl"),
  "dongqiudi-seriea": league("dongqiudi-seriea"),
  "dongqiudi-laliga": league("dongqiudi-laliga"),
  "dongqiudi-bundesliga": league("dongqiudi-bundesliga"),
  "dongqiudi-ligue1": league("dongqiudi-ligue1"),
  "dongqiudi-highlights": league("dongqiudi-highlights"),
})
