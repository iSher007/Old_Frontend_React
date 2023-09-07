import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import defaultPhoto from './assets/images/photo.svg';
import './assets/styles/student_info.css';

const StudentInfo = () => {
    const [studentData, setStudentData] = useState({});
    const { pdfId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('access_token');
            const response = await axios.get(`https://fastapi-production-fffa.up.railway.app/Gallup/${pdfId}/by_id`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setStudentData(response.data);
        };

        fetchData();
    }, [pdfId]);

    return (
        <div className="student-info-container">
            <div className="student-info-header">
                <img
                    src={studentData.photo_url || defaultPhoto}
                    alt={studentData.Name || "Default student"}
                    className="student-photo"
                />                <div className="student-details">
                    <p>School: {studentData.School}</p>
                    <p>Name: {studentData.Name}</p>
                    <p>Grade: {studentData.Grade}</p>
                    <p>Date of Birth: {studentData.Date_of_birth}</p>
                </div>
            </div>
            <div className="student-info-footer">
                {studentData.pdf_similarities &&
                    <a href={studentData.pdf_similarities} download className="download-btn">Download Similarities</a>
                }
                {studentData.pdf_similarities_new &&
                    <a href={studentData.pdf_similarities_new} download className="download-btn">Download New Similarities</a>
                }
                {studentData.pdf_comment &&
                    <a href={studentData.pdf_comment} download className="download-btn">Download Comments</a>
                }
                <button type="navigate" onClick={() => navigate(`/report1/${pdfId}`)}>Go to Results</button>
            </div>
        </div>
    );
};

export default StudentInfo;