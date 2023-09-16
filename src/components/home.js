import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Xwrapper } from "react-xarrows";
import binoculars from './assets/images/binoculars-svgrepo-com.svg';
import star from './assets/images/rating-svgrepo-com.svg';
import starting from './assets/images/output-onlinegiftools.gif';
import "./assets/styles/Home.css";
import "./assets/styles/Resposive_mode.css";
import Form from 'react-bootstrap/Form';


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
      <div className="row">
        <div className="col-12">
          <h1 className="logo">TANU PRO <img src={binoculars} id="1" alt="binoculars" className="logo-image" /></h1>
          
        </div>
        <div className="col-12">
          <h2 className="streamingtext text-center"><span className=''>Окунитесь в мир, где ценят ваши мечты. Мы станем верным путеводителем в мире выбора карьерного пути!</span></h2>
        </div>
        <div className="col-12 d-flex justify-content-center">
          <button className="btn btn-primary nav-btn py-2" onClick={() => Home3Ref.current.scrollIntoView({ behavior: 'smooth' })} >Let's start!</button>
        </div>
        <div className="col-12 col-md-6">
          <img className="img-fluid" src={starting} alt="starting" />
        </div>
        <div className="col-12 col-md-6 d-flex flex-column justify-content-center description1">
          <h2 className='font-weight-bold'>Более 600 уже существующих и новых карьерных путей</h2>
          <h2 className='font-weight-bold'>Наши отчеты помогут раскрыть ваш скрытый потенциал</h2>
          <h2 className='font-weight-bold'>Полный разбор наиболее подходящих профессий и отраслей</h2>
        </div>
          {/* <img src={star} id="2" alt="star" className="logo-image" /> */}

        <div className="col-12 col-md-4 offset-md-4 my-4">
          <div className="card card-custom p-3">
            <form onSubmit={submitHandler}>
              <h1 id="6" className="Authorize">Let's Go</h1>
              {errorMessage && <p className='text-danger'>{errorMessage}</p>}
              <div class="form-row">
                <div class="col my-3">
                  <input
                    type="email"
                    placeholder="Email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div class="col my-3">
                  <input
                    type="password"
                    placeholder="Password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div class="col mb-3 d-flex justify-content-center">
                  <button type="submit" className="btn btn-primary nav-btn my-3 py-2">Sign in</button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* <div className="Home3" ref={Home3Ref}>
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
        </div> */}
      </div>
    </div>
  );
};

export default Home
