import React, { useState } from "react";
import axios from "axios";

const CategoryForm = () => {
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/categories", { name });
      alert("Category created!");
      setName("");
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  return (
    <div>
      <h2>Create Category</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <br />
        <button type="submit">Add Category</button>
      </form>
    </div>
  );
};

export default CategoryForm;
