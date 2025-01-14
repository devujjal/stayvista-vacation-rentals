import axios from 'axios'
import { useEffect } from 'react'
import useAuth from './useAuth'
import { useNavigate } from "react-router";

export const axiosSecure = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
})
const useAxiosSecure = () => {

  const { logOut } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // we can make this into a variable and also can clear that variable by return it;
    axiosSecure.interceptors.response.use(
      res => {
        return res
      },
      async (error) => {
        console.log('error tracked in the interceptor', error.response)
        if (error.response.status === 401 || error.response.status === 403) {
          await logOut();
          navigate('/login');
        }
        return Promise.reject(error)
      }
    )
  }, [logOut, navigate])

  return axiosSecure
}

export default useAxiosSecure
