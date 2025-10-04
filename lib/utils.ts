export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export function calculateHourlyRate(revenue: number, expenses: number, timeInSeconds: number): number {
  const netRevenue = revenue - expenses;
  const hours = timeInSeconds / 3600;
  return hours > 0 ? netRevenue / hours : 0;
}

export function getSignalColor(signal: 'green' | 'yellow' | 'red'): string {
  switch (signal) {
    case 'green':
      return 'text-accent';
    case 'yellow':
      return 'text-warning';
    case 'red':
      return 'text-danger';
  }
}

export function getSignalBadgeClass(signal: 'green' | 'yellow' | 'red'): string {
  switch (signal) {
    case 'green':
      return 'signal-badge-green';
    case 'yellow':
      return 'signal-badge-yellow';
    case 'red':
      return 'signal-badge-red';
  }
}
