export interface RouteConfig {
  path: "/" | "/ily";
  name: string;
  description?: string;
}

const routes: RouteConfig[] = [
  {
    path: "/",
    name: "Home",
    description: "Main page",
  },
  {
    path: "/ily",
    name: "ILY",
    description: "Secret page",
  },
];

export function isValidRoute(path: string): boolean {
  return routes.some((route) => route.path === path);
}

export function getNavigationPath(path: string): string {
  return path;
}

export function getAutocompleteRoutes(query: string): RouteConfig[] {
  const normalizedQuery = query.toLowerCase().trim();

  if (!normalizedQuery) {
    return [];
  }

  if (normalizedQuery === "/") {
    return routes;
  }

  return routes.filter((route) =>
    route.path.toLowerCase().startsWith(normalizedQuery),
  );
}

