import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import Navbar from '../components/Navbar';
import {
  Button, Card, CardContent, TextField, Select, MenuItem, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@material-ui/core';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import NavBarHome from './NavBarHome';
import { axiosInstance } from '../config/AxiosConfig';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  board: {
    display: 'flex',
    justifyContent: 'space-around',
  },
  column: {
    backgroundColor: '#f0f0f0',
    borderRadius: '4px',
    padding: theme.spacing(1),
    width: '30%',
  },
  columnTitle: {
    textAlign: 'center',
    backgroundColor: '#007BFF',
    color: 'white',
    borderRadius: '4px 4px 0 0',
    padding: theme.spacing(1),
  },
  task: {
    marginBottom: theme.spacing(1),
    backgroundColor: '#e0f7fa',
  },
  taskContent: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#007BFF',
    color: 'white',
    '&:hover': {
      backgroundColor: '#0056b3',
    },
  },
  searchField: {
    marginRight: theme.spacing(2),
  },
  controls: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  dialogPaper: {
    minHeight: '400px',
    minWidth: '600px',
  },
}));

const initialData = {
  tasks: {},
  columns: {
    'column-1': { id: 'column-1', title: 'TODO', taskIds: [] },
    'column-2': { id: 'column-2', title: 'IN PROGRESS', taskIds: [] },
    'column-3': { id: 'column-3', title: 'DONE', taskIds: [] },
  },
  columnOrder: ['column-1', 'column-2', 'column-3'],
};

