export function localDate(timezone, now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
  const value = type => parts.find(p => p.type === type).value;
  return `${value('year')}-${value('month')}-${value('day')}`;
}
export function isUpcoming(event, cities, now = new Date()) {
  if (event.sample || event.publicationStatus === 'research') return false;
  if (event.recur) return true;
  const timezone = cities.find(c => c.id === event.city)?.timezone || 'UTC';
  return (event.end || event.date) >= localDate(timezone, now);
}
export function eventDate(event) {
  if (event.recur) return event.recur;
  const fmt = date => new Intl.DateTimeFormat('en-GB', {timeZone:'UTC',day:'numeric',month:'short',year:'numeric'}).format(new Date(date + 'T12:00:00Z'));
  return fmt(event.date) + (event.end ? ' – ' + fmt(event.end) : '');
}
