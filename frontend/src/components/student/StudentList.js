import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentList = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        // This assumes the auth token is stored in localStorage
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'x-auth-token': token,
          },
        };
        const res = await axios.get('/api/students', config);
        setStudents(res.data);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchStudents();
  }, []);

  const deleteStudent = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token,
        },
      };
      await axios.delete(`/api/students/${id}`, config);
      setStudents(students.filter((student) => student._id !== id));
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div>
      <h2>Student List</h2>
      <table>
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Father's Name</th>
            <th>Class</th>
            <th>Village</th>
            <th>Mobile Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td>{student.studentName}</td>
              <td>{student.fatherName}</td>
              <td>{student.class}</td>
              <td>{student.village}</td>
              <td>{student.mobileNumber}</td>
              <td>
                <button>Edit</button>
                <button onClick={() => deleteStudent(student._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentList;
