import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./assets/styles/Info.css";

const Info = () => {
    const [photo, setPhoto] = useState(null);
    const [School, setSchool] = useState('');
    const [Name, setName] = useState('');
    const [Grade, setGrade] = useState('');
    const [Date_of_birth, setDateOfBirth] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [shouldRedirect, setShouldRedirect] = useState(false);
    const [pdfId, setPdfId] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (shouldRedirect && pdfId) {
            navigate(`/upload/${pdfId}`);
        }
    }, [shouldRedirect, pdfId, navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();

        // Removed the photo from this check since it's optional now
        if (!School || !Name || !Grade || !Date_of_birth) {
            setErrorMessage('Please fill all the fields');
            return;
        }

        setIsLoading(true);
        setErrorMessage('');

        const formData = new FormData();

        // Only append the photo if it's present
        if (photo) {
            formData.append('photo', photo);
        }
        formData.append('School', School);
        formData.append('Name', Name);
        formData.append('Grade', Grade);
        formData.append('Date_of_birth', Date_of_birth);

        const token = localStorage.getItem('access_token');

        try {
            const response = await axios.post('https://fastapi-production-fffa.up.railway.app/Gallup/info', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data && response.data._id) {
                setPdfId(response.data._id);
                setShouldRedirect(true);
            }
        } catch (error) {
            console.error("Error while uploading the info:", error);
            if (error.response && error.response.data) {
                // You can further refine this to display error messages from the backend
                setErrorMessage(`Error: ${error.response.data.detail || 'Error uploading the info.'}`);
            } else {
                setErrorMessage('Error uploading the info.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handlePhotoChange = (e) => {
        setPhoto(e.target.files[0]);
    };

    const handleNameChange = (e) => {
        setName(e.target.value);
        setErrorMessage('');
    };

    const handleGradeChange = (e) => {
        setGrade(e.target.value);
        setErrorMessage('');
    };

    const handleSchoolChange = (e) => {
        setSchool(e.target.value);
        setErrorMessage('');
    };

    const handleDateOfBirthChange = (e) => {
        setDateOfBirth(e.target.value);
        setErrorMessage('');
    };


    return (
        <div className="container-upload">
            <h1>Информация о вас</h1>
            <form onSubmit={submitHandler}>
                <div className="container-upload-text">
                    <strong>Дата вашего рождения</strong>
                </div>
                <div>
                    <input
                        type="date"
                        placeholder="Gallup Test Date"
                        value={Date_of_birth}
                        onChange={handleDateOfBirthChange}
                    />
                </div>
                <div className="container-upload-text">
                    <strong>Загрузите ваше фото</strong>
                </div>
                <div>
                    <input type="file" accept=".png" onChange={handlePhotoChange} />
                </div>

                <div className="container-upload-text">
                    <strong>Ваша школа</strong>
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Ex. Тамос"
                        value={School}
                        onChange={handleSchoolChange}
                    />
                </div>
                <div className="container-upload-text">
                    <strong>Ваше имя</strong>
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Ex. Асет Кабдиев"
                        value={Name}
                        onChange={handleNameChange}
                    />
                </div>

                <div className="container-upload-text">
                    <strong>Ваш класс</strong>
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Ex. 10 А"
                        value={Grade}
                        onChange={handleGradeChange}
                    />
                </div>

                <div>
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? 'Uploading...' : 'Submit'}
                    </button>
                </div>
            </form>
            {errorMessage && <p>{errorMessage}</p>}
        </div>
    );
};

export default Info;