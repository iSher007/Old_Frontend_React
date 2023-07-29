import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { Link, Route, BrowserRouter as Router, Routes, useNavigate, useParams } from 'react-router-dom';
import './App.css';
import resultspdf from './ResultsPDF.jpg';
import chatbot from './chatbot.png';
import resluts from './results.jpg';
import starting from './starting.gif';



const Authorization = () => (
  <div className="container">
    <h1>Authorization Page</h1>
    <form>
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />
      <button type="submit">Submit</button>
    </form>
  </div>
);

const About = () => (
  <div className="container">
    <h1>About Gallup Test</h1>
    <p>Different text about Gallup test.</p>
  </div>
);

const MIT_FIELDS = [
  'Linguistic',
  'Logical–mathematical',
  'Musical',
  'Bodily–kinesthetic',
  'Spatial',
  'Interpersonal',
  'Intra–personal',
  'Naturalistic',
  'Existential'
];

const Upload = () => {
  const [date, setDate] = useState('');
  const [file, setFile] = useState(null);
  const [mbti, setMbti] = useState('');
  const [mitInput, setMitInput] = useState(
    MIT_FIELDS.reduce((prev, field) => ({ ...prev, [field]: '' }), {})
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [pdfId, setPdfId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (shouldRedirect && pdfId) {
      navigate(`/results/${pdfId}`);
    }
  }, [shouldRedirect, pdfId, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();

    if (!file || !date || !mbti || Object.values(mitInput).some(val => val === '')) {
      setErrorMessage('Please select a file, enter a date, and enter your MBTI');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('input', date);
    formData.append('MBTI', mbti);
    formData.append('MIT', JSON.stringify(mitInput));

    const token = localStorage.getItem('access_token');

    axios.post('https://fastapi-production-fffa.up.railway.app/Gallup/pdf', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    })
      .then((res) => {
        console.log(res.data);
        setPdfId(res.data._id);
        setShouldRedirect(true);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
        setErrorMessage('Error processing the file. Please upload another file.');
      });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
    setErrorMessage('');
  };

  const handleMbtiChange = (e) => {
    setMbti(e.target.value);
    setErrorMessage('');
  };

  const handleMitChange = (e, field) => {
    setMitInput(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className="container-upload">
      <h1 className="container-upload-logo">Submit Your Test Results</h1>
      <h4>Fill all cells. Click on test names to access their websites, if needed.</h4>
      <form onSubmit={submitHandler}>
        <div className="container-upload-text">
          Your date of birth
        </div>
        <div>
          <input
            type="date"
            placeholder="Gallup Test Date"
            value={date}
            onChange={handleDateChange}
          />
        </div>
        <div className="container-upload-text">
          <a href="https://www.gallup.com/home.aspx" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>Upload Gallup Test Results file</a>
        </div>
        <div>
          <input type="file" accept=".pdf" onChange={handleFileChange} />
        </div>
        <div className="container-upload-text">
          <a href="https://www.16personalities.com/free-personality-test" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>Myers – Briggs Type Indicator Results</a>
        </div>
        <div>
          <input
            type="text"
            placeholder="Ex. INTJ-A"
            value={mbti}
            onChange={handleMbtiChange}
          />
        </div>
        <div className="container-upload-text">
          <a href="https://www.idrlabs.com/multiple-intelligences/test.php" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>Multiple Intelligences Test Results</a>
        </div>
        {MIT_FIELDS.map(field => (
          <div className="mit-field" key={field}>
            <label className="mit-label">{field}</label>
            <input
              type="MIT"
              className="mit-input"
              placeholder={`Ex. 70%`}
              value={mitInput[field]}
              onChange={e => handleMitChange(e, field)}
            />
          </div>
        ))}
        <div className='upload-button'>
          <button type="submit" disabled={isLoading} style={{ marginTop: '10px' }}>
            {isLoading ? 'Sending...' : 'Send your results'}
          </button>
        </div>
      </form>
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};




const Results = () => {
  const { pdfId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [filterTerm, setFilterTerm] = useState('');

  useEffect(() => {
    const fetchTableData = () => {
      setIsLoading(true);

      const token = localStorage.getItem('access_token');

      axios
        .get(`https://fastapi-production-fffa.up.railway.app/Gallup/${pdfId}/pdf_similarity`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const data = response.data;
          setTableData(data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setIsLoading(false);
        });
    };

    fetchTableData();
  }, [pdfId]);

  const handleOpenPDF = () => {
    axios
      .get(`https://fastapi-production-fffa.up.railway.app/Gallup/${pdfId}/pdf_similarities_download`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
      .then((response) => {
        window.open(response.data, '_blank');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (filterTerm === '') {
      setFilteredData(tableData);
    } else {
      const filtered = tableData.filter(row => row.Field === filterTerm);
      setFilteredData(filtered);
    }
  }, [filterTerm, tableData]);

  const handleFilterChange = (e) => {
    setFilterTerm(e.target.value);
  }

  // Get a unique list of 'Field' values
  const fieldOptions = Array.isArray(tableData) ? [...new Set(tableData.map(item => item.Field))] : [];

  return (
    <div className="results-container">
      <div className="buttons-container">
        <Link to={`/results_pdf/${pdfId}`}>
          <button className='results-button'>Next Thing</button>
        </Link>
        <button onClick={handleOpenPDF} className='results-button'>
          Download All
        </button>
      </div>
      <div className="results-main">
        <h1>Best Fit Career</h1>
        <div>
          Select field
          <select value={filterTerm} onChange={handleFilterChange} className="filter-input">

            <option value="">All</option>

            {fieldOptions.map(field => <option value={field}>{field}</option>)}
          </select>
        </div>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            {Array.isArray(filteredData) && filteredData.length > 0 ? (
              <table className="results-table">
                <thead>
                  <tr>
                    <th>Place</th>
                    <th>Field</th>
                    <th>Profession</th>
                    <th>Fit Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row, index) => (
                    <tr key={index}>
                      <td>{row.Place}</td>
                      <td>{row.Field}</td>
                      <td>{row.Professions}</td>
                      <td>{row['Percentage fitting']}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No table data available.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const ResultsPdf = () => {
  const { pdfId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [commentData, setCommentData] = useState(null);
  const [selectedOption, setSelectedOption] = useState("content1");


  useEffect(() => {
    const fetchCommentData = () => {
      setIsLoading(true);

      const token = localStorage.getItem('access_token');

      axios
        .get(`https://fastapi-production-fffa.up.railway.app/Gallup/${pdfId}/pdf_comments`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const data = response.data;
          setCommentData(data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setIsLoading(false);
        });
    };

    fetchCommentData();
  }, [pdfId]);

  const handleOpenPDF = () => {
    axios
      .get(`https://fastapi-production-fffa.up.railway.app/Gallup/${pdfId}/pdf_comments_download`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
      .then((response) => {
        window.open(response.data, '_blank');
      })
      .catch((error) => {
        console.error(error);
      });
  };




  const handleSelectionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const renderContent = (start, end) => {
    if (!commentData) return null;  // Add this line

    const startIndex = commentData.indexOf(start);
    const endIndex = end ? commentData.indexOf(end) : undefined;
    const content = commentData.slice(startIndex, endIndex);
    return content.split('\n').map((item, key) => {
      const parts = item.split('**');
      return (
        <span key={key}>
          {parts.map((part, i) => i % 2 === 0 ? part : <strong>{part}</strong>)}
          <br />
        </span>
      );
    });
  };

  const renderSelectedContent = () => {
    switch (selectedOption) {
      case "content1":
        return renderContent("REPORT 1: EXPLORE YOUR PERSONALITY", "REPORT 2: BEST CAREER FIELDS");
      case "content2":
        return renderContent("REPORT 2: BEST CAREER FIELDS", "REPORT 3: TOP 5 PROFESSIONS");
      case "content3":
        return renderContent("REPORT 3: TOP 5 PROFESSIONS");
      default:
        return null;
    }
  };

  return (
    <div className="results-container">
      <div className="buttons-container">
        <Link to={`/chatbot/${pdfId}`}>
          <button type='submit' className='results-button'>Next Thing</button>
        </Link>
        <button type='submit' onClick={handleOpenPDF} className='results-button'>
          Download All
        </button>
        <Link to={`/results/${pdfId}`}>
          <button type='submit' className='results-button'>Get Back</button>
        </Link>

      </div>
      <select value={selectedOption} onChange={handleSelectionChange} className="filter-input2">
        <option value="content1">REPORT 1: EXPLORE YOUR PERSONALITY</option>
        <option value="content2">REPORT 2: BEST CAREER FIELDS</option>
        <option value="content3">REPORT 3: TOP 5 PROFESSIONS</option>
      </select>
      <div className="container-text">

        <h1>Open AI analysis</h1>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          renderSelectedContent()
        )}
      </div>
    </div>
  );
};

const Chatbot = () => {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { pdfId } = useParams();
  const navigate = useNavigate();

  const sendMessage = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`https://fastapi-production-fffa.up.railway.app/Gallup/${pdfId}/pdf_bot`, {
        params: {
          bot_question: message,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      const botReply = response.data;

      setChat((oldChat) => [...oldChat, { message, from: 'user' }, { message: botReply, from: 'bot' }]);
      setMessage('');
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleSend = (event) => {
    event.preventDefault();
    sendMessage();
  };

  const handleNextQuestion = () => {
    setChat([]);
    navigate(`/chatbot/${pdfId}`);
  };

  return (
    <div className="chatbot-container1">
      <div className="buttons-container1">

        <Link to={`/results_pdf/${pdfId}`}>
          <button type='submit' className='results-button'>Get Back</button>
        </Link>

      </div>
      <div className="chatbot-container">

        <h1 className="chatbot-header">VIRTUAL CAREER COUNSELOR</h1>

        <div className="chat-window">

          {chat.map((msg, idx) => (
            <p key={idx} className={`chat-message ${msg.from}`}>
              <span className="message-sender">{msg.from === 'user' ? 'You: ' : 'Counselor: '}</span>
              <span className="message-content">{msg.message}</span>
            </p>
          ))}
        </div>
        <form onSubmit={handleSend} className="chat-input-area">
          <input
            type="text"
            placeholder="Type a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isLoading}
            className="chat-input"
          />
          <button type="submit" disabled={isLoading} className="send-button">
            Send
          </button>
          <button type="button" onClick={handleNextQuestion} disabled={isLoading} className="clear-button">
            Clear all
          </button>
        </form>
      </div>
    </div>
  );
};


const Home = () => {
  const Home3Ref = useRef(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [redirect, setRedirect] = useState(false);
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('username', email);
    data.append('password', password);

    axios.post('https://fastapi-production-fffa.up.railway.app/auth/users/tokens', data)
      .then((response) => {
        const { access_token } = response.data;
        localStorage.setItem('access_token', access_token);
        setRedirect(true);
      })
      .catch((error) => {
        setErrorMessage('Unauthorized user');
        console.error(error);
      });
  };

  useEffect(() => {
    if (redirect) {
      navigate('/upload');
    }
  }, [redirect, navigate]);

  return (
    <div className="container">
      <div className="Home1">
        <h1 className="logo">PathFinder</h1>
        <div className="streamingtext-wrapper">
          <h2 className="streamingtext">Dive into environment that understands your goals, aided by a chatbot, paving your path to career success!</h2>
        </div>
        <div className="navigation-buttons">
          <button className="nav-btn" onClick={() => Home3Ref.current.scrollIntoView({ behavior: 'smooth' })}>Let's start!</button>
        </div>
        <div className="sectionreverse1">

          <img className="img1" src={starting} alt="starting" />
          <div className="description1">
            <h2>Over a Thousand Potential Career Pathways</h2>
            <h2>Get Ahead with 200 Emerging Professions</h2>
            <h2>Reports Tailored to Your Skills and Interests</h2>
          </div>

        </div>
      </div>
      <div className="Home2">
        <h1 className="KeyFeatures">Key Features</h1>
        <div className="section">
          <div className="description">
            <h1>Personalized Suggestions</h1>
            <h3>Unlock your ideal career with personalized recommendations, combining your strengths and passions. Our platform uses a unique algorithm to match you with fulfilling career paths suited just for you!</h3>
          </div>
          <img className="img" src={resluts} alt="results" />
        </div>
        <div className="sectionreverse">
          <img className="img" src={resultspdf} alt="results pdf" />
          <div className="description">
            <h1>In-depth Analysis</h1>
            <h3>Navigate your career path with our comprehensive personality assessments. Our platform uses advanced algorithms to align your unique strengths with the right profession, setting you up for a successful future.</h3>
          </div>
        </div>
        <div className="section">
          <div className="description">
            <h1>AI Assistant</h1>
            <h3>Facing tough decisions? Our AI chatbot is here to help. Providing instant guidance based on your unique needs, our Assistant supports confident decision-making. Join countless others who have benefited from this personalized advice!</h3>
          </div>
          <img className="img" src={chatbot} alt="chatbot" />
        </div>
      </div>
      <div className="Home3" ref={Home3Ref}>
        <h1 className="Authorize">Authorize</h1>
        {errorMessage && <p>{errorMessage}</p>}
        <form onSubmit={submitHandler}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Sign in</button>
        </form>
      </div>
    </div>
  );
};


const App = () => {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <div className="top-bar">
            <Link to="/" className="logo-container">
              <h1>PathFinder</h1>
            </Link>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Authorization />} />
          <Route path="/about" element={<About />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/results/:pdfId" element={<Results />} />
          <Route path="/results_pdf/:pdfId" element={<ResultsPdf />} />
          <Route path="/chatbot/:pdfId" element={<Chatbot />} />
        </Routes>

      </div>
    </Router>
  );
};

export default App;