
import React, { useState, useEffect } from 'react';
import '../style/UserForm.css';
import { User, UserInput } from '../type/User';

type Props = {
  initialData?: User;
  onSubmit: (user: UserInput | User) => void;
  onCancel: () => void;
};

const UserForm: React.FC<Props> = ({ initialData, onSubmit, onCancel }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (initialData) {
      setUsername(initialData.username || '');
      setEmail(initialData.email || '');
      setPhone(initialData.phone || '');
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!initialData && password !== confirmPassword) {
      alert('Password do not match');
      return;
    }

    const userData = initialData
      ? { id: initialData.id, username, email, phone }
      : { username, email, phone, password };

    onSubmit(userData);
  };

  return (
    <form className="user-form" onSubmit={handleSubmit}>
      {/*<h3>{initialData ? 'Edit user' : 'Add user'}</h3>*/}

      <div className="form-group">
        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          placeholder="Username"
        />
      </div>

      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Email address"
        />
      </div>

      <div className="form-group">
        <label>Phone</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          placeholder="Phone number"
        />
      </div>

      {!initialData && (
        <>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm Password"
            />
          </div>
        </>
      )}

      <div className="form-actions">
        <button type="submit" className="btn-save">
          {initialData ? 'Save' : 'Add'}
        </button>
        <button type="button" className="btn-cancel" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default UserForm;