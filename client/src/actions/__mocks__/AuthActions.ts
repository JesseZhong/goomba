import { Access } from '../../models/Access';

export const AuthAccess: Access = <Resource>(
  action: (access_token: string) => Promise<Resource>
) => {
  return action('example token');
};

const actions = {
  requestAuthorization: () => Promise.resolve(''),
  requestAccess: () => Promise.resolve(),
};

export default actions;
