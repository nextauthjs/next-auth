import * as React from "react"
import { Session } from ".."

export interface BroadcastMessage {
  event?: "session"
  data?: {
    trigger?: "signout" | "getSession"
  }
  clientId: string
  timestamp: number
}

export interface NextAuthConfig {
  baseUrl: string
  basePath: string
  baseUrlServer: string
  basePathServer: string
  /** 0 means disabled (don't send); 60 means send every 60 seconds */
  keepAlive: number
  /** 0 means disabled (only use cache); 60 means sync if last checked > 60 seconds ago */
  clientMaxAge: number
  /** Used for timestamp since last sycned (in seconds) */
  _clientLastSync: number
  /** Stores timer for poll interval */
  _clientSyncTimer: ReturnType<typeof setTimeout>
  /** Tracks if event listeners have been added */
  _eventListenersAdded: boolean
  /** Stores last session response from hook */
  _clientSession: Session | null | undefined
  /** Used to store to function export by getSession() hook */
  _getSession: any
}

export type SessionContext = React.Context<Session>
