export const Events = {
  objection: {
    send: "OBJECTION_SEND",
    triggered: "OBJECTION_TRIGGERED",
  },
  name: {
    send: "NAME_SEND",
    updated: "NAME_UPDATED",
  },
  game: {
    stateUpdate: "STATE_UPDATE",
  },
} as const;
