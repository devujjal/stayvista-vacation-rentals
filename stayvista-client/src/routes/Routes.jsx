import { createBrowserRouter } from 'react-router'
import Main from '../layouts/Main'
import Home from '../pages/Home/Home'
import ErrorPage from '../pages/ErrorPage'
import Login from '../pages/Login/Login'
import SignUp from '../pages/SignUp/SignUp'
import RoomDetails from '../pages/RoomDetails/RoomDetails'
import PrivateRoute from './PrivateRoute'
import Dashboard from '../layouts/Dashboard'
import Statistics from '../pages/Statistics/Statistics'
import AddRoom from '../pages/AddRoom/AddRoom'
import MyListings from '../pages/MyListings/MyListings'
import Profile from '../pages/Dashboard/Profile/Profile'
import ManageUsers from '../pages/Dashboard/ManageUsers/ManageUsers'
import HostRoute from './HostRoute'
import AdminRoute from './AdminRoute'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Main />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/room/:id',
        element: <PrivateRoute><RoomDetails /></PrivateRoute>,
      },
    ],
  },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <SignUp /> },
  {
    path: '/dashboard',
    element: <PrivateRoute><Dashboard /></PrivateRoute>,
    children: [
      {
        index: true,
        element: <PrivateRoute><Statistics /></PrivateRoute>
      },
      {
        path: 'add-room',
        element: <PrivateRoute><HostRoute><AddRoom /></HostRoute></PrivateRoute>
      },
      {
        path: 'my-listings',
        element: <PrivateRoute><HostRoute><MyListings /></HostRoute></PrivateRoute>

      },
      {
        path: 'profile',
        element: <PrivateRoute><Profile /></PrivateRoute>
      },
      {
        path: 'manage-users',
        element: <PrivateRoute><AdminRoute><ManageUsers /></AdminRoute></PrivateRoute>
      }
    ]
  },
])
