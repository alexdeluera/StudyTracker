import React, { useState, useRef, useEffect } from 'react';
import "./Home.css";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

const Home = () => {

    // create a state variable that will contain the backend data retreived from backend API
    const [backendData, setBackendData] = useState([{}])
    useEffect(() => {
        fetch("/api").then(
            response => response.json()
        ).then(
            data => {
                setBackendData(data)
            }
        )
    }, [])

    return (

        <div className="home-page-container">
            <Navbar />

            <div className="description">
                <div className="desc-header">Study Tracker</div>
                <div className="desc-text">The Study Tracker application leverages scheduling, prioritization, and organization with the proven Pomodoro study method to maximize the efficacy of your study time.</div>
                {/* <div className="desc-text">
                    {(typeof backendData.users === 'undefined') ? (<p>Loading...</p>)
                        : (
                            backendData.users.map((user, i) => (
                                <p key={i}>{user}</p>
                            ))
                        )}
                </div> */}
            </div>

            <div className="home-picture">
                <img src="main_pomodoro.png" alt="bolCover" className="" id="heroImage" />
            </div>



            <Footer />

        </div>
    );
};

export default Home;