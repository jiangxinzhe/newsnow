// 自定义源(路线2 2026-09-26):新浪体育每日热榜
// 接口为新浪排行榜 GetTopDataList(返回 "var data = {...}" 的 JS 赋值体,需剥前缀)
interface SinaItem {
  title?: string
  url?: string
  intime?: string
}

function toTs(sec?: string): number {
  const n = Number(sec) * 1000
  return Number.isFinite(n) && n > 0 ? n : 0
}

const sports = defineSource(async () => {
  const day = new Date().toISOString().slice(0, 10).replace(/-/g, "")
  const raw: string = await myFetch(
    `https://top.sports.sina.com.cn/ws/GetTopDataList.php?top_type=day&top_cat=sports_suda&top_time=${day}&top_show_num=50`,
  )
  const data = JSON.parse(raw.replace(/^var data = /, "").trim().replace(/;$/, ""))
  const rows: SinaItem[] = data.result?.data ?? []

  return rows
    .map((x, i) => ({
      id: x.url || i,
      title: (x.title || "").trim(),
      url: x.url || "https://sports.sina.com.cn",
      pubDate: x.intime,
      extra: { date: toTs(x.intime) },
    }))
    .filter(x => x.title)
    .sort((a, b) => Number(b.extra.date) - Number(a.extra.date))
})

export default defineSource({
  "sina-sports": sports,
})
