import React from 'react';
import StudentForm from '../student/StudentForm';
import StudentList from '../student/StudentList';

const InstitutionDashboard = () => {
  return (
    <div>
      <h1>Institution Dashboard</h1>
      <StudentForm />
      <StudentList />
    </div>
  );
};

export default InstitutionDashboard;
