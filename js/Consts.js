const FaviconService = 'https://www.google.com/s2/favicons?size=20&domain='
const DefaultLinkItems = [{
  name: "Google",
  url: "https://google.com/search?q=%s",
  bang: "!g",
  enabled: true,
}, {
  name: "Bing",
  url: "https://bing.com/search?q=%s",
  bang: "!b",
  enabled: true,
}, {
  name: "Wikipedia",
  url: "https://en.wikipedia.org/w/index.php?search=%s",
  bang: "!w",
  enabled: true
}, {
  name: "YouTube",
  url: "https://youtube.com/results?search_query=%s",
  bang: "!y",
  enabled: true
}, {
  name: "DuckDuckGo",
  url: "https://duckduckgo.com/?q=%s",
  bang: "!d",
  enabled: true
}, {
  name: "Wolfram Alpha",
  url: "https://www.wolframalpha.com/input/?i=%s",
  bang: "!wa",
  enabled: false
}, {
  name: "Ecosia",
  url: "https://www.ecosia.org/search?q=%s",
  bang: "!e",
  enabled: false
}]

const AppModes = {
  Normal: 1,
  Open: 2,
}