function TaskBoard8() {
  const classes = useStyles();
  const [data, setData] = useState(initialData);
  const [openView, setOpenView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskContent, setTaskContent] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
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
      console.error('There was an error fetching the tasks!', error);
    });
  }, []);

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
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

    setData(newState);
  };

  const handleClickOpenView = (task) => {
    setSelectedTask(task);
    setOpenView(true);
  };

  const handleClickOpenEdit = (task) => {
    setSelectedTask(task);
    setTaskContent(task.title);
    setTaskDescription(task.description);
    setOpenEdit(true);
  };

  const handleClickOpenDelete = (task) => {
    setSelectedTask(task);
    setOpenDelete(true);
  };

  const handleClickOpenAdd = () => {
    setTaskContent('');
    setTaskDescription('');
    setOpenAdd(true);
  };

  const handleCloseView = () => {
    setOpenView(false);
    setSelectedTask(null);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setSelectedTask(null);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
    setSelectedTask(null);
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
  };

  const handleSaveEdit = () => {
    console.log(taskContent,taskDescription);
    axiosInstance.put(`/tasks/${selectedTask._id}`, {
      title: taskContent,
      description: taskDescription,
    }, {
      headers: {
        Authorization: localStorage.getItem("token")
      },
    })
    .then(response => {
      const updatedTask = response.data;
      const updatedTasks = { ...data.tasks, [updatedTask._id]: updatedTask };
      const updatedData = { ...data, tasks: updatedTasks };
      setData(updatedData);
      handleCloseEdit();
    })
    .catch(error => {
      console.error('There was an error updating the task!', error);
    });
  };

  const handleAddTask = () => {
    axiosInstance.post('/tasks', {
      title: taskContent,
      description: taskDescription,
      status: 'TODO',
    }, {
      headers: {
        Authorization: localStorage.getItem("token")
      },
    })
    .then(response => {
      const newTask = response.data;
      const newTasks = {
        ...data.tasks,
        [newTask._id]: newTask,
      };

      const newTaskIds = Array.from(data.columns['column-1'].taskIds);
      newTaskIds.push(newTask._id);

      const newColumn = {
        ...data.columns['column-1'],
        taskIds: newTaskIds,
      };

      const newState = {
        ...data,
        tasks: newTasks,
        columns: {
          ...data.columns,
          'column-1': newColumn,
        },
      };

      setData(newState);
      handleCloseAdd();
    })
    .catch(error => {
      console.error('There was an error adding the task!', error);
    });
  };

  const handleDeleteTask = () => {
    axiosInstance.delete(`/tasks/${selectedTask._id}`, {
      headers: {
        Authorization: localStorage.getItem("token")
      },
    })
    .then(() => {
      const { [selectedTask._id]: removedTask, ...remainingTasks } = data.tasks;

      const updatedColumns = Object.keys(data.columns).reduce((acc, columnId) => {
        const column = data.columns[columnId];
        const newTaskIds = column.taskIds.filter(taskId => taskId !== selectedTask._id);
        acc[columnId] = { ...column, taskIds: newTaskIds };
        return acc;
      }, {});

      const newState = {
        ...data,
        tasks: remainingTasks,
        columns: updatedColumns,
      };

      setData(newState);
      handleCloseDelete();
    })
    .catch(error => {
      console.error('There was an error deleting the task!', error);
    });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const filteredTasks = Object.values(data.tasks).filter((task) =>
    task.content?.toLowerCase().includes(searchTerm?.toLowerCase())
  );

  const sortedTasks = filteredTasks.sort((a, b) => {
    if (sortBy === 'Recent') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortBy === 'Oldest') {
      return new Date(a.createdAt) - new Date(b.createdAt);
    } else if (sortBy === 'A-Z') {
      return a.content.localeCompare(b.content);
    } else {
      return b.content.localeCompare(a.content);
    }
  });

  return (
    <div>
      <NavBarHome />
      <div className={classes.root}>
        <div className={classes.controls}>
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearch}
            className={classes.searchField}
          />
          <Select value={sortBy} onChange={handleSortChange} variant="outlined" size="small">
            <MenuItem value="Recent">Recent</MenuItem>
            <MenuItem value="Oldest">Oldest</MenuItem>
            <MenuItem value="A-Z">A-Z</MenuItem>
            <MenuItem value="Z-A">Z-A</MenuItem>
          </Select>
          <Button onClick={handleClickOpenAdd} className={classes.button}>Add Task</Button>
        </div>
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className={classes.board}>
            {data.columnOrder.map((columnId) => {
              const column = data.columns[columnId];
              const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);

              return (
                <Droppable key={column.id} droppableId={column.id}>
                  {(provided) => (
                    <div
                      className={classes.column}
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      <Typography className={classes.columnTitle} variant="h6">{column.title}</Typography>
                      {tasks.map((task, index) => (
                        <Draggable key={task._id} draggableId={task._id} index={index}>
                          {(provided) => (
                            <Card
                              className={classes.task}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={() => handleClickOpenView(task)}
                            >
                              <CardContent>
                                <Typography variant="body1">{task.title}</Typography>
                                <Typography variant="body1">{task.description}</Typography>
                                <Typography variant="body1">{task.date}</Typography>
                                <div className={classes.taskContent}>
                                     <Button style={{ backgroundColor: 'blue', color: 'white' }} size="small" onClick={() => handleClickOpenView(task)}>View Details</Button>
                                  <Button style={{ backgroundColor: 'green', color: 'white' }} onClick={(e) => { e.stopPropagation(); handleClickOpenEdit(task); }}>Edit</Button>
                                  <Button style={{ backgroundColor: 'red', color: 'white' }} size="small" onClick={(e) => { e.stopPropagation(); handleClickOpenDelete(task); }}>Delete</Button>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              );
            })}
          </div>
        </DragDropContext>
      </div>
      <Dialog open={openView} onClose={handleCloseView}>
        <DialogTitle>View Task</DialogTitle>
        <DialogContent>
          <DialogContentText>Task Content: {selectedTask?.title}</DialogContentText>
          <DialogContentText>Task Description: {selectedTask?.description}</DialogContentText>
          <DialogContentText>Task Date: {selectedTask?.date}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button style={{ backgroundColor: 'red', color: 'white' }} onClick={handleCloseView} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openEdit} onClose={handleCloseEdit} classes={{ paper: classes.dialogPaper }}>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Task Content"
            type="text"
            fullWidth
            value={taskContent}
            onChange={(e) => setTaskContent(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Task Description"
            type="text"
            fullWidth
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button style={{ backgroundColor: 'red', color: 'white' }} onClick={handleCloseEdit} color="primary">Cancel</Button>
          <Button style={{ backgroundColor: 'blue', color: 'white' }} onClick={handleSaveEdit} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openDelete} onClose={handleCloseDelete}>
       <Button style={{ backgroundColor: 'blue', color: 'white' }}> <DialogTitle>Delete Task</DialogTitle></Button>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this task?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button style={{ backgroundColor: 'blue', color: 'white' }} onClick={handleCloseDelete} color="primary">Cancel</Button>
          <Button style={{ backgroundColor: 'red', color: 'white' }} onClick={handleDeleteTask} color="primary">Delete</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openAdd} onClose={handleCloseAdd} classes={{ paper: classes.dialogPaper }}>
        <DialogTitle>Add Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Task Content"
            type="text"
            fullWidth
            value={taskContent}
            onChange={(e) => setTaskContent(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Task Description"
            type="text"
            fullWidth
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button style={{ backgroundColor: 'red', color: 'white' }} onClick={handleCloseAdd} color="primary">Cancel</Button>
          <Button style={{ backgroundColor: 'blue', color: 'white' }} onClick={handleAddTask} color="primary">Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default TaskBoard8;
