// /tasks/page.tsx
import React from 'react';
import CreateTaskPage from './create/page';

const TasksPage = () => {
  return (
    <div>
      <h1>Task Management</h1>
      <CreateTaskPage />
    </div>
  );
};

export default TasksPage;
