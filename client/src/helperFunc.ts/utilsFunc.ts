import { PAGELIMIT, PAGENUMBER } from '../dtos/constant';

export const formatNumber = (input: number) => {
  return new Intl.NumberFormat().format(input);
};

export const formatDate = (input: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    year: 'numeric',
    day: 'numeric',
  }).format(input);
};

export const formatDateWD = (input: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    year: 'numeric',
    day: 'numeric',
    weekday: 'short',
  }).format(input);
};

export const formatTime = (time: Date) => {
  return new Intl.DateTimeFormat('en-NG', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true, // or false for 24-hour format
  }).format(time);
};

// To capitalized every first letter of each word
export const capitalized = (str: string) => {
  const words = str.split(' ');
  return words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const paginate = (searchParams: URLSearchParams) => {
  // Get current page from search params.
  const currentPage = !searchParams.get('page')
    ? PAGENUMBER
    : Number(searchParams.get('page'));

  // Set start and end index for slice
  const startIndex = (currentPage - 1) * PAGELIMIT;
  const endIndex = currentPage * PAGELIMIT;

  return { currentPage, startIndex, endIndex };
};
