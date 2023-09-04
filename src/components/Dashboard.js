import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./assets/styles/Dashboard.css";

const Dashboard = () => {
    const [students, setStudents] = useState([]);
    const [schools, setSchools] = useState([]);
    const [grades, setGrades] = useState([]);
    const [selectedSchool, setSelectedSchool] = useState('All');
    const [selectedGrade, setSelectedGrade] = useState('All');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('access_token');
            const response = await axios.get('https://fastapi-production-fffa.up.railway.app/Gallup/all', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const validStudents = response.data.filter(student =>
                student.Name.trim() !== '' && student.pdf_similarities.trim() !== ''
            );
            setStudents(validStudents);

            const uniqueSchools = [...new Set(validStudents.map(student => student.School))].sort();
            setSchools(['All', ...uniqueSchools]);

            const uniqueGrades = [...new Set(validStudents.map(student => student.Grade))].sort();
            setGrades(['All', ...uniqueGrades]);
        };

        fetchData();
    }, []);

    const filteredStudents = students.filter(student => {
        let matchesSchool = selectedSchool === 'All' || student.School === selectedSchool;
        let matchesGrade = selectedGrade === 'All' || student.Grade === selectedGrade;
        return matchesSchool && matchesGrade;
    }).sort((a, b) => a.Name.localeCompare(b.Name)); // sort names alphabetically

    return (
        <div className="dashboard">
            <h1> Dashboard</h1>
            <h3>Добавьте нового ученика</h3>
            <button type="submit" onClick={() => navigate('/info')}>New Student</button>
            <h3>Список прошедших систему</h3>
            <div className="filters">
                <select type="school" value={selectedSchool} onChange={e => setSelectedSchool(e.target.value)}>
                    {schools.map(school => <option key={school} value={school}>{school}</option>)}
                </select>
                <select type="grade" value={selectedGrade} onChange={e => setSelectedGrade(e.target.value)}>
                    {grades.map(grade => <option key={grade} value={grade}>{grade}</option>)}
                </select>
            </div>
            <div className="student-list">
                {filteredStudents.map(student => (
                    <div key={student._id} onClick={() => navigate(`/student_info/${student._id}`)}>
                        {student.Name}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;