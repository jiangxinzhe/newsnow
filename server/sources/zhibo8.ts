// 自定义源(路线2 2026-09-26):直播吧新闻(news.zhibo8.cc 首页 HTML,锚点为 //news.zhibo8.com/ 协议相对链接)
interface HotItem {
  id: string
  title: string
  url: string
  mobileUrl: string
}

export default defineSource(async () => {
  const html: string = await myFetch("https://news.zhibo8.cc/")

  const regex = /href="(\/\/news\.zhibo8\.com\/[^"]+?\.htm)"[^>]*>([^<]{8,80})<\/a>/g
  const seen = new Set<string>()
  const result: HotItem[] = []
  let match
  while (true) {
    match = regex.exec(html)
    if (!match) break
    const [, path, title] = match
    const url = `https:${path}`
    if (seen.has(url)) continue
    seen.add(url)
    result.push({
      id: path,
      title: title.trim(),
      url,
      mobileUrl: url,
    })
    if (result.length >= 30) break
  }
  return result
})
