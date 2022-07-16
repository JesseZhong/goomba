interface Response {
    status: () => number;
    ok: () => boolean;
    get: () => string;
    toError: () => void;
}

const defaultResponse: Response = {
    status: () => 200,
    ok: () => true,
    get: jest.fn(),
    toError: jest.fn()
};

class Request {

    mockError?: any;

    mockDelay?: boolean;

    mockResponse: Response = defaultResponse;

    get = jest.fn().mockReturnThis();
    post = jest.fn().mockReturnThis();
    send = jest.fn().mockReturnThis();
    query = jest.fn().mockReturnThis();
    field = jest.fn().mockReturnThis();
    set = jest.fn().mockReturnThis();
    accept = jest.fn().mockReturnThis();
    timeout = jest.fn().mockReturnThis();
    then = (callback: (response: Response) => void) => {
        return new Promise(
            (
                resolve: (value: unknown) => void,
                reject: (reason?: any) => void 
            ) => {
                if (this.mockError) {
                    return reject(this.mockError);
                }

                return resolve(callback(this.mockResponse));
            }
        )
    };

    end = jest.fn().mockImplementation((
        callback: (error: any, response: any) => void
    ) => {
        if (this.mockDelay) {
            const delayTimer = setTimeout(
                callback,
                0,
                this.mockError,
                this.mockResponse
            );
        }
        else {
            callback(
                this.mockError,
                this.mockResponse
            );
        }
    });

    __setMockDelay = (value: boolean) => this.mockDelay = value;

    __setMockResponse = (response: {}) => {
        this.mockResponse = {
            ...this.mockResponse,
            ...response
        };
    }

    __setMockError = (error: any) => this.mockError = error;
}

export default new Request();