import './App.css'
import { Route, Routes ,Navigate} from 'react-router'
import Home from './pages/Home.jsx'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import Chat from './pages/Chat.jsx'
import Call from './pages/Call.jsx'
import Notification from './pages/Notification.jsx'
import Onboard from './pages/Onboard.jsx'
import toast, { Toaster } from 'react-hot-toast'
import { useAuthUser } from './hooks/useAuthUser.js'
import PageLoader from './components/PageLoader.jsx'
import Layout from './components/Layout.jsx'

function App() {
          
  const {isLoading,authUser} = useAuthUser();

const isAuthenticated = Boolean(authUser);
const isOnboarded = authUser?.isOnboarded

  if(isLoading) {
    return <PageLoader />;
  }
  return (
    <>
      <div>
        <Routes>
          <Route path="/" element={isAuthenticated && isOnboarded ? (
            <Layout showSidebar={true}><Home/></Layout>
          ):(<Navigate to = {!isAuthenticated ? "/login" : "/onboard"}/>)} />
          <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to ={isOnboarded?"/":"/onboard"}/>} />
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to ={isOnboarded?"/":"/onboard"}/>} />
       <Route
  path="/call/:id"
  element={
    isAuthenticated && isOnboarded
      ? <Call />
      : <Navigate to={!isAuthenticated ? "/login" : "/onboard"} />
  }
/>

          
          {/* ✅ REVERTED: Changed parameter back to :userId */}
          <Route path="/chat/:userId" element={isAuthenticated ? <Chat />: <Navigate to ={isOnboarded?"/login":"/onboard"}/>} />

          <Route path="/notifications" element={isAuthenticated && isOnboarded ? (<Layout showSidebar={true}><Notification/></Layout>):(<Navigate to={!isAuthenticated?"/login":"/onboard"}/>)} />
          <Route path="/onboard" element={isAuthenticated ?<Onboard />:<Navigate to = "/login"/>} />
        </Routes>
      </div>

      {/* Add this line — it renders the toast notifications */}
      <Toaster position="top-right" reverseOrder={false} />  
    </>
  )
}

export default App