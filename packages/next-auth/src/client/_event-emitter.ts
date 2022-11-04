interface DefaultEvents {
  [event: string]: (...args: any[]) => void;
}

export const createEventEmitter = <Events extends DefaultEvents>() => {
  const events: Partial<{ [E in keyof Events]: Array<Events[E]> }> = {};

  const on = <K extends keyof Events>(event: K, cb: Events[K]) => {
    events[event] ??= []
    events[event]?.push(cb)

    return () => {
      events[event] = events[event]?.filter((i) => cb !== i);
    };
  };

  const emit = <K extends keyof Events>(event: K, ...args: Parameters<Events[K]>) => {
    const callbacks = events[event] ?? [];

    for (const callback of callbacks.values()) {
      // eslint-disable-next-line node/no-callback-literal
      callback(...args);
    }
  };

  return {
    events,
    on,
    emit,
  };
};
