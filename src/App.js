import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { Link, Route, BrowserRouter as Router, Routes, useNavigate, useParams } from 'react-router-dom';
import ReactXarrow, { Xwrapper } from "react-xarrows";
import './App.css';
import resultspdf from './ResultsPDF.jpg';
import binoculars from './binoculars-svgrepo-com.svg';
import chatbot from './chatbot.png';
import question from './faq-svgrepo-com.svg';
import report from './file-svgrepo-com.svg';
import star from './rating-svgrepo-com.svg';
import resluts from './results.jpg';
import gold from './sales-performance-svgrepo-com.svg';
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

    axios.post('http://localhost:8000/Gallup/pdf', formData, {
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
        .get(`http://localhost:8000/Gallup/${pdfId}/pdf_similarity`, {
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
      .get(`http://localhost:8000/Gallup/${pdfId}/pdf_similarities_download`, {
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
        <Link to={`/results_new/${pdfId}`}>
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
                    <th>Subfield</th>
                    <th>Profession</th>
                    <th>Fit Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row, index) => (
                    <tr key={index}>
                      <td>{row.Place}</td>
                      <td>{row.Field}</td>
                      <td>{row.Subfield}</td>
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

const Results_new = () => {
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
        .get(`http://localhost:8000/Gallup/${pdfId}/pdf_similarity_new`, {
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
      .get(`http://localhost:8000/Gallup/${pdfId}/pdf_similarities_download_new`, {
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
                    <th>Year of appearance</th>
                    <th>Profession</th>
                    <th>Fit Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row, index) => (
                    <tr key={index}>
                      <td>{row.Place}</td>
                      <td>{row.Field}</td>
                      <td>{row['Year of appearance']}</td>
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
        .get(`http://localhost:8000/Gallup/${pdfId}/pdf_comments`, {
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
      .get(`http://localhost:8000/Gallup/${pdfId}/pdf_comments_download`, {
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
        return renderContent("EXPLORE YOUR PERSONALITY", "BEST CAREER FIELDS");
      case "content2":
        return renderContent("BEST CAREER FIELDS", "TOP 5 PROFESSIONS");
      case "content3":
        return renderContent("TOP 5 PROFESSIONS");
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
      const response = await axios.get(`http://localhost:8000/Gallup/${pdfId}/pdf_bot`, {
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
  const KeyFeaturesRef = useRef(null);
  const Startbutton = useRef(null);
  const Description1 = useRef(null);
  const Description2 = useRef(null);

  const [isVisibleHome3, setIsVisibleHome3] = useState(false);
  const [isVisibleKeyFeatures, setIsVisibleKeyFeatures] = useState(false);
  const [isVisibleStartbutton, setIsVisibleStartbutton] = useState(false);
  const [isVisibleDescription1, setIsVisibleDescription1] = useState(false);
  const [isVisibleDescription2, setIsVisibleDescription2] = useState(false);
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

    axios.post('http://localhost:8000/auth/users/tokens', data)
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

  const checkVisibility = (ref, setIsVisible) => {
    if (!ref.current) {
      return;
    }
    const rect = ref.current.getBoundingClientRect();
    if (rect.top <= window.innerHeight && rect.bottom) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    const checkScroll = () => {
      checkVisibility(Home3Ref, setIsVisibleHome3);
      checkVisibility(KeyFeaturesRef, setIsVisibleKeyFeatures);
      checkVisibility(Startbutton, setIsVisibleStartbutton)
      checkVisibility(Description1, setIsVisibleDescription1)
      checkVisibility(Description2, setIsVisibleDescription2)
    };

    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);


  useEffect(() => {
    if (redirect) {
      navigate('/upload');
    }
  }, [redirect, navigate]);

  return (
    <div className="container">
      <Xwrapper>
        <div className="Home1">
          <div className="logo-container" >
            <h1 className="logo">PathFinder</h1>

            <img src={binoculars} id="1" alt="binoculars" className="logo-image" />

          </div>
          <div className="streamingtext-wrapper">
            <h2 className="streamingtext">Dive into environment that understands your goals, aided by a chatbot, paving your path to career success!</h2>
          </div>
          <div className="navigation-buttons">
            <button className="nav-btn" onClick={() => Home3Ref.current.scrollIntoView({ behavior: 'smooth' })} >Let's start!</button>
          </div>
          <div className="logo-container">
            <div className="sectionreverse1">

              <img className="img1" src={starting} alt="starting" />
              <div className="description1" >
                <h2>Over a Thousand Potential Career Pathways</h2>
                <h2>Get Ahead with 200 Emerging Professions</h2>
                <h2>Reports Tailored to Your Skills and Interests</h2>
              </div>
            </div>
            <img src={star} id="2" alt="star" className="logo-image" />
          </div>
        </div>

        <div className="Home2">

          <h1 className="KeyFeatures" ref={Startbutton} >Key Features</h1>

          <div className="logo-container">
            <div className="section">
              <div id="keyFeatures" className="description">
                <h1>Personalized Suggestions</h1>
                <h3 ref={KeyFeaturesRef}>Unlock your ideal career with personalized recommendations, combining your strengths and passions. Our platform uses a unique algorithm to match you with fulfilling career paths suited just for you!</h3>
              </div>
              <img className="img" src={resluts} alt="results" />
            </div>
            <img src={gold} id="3" alt="gold" className="logo-image1" />
          </div>
          <div className="logo-container">

            <div className="sectionreverse" ref={Description1} >
              <img className="img" src={resultspdf} alt="results pdf" />
              <div className="description" >
                <h1>In-depth Analysis</h1>
                <h3 >Navigate your career path with our comprehensive personality assessments. Our platform uses advanced algorithms to align your unique strengths with the right profession, setting you up for a successful future.</h3>
              </div>
            </div>
            <img src={report} id="4" alt="report" className="logo-image" />
          </div>
          <div className="logo-container">
            <div className="section">
              <div className="description">
                <h1 ref={Description2}>AI Assistant </h1>
                <h3>Facing tough decisions? Our AI chatbot is here to help. Providing instant guidance based on your unique needs, our Assistant supports confident decision-making. Join countless others who have benefited from this personalized advice!</h3>
              </div>
              <img className="img" src={chatbot} alt="chatbot" />

            </div>
            <img src={question} id="5" alt="question" className="logo-image1" />
          </div>
        </div>
        <div className="Home3" ref={Home3Ref}>
          <h1 id="6" className="Authorize">Authorize</h1>
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

        {isVisibleStartbutton && (
          <>
            <div className="xarrow">
              <ReactXarrow
                start="1"
                end="2"
                color='rgba(28, 30, 162, 0.64)'
                animateDrawing={true}
                headShape={'none'}
                // headColor={'white'}
                headSize={1}
                strokeWidth={4}
                path='grid'
                curveness={0.8}
              />
            </div>
          </>
        )}
        {isVisibleKeyFeatures && (
          <>
            <div className="xarrow1">
              <ReactXarrow
                start="2"
                end="3"
                color='rgba(162, 38, 46, 0.64)'
                path="smooth"
                animateDrawing={true}
                curveness={1.5}
                startAnchor="bottom"
                endAnchor="top"
                headShape={'none'}
                // headColor={'white'}
                headSize={1}
                strokeWidth={4}
                gridBreak="60%"
              />
            </div>
          </>
        )}
        {isVisibleDescription1 && (
          <>

            <div className="xarrow">
              <ReactXarrow
                start="3"
                end="4"
                color='rgba(192, 163, 32, 0.64)'
                path="smooth"
                curveness={1}
                animateDrawing={true}
                startAnchor="bottom"
                endAnchor="top"
                headShape={'none'}
                // headColor={'white'}
                headSize={1}
                strokeWidth={4}
                gridBreak="60%"
              />
            </div>
          </>
        )}
        {isVisibleDescription2 && (
          <>

            <div className="xarrow">
              <ReactXarrow
                start="4"
                end="5"
                color='rgba(32, 152, 192, 0.64)'
                path="smooth"
                curveness={1.8}
                startAnchor="bottom"
                endAnchor="top"
                animateDrawing={true}
                headShape={'none'}
                // headColor={'white'}
                headSize={1}
                strokeWidth={4}
                gridBreak="60%"
              />
            </div>
          </>
        )}
        {isVisibleHome3 && (
          <>
            <div className="xarrow">
              <ReactXarrow
                start="5"
                end="6"
                color='rgba(77, 192, 32, 0.64)'
                path="smooth"
                curveness={1.2}
                startAnchor="bottom"
                endAnchor="top"
                animateDrawing={true}
                headShape={'none'}
                // headColor={'white'}
                headSize={6}
                strokeWidth={4}
                gridBreak="60%"
              />
            </div>
          </>
        )}
      </Xwrapper>

    </div >
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
          <Route path="/results_new/:pdfId" element={<Results_new />} />
          <Route path="/results_pdf/:pdfId" element={<ResultsPdf />} />
          <Route path="/chatbot/:pdfId" element={<Chatbot />} />
        </Routes>

      </div>
    </Router>
  );
};

export default App;