import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MyForm from "./components/Myform";
import SignUpForm from "./components/SignUpForm";
import MainApp from "./components/MainApp"
import ForgotPasswordForm from './components/ForgotPassword';
import ResetPasswordForm from './components/ResetPassword';

function App() {
 return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/available_websites" element={<MainApp />} />
        <Route path="/" element={<MyForm />} />
        <Route path="/" element={<MyForm />} />
        <Route path="/verify_user" element={<ForgotPasswordForm />} />
        <Route path='/reset_password' element={<ResetPasswordForm />} />
      </Routes>
    </Router>
 );
}

export default App;
