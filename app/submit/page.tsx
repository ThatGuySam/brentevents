export const metadata = {
  title: 'Submit an Event | Community Events',
  description: 'Submit your community event to be featured on the calendar',
};

export default function SubmitPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Submit an Event</h1>

      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Want to share an event with the community? We use GitHub Issues to
        collect event submissions. It's free and keeps everything transparent.
      </p>

      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">How it works</h2>
        <ol className="space-y-3 text-gray-600 dark:text-gray-400">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm font-medium">
              1
            </span>
            <span>
              Click the button below to open our event submission form on GitHub
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm font-medium">
              2
            </span>
            <span>Fill out the event details (you'll need a GitHub account)</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm font-medium">
              3
            </span>
            <span>Submit the issue - we'll review it and add it to the calendar</span>
          </li>
        </ol>
      </div>

      <a
        href="https://github.com/brentom/brentevents/issues/new?template=event-submission.yml"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
      >
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            clipRule="evenodd"
          />
        </svg>
        Submit Event on GitHub
      </a>

      <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
        <h2 className="text-lg font-semibold mb-3">Don't have a GitHub account?</h2>
        <p className="text-gray-600 dark:text-gray-400">
          No problem! You can{' '}
          <a
            href="https://github.com/signup"
            className="text-blue-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            create a free GitHub account
          </a>{' '}
          in under a minute. Or, email your event details to the calendar
          maintainer directly.
        </p>
      </div>
    </div>
  );
}
