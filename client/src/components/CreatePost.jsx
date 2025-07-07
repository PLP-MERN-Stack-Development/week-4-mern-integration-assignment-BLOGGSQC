import { useState, useEffect } from "react";
import axios from "axios";

const CreatePost = ({ onPostCreated, editingPost, setEditingPost }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    featuredImage: ""
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/categories")
      .then(res => setCategories(res.data))
      .catch(err => console.error("Error fetching categories", err));
  }, []);

  // Update form data when editing
  useEffect(() => {
    if (editingPost) {
      setFormData({
        title: editingPost.title,
        content: editingPost.content,
        category: editingPost.category?._id || editingPost.category,
        featuredImage: editingPost.featuredImage || ""
      });
    }
  }, [editingPost]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editingPost) {
        // Update existing post
        await axios.put(`http://localhost:5000/api/posts/${editingPost._id}`, formData);
        alert("Post updated!");
        setEditingPost(null);
      } else {
        // Create new post
        await axios.post("http://localhost:5000/api/posts", formData);
        alert("Post created!");
      }
      setFormData({ title: "", content: "", category: "", featuredImage: "" });
      onPostCreated();
    } catch (err) {
      alert("Error submitting post");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 shadow-md rounded mb-4">
      <h2 className="text-lg font-bold mb-2">
        {editingPost ? "Edit Post" : "Create Post"}
      </h2>

      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Title"
        className="block w-full p-2 border mb-2"
        required
      />

      <textarea
        name="content"
        value={formData.content}
        onChange={handleChange}
        placeholder="Content"
        className="block w-full p-2 border mb-2"
      />

      <input
        type="text"
        name="featuredImage"
        value={formData.featuredImage}
        onChange={handleChange}
        placeholder="Featured Image URL"
        className="block w-full p-2 border mb-2"
      />

      <select
        name="category"
        value={formData.category}
        onChange={handleChange}
        className="block w-full p-2 border mb-2"
        required
      >
        <option value="">Select Category</option>
        {categories.map(cat => (
          <option key={cat._id} value={cat._id}>{cat.name}</option>
        ))}
      </select>

      <div className="flex gap-3">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {editingPost ? "Update" : "Submit"}
        </button>

        {editingPost && (
          <button
            type="button"
            onClick={() => {
              setEditingPost(null);
              setFormData({ title: "", content: "", category: "", featuredImage: "" });
            }}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default CreatePost;
