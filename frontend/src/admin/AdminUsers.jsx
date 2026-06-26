import React, { useEffect, useState } from 'react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const token = (() => {
    try {
      const data = JSON.parse(localStorage.getItem('userInfo'));
      return data?.token;
    } catch (e) {
      return null;
    }
  })();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/auth/users', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error('Failed to load users');
        const data = await res.json();
        setUsers(data || []);
      } catch (err) {
        setError(err.message || 'Unable to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/auth/users/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to delete user');

      setUsers((u) => u.filter((x) => x._id !== id));
    } catch (err) {
      alert(err.message || 'Unable to delete user');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="shop-page">
      <div className="page-heading">
        <div>
          <h1>Users</h1>
          <p className="cart-summary">Manage registered users ({users.length})</p>
        </div>
      </div>

      <div style={{ padding: 8 }}>
        {loading && <div>Loading users...</div>}
        {error && <div style={{ color: '#f87171' }}>{error}</div>}

        {!loading && !error && (
          <div style={{ display: 'grid', gap: 12 }}>
            {users.length === 0 && <div className="empty-cart-card">No users found</div>}
            {users.map((u) => (
              <div key={u._id} className="summary-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{u.name || u.email}</div>
                  <div style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>{u.email}</div>
                  <div style={{ marginTop: 6 }}>Role: <strong>{u.role || 'user'}</strong></div>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <a href={`mailto:${u.email}`} className="btn btn-secondary">Email</a>
                  <button onClick={() => handleDelete(u._id)} disabled={deletingId === u._id} className="btn btn-danger">
                    {deletingId === u._id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
