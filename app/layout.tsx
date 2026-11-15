import type { Metadata, Viewport } from "next";
import { Fraunces, IBM_Plex_Mono, Outfit } from "next/font/google";
import Script from "next/script";
import { Atmosphere } from "@/components/Atmosphere";
import "./globals.css";

const serif = Fraunces({
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  variable: "--font-serif",
});

const sans = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Sakshi Jain — Marketing Strategist and Planner, Noida",
  description:
    "Sakshi Jain is a marketing strategist and planner in Noida, India. A name, then a scroll through the size of a downstream market.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#07080c",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${serif.variable} ${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <Script id="boot-flags" strategy="beforeInteractive">
          {`(function(){try{if(matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('reduce');if('scrollRestoration' in history)history.scrollRestoration='manual';var nav=performance.getEntriesByType&&performance.getEntriesByType('navigation')[0];var isReload=nav?nav.type==='reload':(performance.navigation&&performance.navigation.type===1);var section=/^#(desk|top|work|work-do|projects|contact)$/;if(isReload){try{sessionStorage.removeItem('sakshi:home-scroll');sessionStorage.removeItem('sakshi:return-home');sessionStorage.removeItem('sakshi:open-pillar')}catch(e){}if(section.test(location.hash)){history.replaceState(null,'',location.pathname+location.search)}window.scrollTo(0,0);document.documentElement.dataset.sakshiBoot='top';return}var h=location.hash;var restoring=false;try{restoring=sessionStorage.getItem('sakshi:return-home')==='1'||sessionStorage.getItem('sakshi:home-scroll')!=null}catch(e){}if((!h||h==='#'||h==='#desk')&&!restoring){window.scrollTo(0,0);document.documentElement.dataset.sakshiBoot='top'}}catch(e){}})();`}
        </Script>
        <Atmosphere />
        {children}
      </body>
    </html>
  );
}
