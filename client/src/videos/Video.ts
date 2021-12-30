export interface Video {
    id: string;
    name: string;
    fileURI: string;
    thumbnailURI: string;
    type: 'image' | 'video/webm' | 'video/mp4' | 'unknown';
    tags: string[];
}

export class Videos extends Map<string, Video> {

    private readonly order: string[] = [];
    private readonly indexes: Map<string, number> = new Map();

    constructor(videos?: Object) {
        super();
        if (videos) {
            for (const [key, video] of Object.entries(videos)) {
                this.order.push(key);
                this.indexes.set(key, this.order.length - 1);
                this.set(key, video);
            }
        }
    }

    public getVideo(index: number): Video | undefined {
        return this.get(this.order[index]);
    }

    public getIndex(video: Video): number | undefined {
        return this.indexes.get(video.name);
    }

    public len(): number {
        return this.order.length;
    }
}