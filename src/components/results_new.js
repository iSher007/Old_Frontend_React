import axios from 'axios';
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Link, useParams } from 'react-router-dom';
import { BeatLoader } from "react-spinners";
import "./assets/styles/Results_new.css";

const Results_new = () => {
    const { pdfId } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [tableData, setTableData] = useState(null);
    const [filteredData, setFilteredData] = useState(null);
    const [filterTerms, setFilterTerms] = useState([]);
    const [range, setRange] = useState({ min: 0, max: 100 });

    useEffect(() => {
        const fetchTableData = async () => {
            setIsLoading(true);
            const token = localStorage.getItem('access_token');
            try {
                const response = await axios.get(`https://fastapi-production-fffa.up.railway.app/Gallup/${pdfId}/pdf_similarity_new`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = response.data;
                setTableData(data);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
                setIsLoading(false);
            }
        };

        fetchTableData();
    }, [pdfId]);

    const handleOpenPDF = () => {
        const token = localStorage.getItem('access_token');

        axios
            .get(`https://fastapi-production-fffa.up.railway.app/Gallup/${pdfId}/pdf_similarities_download_new`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                window.open(response.data, '_blank');
            })
            .catch((error) => {
                console.error(error);
            });
    };

    useEffect(() => {
        if (filterTerms.length === 0) {
            setFilteredData(tableData);
        } else {
            const filtered = tableData.filter(row => filterTerms.includes(row.Field));
            setFilteredData(filtered);
        }
    }, [filterTerms, tableData]);

    const handleFilterChange = (field) => {
        const newFilterTerms = [...filterTerms];

        if (filterTerms.includes(field)) {
            const index = newFilterTerms.indexOf(field);
            newFilterTerms.splice(index, 1);
        } else {
            newFilterTerms.push(field);
        }

        setFilterTerms(newFilterTerms);
    };

    const fieldOptions = Array.isArray(tableData) ? [...new Set(tableData.map(item => item.Field))] : [];
    const half = Math.ceil(fieldOptions.length / 2);
    const firstHalfOptions = fieldOptions.splice(0, half);
    const secondHalfOptions = fieldOptions.splice(-half);

    const handleRangeChange = (boundary, value) => {
        setRange(prevRange => ({
            ...prevRange,
            [boundary]: Number(value),
        }));
    };

    const calculateChartData = () => {
        if (!tableData) {
            return {
                labels: [],
                datasets: [],
            };
        }

        const filteredData = tableData.filter(data => {
            const place = Number(data.Place);
            return place >= range.min && place <= range.max;
        });

        const fieldCounts = filteredData.reduce((counts, data) => {
            counts[data.Field] = (counts[data.Field] || 0) + 1;
            return counts;
        }, {});

        return {
            labels: Object.keys(fieldCounts),
            datasets: [{
                label: 'Number of Fields',
                data: Object.values(fieldCounts),
                backgroundColor: 'rgba(143, 75, 192, 0.6)', // Change to any color you like
            }],
        };
    };

    const chartData = calculateChartData();

    return (
        <div className="results-container">
            {isLoading ? (
                <div className="loader-container">
                    <h1>What's Emerging in Your Future?</h1>
                    <ul className="content-list">
                        <li><strong>FUTURE PROFESSIONS:</strong> Discover the latest professions on the horizon, based on your skills and aptitude.</li>
                        <li><strong>EXPLORATION PATHWAYS:</strong> Explore new professions, understanding their requirements and the paths to excel in them.</li>
                        <li><strong>PERSONALIZED DISCOVERY:</strong> Personalize your exploration by selecting fields of interest that capture your curiosity.</li>
                        <li><strong>EMERGING TRENDS:</strong> Use our top-chart to discern the popularity of these emerging fields within ranking ranges.</li>
                    </ul>
                    <div className="loader">
                        <BeatLoader color="#4A90E2" />
                    </div>
                </div>
            ) : (
                <>
                    <div className="buttons-container">
                        <Link to={`/results_pdf/${pdfId}`}>
                            <button className='results-button'>Next</button>
                        </Link>
                        <button onClick={handleOpenPDF} className='results-button'>
                            Download
                        </button>
                        <Link to={`/results/${pdfId}`}>
                            <button type='submit' className='results-button'>Back</button>
                        </Link>
                    </div>
                    <div className="container">
                        <h1>New Professions and Competencies</h1>
                    </div>
                    <div className="results-main">
                        <div>
                            <h3>Select the fields of interest </h3>
                            <div className="filter-input">
                                <div className="checkbox-column">
                                    {firstHalfOptions.map(field => (
                                        <div key={field}>
                                            <input
                                                type="checkbox"
                                                id={`checkbox-${field}`}
                                                checked={filterTerms.includes(field)}
                                                onChange={() => handleFilterChange(field)}
                                            />
                                            <label htmlFor={`checkbox-${field}`}>{field}</label>
                                        </div>
                                    ))}
                                </div>

                                <div className="checkbox-column">
                                    {secondHalfOptions.map(field => (
                                        <div key={field}>
                                            <input
                                                type="checkbox"
                                                id={`checkbox-${field}`}
                                                checked={filterTerms.includes(field)}
                                                onChange={() => handleFilterChange(field)}
                                            />
                                            <label htmlFor={`checkbox-${field}`}>{field}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="results-main2">
                        <h3>Examine fields within the defined range</h3>
                        <div className="range-inputs">
                            <label>
                                Min Place:
                                <input type="number" value={range.min} onChange={e => handleRangeChange('min', e.target.value)} />
                            </label>
                            <label>
                                Max Place:
                                <input type="number" value={range.max} onChange={e => handleRangeChange('max', e.target.value)} />
                            </label>
                        </div>
                        <div className="chart-container">
                            <Bar data={chartData} />
                        </div>
                    </div>
                    <div className="container-text1">
                        <div className="results-main1">
                            {isLoading ? (
                                <p>Loading...</p>
                            ) : (
                                <>
                                    {Array.isArray(filteredData) && filteredData.length > 0 ? (
                                        <table className="results-table">
                                            <thead>
                                                <tr>
                                                    <th>Place</th>
                                                    <th>Field</th>
                                                    <th>Profession</th>
                                                    <th>Year of appearance</th>
                                                    <th>Description</th>
                                                    <th>Fit Percentage</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredData.map((row, index) => (
                                                    <tr key={index}>
                                                        <td>{row.Place}</td>
                                                        <td>{row.Field}</td>
                                                        <td>{row.Professions}</td>
                                                        <td>{row['Year of appearance']}</td>
                                                        <td><a href={row['Description link']} target="_blank" rel="noopener noreferrer">Open Link</a></td>
                                                        <td>{row['Percentage fitting']}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <p>No table data available.</p>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};



export default Results_new;