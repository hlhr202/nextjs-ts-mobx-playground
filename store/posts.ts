import Axios from "axios";
import { useStaticRendering } from "mobx-react-lite";
import { observable, action } from "mobx";
import { isServer } from "../utils/mobx-util";

useStaticRendering(isServer);

export interface IPost {
    userId: number;
    id: number;
    title: string;
    body: string;
}

export class PostsStore {
    @observable posts: IPost[] | null = null;
    @observable post: IPost | null = null;

    @action updatePosts = (posts: IPost[]) => {
        this.posts = posts;
    };

    @action updatePost = (post: IPost) => {
        this.post = post;
    };

    fetchPosts = async () => {
        const response = await Axios.get<IPost[]>(
            "https://jsonplaceholder.typicode.com/posts"
        );
        this.updatePosts(response.data);
    };

    fetchPost = async (postId: string) => {
        const response = await Axios.get<IPost>(
            `https://jsonplaceholder.typicode.com/posts/${postId}`
        );
        this.updatePost(response.data);
    };
}
