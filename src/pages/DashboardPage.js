import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AuthProvider } from '../context/AuthContext';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function DashboardPage() {
//   const { authTokens } = AuthProvider();
  const [tasks, setTasks] = useState([{"title":1,"description":"test"},{"title":1,"description":"test"},{"title":1,"descripton":"test"}]);

//   useEffect(() => {
//     axios.get('/api/tasks', { headers: { Authorization: `Bearer ${authTokens}` } })
//       .then(response => setTasks(response.data))
//       .catch(err => console.error(err));
//   }, [authTokens]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const updatedTasks = Array.from(tasks);
    const [reorderedTask] = updatedTasks.splice(result.source.index, 1);
    updatedTasks.splice(result.destination.index, 0, reorderedTask);

    setTasks(updatedTasks);
    // Update task order in the backend if necessary
  };

  return (
    <div>
      <h2>Task Manager</h2>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {tasks.map((task, index) => (
                <Draggable key={task._id} draggableId={task._id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <h4>{task.title}</h4>
                      <p>{task.description}</p>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default DashboardPage;
