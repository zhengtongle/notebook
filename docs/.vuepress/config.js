import { defineUserConfig ,defaultTheme} from 'vuepress'

export default defineUserConfig({
  lang: 'zh-CN',
  title: '御坂网络',
  description: 'Notebook',
  theme: defaultTheme({
    logo: 'https://vuejs.org/images/logo.png',
    navbar:[
        {
            text: '主页',
            link: '/'
        },
        {
            text: '大数据',
            children:[
                {
                    text:'Hive on Hadoop',
                    link: '/大数据/Hive on Hadoop.html',
                }
            ]
        },
        {
            text: '前端',
            children:[
                {
                    text: '硅谷甄选',
                    link: '/前端/硅谷甄选.html'
                }
            ]
        }
    ]
  }),
})