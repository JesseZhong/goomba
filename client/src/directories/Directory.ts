export interface Directory {
    id: string;
    name: string;
    banner?: string;
    parent?: string;
    children?: string[];
    videos?: string[];
}

export class Directories extends Map<string, Directory> {

    private root: Directory[];

    constructor(
        entries?: readonly (readonly [string, Directory])[] | null
    ) {
        super(entries);
        this.root = entries?.filter(
            (value: readonly [string, Directory]) => {
                return !value[1]?.parent
            }
        )
        .map(
            (value: readonly [string, Directory]) => {
                return value[1];
            }
        ) ?? [];
    }

    public get_root(): readonly Directory[] {
        return this.root;
    }

    public get_children(
        directory_id: string
    ): readonly Directory[] | null {
        if (!this.has(directory_id)) {
            return null;
        }

        const children = this.get(directory_id)?.children;
        if (!children) {
            return null;
        }

        return children
            .map(
                (dir_id: string) => this.get(dir_id)
            )
            .filter(
                (dir?: Directory): dir is Directory => {
                    if (dir === null || dir === undefined) {
                        return false;
                    }

                    return true;
                }
            );
    }

    public set(key: string, value: Directory): this {
        if (!value.parent) {
            this.root.push(value);
        }

        return super.set(key, value);
    }

    public delete(key: string): boolean {
        const rootIndex = this.root.findIndex((dir: Directory) => dir.id === key);
        if (rootIndex < 0) {
            delete this.root[rootIndex];
        }
        
        return super.delete(key);
    }

    public clear(): void {
        super.clear();
        this.root = [];
    }
}