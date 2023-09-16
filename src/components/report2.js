import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BeatLoader } from "react-spinners";
import "./assets/styles/Report1.css";

const Report2 = () => {
    const { pdfId } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [pdfLoaded, setPdfLoaded] = useState(false);
    const [gallupUrl, setGallupUrl] = useState('');
    const token = localStorage.getItem('access_token');

    useEffect(() => {
        axios.get(`http://localhost:8000/Gallup/${pdfId}/report1`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                setGallupUrl(response.data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setIsLoading(false);
            });
    }, [pdfId, token]);

    return (<div className="results-container">
        <div className="report1-container">
            {isLoading ? (
                <div className="loader-container">
                    <h1>Unlock Your Potential with Personalized Insights</h1>
                    <ul className="content-list">
                        <li><strong>REPORT 1: YOUR PERSONALITY</strong> - Pesronality analysis based on CliftonStrengths, MBTI, and Multiple Intelligences </li>
                        <li><strong>REPORT 2: BEST CAREER FIELDS</strong> - Explore top career paths aligned with your unique strengths and interests </li>
                        <li><strong>REPORT 3: TOP 5 PROFESSIONS</strong> - Analyze your chosen professions to understand their fit with your strengths </li>
                    </ul>
                    <div className="loader">
                        <BeatLoader color="#4A90E2" />
                    </div>
                </div>
            ) : (


                <div>
                    {pdfLoaded ? null : <p>Loading PDF...</p>}
                    <object
                        data={gallupUrl}
                        type="application/pdf"
                        width="100%"
                        height="820px"
                        onLoad={() => setPdfLoaded(true)}>
                        <p>If the PDF does not load, you can <a href={gallupUrl} target="_blank" rel="noopener noreferrer">click here to download it</a>.</p>
                    </object>
                </div>
            )}
            <div className="buttons-container" >
                <Link to={`/report3/${pdfId}`}>
                    <button className='btn btn-primary me-2' style={{ marginTop: '10px' }}>Next</button>
                </Link>
                <Link to={`/report1/${pdfId}`}>
                    <button className='btn btn-info mx-2' style={{ marginTop: '10px' }}>Back</button>
                </Link>
            </div>
        </div>
    </div>
    );
};

export default Report2;