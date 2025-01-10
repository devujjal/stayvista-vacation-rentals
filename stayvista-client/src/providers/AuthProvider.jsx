import PropTypes from 'prop-types';
import { createContext, useEffect, useState } from 'react';
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { app } from '../firebase/firebase.config';
import axios from 'axios';
export const AuthContext = createContext(null);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true);


  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password)
  }

  const signIn = (email, password) => {
    setLoading(true)
    return signInWithEmailAndPassword(auth, email, password)
  }

  const signInWithGoogle = () => {
    setLoading(true)
    return signInWithPopup(auth, googleProvider)
  }

  const resetPassword = email => {
    setLoading(true)
    return sendPasswordResetEmail(auth, email)
  }

  const logOut = async () => {
    setLoading(true)
    await axios.get(`${import.meta.env.VITE_API_URL}/logout`, {
      withCredentials: true,
    })
    return signOut(auth)
  }

  const updateUserProfile = (name, photo) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo,
    })
  }
  // Get token from server
  // const getToken = async email => {
  //   try {

  //     const res = await axiosSecure.post('/jwt', { email })
  //     return res.data;
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }


  //Saved User in db
  const savedUser = async (userInfo) => {
    try {
      const newUser = {
        email: userInfo?.email,
        role: 'guest',
        status: 'Verified',
      };

      const res = await axios.put('http://localhost:5000/user', newUser, {
        withCredentials: true
      })
      return res.data;

    } catch (error) {
      console.log(error)
    }
  }


  // onAuthStateChange
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      const userEmail = currentUser?.email || user?.email;
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {

        await axios.post('http://localhost:5000/jwt', { email: userEmail }, {
          withCredentials: true
        });
        await savedUser(currentUser);
      }
      else {
        await axios.post('http://localhost:5000/logout', { email: userEmail }, {
          withCredentials: true
        })
      }

    });

    return () => {
      unsubscribe();
    };
  }, [user?.email]);


  const authInfo = {
    user,
    loading,
    setLoading,
    createUser,
    signIn,
    signInWithGoogle,
    resetPassword,
    logOut,
    updateUserProfile,
  }

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  // Array of children.
  children: PropTypes.array,
}

export default AuthProvider
