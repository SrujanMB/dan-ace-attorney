export interface GameState {
  teamA: { name: string; score: number };
  teamB: { name: string; score: number };
  isLocked: boolean;
}

export interface ObjectionPayload {
  teamId: "A" | "B";
  userName: string;
}
