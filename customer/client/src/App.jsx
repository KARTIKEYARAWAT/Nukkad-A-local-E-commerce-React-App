import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CustLogin from './pages/custlogin';
import Signup from './pages/signup';
import Index from './pages/page';
const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/custlogin" element={<CustLogin />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  </Router>
);

export default App;
