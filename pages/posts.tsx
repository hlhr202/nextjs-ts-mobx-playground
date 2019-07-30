import { useObserver } from "mobx-react-lite";
import { useCallback } from "react";
import { PostsStore } from "../store/posts";
import { NextPage } from "next";
import { instantiate, useRehydrated } from "../utils/mobx-util";

const CounterPage: NextPage<{ postsStore: PostsStore }> = props => {
    const postsStore = useRehydrated(PostsStore, props.postsStore);
    const fetchSinglePost = useCallback(() => postsStore.fetchPost("1"), []);

    return useObserver(() => (
        <div>
            <button onClick={fetchSinglePost}>Fetch Single Post</button>
            {!!postsStore.post && (
                <div>
                    <div>{postsStore.post.title}</div>
                    <div>{postsStore.post.body}</div>
                </div>
            )}
            <br />
            <br />
            <br />
            <br />
            <br />
            {(postsStore.posts || []).map(post => {
                return (
                    <div key={post.id}>
                        <div>{post.id}</div>
                        <div>{post.title}</div>
                        <div>{post.body}</div>
                        <br />
                    </div>
                );
            })}
        </div>
    ));
};

CounterPage.getInitialProps = async () => {
    const postsStore = instantiate(PostsStore);
    await postsStore.fetchPosts();
    return { postsStore };
};

export default CounterPage;
