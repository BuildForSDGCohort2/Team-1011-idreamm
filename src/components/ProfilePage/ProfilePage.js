import React, { useContext } from 'react';
import { Helmet } from 'react-helmet';
import { AuthContext } from '../../context/AuthContext';
import Profile from '../Profile/Profile';
import UserPosts from '../UserPosts/UserPosts';

export default function ProfilePage() {
  const { currentUser } = useContext(AuthContext);

  return (
    <>
      <Helmet>
        <title>{currentUser.username}</title>
      </Helmet>

      <div>
        <Profile />
        <UserPosts />
      </div>
    </>
  );
}
