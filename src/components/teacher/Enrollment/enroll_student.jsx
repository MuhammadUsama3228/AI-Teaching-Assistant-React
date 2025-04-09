import React, { useEffect, useState } from 'react';
import api from '../../../api'; // Ensure you're importing your configured axios instance

const CourseEnrollmentPage = () => {
    const [email, setEmail] = useState('');
    const [studentEmails, setStudentEmails] = useState([]); // State to hold student emails
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedStudentEmail, setSelectedStudentEmail] = useState(''); // State to hold selected student email
    const [enrollmentMessage, setEnrollmentMessage] = useState('');
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(''); // Error state

    useEffect(() => {
        const fetchProfileAndCourses = async () => {
            try {
                const [profileResponse, coursesResponse, studentsResponse] = await Promise.all([
                    api.get('/api/manage_profile/'),
                    api.get('/api/courses/course/'),
                    api.get('/api/users/students/'), // Fetching all student emails
                ]);
                setEmail(profileResponse.data.email);
                setCourses(coursesResponse.data);
                setStudentEmails(studentsResponse.data); // Set the student emails
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to fetch data. Please try again later.');
            } finally {
                setLoading(false); // End loading state
            }
        };

        fetchProfileAndCourses();
    }, []);

    const handleEnrollment = async () => {
        if (!selectedCourse || !selectedStudentEmail) {
            setEnrollmentMessage('Please select a course and a student to enroll.');
            return;
        }

        try {
            await api.post('/api/enrollment/', {
                email: selectedStudentEmail, // Use the selected student email
                course: selectedCourse,
            });
            setEnrollmentMessage('Successfully enrolled in the course!');
            setSelectedCourse(''); // Reset the selection after successful enrollment
            setSelectedStudentEmail(''); // Reset selected student email
        } catch (error) {
            console.error('Error enrolling in course:', error);
            setEnrollmentMessage('Failed to enroll in the course. Please try again.');
        }
    };

    if (loading) {
        return <p>Loading...</p>; // Loading message
    }

    return (
        <div>
            <h1>Course Enrollment</h1>
            <p>Email: {email}</p>

            <label htmlFor="students">Select a Student Email:</label>
            <select
                id="students"
                value={selectedStudentEmail}
                onChange={(e) => setSelectedStudentEmail(e.target.value)}
            >
                <option value="">--Select a Student Email--</option>
                {studentEmails.map((student) => (
                    <option key={student.id} value={student.email}>
                        {student.email}
                    </option>
                ))}
            </select>

            <label htmlFor="courses">Select a Course:</label>
            <select
                id="courses"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
            >
                <option value="">--Select a Course--</option>
                {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                        {course.name}
                    </option>
                ))}
            </select>

            <button 
                onClick={handleEnrollment} 
                disabled={loading || !selectedCourse || !selectedStudentEmail} // Disable button if loading or selections are missing
            >
                Enroll
            </button>
            {enrollmentMessage && <p>{enrollmentMessage}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
        </div>
    );
};

export default CourseEnrollmentPage;
