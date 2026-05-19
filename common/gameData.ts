export interface GameState {
  isLocked: boolean;
}

export type Team = "A" | "B";

export interface ObjectionPayload {
  teamId: Team;
  userName: string;
}
