export function formatTimeAgo(dateString: string) {
  const now = new Date();

  const date = new Date(dateString);

  const seconds = Math.floor(
    (now.getTime() - date.getTime()) / 1000
  );

  // JUST NOW
  if (seconds < 60) {
    return "Just now";
  }

  // MINUTES
  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes} minute${
      minutes > 1 ? "s" : ""
    } ago`;
  }

  // HOURS
  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `Today at ${date.toLocaleTimeString(
      [],
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    )}`;
  }

  // DAYS
  const days = Math.floor(hours / 24);

  if (days === 1) {
    return "Yesterday";
  }

  if (days < 7) {
    return `${days} days ago`;
  }

  // FULL DATE
  return date.toLocaleDateString([], {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}