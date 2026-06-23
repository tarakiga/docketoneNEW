"use client"

import Script from "next/script"
import { useEffect, useState } from "react"

export function ConsentScripts() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const check = () => {
      try {
        const val = localStorage.getItem("cookie-consent")
        setEnabled(val === "accepted")
      } catch {}
    }
    check()

    const handler = (e: Event) => {
      const ce = e as CustomEvent<string>
      if (ce.detail === "accepted") setEnabled(true)
      if (ce.detail === "declined") setEnabled(false)
    }
    window.addEventListener("cookie-consent", handler as EventListener)
    return () => window.removeEventListener("cookie-consent", handler as EventListener)
  }, [])

  if (!enabled) return null

  return (
    <>
      <Script id="hotjar-tracking" strategy="afterInteractive">
        {`
            (function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:6629645,hjsv:6};
                a=o.getElementsByTagName('head')[0];
                r=o.createElement('script');r.async=1;
                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                a.appendChild(r);
            })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
        `}
      </Script>
      <Script 
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7016949439291956"
        strategy="lazyOnload"
        crossOrigin="anonymous"
      />
      {/* Google Analytics 4 */}
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-YQ83DCFDE4" strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-YQ83DCFDE4');
        `}
      </Script>
    </>
  )
}

export function AdUnit({ className }: { className?: string }) {
  const [enabled, setEnabled] = useState(false)
  const slotId = process.env.NEXT_PUBLIC_ADSENSE_SLOT

  useEffect(() => {
    const check = () => {
      try {
        const val = localStorage.getItem("cookie-consent")
        setEnabled(val === "accepted")
      } catch {}
    }
    check()

    const handler = (e: Event) => {
      const ce = e as CustomEvent<string>
      if (ce.detail === "accepted") setEnabled(true)
      if (ce.detail === "declined") setEnabled(false)
    }
    window.addEventListener("cookie-consent", handler as EventListener)
    return () => window.removeEventListener("cookie-consent", handler as EventListener)
  }, [])

  useEffect(() => {
    if (!enabled || !slotId) return
    try {
      const adsbygoogle = (window as Window & { adsbygoogle?: unknown[] }).adsbygoogle || []
      ;(window as Window & { adsbygoogle?: unknown[] }).adsbygoogle = adsbygoogle
      adsbygoogle.push({})
    } catch {}
  }, [enabled, slotId])

  if (!enabled || !slotId) return null

  return (
    <div className={`my-10 ${className ?? ""}`}>
      <div className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-black text-center mb-3">Advertisement</div>
      <ins
        className="adsbygoogle block min-h-[90px] bg-white/70 rounded-2xl border border-slate-200/70"
        style={{ display: "block" }}
        data-ad-client="ca-pub-7016949439291956"
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
