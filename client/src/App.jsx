import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
  });
  const [editingPostId, setEditingPostId] = useState(null);

  const API_BASE = "http://localhost:5000/api";

  // Fetch categories and posts on load
  useEffect(() => {
    fetchCategories();
    fetchPosts();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE}/categories`);
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories", err);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/posts`);
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching posts", err);
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/categories`, { name: categoryName });
      setCategoryName("");
      fetchCategories();
    } catch (err) {
      alert("Failed to create category");
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPostId) {
        await axios.put(`${API_BASE}/posts/${editingPostId}`, formData);
        setEditingPostId(null);
      } else {
        await axios.post(`${API_BASE}/posts`, formData);
      }
      setFormData({ title: "", content: "", category: "" });
      fetchPosts();
    } catch (err) {
      alert("Failed to submit post");
    }
  };

  const handleEdit = (post) => {
    setFormData({
      title: post.title,
      content: post.content,
      category: post.category?._id || "",
    });
    setEditingPostId(post._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/posts/${id}`);
      fetchPosts();
    } catch (err) {
      alert("Failed to delete post");
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "auto" }}>
      <h2>Simple Blog Admin Panel</h2>

      {/* Category Form */}
      <form onSubmit={handleCategorySubmit}>
        <h3>Create Category</h3>
        <input
          type="text"
          placeholder="Category name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          required
        />
        <button type="submit">Add Category</button>
      </form>

      {/* Post Form */}
      <form onSubmit={handlePostSubmit} style={{ marginTop: "2rem" }}>
        <h3>{editingPostId ? "Edit Post" : "Create Post"}</h3>
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
          required
        />
        <br />
        <textarea
          placeholder="Content"
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
          required
        />
        <br />
        <select
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option value={cat._id} key={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
        <br />
        <button type="submit">{editingPostId ? "Update Post" : "Submit Post"}</button>
      </form>

      {/* Post List */}
      <div style={{ marginTop: "2rem" }}>
        <h3>All Posts</h3>
        {posts.map((post) => (
          <div
            key={post._id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "1rem",
              marginBottom: "1rem",
              background: "#f9f9f9",
            }}
          >
            <h4>{post.title}</h4>
            <p>{post.content}</p>
            <small>Category: {post.category?.name}</small>
            <br />
            <button onClick={() => handleEdit(post)} style={{ marginRight: "10px" }}>
              Edit
            </button>
            <button onClick={() => handleDelete(post._id)} style={{ color: "red" }}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
