import React, { useState, useEffect } from 'react';
import "./Pomodoro.css";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

const Pomodoro = () => {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        let timer;
        if (isRunning && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prevTime => prevTime - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsRunning(false);
        }

        return () => clearInterval(timer);
    }, [isRunning, timeLeft]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const start25Timer = () => {
        setTimeLeft(25 * 60);
        setIsRunning(true);
    };

    const reset25Timer = () => {
        setIsRunning(false);
        setTimeLeft(25 * 60);
    };

    return (
    <div className="page-container">
        <Navbar />
        <div className="content-wrapper">
            

            <div className="description">
                <div className="desc-header">Pomodoro Study Method</div>
                <div className="desc-text">
                    The Study Tracker application leverages scheduling, prioritization, and organization
                    with the proven Pomodoro study method to maximize the efficacy of your study time.
                </div>
            </div>

            <div className="timer-container">
                <div className="timer-box">
                    <div className="timer-display">{formatTime(timeLeft)}</div>
                    <div className="timer-buttons">
                        <button onClick={start25Timer} disabled={isRunning}>Start 25-min Timer</button>
                        <button onClick={reset25Timer}>Reset</button>
                    </div>
                </div>
                <div className="timer-box">
                    <div className="timer-display">{formatTime(timeLeft)}</div>
                    <div className="timer-buttons">
                        <button onClick={start25Timer} disabled={isRunning}>Start 25-min Timer</button>
                        <button onClick={reset25Timer}>Reset</button>
                    </div>
                </div>
            </div>

        </div>

        <Footer />
    </div>
    );
}

export default Pomodoro;

// return (
//     <div className="page-container">
//       <Navbar />

//       <div className="content-wrapper">
//         <div className="signin-box">
//           <h2>Welcome Back!</h2>
//           <form onSubmit={handleSubmit}>
//             <div className="mb-3">
//               <label htmlFor="email"><strong>Email</strong></label>
//               <input
//                 type="text"
//                 placeholder="Enter Email"
//                 autoComplete="off"
//                 name="email"
//                 className="form-control rounded-0"
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//             </div>
//             <div className="mb-3">
//               <label htmlFor="password"><strong>Password</strong></label>
//               <input
//                 type="password"
//                 placeholder="Enter Password"
//                 name="password"
//                 className="form-control rounded-0"
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//             </div>
//             <button type="submit" className="btn btn-success w-100 rounded-0">
//               Sign In
//             </button>
//           </form>
//           <p className="mt-3">Don't have an account?</p>
//           <Link to="/register" className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">
//             Register
//           </Link>
//         </div>
//       </div>

//       <Footer />
//     </div>
//   );