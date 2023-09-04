import * as ls from 'local-storage';
import { v4 as uuid } from 'uuid';
import { User } from './user';

const key = 'session';

export interface Session {
  session_id: string;
  access_token?: string;
  refresh_token?: string;
  is_admin?: boolean;
  user?: User;
  videoProgress?: { [key: string]: number };
}

export const Sessions = {
  /**
   * Attempt to resume or create a session.
   */
  load: (receive: (session: Session) => void) => {
    // Attempt to resume a session.
    let session = ls.get(key) as Session;

    // No session found? Make a new one.
    if (!session?.session_id) {
      session = {
        session_id: uuid(),
      };

      // Put the session in local storage.
      ls.set(key, session);
    }

    receive(session);
  },

  /**
   * Save the session to storage.
   */
  set: (session: Session) => {
    ls.set(key, session);
  },
};
