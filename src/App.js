import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard.js';
import './components/assets/styles/App.css';
import Chatbot from './components/chatbot.js';
import Home from './components/home.js';
import Info from './components/info.js';
import Results from './components/results.js';
import Results_new from './components/results_new.js';
import ResultsPdf from './components/results_pdf';
import StudentInfo from './components/student_info.js';
import Upload from './components/upload.js';


const App = () => {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <div className="top-bar">
            <Link to="/" className="logo-container">
              <h1>TANU</h1>
            </Link>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload/:pdfId" element={<Upload />} />
          <Route path="/results/:pdfId" element={<Results />} />
          <Route path="/results_new/:pdfId" element={<Results_new />} />
          <Route path="/results_pdf/:pdfId" element={<ResultsPdf />} />
          <Route path="/chatbot/:pdfId" element={<Chatbot />} />
          <Route path="/student_info/:pdfId" element={<StudentInfo />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/info" element={<Info />} />
        </Routes>

      </div>
    </Router>
  );
};

export default App;