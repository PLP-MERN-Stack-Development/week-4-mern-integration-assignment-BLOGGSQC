import React, { useEffect, useState } from "react";
import axios from "axios";

const PostList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/posts")
      .then(res => setPosts(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>All Posts</h2>
      <ul>
        {posts.map(post => (
          <li key={post._id}>
            <h4>{post.title}</h4>
            <p>{post.content}</p>
            <small>Category: {post.category?.name}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostList;
