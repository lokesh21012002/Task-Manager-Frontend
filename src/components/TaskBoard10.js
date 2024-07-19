import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import Navbar from '../components/Navbar';
import {
  Button, Card, CardContent, TextField, Select, MenuItem, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@material-ui/core';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { axiosInstance } from '../config/AxiosConfig';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DateTimePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { Navigate } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  // styles here
}));

const initialData = {
  tasks: {},
  columns: {
    'column-1': { id: 'column-1', title: 'TODO', taskIds: [] },
    'column-2': { id: 'column-2', title: 'IN PROGRESS', taskIds: [] },
    'column-3': { id: 'column-3', title: 'DONE', taskIds: [] },
  },
  columnOrder: ['column-1', 'column-2', 'column-3'],
}


function TaskBoard10() {
  const classes = useStyles();
  const [data, setData] = useState(initialData);
  const [openView, setOpenView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskContent, setTaskContent] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDueDate, setTaskDueDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('Recent');

  useEffect(() => {
    axiosInstance.get('/tasks', {
      headers: {
        Authorization: localStorage.getItem("token")
      },
    })
    .then(response => {
      const tasks = response.data.reduce((acc, task) => {
        acc[task._id] = task;
        return acc;
      }, {});

      const columns = {
        'column-1': { id: 'column-1', title: 'TODO', taskIds: response.data.filter(task => task.status === 'TODO').map(task => task._id) },
        'column-2': { id: 'column-2', title: 'IN PROGRESS', taskIds: response.data.filter(task => task.status === 'IN PROGRESS').map(task => task._id) },
        'column-3': { id: 'column-3', title: 'DONE', taskIds: response.data.filter(task => task.status === 'DONE').map(task => task._id) },
      };

      setData({ tasks, columns, columnOrder: ['column-1', 'column-2', 'column-3'] });
    })
    .catch(error => {
         toast.error('Error fetching tasks!');
         Navigate("/login")
      console.error('There was an error fetching the tasks!', error);
    });
  }, []);

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      const newState = {
        ...data,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn,
        },
      };

      setData(newState);
      return;
    }

    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    const newState = {
      ...data,
      columns: {
        ...data.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };

    const updatedTask = { ...data.tasks[draggableId], status: finish.title };
    axiosInstance.put(`/tasks/${draggableId}`, updatedTask, {
      headers: {
        Authorization: localStorage.getItem("token")
      }
    })
    .then(response => {
         toast.success('Task updated successfully!');
      setData(newState);
    })
    .catch(error => {
        toast.error('Error updating task!');
      console.error('There was an error updating the task!', error);
    });
  };

  const handleClickOpenView = (task) => {
    setSelectedTask(task);
    setOpenView(true);
  };

  const handleCloseView = () => {
    setOpenView(false);
    setSelectedTask(null);
  };

  const handleClickOpenEdit = (task) => {
    setSelectedTask(task);
    setTaskContent(task.title);
    setTaskDescription(task.description);
    setTaskDueDate(task.dueDate ? new Date(task.dueDate) : null);
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setSelectedTask(null);
  };

  const handleSaveEdit = () => {
    const updatedTask = {
      ...selectedTask,
      title: taskContent,
      description: taskDescription,
      dueDate: taskDueDate,
    };

    axiosInstance.put(`/tasks/${selectedTask._id}`, updatedTask, {
      headers: {
        Authorization: localStorage.getItem("token")
      }
    })
    .then(response => {
      const updatedTask = response.data;
      const updatedTasks = { ...data.tasks, [updatedTask._id]: updatedTask };
      const updatedData = { ...data, tasks: updatedTasks };
      setData(updatedData);
      handleCloseEdit();
      toast.success('Task edited successfully!');
    })
    .catch(error => {
           toast.error('Error editing task!');
      console.error('There was an error updating the task!', error);
    });
  };

  const handleClickOpenDelete = (task) => {
    setSelectedTask(task);
    setOpenDelete(true);
  };

  const handleClickOpenAdd = () => {
    setTaskContent('');
    setTaskDescription('');
    setTaskDueDate(null);
    setOpenAdd(true);
  };

  const handleClose = () => {
    setOpenView(false);
    setOpenEdit(false);
    setOpenDelete(false);
    setOpenAdd(false);
  };

  const handleAddTask = () => {
    const newTask = {
      title: taskContent,
      description: taskDescription,
      status: 'TODO',
      dueDate: taskDueDate,
    };

    axiosInstance.post('/tasks', newTask, {
      headers: {
        Authorization: localStorage.getItem("token")
      }
    })
    .then(response => {
      const task = response.data;
      const newTasks = {
        ...data.tasks,
        [task._id]: task,
      };
      const newTodoColumn = {
        ...data.columns['column-1'],
        taskIds: [...data.columns['column-1'].taskIds, task._id],
      };

      setData({
        ...data,
        tasks: newTasks,
        columns: {
          ...data.columns,
          'column-1': newTodoColumn,
        },
      });

      handleClose();
      toast.success('Task added successfully!');
    })
    .catch(error => {
      toast.error('Error adding task!');
      console.error('There was an error adding the task!', error);
    });
  };

  const handleDeleteTask = () => {
    axiosInstance.delete(`/tasks/${selectedTask._id}`, {
      headers: {
        Authorization: localStorage.getItem("token")
      }
    })
    .then(response => {
      const newTasks = { ...data.tasks };
      delete newTasks[selectedTask._id];

      const newColumns = { ...data.columns };
      Object.keys(newColumns).forEach(columnId => {
        newColumns[columnId].taskIds = newColumns[columnId].taskIds.filter(taskId => taskId !== selectedTask._id);
      });

      setData({ ...data, tasks: newTasks, columns: newColumns });
      handleClose();
      toast.success('Task deleted successfully!');
    })
    .catch(error => {
      toast.error('Error deleting task!');
      console.error('There was an error deleting the task!', error);
    });
  };

  const filteredTasks = Object.values(data.tasks).filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedTasks = filteredTasks.sort((a, b) => {
    if (sortBy === 'Recent') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortBy === 'Due Date') {
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    return 0;
  });

  return (
    <>
      <Navbar />
      <div className={classes.root}>
        <div className={classes.searchSortContainer}>
          <TextField
            label="Search Tasks"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={classes.searchInput}
          />
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            variant="outlined"
            size="small"
          >
            <MenuItem value="Recent">Recent</MenuItem>
            <MenuItem value="Due Date">Due Date</MenuItem>
          </Select>
          <Button variant="contained" color="primary" onClick={handleClickOpenAdd}>
            Add Task
          </Button>
        </div>
        <DragDropContext onDragEnd={handleDragEnd}>
          {data.columnOrder.map((columnId) => {
            const column = data.columns[columnId];
            const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);

            return (
              <div key={column.id} className={classes.column}>
                <Typography variant="h6" className={classes.columnTitle}>
                  {column.title}
                </Typography>
                <Droppable droppableId={column.id}>
                  {(provided) => (
                    <div
                      className={classes.taskList}
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {tasks.map((task, index) => (
                        <Draggable key={task._id} draggableId={task._id} index={index}>
                          {(provided) => (
                            <Card
                              className={classes.taskCard}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              ref={provided.innerRef}
                            >
                              <CardContent>
                                <Typography variant="h6" onClick={() => handleClickOpenView(task)}>
                                  {task.title}
                                </Typography>
                                <Typography variant="body2">
                                  {task.description}
                                </Typography>
                                {task.dueDate && (
                                  <Typography variant="body2" color="textSecondary">
                                    Due Date: {new Date(task.dueDate).toLocaleDateString()}
                                  </Typography>
                                )}
                              </CardContent>
                              <Button variant="contained" color="primary" onClick={() => handleClickOpenEdit(task)}>
                                Edit
                              </Button>
                              <Button variant="contained" color="secondary" onClick={() => handleClickOpenDelete(task)}>
                                Delete
                              </Button>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </DragDropContext>

        <Dialog open={openView} onClose={handleCloseView}>
          <DialogTitle>{selectedTask && selectedTask.title}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {selectedTask && selectedTask.description}
            </DialogContentText>
            {selectedTask && selectedTask.dueDate && (
              <Typography variant="body2" color="textSecondary">
                Due Date: {new Date(selectedTask.dueDate).toLocaleDateString()}
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseView} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openEdit} onClose={handleCloseEdit}>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogContent>
            <TextField
              label="Title"
              fullWidth
              value={taskContent}
              onChange={(e) => setTaskContent(e.target.value)}
              margin="dense"
            />
            <TextField
              label="Description"
              fullWidth
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              margin="dense"
              multiline
              rows={4}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                renderInput={(props) => <TextField {...props} margin="dense" fullWidth />}
                label="Due Date"
                value={taskDueDate}
                onChange={(date) => setTaskDueDate(date)}
              />
            </LocalizationProvider>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEdit} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openDelete} onClose={handleClose}>
          <DialogTitle>Delete Task</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this task?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDeleteTask} color="primary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openAdd} onClose={handleClose}>
          <DialogTitle>Add Task</DialogTitle>
          <DialogContent>
            <TextField
              label="Title"
              fullWidth
              value={taskContent}
              onChange={(e) => setTaskContent(e.target.value)}
              margin="dense"
            />
            <TextField
              label="Description"
              fullWidth
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              margin="dense"
              multiline
              rows={4}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                renderInput={(props) => <TextField {...props} margin="dense" fullWidth />}
                label="Due Date"
                value={taskDueDate}
                onChange={(date) => setTaskDueDate(date)}
              />
            </LocalizationProvider>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleAddTask} color="primary">
              Add
            </Button>
          </DialogActions>
        </Dialog>

        <ToastContainer />
      </div>
    </>
  );
}

export default TaskBoard10;
