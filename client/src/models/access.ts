export type Access = <Resource>(
  action: (access_token: string) => Promise<Resource>
) => Promise<Resource>;
