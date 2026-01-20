import { format, parseISO } from 'date-fns';
import { notFound } from 'next/navigation';
import { getAllEventSlugs, getEventBySlug } from '@/lib/events';

interface EventPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const slugs = getAllEventSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: EventPageProps) {
  const event = await getEventBySlug(params.slug);
  if (!event) return { title: 'Event Not Found' };

  return {
    title: `${event.title} | Community Events`,
    description: `${event.title} on ${event.date} at ${event.location}`,
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const event = await getEventBySlug(params.slug);

  if (!event) {
    notFound();
  }

  const dateObj = parseISO(event.date);

  return (
    <article className="max-w-3xl mx-auto">
      <a
        href="/"
        className="inline-flex items-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-6"
      >
        ← Back to all events
      </a>

      <header className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {event.category.replace(/-/g, ' ')}
          </span>
        </div>

        <h1 className="text-4xl font-bold mb-4">{event.title}</h1>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-start gap-3">
            <span className="text-2xl">📅</span>
            <div>
              <div className="font-medium">
                {format(dateObj, 'EEEE, MMMM d, yyyy')}
              </div>
              <div className="text-gray-500">{event.time}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-2xl">📍</span>
            <div>
              <div className="font-medium">{event.location}</div>
              {event.address && (
                <div className="text-gray-500">{event.address}</div>
              )}
            </div>
          </div>

          {event.organizer && (
            <div className="flex items-start gap-3">
              <span className="text-2xl">👤</span>
              <div>
                <div className="font-medium">Hosted by</div>
                <div className="text-gray-500">{event.organizer}</div>
              </div>
            </div>
          )}

          {event.url && (
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔗</span>
              <div>
                <div className="font-medium">More Info</div>
                <a
                  href={event.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-all"
                >
                  {event.url.replace(/^https?:\/\//, '').slice(0, 40)}
                  {event.url.length > 50 ? '...' : ''}
                </a>
              </div>
            </div>
          )}
        </div>
      </header>

      {event.url && (
        <div className="mb-8">
          <a
            href={event.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Register / More Details →
          </a>
        </div>
      )}

      <div
        className="prose dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: event.contentHtml || '' }}
      />

      {event.contact_email && (
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-gray-500">
            Questions? Contact{' '}
            <a
              href={`mailto:${event.contact_email}`}
              className="text-blue-600 hover:underline"
            >
              {event.contact_email}
            </a>
          </p>
        </div>
      )}
    </article>
  );
}
