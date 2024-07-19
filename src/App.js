import React from 'react';
import { BrowserRouter as Router,Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import TaskBoard from './components/TaskBoard';
import TaskBoard2 from './components/TaskBoard2';
import TaskBoard3 from './components/TaskBoard3';
import TaskBoard4 from './components/TaskBoard4';
import TaskBoard5 from './components/TaskBoard5';
import TaskBoard6 from './components/TaskBoard6';
import LoginPage2 from './pages/LoginPage2';
import TaskBoard7 from './components/TaskBoard7';
import TaskBoard8 from './components/TaskBoard8';
import TaskBoard9 from './components/TaskBoard9';
import TaskBoard10 from './components/TaskBoard10';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage2 />} />

          
          {/* <Route path="/login" element={<LoginPage2 />} /> */}
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/home" element={<PrivateRoute element={<TaskBoard9 />} />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
//   return (
//     <AuthProvider>
//     <div className="App">
//       <Routes>
//         <Route path="/login" element={<LoginPage2/>} />
//         <Route path="/signup" element={<SignupPage />} />
//         <Route exact path='/home' element={<TaskBoard9/>}/>

//         {/* <Route exact path='/' element={<PrivateRoute/>}>
//                         <Route exact path='/' element={<DashboardPage/>}/>
//         </Route> */}
      
//          {/* <PrivateRoute exact path="/" component={DashboardPage}/>
//          <Route exact path='/' element={<PrivateRoute/>}>
//       <Route exact path='/' element={<Home/>}/>
// </Route> */}
         
//       </Routes>
//     </div>
//     </AuthProvider>
//   );
}

export default App;
