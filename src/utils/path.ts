const toSegments = (pathname: string): string[] =>
  pathname.split("/").filter(Boolean);

export const getFirstSegment = (pathname: string): string =>
  toSegments(pathname)[0] ?? "";

export const stripFirstSegment = (pathname: string): string =>
  `/${toSegments(pathname).slice(1).join("/")}`;

export const joinPath = (...parts: string[]): string =>
  `/${parts.flatMap(toSegments).join("/")}`;
