import { Dispatcher } from 'flux';

export interface ActionPayload {
  type: string;
}

const dispatcher = new Dispatcher<ActionPayload>();

export default dispatcher;
