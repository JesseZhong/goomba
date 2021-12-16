import request, { Response } from "superagent";

const TagAPI = (
    url: string
) => ({
    listTags(
        received: (tags: string[]) => void
    ): void {
        request.get(`${url}/tags`)
            .set('Accept', 'application/json')
            .end((error: any, response: Response) => {
                if (error) {
                    return console.error(error);
                }

                const results = response?.body as string[];
                received(results);
            });
    },

    getItemTags(
        item: string,
        received: (tags: string[]) => void
    ): void {
        request.get(`${url}/files/${item}/tags`)
            .set('Accept', 'application/json')
            .end((error: any, response: Response) => {
                if (error) {
                    return console.error(error);
                }

                const results = response?.body as string[];
                received(results);
            });
    },

    addTags(
        item: string,
        tags: string[]
    ): void {
        request.put(`${url}/files/${item}/tags/add`)
            .set('Accept', 'application/json')
            .send(tags)
            .end((error: any, _response: Response) => {
                if (error) {
                    return console.error(error);
                }
            });
    },

    removeTags(
        item: string,
        tags: string[]
    ): void {
        request.put(`${url}/files/${item}/tags/remove`)
            .set('Accept', 'application/json')
            .send(tags)
            .end((error: any, _response: Response) => {
                if (error) {
                    return console.error(error);
                }
            });
    }
});

export default TagAPI;