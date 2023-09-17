import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import defaultPhoto from './assets/images/photo.svg';
import './assets/styles/student_info.css';

const StudentInfo = () => {
    const [studentData, setStudentData] = useState({});
    const { pdfId } = useParams();
    const navigate = useNavigate();
    const parsedMIT = studentData.MIT ? JSON.parse(studentData.MIT) : null;
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

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
        <div className="container">
            <div className="row my-4">
                <div className="col-12 col-md-4">
                    <div className="card card-custom p-3 d-flex flex-column align-items-center">
                        <div className="d-flex flex-column align-items-center student-details">
                            <img
                                src={studentData.photo_url || defaultPhoto}
                                alt={studentData.Name || "Default student"}
                                className="img-fluid student-photo"
                            />
                            <p>School: {studentData.School}</p>
                            <p>Name: {studentData.Name}</p>
                            <p>Grade: {studentData.Grade}</p>
                            <p>Date of Birth: {studentData.Date_of_birth}</p>
                            <p>MBTI: {studentData.MBTI}</p>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-8">
                    <div className="card card-custom h-100 d-flex flex-column p-3 align-items-start">
                        <div className="d-grid gap-2">
                            <button className="btn btn-secondary" onClick={() => setIsDropdownVisible(!isDropdownVisible)}>
                                MIT &nbsp;  {isDropdownVisible ? "▲" : "▼"}
                            </button>
                            {isDropdownVisible && parsedMIT && (
                                <div className="mit-dropdown-content">
                                    {Object.entries(parsedMIT).map(([key, value]) => (
                                        <p key={key}>{key}: {value}</p>
                                    ))}
                                </div>
                            )}
                            {studentData.gallup_url &&
                                <a href={studentData.gallup_url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">View Gallup PDF</a>
                            }
                            {studentData.pdf_similarities &&
                                <a href={studentData.pdf_similarities} download className="btn btn-primary btn-block">Download Similarities</a>
                            }
                            {studentData.pdf_similarities_new &&
                                <a href={studentData.pdf_similarities_new} download className="btn btn-primary btn-block">Download New Similarities</a>
                            }
                            {studentData.pdf_comment &&
                                <a href={studentData.pdf_comment} download className="btn btn-primary btn-block">Download Comments</a>
                            }
                            <button type="button" className='btn btn-secondary' onClick={() => navigate(`/report1/${pdfId}`)}>Go to Results</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentInfo;