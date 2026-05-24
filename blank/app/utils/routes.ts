import { isIlyPageEnabledClient } from "@/lib/ilyAuth";

export interface RouteConfig {
  path: "/" | "/portfolio" | "/ily";
  name: string;
  description?: string;
}

const homeRoute: RouteConfig = {
  path: "/",
  name: "Home",
  description: "Main page",
};

const ilyRoute: RouteConfig = {
  path: "/ily",
  name: "ILY",
  description: "Secret page",
};

const portfolioRoute: RouteConfig = {
  path: "/portfolio",
  name: "Portfolio",
  description: "Expanded portfolio route",
};

function getRoutes(): RouteConfig[] {
  const baseRoutes: RouteConfig[] = [homeRoute, portfolioRoute];
  return isIlyPageEnabledClient() ? [...baseRoutes, ilyRoute] : baseRoutes;
}

export function isValidRoute(path: string): boolean {
  return getRoutes().some((route) => route.path === path);
}

export function getNavigationPath(path: string): string {
  return path;
}

export function getAutocompleteRoutes(query: string): RouteConfig[] {
  const normalizedQuery = query.toLowerCase().trim();

  if (!normalizedQuery) {
    return [];
  }

  const routes = getRoutes();

  if (normalizedQuery === "/") {
    return routes;
  }

  return routes.filter((route) =>
    route.path.toLowerCase().startsWith(normalizedQuery),
  );
}

