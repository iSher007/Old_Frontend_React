import React from 'react';
import { Link, Navigate, Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import Dashboard from './components/Dashboard.js';
import './components/assets/styles/App.css';
import Chatbot from './components/chatbot.js';
import Home from './components/home.js';
import Info from './components/info.js';
import Report1 from './components/report1.js';
import Report2 from './components/report2.js';
import Report3 from './components/report3.js';
import Results from './components/results.js';
import ResultsNew from './components/ResultsNew.js';
import ResultsPdf from './components/results_pdf';
import StudentInfo from './components/student_info.js';
import Upload from './components/upload.js';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

const HeaderButtons = () => {
  const hasAccessToken = localStorage.getItem("access_token");
  const location = useLocation();


  return (
    <>
      {(hasAccessToken || location.pathname === "/dashboard") && (
        <>
          <Nav.Link className="mx-2" href="/dashboard">Dashboard</Nav.Link>
          <Nav.Link className="mx-2" href="/chatbot">Chatbot</Nav.Link>
          <Nav.Link className="mx-2" href=""><SignInOutButton /></Nav.Link>
        </>
      )}

    </>
  );
};


const SignInOutButton = () => {
  const hasAccessToken = localStorage.getItem("access_token");

  const handleSignOutClick = () => {
    if (hasAccessToken) {
      localStorage.removeItem('access_token'); // remove the token
      window.location.href = '/';
    }
  };

  if (!hasAccessToken) return null; // No button rendered if user isn't authenticated

  return (
    <button className='btn btn-secondary' onClick={handleSignOutClick}>
      Sign Out
    </button>
  );
};


const ProtectedRoute = ({ children }) => {
  const hasAccessToken = localStorage.getItem("access_token");

  // If there's no access token, redirect to home page
  if (!hasAccessToken) {
    return <Navigate to="/" />;
  }

  return children;
};

const App = () => {
  return (
    <Router>
      <div>
        {/* <div className="container-fluid">
          <div className="row">
            <div className="col-12 d-flex justify-content-between">
              
            </div>
          </div>
        </div> */}
        {/* <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <a className="navbar-brand logo-container px-3" href="/">
              TANU
            </a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav ms-auto">
                <HeaderButtons />
              </ul>
            </div>
          </div>
        </nav> */}
        <Navbar expand="lg" className="bg-light">
          <Container fluid>
            <Navbar.Brand className="navbar-brand logo-container ms-2" href="/">TANU</Navbar.Brand>
            <Navbar.Toggle className="me-2" aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <HeaderButtons />
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        
        <div className="container-fluid bg-grey">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/upload/:pdfId"
              element={
                <ProtectedRoute>
                  <Upload />
                </ProtectedRoute>
              }
            />
            <Route
              path="/report1/:pdfId"
              element={
                <ProtectedRoute>
                  <Report1 />
                </ProtectedRoute>
              }
            />
            <Route
              path="/report2/:pdfId"
              element={
                <ProtectedRoute>
                  <Report2 />
                </ProtectedRoute>
              }
            />
            <Route
              path="/report3/:pdfId"
              element={
                <ProtectedRoute>
                  <Report3 />
                </ProtectedRoute>
              }
            />
            <Route
              path="/results/:pdfId"
              element={
                <ProtectedRoute>
                  <Results />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ResultsNew/:pdfId"
              element={
                <ProtectedRoute>
                  <ResultsNew />
                </ProtectedRoute>
              }
            />
            <Route
              path="/results_pdf/:pdfId"
              element={
                <ProtectedRoute>
                  <ResultsPdf />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chatbot"
              element={
                <ProtectedRoute>
                  <Chatbot />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student_info/:pdfId"
              element={
                <ProtectedRoute>
                  <StudentInfo />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/info"
              element={
                <ProtectedRoute>
                  <Info />
                </ProtectedRoute>
              }
            />
          </Routes>

        </div>
      </div>
    </Router>
  );
};

export default App;