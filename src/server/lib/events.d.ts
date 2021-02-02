export type EventType=
  | 'signIn'
  | 'signOut'
  | 'createUser'
  | 'updateUser'
  | 'linkAccount'
  | 'session'
  | 'error'

export type EventCallback = (message: any) => Promise<void>

export type EventsOptions = Partial<Record<EventType, EventCallback>>
