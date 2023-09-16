import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BeatLoader } from "react-spinners";
import "./assets/styles/Results_pdf.css";

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
        <div className="container">
            <div className="row">
                {isLoading ? (
                    <div className="col-12 my-2">
                        <div className="card card-custom h-100 p-3 d-flex flex-column align-items-center">
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
                    </div>
                ) : (
                    <>
                        <div className="col-12 my-3 text-center">
                            <div className="card card-custom h-100 p-3">
                                <select value={selectedOption} onChange={handleSelectionChange} className="form-control">
                                    <option value="content1">REPORT 1: EXPLORE YOUR PERSONALITY</option>
                                    <option value="content2">REPORT 2: BEST CAREER FIELDS</option>
                                    <option value="content3">REPORT 3: TOP 5 PROFESSIONS</option>
                                </select>
                                <div className="col-12 mt-3">
                                    <button onClick={handleOpenPDF} className='btn btn-success mx-2'>
                                        Download
                                    </button>
                                    <Link to={`/results_new/${pdfId}`}>
                                        <button className='btn btn-info mx-2'>Back</button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        
                        <div className="col-12 my-2">
                            <div className="card card-custom h-100 p-3 container-text">
                                <h1 className='fw-bold'>Open AI analysis</h1>
                                {isLoading ? (
                                    <p className=''>Loading...</p>
                                ) : (
                                    renderSelectedContent()
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ResultsPdf