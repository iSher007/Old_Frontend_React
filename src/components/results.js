import axios from 'axios';
import { Chart, registerables } from 'chart.js';
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Link, useParams } from 'react-router-dom';
import { BeatLoader } from "react-spinners";
import "./assets/styles/Results.css";

Chart.register(...registerables);

const Results = () => {
    const { pdfId } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [tableData, setTableData] = useState(null);
    const [filteredData, setFilteredData] = useState(null);
    const [filterTerms, setFilterTerms] = useState([]);
    const [range, setRange] = useState({ min: 0, max: 100 });
    const [selectedDomain, setSelectedDomain] = useState('');
    const [domains, setDomains] = useState([]);


    useEffect(() => {
        const fetchTableData = async () => {
            setIsLoading(true);
            const token = localStorage.getItem('access_token');
            try {
                const response = await axios.get(`https://fastapi-production-fffa.up.railway.app/Gallup/${pdfId}/pdf_similarity`, {
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
            .get(`https://fastapi-production-fffa.up.railway.app/Gallup/${pdfId}/pdf_similarities_download`, {
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
        if (tableData && tableData.length > 0) {
            const uniqueDomains = [...new Set(tableData.map(item => item.Domains))];
            setDomains(uniqueDomains);
        }
    }, [tableData]);

    useEffect(() => {
        let filtered = tableData;

        // If domain is selected, filter by domain
        if (selectedDomain) {
            filtered = filtered.filter(row => row.Domains === selectedDomain);
        }

        // Your existing filter logic
        if (filterTerms.length > 0) {
            filtered = filtered.filter(row => filterTerms.includes(row.Field));
        }

        setFilteredData(filtered);
    }, [selectedDomain, filterTerms, tableData]);

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
                backgroundColor: 'rgba(75, 192, 192, 0.6)', // Change to any color you like
            }],
        };
    };

    const chartData = calculateChartData();

    return (
        <div className="results-container">
            {isLoading ? (
                <div className="loader-container">
                    <h1>What Can You Discover Here?</h1>
                    <ul className="content-list">
                        <li><strong>PROFESSIONAL DISCOVERY:</strong> - Explore an extensive list of professions tailored to your aptitude.</li>
                        <li><strong>DEEP DIVE:</strong> - Open the links in the description to delve into each profession's details.</li>
                        <li><strong>CUSTOMIZED VIEW:</strong> - Select fields of personal interest for a customized viewing experience.</li>
                        <li><strong>RANKING INSIGHT:</strong> - Utilize our top-chart to identify the quantity of fields within a range of rankings.</li>
                    </ul>
                    <div className="loader">
                        <BeatLoader color="#4A90E2" />
                    </div>
                </div>
            ) : (
                <>
                    <div className="buttons-container">
                        <Link to={`/results_new/${pdfId}`}>
                            <button className='results-button'>Next</button>
                        </Link>
                        <button onClick={handleOpenPDF} className='results-button'>
                            Download
                        </button>
                    </div>

                    <div className="container">
                        <h1>Best Fit Career</h1>
                        <div className="domain-selection">
                            <label>Select Domain: </label>
                            <select value={selectedDomain} onChange={(e) => setSelectedDomain(e.target.value)}>
                                <option value=''>All Domains</option>
                                {domains.map(domain => (
                                    <option key={domain} value={domain}>{domain}</option>
                                ))}
                            </select>
                        </div>
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
                                                    <th>Subfield</th>
                                                    <th>Profession</th>
                                                    <th>Description</th>
                                                    <th>Fit Percentage</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredData.map((row, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{row.Field}</td>
                                                        <td>{row.Subfield}</td>
                                                        <td>{row.Professions}</td>
                                                        <td><a href={row['Links']} target="_blank" rel="noopener noreferrer">Open Link</a></td>
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

export default Results;