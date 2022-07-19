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

    mockResponses: Map<string, Response> = new Map();

    mockUrl?: string;

    private withUrl = (url: string) => {
        this.mockUrl = url;
        return this;
    };

    private getResponse = () => this.mockResponses.size &&
            this.mockUrl &&
            this.mockResponses.has(this.mockUrl) 
        ? this.mockResponses.get(this.mockUrl)
        : this.mockResponse;

    get = this.withUrl;
    post = this.withUrl;
    put = this.withUrl;
    delete = this.withUrl;

    auth = jest.fn().mockReturnThis();
    send = jest.fn().mockReturnThis();
    query = jest.fn().mockReturnThis();
    field = jest.fn().mockReturnThis();
    set = jest.fn().mockReturnThis();
    accept = jest.fn().mockReturnThis();
    timeout = jest.fn().mockReturnThis();

    then = (callback: (response?: Response) => void) => {

        return new Promise(
            (
                resolve: (value: unknown) => void,
                reject: (reason?: any) => void 
            ) => {
                if (this.mockError) {
                    return reject(this.mockError);
                }

                return resolve(callback(this.getResponse()));
            }
        )
    };

    end = jest.fn().mockImplementation((
        callback: (error: any, response: any) => void
    ) => {
        const response = this.getResponse();

        if (this.mockDelay) {
            const delayTimer = setTimeout(
                callback,
                0,
                this.mockError,
                response
            );
        }
        else {
            callback(
                this.mockError,
                response
            );
        }
    });

    __setMockDelay = (value: boolean) => this.mockDelay = value;

    __setDefaultMockResponse = (response: {}) => {
        this.mockResponse = {
            ...defaultResponse,
            ...response
        };
    }

    __setMockResponses = (responses: { [key: string]: {} }) => {
        if (responses) {
            for (const [url, response] of Object.entries(responses)) {
                this.mockResponses.set(
                    url,
                    {
                        ...defaultResponse,
                        ...response
                    }
                );
            }
        }
    }

    __setMockError = (error: any) => this.mockError = error;
}

export default new Request();