export const themeData = JSON.parse("{\"logo\":\"/logo.png\",\"navbar\":[{\"text\":\"主页\",\"link\":\"/\"},{\"text\":\"大数据\",\"children\":[{\"text\":\"Hive on Hadoop\",\"link\":\"/大数据/Hive on Hadoop.html\"},{\"text\":\"大数据（LoongArch64）\",\"link\":\"/大数据/大数据（LoongArch64）.html\"},{\"text\":\"数据分析\",\"link\":\"/大数据/数据分析.html\"}]},{\"text\":\"前端\",\"children\":[{\"text\":\"硅谷甄选\",\"link\":\"/前端/硅谷甄选.html\"}]}],\"locales\":{\"/\":{\"selectLanguageName\":\"English\"}},\"colorMode\":\"auto\",\"colorModeSwitch\":true,\"repo\":null,\"selectLanguageText\":\"Languages\",\"selectLanguageAriaLabel\":\"Select language\",\"sidebar\":\"auto\",\"sidebarDepth\":2,\"editLink\":true,\"editLinkText\":\"Edit this page\",\"lastUpdated\":true,\"lastUpdatedText\":\"Last Updated\",\"contributors\":true,\"contributorsText\":\"Contributors\",\"notFound\":[\"There's nothing here.\",\"How did we get here?\",\"That's a Four-Oh-Four.\",\"Looks like we've got some broken links.\"],\"backToHome\":\"Take me home\",\"openInNewWindow\":\"open in new window\",\"toggleColorMode\":\"toggle color mode\",\"toggleSidebar\":\"toggle sidebar\"}")

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateThemeData) {
    __VUE_HMR_RUNTIME__.updateThemeData(themeData)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ themeData }) => {
    __VUE_HMR_RUNTIME__.updateThemeData(themeData)
  })
}
