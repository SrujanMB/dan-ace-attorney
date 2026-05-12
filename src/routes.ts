export const routes = {
  COURT: "/",
  PLAYER_A: "/playerA",
  PLAYER_B: "/playerB",
};

export function getRouteUrl(route: string) {
  const location = window.location;
  // Switch between local address & domain name (CF Tunnel)
  const suffix = location.port == "" ? "" : `:${location.port}`;
  const serverUrl = `https://${location.hostname}${suffix}${route}`;

  return serverUrl;
}
