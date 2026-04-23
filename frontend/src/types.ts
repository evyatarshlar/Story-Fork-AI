export interface StoryOptions {
    age?: number;
    depth?: number;
    genre?: string;
    tone?: string;
    length?: string;
}

export interface StoryOption {
    node_id: string;
    text: string;
}

export interface StoryNode {
    id: string;
    content: string;
    is_ending: boolean;
    is_winning_ending: boolean;
    options: StoryOption[];
}

export interface Story {
    title: string;
    root_node: StoryNode;
    all_nodes: Record<string, StoryNode>;
}

export interface StoredStory {
    id: number;
    title: string;
    created_at: string;
    theme?: string;
    genre?: string;
    tone?: string;
    age?: number;
    depth?: number;
    length?: string;
}
