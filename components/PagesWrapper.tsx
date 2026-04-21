
import SiteLoader from './SiteLoader';
import { TransitionProvider } from './PageTransition';
import { EB_Garamond } from 'next/font/google';

const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  variable: '--font-link',
});

export default async function PagesWrapper({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body cz-shortcut-listen="true" className={`${ebGaramond.variable}`}>
        <SiteLoader>
          <TransitionProvider>
            <div className="main-wrapper flex min-h-screen flex-col overflow-x-hidden">
              <main>{children}</main>
            </div>
          </TransitionProvider>
        </SiteLoader>
      </body>
    </html>
  );
}
