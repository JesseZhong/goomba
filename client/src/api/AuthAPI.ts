import request, { Response } from 'superagent';
import { ErrorResponse } from './ErrorResponse';


export interface TokenResponse {
    access_token: string;
    refresh_token: string;
    is_admin?: boolean;
    scope: string;
}

export interface AuthAPIClient {
    requestAuthorization(
        state: string
    ): Promise<string>;

    requestAccess(
        state: string,
        code: string
    ): Promise<TokenResponse>;

    access(
        access_token: string,
        refresh_token: string,
        action: <Resource>(
            access_token: string,
            errorHandler?: (response: ErrorResponse) => boolean
        ) => Promise<Resource>,
        tokensReceived: (
            access_token: string,
            refresh_token: string
        ) => void,
        tokenRevoked: () => void
    ): void;
}


const AuthAPI = (
    url: string
): AuthAPIClient => ({

    async requestAuthorization(
        state: string
    ): Promise<string> {
        return request.get(`${url}/authorize`)
            .set('Accept', 'application/json')
            .set('State', state)
            .then(
                (response: Response) => {

                    // Throw an exception if the wrong state was
                    // passed back. Might be a man-in-the middle attack.
                    const returnState = response.body['state'];
                    if (state !== returnState) {
                        throw new Error(`Incorrect state passed back. ${state} != ${returnState}`);
                    }
                    else {
                        return response.body['auth_url'];
                    }
                }
            );
    },

    async requestAccess(
        state: string,
        code: string
    ): Promise<TokenResponse> {
        return request.get(`${url}/access`)
            .set('Accept', 'application/json')
            .set('State', state)
            .set('Code', code)
            .then(
                (response: Response) => {
                    return response.body as TokenResponse;
                }
            );
    },

    /**
     * Access an endpoint that requires authorization.
     * Handles token refreshes.
     * @param access_token
     * @param refresh_token 
     * @param action 
     * @param tokensReceived 
     */
    access(
        access_token: string,
        refresh_token: string,
        action: <Resource>(
            access_token: string,
            errorHandler?: (response: ErrorResponse) => boolean
        ) => Promise<Resource>,
        tokensReceived: (
            access_token: string,
            refresh_token: string
        ) => void,
        tokenRevoked: () => void
    ): void {
        action(
            access_token,
            (response: ErrorResponse): boolean => {
                if (response.status === 401) {

                    const body = response.body as {
                        'message': string
                    }

                    if (body.message === 'Unauthorized - Invalid Token.') {
                        request.get(`${url}/refresh`)
                            .set('Accept', 'application/json')
                            .set('Refresh', refresh_token)
                            .end((error: any, response: Response) => {
                                if (error) {
                                    return console.error(error);
                                }

                                const {
                                    access_token,
                                    refresh_token
                                } = response.body as TokenResponse;

                                tokensReceived(
                                    access_token,
                                    refresh_token
                                );

                                // Attempt action again.
                                action(access_token)
                            });

                        return true;
                    }
                    else if (body.message === 'Unauthorized - New Token Required.') {
                        tokenRevoked();
                        return false;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    return false;
                }
            }
        )
    }
});

export default AuthAPI;