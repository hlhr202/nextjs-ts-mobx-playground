import { NextPage } from "next";
import { instantiate, isServer } from "../utils/mobx-util";
import { useObserver } from "mobx-react-lite";
import { PostsStore } from "../store/posts";
import { useEffect, useCallback } from "react";

const CounterPage: NextPage<{ postsStore: PostsStore }> = props => {
    const postsStore = isServer
        ? props.postsStore
        : instantiate<PostsStore>(PostsStore);
    useEffect(() => {
        if (!postsStore.posts) {
            postsStore.updatePosts(props.postsStore.posts || []);
        }
    }, []);
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
    const postsStore = instantiate<PostsStore>(PostsStore);
    await postsStore.fetchPosts();
    return { postsStore };
};

export default CounterPage;
