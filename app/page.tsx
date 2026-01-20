import { getUpcomingEvents, getPastEvents, getCategories } from '@/lib/events';
import EventCard from '@/components/EventCard';

export default function HomePage() {
  const upcomingEvents = getUpcomingEvents();
  const pastEvents = getPastEvents().slice(0, 5);
  const categories = getCategories();

  return (
    <div>
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Upcoming Events</h1>
        </div>

        {upcomingEvents.length > 0 ? (
          <div className="grid gap-4">
            {upcomingEvents.map((event) => (
              <EventCard key={event.slug} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
            <p className="text-gray-500 mb-4">No upcoming events yet.</p>
            <a
              href="https://github.com/ThatGuySam/brentevents/issues/new?template=event-submission.yml"
              className="text-blue-600 hover:underline"
            >
              Be the first to submit an event →
            </a>
          </div>
        )}
      </section>

      {categories.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Browse by Category</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <span
                key={category.slug}
                className="px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition-colors"
              >
                {category.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {pastEvents.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-500">
            Past Events
          </h2>
          <div className="grid gap-4 opacity-60">
            {pastEvents.map((event) => (
              <EventCard key={event.slug} event={event} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
