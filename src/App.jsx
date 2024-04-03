

import './App.css'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import UserProfile from './pages/UserProfile'
import { ThemingProvider } from './context/ThemeContext'
import Login from './features/Auth/Login'
import Register from './features/Auth/Register'
import RequireAuth from './components/RequireAuth'
import Timeline from './features/Posts/Timeline'
import Message from './pages/Message'
import UserPosts from './features/Profile/UserPosts'
import About from './features/Profile/About'
import UserFollowers from './features/Profile/UserFollowers'
import UserGallery from './features/Profile/UserGallery'
import StoryPage from './pages/StoryPage'
import EmailVerify from './components/EmailVerify'
import StartConversation from './features/Chat/StartConversation'
import FriendSuggestions from './components/FriendSuggestions'
import Chat from './features/Chat/Chat'
import Activity from './pages/Activity'
import Comments from './components/Comments'
import Likes from './components/Likes'
import PersistLogin from './components/PersistLogin'
import NoMatch from './components/NoMatch'

function App() {

  return (
    <ThemingProvider>
        <Routes>
            <Route path='*' element={<NoMatch />}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/register' element={<Register/>}/>
            <Route path='/verify/:userId/:token' element={<EmailVerify/>}/>
           
            <Route path='/' element={<Layout/>}>
              <Route element={<PersistLogin/>}>
                <Route element={<RequireAuth/>}>
                  <Route path='/' element={<Timeline/>}/>
                </Route>
                <Route element={<RequireAuth/>}>
                    <Route exact path='/profile/:userId' element={<UserProfile/>}>
                      <Route index element={<UserPosts/>}/>
                      <Route path='about' index element={<About/>}/>
                      <Route path='followers' index element={<UserFollowers/>}/>
                      <Route path='gallery' index element={<UserGallery/>}/>
                    </Route>
                </Route>
                <Route element={<RequireAuth/>}>
                  <Route path='/friendSuggestions' element={<FriendSuggestions/>}/>
                </Route>
                <Route element={<RequireAuth/>}>
                 
                </Route>
                <Route element={<RequireAuth/>}>
                  <Route path='/message' element={<Message/>}>
                  <Route index element={<StartConversation/>}/>
                  <Route path='chat/:id' element={<Chat/>}/>
                  </Route>
                </Route>
                <Route element={<RequireAuth/>}>
                <Route path='/stories/:userId' element={<StoryPage/>}/>
                </Route>
                <Route element={<RequireAuth/>}>
                    <Route exact path='/activity' element={<Activity/>}>
                      <Route path='likes' element={<Likes/>}/>
                      <Route path='comment' element={<Comments/>}/>
                    </Route>
                </Route>
              </Route>
          </Route>
        </Routes>
    </ThemingProvider>
  )
}

export default App