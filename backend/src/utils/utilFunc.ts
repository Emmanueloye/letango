/**
 *
 * @param str : Accepts string
 * @returns slugs with dash (-) as a seperator.
 */
export const slugify = (str: string) => {
  return str.replaceAll(' ', '-');
};

/**
 *
 * @param str accepts string
 * @returns sentence case strings.
 */
export const capitalized = (str: string) => {
  const words = str.split(' ');
  const capitalizedWords = words.map(
    (item) => item.charAt(0).toUpperCase() + item.slice(1),
  );

  return capitalizedWords.join(' ');
};
