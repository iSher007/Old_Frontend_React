import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./assets/styles/Chatbot.css";

const Chatbot = () => {
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const sendMessage = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`https://frontend-path.vercel.app/Gallup/pdf_bot`, {
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
        navigate(`/chatbot`);
    };

    return (
        <div className="container">
            <div className="row">
                {/* <div className="col-12">
                    <Link to={`/dashboard`}>
                        <button type='button' className='btn btn-success'>Dashboard</button>
                    </Link>

                </div> */}
                <div className="col-12 my-3">
                    <div className="card card-custom p-3">
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
                                className="form-control"
                            />
                            <button type="submit" disabled={isLoading} className="btn btn-success">
                                Send
                            </button>
                            <button type="button" onClick={handleNextQuestion} disabled={isLoading} className="btn btn-danger ms-2">
                                Clear
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chatbot