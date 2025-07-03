import { useState, useRef, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import "../Home/Home.css";
import "./StudyTracker.css";

const StudyTracker = () => {
    
    return (

        <div className="tracker-page-container">
            <Navbar />

            <div class="dashboard">
                <div class ="sidebar">
                    <div class="header">To-Do List</div>
                </div>

                <div class="widgets">
                <div class="widget">
                    <div class="header">Calendar</div>
                </div>
                <div class="widget">
                    <div class="header">Pomodoro</div>
                </div>
            </div>
            </div>

            <div class="main">
            </div>

            <div class="footer collapsible collapsed" id="footer">
                <div class="footer-header" id="footerHeader">Achievements + Statistics</div>
                <div class="footer-content" id="footerContent">
                    Content goes here later =u=
                </div>
            </div>

            

            <Footer />

        </div>
    );
};

export default StudyTracker;