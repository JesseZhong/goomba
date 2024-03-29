export interface Directory {
  id: string;
  name: string;
  avatar?: string;
  avatar_url?: string;
  banner?: string;
  banner_url?: string;
  parent?: string;
  children?: string[];
  videos?: string[];
}

export class Directories extends Map<string, Directory> {
  private root: Directory[] = [];
  private lookup: Map<string, Directory> = new Map();

  constructor(directories?: Object) {
    super();
    if (directories) {
      for (const [key, directory] of Object.entries(directories)) {
        this.set(key, directory);
      }
    }
  }

  public get_root(): readonly Directory[] {
    return this.root;
  }

  public get_lookup(): Map<string, Directory> {
    return this.lookup;
  }

  public get_children(directory_id: string): readonly Directory[] | null {
    if (!this.has(directory_id)) {
      return null;
    }

    const children = this.get(directory_id)?.children;
    if (!children) {
      return null;
    }

    return children
      .map((dir_id: string) => this.get(dir_id))
      .filter((dir?: Directory): dir is Directory => {
        if (dir === null || dir === undefined) {
          return false;
        }

        return true;
      });
  }

  public set(key: string, value: Directory): this {
    if (!value.parent) {
      this.root.push(value);
      this.lookup.set(encodeURI(value.name), value);
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
