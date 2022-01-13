export interface Video {
    id: string;
    name: string;
    stream_key: string;
    stream_url?: string;
    download_key?: string;
    download_url?: string;
    download_available?: boolean;
    thumbnail_key?: string;
    thumbnail_url?: string;
    date_aired?: string;
    date_added?: string;
    member?: boolean;
    tags?: string[];
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

    public set(
        key: string,
        value: Video
    ) {
        const len = this.order.push(value.name);
        this.indexes.set(value.name, len - 1);

        return super.set(key, value);
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