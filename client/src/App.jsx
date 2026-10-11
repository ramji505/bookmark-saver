import React, { useState, useEffect } from 'react';

function App() {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  // Fetch bookmarks on initial render
  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      const res = await fetch('/api/bookmarks');
      if (res.ok) {
        const data = await res.json();
        setBookmarks(data);
      }
    } catch (err) {
      console.error('Error fetching bookmarks:', err);
    }
  };

  const handleSaveBookmark = async (e) => {
    e.preventDefault();
    if (!url.trim()) {
      setStatusMessage({ type: 'error', text: 'Please enter a valid URL.' });
      return;
    }

    setLoading(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim(), title: title.trim() })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to save bookmark.');
      }

      setBookmarks([data, ...bookmarks]);
      setUrl('');
      setTitle('');
      setStatusMessage({ type: 'success', text: 'Website URL saved successfully!' });
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/bookmarks/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setBookmarks(bookmarks.filter((item) => item._id !== id));
      }
    } catch (err) {
      console.error('Failed to delete bookmark:', err);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1><span>🔖</span> Bookmark Saver</h1>
        <p>Save website URLs to your collection</p>
      </header>

      {statusMessage && (
        <div className={`alert alert-${statusMessage.type}`}>
          {statusMessage.text}
        </div>
      )}

      <form onSubmit={handleSaveBookmark} className="form-group">
        <input
          type="text"
          className="input-field"
          placeholder="Website Title (optional, e.g. GitHub)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          className="input-field"
          placeholder="Website URL (e.g. https://github.com or google.com)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Saving...' : 'Save Bookmark'}
        </button>
      </form>

      <section className="bookmarks-section">
        <h2>Saved Bookmarks ({bookmarks.length})</h2>
        {bookmarks.length === 0 ? (
          <p className="empty-state">No bookmarks saved yet. Add your first website above!</p>
        ) : (
          <ul className="bookmarks-list">
            {bookmarks.map((bookmark) => (
              <li key={bookmark._id} className="bookmark-item">
                <div className="bookmark-info">
                  <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bookmark-title"
                  >
                    {bookmark.title || bookmark.url}
                  </a>
                  <span className="bookmark-url">{bookmark.url}</span>
                </div>
                <button
                  onClick={() => handleDelete(bookmark._id)}
                  className="btn-delete"
                  title="Delete bookmark"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default App;
