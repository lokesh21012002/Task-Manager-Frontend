import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Navbar from '../components/Navbar';
import {
  Button, Card, CardContent, TextField, Select, MenuItem, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@material-ui/core';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import NavBarHome from './NavBarHome';

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
  tasks: {
    'task-1': { id: 'task-1', content: 'Task 1', description: 'Description 1', createdAt: '2024-09-01T05:30:00' },
    'task-2': { id: 'task-2', content: 'Task 2', description: 'Description 2', createdAt: '2024-09-01T05:30:00' },
    'task-3': { id: 'task-3', content: 'Task 3', description: 'Description 3', createdAt: '2024-09-01T05:30:00' },
    'task-4': { id: 'task-4', content: 'Task 4', description: 'Description 4', createdAt: '2024-09-01T05:30:00' },
    'task-5': { id: 'task-5', content: 'Task 5', description: 'Description 5', createdAt: '2024-09-01T05:30:00' },
    'task-6': { id: 'task-6', content: 'Task 6', description: 'Description 6', createdAt: '2024-09-01T05:30:00' },
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'TODO',
      taskIds: ['task-3', 'task-1', 'task-2'],
    },
    'column-2': {
      id: 'column-2',
      title: 'IN PROGRESS',
      taskIds: ['task-4', 'task-5'],
    },
    'column-3': {
      id: 'column-3',
      title: 'DONE',
      taskIds: ['task-6'],
    },
  },
  columnOrder: ['column-1', 'column-2', 'column-3'],
};

function TaskBoard6() {
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
    console.log(event.target.value);
    setSortBy(event.target.value);
  };

  const getFilteredAndSortedTasks = (taskIds) => {
    const filteredTasks = taskIds
      .map((taskId) => data.tasks[taskId])
      .filter((task) => task.content.toLowerCase().includes(searchTerm.toLowerCase()));

    const sortedTasks = filteredTasks.sort((a, b) => {
      if (sortBy === 'Recent') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortBy === 'Oldest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return 0;
    });

    return sortedTasks;
  };

  return (
    <>
      <NavBarHome/>
      <div className={classes.root}>
        <div className={classes.controls}>
          <Button className={classes.button} onClick={handleClickOpenAdd}>Add Task</Button>
          <TextField
            label="Search Tasks"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            className={classes.searchField}
          />
          <Select
            value={sortBy}
            onChange={handleSortChange}
            displayEmpty
            inputProps={{ 'aria-label': 'Sort By' }}
          >
            <MenuItem value="" disabled>Sort By</MenuItem>
            <MenuItem value="Recent">Recent</MenuItem>
            <MenuItem value="Oldest">Oldest</MenuItem>
          </Select>
        </div>
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className={classes.board}>
            {data.columnOrder.map((columnId) => {
              const column = data.columns[columnId];
              const tasks = getFilteredAndSortedTasks(column.taskIds);

              return (
                <Droppable droppableId={column.id} key={column.id}>
                  {(provided) => (
                    <div className={classes.column} {...provided.droppableProps} ref={provided.innerRef}>
                      <div className={classes.columnTitle}>{column.title}</div>
                      {tasks.map((task, index) => (
                        <Draggable draggableId={task.id} index={index} key={task.id}>
                          {(provided) => (
                            <Card className={classes.task} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                              <CardContent>
                                <Typography variant="h6">{task.content}</Typography>
                                <Typography variant="body1">{task.description}</Typography>
                                <Typography variant="body2">{task.createdAt}</Typography>
                                <div className={classes.taskContent}>
                                  <Button color="primary" onClick={() => handleClickOpenEdit(task)}>Edit</Button>
                                  <Button color="secondary" onClick={() => handleClickOpenDelete(task)}>Delete</Button>
                                  <Button color="default" onClick={() => handleClickOpenView(task)}>View Details</Button>
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

        {selectedTask && (
          <Dialog open={openView} onClose={handleCloseView} classes={{ paper: classes.dialogPaper }}>
            <DialogTitle>Task Details</DialogTitle>
            <DialogContent>
              <DialogContentText>
                <Typography variant="h6">{selectedTask.content}</Typography>
                <Typography variant="body1">{selectedTask.description}</Typography>
                <Typography variant="body2">{selectedTask.createdAt}</Typography>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseView} color="primary">Close</Button>
            </DialogActions>
          </Dialog>
        )}

        {selectedTask && (
          <Dialog open={openEdit} onClose={handleCloseEdit} classes={{ paper: classes.dialogPaper }}>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogContent>
              <TextField
                label="Task Content"
                fullWidth
                margin="dense"
                value={taskContent}
                onChange={(e) => setTaskContent(e.target.value)}
              />
              <TextField
                label="Task Description"
                fullWidth
                margin="dense"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseEdit} color="primary">Cancel</Button>
              <Button onClick={handleSaveEdit} color="primary">Save</Button>
            </DialogActions>
          </Dialog>
        )}

        {selectedTask && (
          <Dialog open={openDelete} onClose={handleCloseDelete}>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete the task "{selectedTask.content}"?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDelete} color="primary">Cancel</Button>
              <Button onClick={handleDeleteTask} color="secondary">Delete</Button>
            </DialogActions>
          </Dialog>
        )}

        <Dialog open={openAdd} onClose={handleCloseAdd} classes={{ paper: classes.dialogPaper }}>
          <DialogTitle>Add Task</DialogTitle>
          <DialogContent>
            <TextField
              label="Task Content"
              fullWidth
              margin="dense"
              value={taskContent}
              onChange={(e) => setTaskContent(e.target.value)}
            />
            <TextField
              label="Task Description"
              fullWidth
              margin="dense"
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
    </>
  );
}

export default TaskBoard6;
