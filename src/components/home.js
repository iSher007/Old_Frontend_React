import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Xwrapper } from "react-xarrows";
import binoculars from './assets/images/binoculars-svgrepo-com.svg';
import star from './assets/images/rating-svgrepo-com.svg';
import starting from './assets/images/starting.gif';
import "./assets/styles/Home.css";
import "./assets/styles/Resposive_mode.css";



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
    window.addEventListener('signInClicked', () => {
      Home3Ref.current.scrollIntoView({ behavior: 'smooth' });
    });

    return () => {
      window.removeEventListener('signInClicked', () => { });
    };
  }, []);

  useEffect(() => {
    if (redirect) {
      navigate('/dashboard');
    }
  }, [redirect, navigate]);
  return (
    <div className="container">
      <Xwrapper>
        <div className="Home1">
          <div className="logo-container" >
            <h1 className="logo">TANU PRO</h1>

            <img src={binoculars} id="1" alt="binoculars" className="logo-image" />

          </div>
          <div className="streamingtext-wrapper">
            <h2 className="streamingtext"><span>Окунитесь в мир, где ценят ваши мечты. Мы станем верным путеводителем в мире выбора карьерного пути!</span></h2>
          </div>
          <div className="navigation-buttons">
            <button className="nav-btn" onClick={() => Home3Ref.current.scrollIntoView({ behavior: 'smooth' })} >Let's start!</button>
          </div>
          <div className="logo-container">
            <div className="sectionreverse1">

              <img className="img1" src={starting} alt="starting" />
              <div className="description1" >
                <h2>Более 600 уже существующих и новых карьерных путей</h2>
                <h2>Наши отчеты помогут раскрыть ваш скрытый потенциал</h2>
                <h2>Полный разбор наиболее подходящих профессий и отраслей</h2>
              </div>
            </div>
            <img src={star} id="2" alt="star" className="logo-image" />
          </div>
        </div>

        <div className="Home3" ref={Home3Ref}>
          <h1 id="6" className="Authorize">Let's Go</h1>
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

      </Xwrapper>

    </div >
  );
};

export default Home
