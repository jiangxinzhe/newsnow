// 自定义源(路线2 2026-09-26):虎扑足球区热帖——与官方 hupu.ts 同款正则,仅版块不同
interface HotItem {
  id: string
  title: string
  url: string
  mobileUrl: string
}

export default defineSource(async () => {
  const html: string = await myFetch(`https://bbs.hupu.com/soccer`)

  const regex = /<li class="bbs-sl-web-post-body">[\s\S]*?<a href="(\/[^"]+?\.html)"[^>]*?class="p-title"[^>]*>([^<]+)<\/a>/g

  const result: HotItem[] = []
  const seen = new Set<string>()
  let match
  while (true) {
    match = regex.exec(html)
    if (!match) break
    const [, path, title] = match
    if (seen.has(path)) continue
    seen.add(path)
    const url = `https://bbs.hupu.com${path}`
    result.push({
      id: path,
      title: title.trim(),
      url,
      mobileUrl: url,
    })
  }
  return result
})
