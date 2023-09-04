import { ActionPayload } from '../AppDispatcher';
import { Session } from '../models/session';

export interface SessionPayload extends ActionPayload {
  session: Session;
}
