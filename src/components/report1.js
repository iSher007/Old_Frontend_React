import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BeatLoader } from "react-spinners";
import "./assets/styles/Report1.css";

const Report1 = () => {
    const { pdfId } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [pdfLoaded, setPdfLoaded] = useState(false);
    const [gallupUrl, setGallupUrl] = useState('');
    const token = localStorage.getItem('access_token');

    useEffect(() => {
        axios.get(`https://fastapi-production-fffa.up.railway.app/Gallup/${pdfId}/pdf_gallup`, {
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
                    <BeatLoader color="#4A90E2" />
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
            <div className="buttons-container">
                <Link to={`/results/${pdfId}`}>
                    <button className='results-button'>Next</button>
                </Link>

            </div>
        </div>
    </div>
    );
};

export default Report1;