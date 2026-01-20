import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Community Events Calendar',
  description: 'Discover local events in your community',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white dark:bg-gray-950">
        <header className="border-b border-gray-200 dark:border-gray-800">
          <nav className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="text-xl font-bold">
              📅 Events
            </a>
            <div className="flex items-center gap-4">
              <a
                href="/submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Submit Event
              </a>
            </div>
          </nav>
        </header>
        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
        <footer className="border-t border-gray-200 dark:border-gray-800 mt-12">
          <div className="max-w-5xl mx-auto px-4 py-6 text-center text-gray-500 text-sm">
            <p>
              Want to add an event?{' '}
              <a
                href="https://github.com/ThatGuySam/brentevents/issues/new?template=event-submission.yml"
                className="text-blue-600 hover:underline"
              >
                Submit via GitHub
              </a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
