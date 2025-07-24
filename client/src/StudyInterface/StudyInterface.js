import { useState, useEffect } from "react";
import axios from "axios";
import NavUser from "../NavUser/NavUser";
import Footer from "../Footer/Footer";
import "../Home/Home.css";
import "./StudyInterface.css";

const StudyTracker = () => {
    const [showAchievements, setShowAchievements] = useState(false);
    const toggleAchievements = () => setShowAchievements(prev => !prev);

    const [expandedCourseId, setExpandedCourseId] = useState(null);
    const [courses, setCourses] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState(null);

    const [draggedTaskInfo, setDraggedTaskInfo] = useState(null); // { folderId, taskIndex }
    const [draggedCourseIndex, setDraggedCourseIndex] = useState(null);

    const [showAddMenu, setShowAddMenu] = useState(false);
    const [showCourseForm, setShowCourseForm] = useState(false);
    const [showTaskForm, setShowTaskForm] = useState(false);

    const [newCourseNumber, setNewCourseNumber] = useState("");



    const [newCourseColor, setNewCourseColor] = useState("#ffb3b3");
    const [newCourseName, setNewCourseName] = useState("");
    const [newTask, setNewTask] = useState("");
    const [editIndex, setEditIndex] = useState(null);
    const [taskDeadline, setTaskDeadline] = useState("");
    const [taskStartDate, setTaskStartDate] = useState("");


    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) return; // or redirect to /signin

        axios.get("http://localhost:5000/courses", {
            headers: { Authorization: `Bearer ${token}` }
  })
        .then(res => {
            setCourses(res.data.map(c => ({
                id:     c._id,
                number: c.number,
                name:   c.name,
                color:  "#ffb3b3",
                tasks:  []
    })));
  })
        .catch(err => console.error("Load courses failed", err));
}, []);


    const calculateProgress = (startDate, deadline) => {
        const start = new Date(startDate);
        const end = new Date(deadline);
        const now = new Date();

        if (now >= end) return 100;
        if (now <= start) return 0;

        const totalMs = end - start;
        const elapsedMs = now - start;

        return Math.min(100, Math.round((elapsedMs / totalMs) * 100));
    };

    const getDaysLeft = (deadline) => {
        if (!deadline) return "";

        const [year, month, day] = deadline.split("-").map(Number);
        const dueDate = new Date(year, month - 1, day);
        const today = new Date();
        const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        const timeDiff = dueDate.getTime() - todayDate.getTime();
        const dayDiff = Math.round(timeDiff / (1000 * 60 * 60 * 24));

        if (dayDiff < 0) return "Overdue";
        if (dayDiff === 0) return "Due today";
        if (dayDiff === 1) return "Due tomorrow";
        return `${dayDiff} days left`;
    };
    
    
  const createCourse = () => {
  if (!newCourseNumber.trim() || !newCourseName.trim()) return;

  const token = localStorage.getItem("accessToken");
  axios.post(
    "http://localhost:5000/courses",
    {
      number: newCourseNumber.trim(),
      name:   newCourseName.trim()
    },
    { headers: { Authorization: `Bearer ${token}` } }
  )
  .then(res => {
    const c = res.data;
    setCourses(cs => [
      ...cs,
      { id: c._id, number: c.number, name: c.name, color: newCourseColor, tasks: [] }
    ]);
    // reset form
    setNewCourseNumber("");
    setNewCourseName("");
    setNewCourseColor("#ffb3b3");
    setShowCourseForm(false);
  })
  .catch(console.error);
};







    const addTask = () => {
        if (!newTask.trim() || !selectedCourseId) return;

        setCourses(courses.map(course => {
            if (course.id === selectedCourseId) {
                const updatedTasks = [...course.tasks];

                if (editIndex !== null) {
                    updatedTasks[editIndex] = {
                        ...updatedTasks[editIndex],
                        text: newTask,
                        deadline: taskDeadline,
                        startDate: taskStartDate || updatedTasks[editIndex].startDate
                    };
                } else {
                    updatedTasks.push({
                        text: newTask,
                        completed: false,
                        startDate: taskStartDate || new Date().toISOString(),
                        deadline: taskDeadline
                    });
                }

                return { ...course, tasks: updatedTasks };
            }
            return course;
        }));

        setNewTask("");
        setEditIndex(null);
        setTaskDeadline("");
        setTaskStartDate("");
        setShowTaskForm(false);
    };

    const toggleComplete = (courseId, index) => {
        setCourses(prev =>
            prev.map(course =>
                course.id === courseId
                    ? {
                        ...course,
                        tasks: course.tasks.map((task, i) =>
                            i === index ? { ...task, completed: !task.completed } : task
                        ),
                    }
                    : course
            )
        );
    };

    const editTask = (courseId, index) => {
        const course = courses.find(c => c.id === courseId);
        if (!course) return;
        setNewTask(course.tasks[index].text);
        setTaskDeadline(course.tasks[index].deadline || "");
        setTaskStartDate(course.tasks[index].startDate || "");
        setEditIndex(index);
        setSelectedCourseId(courseId);
        setShowTaskForm(true);
    };

    const deleteTask = (courseId, index) => {
        setCourses(prev =>
            prev.map(course =>
                course.id === courseId
                    ? {
                        ...course,
                        tasks: course.tasks.filter((_, i) => i !== index),
                    }
                    : course
            )
        );
    };

    return (
        <div className="page-container">
            <NavUser />

            <div className="dashboard">
                <div className="sidebar">
                    <div className="header">
                        To-Do List
                        <button className="add-toggle" onClick={() => setShowAddMenu(!showAddMenu)}>+</button>
                        {showAddMenu && (
                            <div className="add-dropdown">
                                <div onClick={() => { setShowCourseForm(true); setShowTaskForm(false); setShowAddMenu(false); }}>
                                    📁 Add Course
                                </div>
                                <div onClick={() => { setShowTaskForm(true); setShowCourseForm(false); setShowAddMenu(false); }}>
                                    ➕ Add Task
                                </div>
                            </div>
                        )}
                    </div>

                    {showTaskForm && selectedCourseId && (
                        <div className="todo-input">
                            <input
                                type="text"
                                placeholder="Add a task..."
                                value={newTask}
                                onChange={(e) => setNewTask(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && addTask()}
                            />
                            <input
                                type="date"
                                value={taskStartDate}
                                onChange={(e) => setTaskStartDate(e.target.value)}
                                placeholder="Start date"
                            />
                            <input
                                type="date"
                                value={taskDeadline}
                                onChange={(e) => setTaskDeadline(e.target.value)}
                                placeholder="Deadline"
                            />
                            <button onClick={addTask}>Add</button>
                        </div>
                    )}

                    {showCourseForm && (
                        <div className="course-form">
                            <input
                                type ="text"
                                placeholder="Course number"
                                value={newCourseNumber}
                                onChange={e => setNewCourseNumber(e.target.value)}
                            />

                            <input
                                type="text"
                                placeholder="Course name"
                                value={newCourseName}
                                onChange={(e) => setNewCourseName(e.target.value)}
                            />
                            <input
                                type="color"
                                value={newCourseColor}
                                onChange={(e) => setNewCourseColor(e.target.value)}
                            />
                            <button 
                                onClick={createCourse}
                               /* onClick={() => {
                                    if (!newCourseName.trim()) return;
                                    const newCourse = {
                                        id: Date.now(),
                                        name: newCourseName.trim(),
                                        color: newCourseColor,
                                        tasks: []
                                    };
                                    setCourses([...courses, newCourse]);
                                    setNewCourseName("");
                                    setNewCourseColor("#ffb3b3");
                                    setShowCourseForm(false);
                                }}*/
                            >
                                Create
                            </button>
                        </div>
                    )}

                    <ul className="Course-list">
                        {courses.map((course, courseIndex) => (
                            <li
                                key={course.id}
                                className="course-item"
                                draggable
                                onDragStart={() => setDraggedCourseIndex(courseIndex)}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    if (draggedCourseIndex === null || draggedCourseIndex === courseIndex) return;

                                    const bounding = e.currentTarget.getBoundingClientRect();
                                    const offset = e.clientY - bounding.top;
                                    const dropBefore = offset < bounding.height / 2;
                                    const newIndex = dropBefore ? courseIndex : courseIndex + 1;

                                    const updated = [...courses];
                                    const [moved] = updated.splice(draggedCourseIndex, 1);

                                    // Adjust newIndex if moving forward in the list
                                    const adjustedIndex = newIndex > draggedCourseIndex ? newIndex - 1 : newIndex;

                                    updated.splice(adjustedIndex, 0, moved);

                                    setCourses(updated);
                                    setDraggedCourseIndex(null);
                                }}
                                onDragEnd={() => setDraggedCourseIndex(null)}
                            >
                                <div
                                    className="course-header"
                                    onClick={() => {
                                        setExpandedCourseId(prev => prev === course.id ? null : course.id);
                                        setSelectedCourseId(course.id);
                                    }}
                                    style={{
                                        backgroundColor: course.id === expandedCourseId ? "#e3f2fd" : "#f5f5f5",
                                        borderLeft: `10px solid ${course.color}`,
                                    }}
                                >
                                    {course.number} - {course.name}
                                </div>

                                {expandedCourseId === course.id && (
                                    <ul className="todo-list">
                                        {course.tasks.map((task, index) => (
                                            <li
                                                key={index}
                                                className={task.completed ? "completed" : ""}
                                                style={{ borderLeft: `6px solid ${course.color}` }}
                                                draggable
                                                onDragStart={() => setDraggedTaskInfo({ courseId: course.id, taskIndex: index })}
                                                onDragOver={(e) => e.preventDefault()}
                                                onDrop={(e) => {
                                                    e.preventDefault();
                                                    if (!draggedTaskInfo) return;

                                                    const bounding = e.currentTarget.getBoundingClientRect();
                                                    const offset = e.clientY - bounding.top;
                                                    const dropBefore = offset < bounding.height / 2;
                                                    const newIndex = dropBefore ? index : index + 1;

                                                    setCourses(prevCourses => {
                                                        // Clone the entire folders array
                                                        const updatedCourses = prevCourses.map(c => ({
                                                            ...c,
                                                            tasks: [...c.tasks]
                                                        }));

                                                        const sourceCourse = updatedCourses.find(c => c.id === draggedTaskInfo.courseId);
                                                        const targetCourse = updatedCourses.find(c => c.id === course.id);

                                                        if (!sourceCourse || !targetCourse) return prevCourses;

                                                        // Remove the moved task from the source folder tasks
                                                        const [movedTask] = sourceCourse.tasks.splice(draggedTaskInfo.taskIndex, 1);

                                                        // Adjust insertion index if moving down within the same folder
                                                        let adjustedIndex = newIndex;
                                                        if (course.id === draggedTaskInfo.courseId && newIndex > draggedTaskInfo.taskIndex) {
                                                            adjustedIndex = newIndex - 1;
                                                        }

                                                        // Insert moved task at the new index in target course
                                                        targetCourse.tasks.splice(adjustedIndex, 0, movedTask);

                                                        return updatedCourses;
                                                    });

                                                    setDraggedTaskInfo(null);
                                                }}
                                                onDragEnd={() => setDraggedTaskInfo(null)}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={task.completed}
                                                    onChange={() => toggleComplete(course.id, index)}
                                                />
                                                <span>{task.text}</span>
                                                {task.deadline && task.startDate && (
                                                    <div className="progress-wrapper">
                                                        <div className="progress-container">
                                                            <div
                                                                className="progress-bar"
                                                                style={{ width: `${calculateProgress(task.startDate, task.deadline)}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className="due-date-label">{getDaysLeft(task.deadline)}</span>
                                                    </div>
                                                )}
                                                <div className="task-buttons">
                                                    <button onClick={() => editTask(course.id, index)}>✏️</button>
                                                    <button onClick={() => deleteTask(course.id, index)}>❌</button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="middle-column">
                    <div className="image-container"></div>
                    <div className="achievements-bar" onClick={toggleAchievements}>
                        Achievements + Statistics
                    </div>
                    {showAchievements && (
                        <div className="achievements-content">
                            <p>⭐ You completed 3 Pomodoros today!</p>
                            <p>📈 Your focus time increased by 12%</p>
                        </div>
                    )}
                </div>

                <div className="widgets">
                    <div className="widget calendar-widget">
                        <div className="header">Calendar</div>
                    </div>
                    <div className="widget pomodoro-widget">
                        <div className="header">Pomodoro</div>
                    </div>
                </div>
            </div>

            {/* <div className="main"></div> */}
            <Footer />
        </div>
        
    );
};

export default StudyTracker;