import "./global.css"
import { GoogleAnalytics } from "@next/third-parties/google"
import { Analytics } from "@vercel/analytics/react"
import Script from "next/script"

export default function App({ Component, pageProps }) {
  if (process.env.NEXT_PUBLIC_VERCEL_ENV !== "production") {
    return <Component {...pageProps} />
  }

  return (
    <>
      <Component {...pageProps} />
      <GoogleAnalytics gaId="AW-11313383806" />
      <Analytics />
      <Script id="twitter-pixel" strategy="lazyOnload">{`
!function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
},s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',
a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
twq('config','o6tnh');
twq('event', 'tw-o6tnh-oi8tp', {});
      `}</Script>
    </>
  )
}
