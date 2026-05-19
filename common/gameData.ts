export interface GameState {
  isLocked: boolean;
}

export type Team = "A" | "B";

export interface ObjectionPayload {
  teamId: Team;
  userName: string;
}

export interface NamePayload {
  teamId: Team;
  userName: string;
}
