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

function TaskBoard7() {
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
        // console.log(response.data);
      const tasks = response.data.reduce((acc, task) => {
        acc[task._id] = task;
        return acc;
      }, {});

      console.log(response.data,tasks);

      const columns = {
        'column-1': { id: 'column-1', title: 'TODO', taskIds: response.data.filter(task => task.status === 'TODO').map(task => task._id) },
        'column-2': { id: 'column-2', title: 'IN PROGRESS', taskIds: response.data.filter(task => task.status === 'IN PROGRESS').map(task => task._id) },
        'column-3': { id: 'column-3', title: 'DONE', taskIds: response.data.filter(task => task.status === 'DONE').map(task => task._id) },
      };

      setData({ tasks, columns, columnOrder: ['column-1', 'column-2', 'column-3'] });
    //   console.log();
    })
    .catch(error => {
        console.log(error);
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
    setTaskContent(task.content);
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
    const updatedTask = { ...selectedTask, content: taskContent, description: taskDescription };
    const updatedTasks = { ...data.tasks, [updatedTask.id]: updatedTask };
    const updatedData = { ...data, tasks: updatedTasks };
    setData(updatedData);
    handleCloseEdit();
  };

  const handleAddTask = () => {
    const newTaskId = `task-${Object.keys(data.tasks).length + 1}`;
    const newTask = {
      id: newTaskId,
      content: taskContent,
      description: taskDescription,
      createdAt: new Date().toISOString(),
      status: 'TODO',
    };

    const newTasks = {
      ...data.tasks,
      [newTaskId]: newTask,
    };

    const newTaskIds = Array.from(data.columns['column-1'].taskIds);
    newTaskIds.push(newTaskId);

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
  };

  const handleDeleteTask = () => {
    const updatedTasks = { ...data.tasks };
    delete updatedTasks[selectedTask.id];

    const updatedColumns = { ...data.columns };
    Object.keys(updatedColumns).forEach((columnId) => {
      const taskIds = updatedColumns[columnId].taskIds.filter((taskId) => taskId !== selectedTask.id);
      updatedColumns[columnId].taskIds = taskIds;
    });

    const updatedData = { ...data, tasks: updatedTasks, columns: updatedColumns };
    setData(updatedData);
    handleCloseDelete();
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const getFilteredAndSortedTasks = (taskIds) => {
    const filteredTasks = taskIds
      .map((taskId) => data.tasks[taskId])
      .filter((task) => task?.title.toLowerCase().includes(searchTerm?.toLowerCase()));

    const sortedTasks = filteredTasks.sort((a, b) => {
      if (sortBy === 'Recent') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortBy === 'Oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      return 0;
    });

    return sortedTasks;
  };

  return (
    <div className={classes.root}>
      <NavBarHome />

      <div className={classes.controls}>
        <TextField
          className={classes.searchField}
          label="Search tasks"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <Select value={sortBy} onChange={handleSortChange}>
          <MenuItem value="Recent">Recent</MenuItem>
          <MenuItem value="Oldest">Oldest</MenuItem>
        </Select>
        <Button className={classes.button} onClick={handleClickOpenAdd}>Add Task</Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className={classes.board}>
          {data.columnOrder.map((columnId) => {
            const column = data.columns[columnId];
            const tasks = getFilteredAndSortedTasks(column.taskIds);

            return (
              <Droppable key={column.id} droppableId={column.id}>
                {(provided) => (
                  <div className={classes.column} ref={provided.innerRef} {...provided.droppableProps}>
                    <Typography className={classes.columnTitle} variant="h6">{column.title}</Typography>
                    {tasks.map((task, index) => (
                        
                        // console.log(task,index)
                      <Draggable key={task._id} draggableId={task._id} index={index}>
                        {(provided) => (
                          <Card
                            className={classes.task}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <CardContent className={classes.taskContent}>
                              <Typography variant="body2">{task.title}</Typography>
                              <div>
                                <Button size="small" onClick={() => handleClickOpenView(task)}>View</Button>
                                <Button size="small" onClick={() => handleClickOpenEdit(task)}>Edit</Button>
                                <Button size="small" onClick={() => handleClickOpenDelete(task)}>Delete</Button>
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
          <DialogContentText>
            <Typography variant="h6">{selectedTask?.title}</Typography>
            <Typography variant="body2">{selectedTask?.description}</Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseView} color="primary">Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEdit} onClose={handleCloseEdit}>
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
          <Button onClick={handleCloseEdit} color="primary">Cancel</Button>
          <Button onClick={handleSaveEdit} color="primary">Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDelete} onClose={handleCloseDelete}>
        <DialogTitle>Delete Task</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this task?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete} color="primary">Cancel</Button>
          <Button onClick={handleDeleteTask} color="primary">Delete</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openAdd} onClose={handleCloseAdd}>
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
          <Button onClick={handleCloseAdd} color="primary">Cancel</Button>
          <Button onClick={handleAddTask} color="primary">Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default TaskBoard7;
