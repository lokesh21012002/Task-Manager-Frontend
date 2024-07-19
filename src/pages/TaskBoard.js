import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Navbar from '../components/Navbar';
import {
  Button, Card, CardContent, TextField, Select, MenuItem, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@material-ui/core';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { axiosInstance } from '../config/AxiosConfig';
import {toast,ToastContainer} from "react-toastify";
import { Link ,useNavigate} from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';


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

function TaskBoard() {
     const navigate=useNavigate();
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
        console.log(response);
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
        navigate("/")
         toast.error('Please Login First!!');
       
         toast.error('Please Login First!!');
        
      console.error('There was an error fetching the tasks!', error);
    });
  },[]);

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

    // Update the task status in the database
    const updatedTask = { ...data.tasks[draggableId], status: finish.title };
    axiosInstance.put(`/tasks/${draggableId}`, updatedTask, {
      headers: {
        Authorization: localStorage.getItem("token")
      }
    })
    .then(response => {
        //  toast.success('Task updated successfully!');
      // If the update is successful, update the state
      setData(newState);
    })
    .catch(error => {
        toast.error('Error updating task!');
      console.error('There was an error updating the task!', error);
      // Optionally, you could revert the UI state if the API call fails
    });
  };

  const handleClickOpenView = (task) => {
    setSelectedTask(task);
    setOpenView(true);
  };
   const handleCloseEdit = () => {
    setOpenEdit(false);
    setSelectedTask(null);
  };
    const handleCloseView = () => {
    setOpenView(false);
    setSelectedTask(null);
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
      toast.success('Task edited successfully!');


    })
    .catch(error => {
              toast.error('Error editing task!');

      console.error('There was an error updating the task!', error);
    });
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

  const handleEditTask = () => {
    const updatedTask = {
      ...selectedTask,
      content: taskContent,
      description: taskDescription,
    };

    axiosInstance.put(`/tasks/${selectedTask._id}`, updatedTask, {
      headers: {
        Authorization: localStorage.getItem("token")
      }
    })
    .then(response => {
      const newTasks = {
        ...data.tasks,
        [updatedTask._id]: updatedTask,
      };

      setData({
        ...data,
        tasks: newTasks,
      });

      handleClose();
            toast.success('Task deleted successfully!');

    })
    .catch(error => {
      console.error('There was an error updating the task!', error);
            toast.error('Error deleting task!');


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

      setData({
        ...data,
        tasks: newTasks,
        columns: newColumns,
      });

      handleClose();
      toast.success('Task deleted successfully!');
    })
    .catch(error => {
        toast.error("Error deleting the task");
      console.error('There was an error deleting the task!', error);
    });
  };
  const getFilteredAndSortedTasks = (taskIds) => {
    const filteredTasks = taskIds
      .map((taskId) => data.tasks[taskId])
      .filter((task) => task?.title.toLowerCase().includes(searchTerm?.toLowerCase()));
      console.log(filteredTasks);

    const sortedTasks = filteredTasks.sort((a, b) => {
      if (sortBy === 'Recent') {
        return new Date(a.date) - new Date(b.date);
      } else if (sortBy === 'Oldest') {
        return new Date(b.date) - new Date(a.date);
      }
      else if (sortBy === 'Alphabetical') {
        return a.title.localeCompare(b.title);
    }
      return 0;
    });

    return sortedTasks;

   
  };

  return (
    <div className={classes.root}>
         <ToastContainer />
      <Navbar />
      <br></br>

      <div className={classes.controls}>
          <Button variant="contained" color="primary" onClick={handleClickOpenAdd}>
          Add Task
        </Button>
        <TextField
          className={classes.searchField}
          label="Search Tasks"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <MenuItem value="Recent">Recent</MenuItem>
          <MenuItem value="Oldest">Oldest</MenuItem>
          <MenuItem value="Alphabetical">Alphabetical</MenuItem>
        </Select>
        {/* <Button variant="contained" color="primary" onClick={handleClickOpenAdd}>
          Add Task
        </Button> */}
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className={classes.board}>
          {data.columnOrder.map((columnId) => {
            const column = data.columns[columnId];
            // const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);
            const tasks = getFilteredAndSortedTasks(column.taskIds);


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
                                <Button
                                  size="small"
                                  onClick={() => handleClickOpenView(task)}
                                  style={{ backgroundColor: 'blue', color: 'white' }} // Blue background for View button
                                >
                                  View
                                </Button>
                                <Button
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleClickOpenEdit(task);
                                  }}
                                  style={{ backgroundColor: 'green', color: 'white' }} // Green background for Edit button
                                >
                                  Edit
                                </Button>
                                <Button
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleClickOpenDelete(task);
                                  }}
                                  style={{ backgroundColor: 'red', color: 'white' }} // Red background for Delete button
                                >
                                  Delete
                                </Button>
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

      <Dialog open={openDelete} onClose={handleClose}>
        <DialogTitle>Delete Task</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this task?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" style={{ backgroundColor: 'green', color: 'white' }}>
            Cancel
          </Button>
          <Button onClick={handleDeleteTask} color="primary" style={{ backgroundColor: 'red', color: 'white' }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openAdd} onClose={handleClose} classes={{ paper: classes.dialogPaper }}>
        <DialogTitle>Add Task</DialogTitle>
        <DialogContent>
          <TextField
            label="Content"
            variant="outlined"
            value={taskContent}
            onChange={(e) => setTaskContent(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Description"
            variant="outlined"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" style={{ backgroundColor: 'green', color: 'white' }}>
            Cancel
          </Button>
          <Button onClick={handleAddTask} color="primary" style={{ backgroundColor: 'blue', color: 'white' }}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default TaskBoard;
