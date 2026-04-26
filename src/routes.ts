export const routes = {
  COURT: "/",
  PLAYER_A: "/playerA",
  PLAYER_B: "/playerB",
};

export function getRouteUrl(route: string) {
  const location = window.location;
  const serverUrl = `http://${location.hostname}:${location.port}${route}`;

  return serverUrl;
}
