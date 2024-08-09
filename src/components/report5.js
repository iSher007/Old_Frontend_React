import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BeatLoader } from "react-spinners";
import "./assets/styles/Report1.css";

const Report5 = () => {
    const { pdfId } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [pdfLoaded, setPdfLoaded] = useState(false);
    const [gallupUrl, setGallupUrl] = useState('');
    const token = localStorage.getItem('access_token');

    useEffect(() => {
        axios.get(`https://fastapi-production-fffa.up.railway.app/Gallup/${pdfId}/school_reports`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                num_report: 5, // Directly sending integer 1 for num_report
            },
        })
            .then((response) => {
                // Append a timestamp to the URL as a query parameter
                setGallupUrl(`${response.data}?timestamp=${new Date().getTime()}`);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setIsLoading(false);
            });
    }, [pdfId, token]);

    const onRegenerateClick = () => {
        setIsLoading(true);  // Show the loader while regenerating
        axios.get(`https://fastapi-production-fffa.up.railway.app/Gallup/${pdfId}/school_reports?regenerate=true`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                num_report: 5, // Directly sending integer 1 for num_report
            },
        })
            .then((response) => {
                // Append a timestamp to the URL as a query parameter
                setGallupUrl(`${response.data}?timestamp=${new Date().getTime()}`);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Error regenerating report:', error);
                setIsLoading(false);
            });
    }
    return (<div className="results-container">
        <div className="report1-container">
            {isLoading ? (
                <div className="card card-custom h-100 p-3 d-flex flex-column align-items-center">
                    <h1>Потенциальные Карьерные Пути</h1>
                    <ul className="content-list">
                        <li><strong>ОТЧЕТ 1: ЛУЧШИЕ КАРЬЕРНЫЕ НАПРАВЛЕНИЯ</strong> - Исследуйте лучшие карьерные пути, соответствующие вашим уникальным сильным сторонам и интересам</li>
                        <li><strong>ОТЧЕТ 2: ТОП-5 ПРОФЕССИЙ</strong> - Проанализируйте подходящие профессии, чтобы понять, насколько они соответствуют вашим сильным сторонам </li>
                        <li><strong>ОТЧЕТ 3: ХАРАКТЕРИСТИКА ВАШЕЙ ЛИЧНОСТИ</strong> - Характеристика вашей личности на основе CliftonStrengths, MBTI и множественных интеллектов</li>
                    </ul>
                    <div className="loader">
                        <BeatLoader color="#4A90E2" />
                    </div>
                </div>
            ) : (


                <div >
                    {pdfLoaded ? null : <p>Загружаем отчет...</p>}
                    <div >
                        <object
                            data={gallupUrl}
                            type="application/pdf"
                            width="100%"
                            height="820px"
                            onLoad={() => setPdfLoaded(true)}>
                            <p>Для получения отчета:</p>
                            <p>1. Можете перезагрузить страницу через 3-4 минуты</p>
                            <p>2. Через 3-4 минуты можете нажать на эту ссылку <a href={gallupUrl} target="_blank" rel="noopener noreferrer"> что бы загрузить отчет</a>.</p>
                            <p>3. Так же можно будет скачать отчет в профиле ученика</p>
                            <p>4. Если через 7 минут ни один способ не сработал, проверьте загруженные файлы и загрузите профиль ученика заново.</p>
                            <p>Если проблема останется нерешенной, пожалуйста, обратитесь к администратору, предоставив полное описание проблемы.</p>
                        </object>
                    </div>
                </div>
            )}
            <div className="buttons-container" >
                <Link to={`/report4/${pdfId}`}>
                    <button className='btn btn-primary me-2' style={{ marginTop: '10px' }}>Back</button>
                </Link>
                <Link to={`/dashboard`}>
                    <button className='btn btn-info mx-2' style={{ marginTop: '10px' }}>Finish</button>
                </Link>
            </div>
            <div className="buttons-container-left" >
                <button onClick={onRegenerateClick} className='btn btn-danger' style={{ marginTop: '10px' }}>Regenerate</button>
            </div>
        </div>
    </div >
    );
};

export default Report5;