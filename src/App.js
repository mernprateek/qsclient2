import React, { useEffect, useState } from 'react';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    fetch(' https://giddy-tan-rugby-shirt.cyclic.app/blogs', {
      headers: {
        Authorization: localStorage.getItem('token'),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === 'Invalid token') {
          setLoggedIn(false);
          localStorage.removeItem('token');
        } else {
          setLoggedIn(true);
          setBlogs(data);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    const username = e.target.username.value;
    const password = e.target.password.value;

    fetch(' https://giddy-tan-rugby-shirt.cyclic.app/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.token) {
          localStorage.setItem('token', data.token);
          setLoggedIn(true);
        } else {
          console.log(data.message);
        }
      })
      .catch((err) => console.error(err));
  };

  const handleSignup = (e) => {
    e.preventDefault();

    const username = e.target.username.value;
    const password = e.target.password.value;

    fetch(' https://giddy-tan-rugby-shirt.cyclic.app/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.message);
      })
      .catch((err) => console.error(err));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
  };

  const handleCreate = (e) => {
    e.preventDefault();

    fetch(' https://giddy-tan-rugby-shirt.cyclic.app/blogs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token'),
      },
      body: JSON.stringify({ title, content }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.message);
        setTitle('');
        setContent('');
      })
      .catch((err) => console.error(err));
  };

  const handleUpdate = (id) => {
    const updatedTitle = prompt('Enter new title:');
    const updatedContent = prompt('Enter new content:');

    fetch(` https://giddy-tan-rugby-shirt.cyclic.app/blogs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token'),
      },
      body: JSON.stringify({ title: updatedTitle, content: updatedContent }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.message);
      })
      .catch((err) => console.error(err));
  };

  const handleDelete = (id) => {
    fetch(` https://giddy-tan-rugby-shirt.cyclic.app/blogs/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: localStorage.getItem('token'),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.message);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div>
      {!loggedIn ? (
        <>
          <h1>Login</h1>
          <form onSubmit={handleLogin}>
            <input type="text" name="username" placeholder="Username" />
            <input type="password" name="password" placeholder="Password" />
            <button type="submit">Login</button>
          </form>
          <h1>Signup</h1>
          <form onSubmit={handleSignup}>
            <input type="text" name="username" placeholder="Username" />
            <input type="password" name="password" placeholder="Password" />
            <button type="submit">Signup</button>
          </form>
        </>
      ) : (
        <>
          <h1>Create Social Media Post</h1>
          <form onSubmit={handleCreate}>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              type="text"
              name="content"
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <button type="submit">Create</button>
          </form>
          <h1>Social Media Posts</h1>
          {blogs.map((blog) => (
            <div key={blog._id}>
              <h2>{blog.title}</h2>
              <p>{blog.content}</p>
              <button onClick={() => handleUpdate(blog._id)}>Update</button>
              <button onClick={() => handleDelete(blog._id)}>Delete</button>
            </div>
          ))}
          <button onClick={handleLogout}>Logout</button>
        </>
      )}
    </div>
  );
};

export default App;
