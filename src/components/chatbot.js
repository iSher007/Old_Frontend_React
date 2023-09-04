import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import "./assets/styles/Chatbot.css";

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
                    <button type='submit' className='results-button'>Back</button>
                </Link>
                <Link to={`/dashboard`}>
                    <button type='submit' className='results-button'>Dashboard</button>
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
                        Clear
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chatbot