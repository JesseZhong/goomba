import { ActionPayload } from '../AppDispatcher';
import { Session } from '../models/Session';

export interface SessionPayload extends ActionPayload {
  session: Session;
}
