import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import "./assets/styles/Upload.css";

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
    const { pdfId } = useParams();
    const [file, setFile] = useState(null);
    const [mbti, setMbti] = useState('');
    const [mitInput, setMitInput] = useState(
        MIT_FIELDS.reduce((prev, field) => ({ ...prev, [field]: '' }), {})
    );
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [shouldRedirect, setShouldRedirect] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (shouldRedirect && pdfId) {
            navigate(`/results/${pdfId}`);
        }
    }, [shouldRedirect, pdfId, navigate]);

    const submitHandler = (e) => {
        e.preventDefault();

        if (!file || !mbti || Object.values(mitInput).some(val => val === '')) {
            setErrorMessage('Please select a file and enter your MBTI and MIT results');
            return;
        }

        setIsLoading(true);
        setErrorMessage('');

        const formData = new FormData();
        formData.append('pdf_id', pdfId);
        formData.append('file', file);
        formData.append('MBTI', mbti);
        formData.append('MIT', JSON.stringify(mitInput));

        const token = localStorage.getItem('access_token');

        axios.post(`https://fastapi-production-fffa.up.railway.app/Gallup/${pdfId}/pdf`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        })
            .then((res) => {
                console.log(res.data);
                setShouldRedirect(true);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setIsLoading(false);
                setErrorMessage(err.response && err.response.data.detail ? err.response.data.detail : 'Error processing the file. Please upload another file.');
            });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
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
            <h1 className="container-upload-logo">Загрузите результаты ваших тестов</h1>
            <h4>При необходимости щелкните на названиях тестов, чтобы перейти на их веб-сайты.</h4>
            <form onSubmit={submitHandler}>

                <div className="container-upload-text">
                    <a href="https://www.gallup.com/home.aspx" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}><strong>Загрузите ваш результат Gallup теста</strong></a>
                </div>
                <div>
                    <input type="file" accept=".pdf" onChange={handleFileChange} />
                </div>
                <div className="container-upload-text">
                    <a href="https://www.16personalities.com/free-personality-test" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}><strong>Результаты индикатора Майерс-Бриггс</strong></a>
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
                    <a href="https://www.idrlabs.com/multiple-intelligences/test.php" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}> <strong>Результаты теста на тип интеллекта</strong></a>
                </div>
                {
                    MIT_FIELDS.map(field => (
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
                    ))
                }
                <div className='upload-button'>
                    <button type="submit" disabled={isLoading} style={{ marginTop: '10px' }}>
                        {isLoading ? 'Загрузка...' : 'Загрузить'}
                    </button>
                </div>
            </form >
            {errorMessage && <p>{errorMessage}</p>}
        </div >
    );
};

export default Upload;
