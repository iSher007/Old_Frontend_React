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
  // const KeyFeaturesRef = useRef(null);
  // const Startbutton = useRef(null);
  // const Description1 = useRef(null);
  // const Description2 = useRef(null);

  // const [isVisibleHome3, setIsVisibleHome3] = useState(false);
  // const [isVisibleKeyFeatures, setIsVisibleKeyFeatures] = useState(false);
  // const [isVisibleStartbutton, setIsVisibleStartbutton] = useState(false);
  // const [isVisibleDescription1, setIsVisibleDescription1] = useState(false);
  // const [isVisibleDescription2, setIsVisibleDescription2] = useState(false);
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

  // const checkVisibility = (ref, setIsVisible) => {
  //   if (!ref.current) {
  //     return;
  //   }
  //   const rect = ref.current.getBoundingClientRect();
  //   if (rect.top <= window.innerHeight && rect.bottom) {
  //     setIsVisible(true);
  //   } else {
  //     setIsVisible(false);
  //   }
  // };

  // useEffect(() => {
  //   const checkScroll = () => {
  //     checkVisibility(Home3Ref, setIsVisibleHome3);
  //     checkVisibility(KeyFeaturesRef, setIsVisibleKeyFeatures);
  //     checkVisibility(Startbutton, setIsVisibleStartbutton)
  //     checkVisibility(Description1, setIsVisibleDescription1)
  //     checkVisibility(Description2, setIsVisibleDescription2)
  //   };

  //   window.addEventListener('scroll', checkScroll);
  //   return () => window.removeEventListener('scroll', checkScroll);
  // }, []);


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

        {/* <div className="Home2">

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
        </div> */}
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

        {/* {isVisibleStartbutton && (
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
        )} */}
      </Xwrapper>

    </div >
  );
};

export default Home
