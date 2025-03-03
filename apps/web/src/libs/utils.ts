export const getNextAvailableIndex = (
  items: { name: string }[],
  prefix: string,
): number => {
  const unavailableIndex = new Set<number>();

  items.forEach((item) => {
    // using prefix so we can match with levelName, driveName, locationName. making it more generic
    const match = item.name.match(new RegExp(`${prefix} (\\d+)`)); // using regex to match the prefix and number
    // if it matches put it in the set
    if (match?.[1]) {
      unavailableIndex.add(parseInt(match[1], 10));
    }
  });

  let index = 1;
  while (unavailableIndex.has(index)) {
    index++;
  }

  return index;
};
