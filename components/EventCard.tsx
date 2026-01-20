import { format, parseISO } from 'date-fns';
import type { Event } from '@/lib/events';

interface EventCardProps {
  event: Event;
}

const categoryColors: Record<string, string> = {
  tech: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'arts-culture':
    'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  music: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
  'food-drink':
    'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  'sports-fitness':
    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  community:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  'business-networking':
    'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
  education: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
  other: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
};

export default function EventCard({ event }: EventCardProps) {
  const dateObj = parseISO(event.date);
  const categoryClass = categoryColors[event.category] || categoryColors.other;

  return (
    <a
      href={`/events/${event.slug}/`}
      className="block border border-gray-200 dark:border-gray-800 rounded-lg p-5 hover:border-blue-500 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-shrink-0 text-center w-16">
          <div className="text-sm font-medium text-gray-500 uppercase">
            {format(dateObj, 'MMM')}
          </div>
          <div className="text-2xl font-bold">{format(dateObj, 'd')}</div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg mb-1 truncate">{event.title}</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
            {event.time} • {event.location}
          </p>
          <span
            className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${categoryClass}`}
          >
            {event.category.replace(/-/g, ' ')}
          </span>
        </div>
      </div>
    </a>
  );
}
