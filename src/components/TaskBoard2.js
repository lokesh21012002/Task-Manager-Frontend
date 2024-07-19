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
    marginTop: theme.spacing(2),
    backgroundColor: '#007BFF',
    color: 'white',
    '&:hover': {
      backgroundColor: '#0056b3',
    },
  },
  searchField: {
    marginRight: theme.spacing(2),
  },
    dialogPaper: {
    minHeight: '400px',
    minWidth: '600px',
  },
}));

const initialData = {
  tasks: {
    'task-1': { id: 'task-1', content: 'Task 1', description: 'Description 1', createdAt: '01/09/2021, 05:30:00' },
    'task-2': { id: 'task-2', content: 'Task 2', description: 'Description 2', createdAt: '01/09/2021, 05:30:00' },
    'task-3': { id: 'task-3', content: 'Task 3', description: 'Description 3', createdAt: '01/09/2024, 05:30:00' },
    'task-4': { id: 'task-4', content: 'Task 4', description: 'Description 4', createdAt: '01/09/2024, 05:30:00' },
    'task-5': { id: 'task-5', content: 'Task 5', description: 'Description 5', createdAt: '01/09/2021, 05:30:00' },
    'task-6': { id: 'task-6', content: 'Task 6', description: 'Description 6', createdAt: '01/09/2021, 05:30:00' },
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

function TaskBoard2() {
  const classes = useStyles();
  const [data, setData] = useState(initialData);
  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

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

  const handleClickOpen = (task) => {
    setSelectedTask(task);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTask(null);
  };

  return (
    <>
      <NavBarHome/>
      <div className={classes.root}>
        <Button className={classes.button}>Add Task</Button>
        <TextField className={classes.searchField} label="Search" variant="outlined" size="small" />
        <Select label="Sort By" defaultValue="Recent">
          <MenuItem value="Recent">Recent</MenuItem>
          <MenuItem value="Oldest">Oldest</MenuItem>
        </Select>
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
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (
                            <Card
                              className={classes.task}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <CardContent>
                                <Typography variant="body2">{task.content}</Typography>
                                <div className={classes.taskContent}>
                                  <Button color="secondary">Delete</Button>
                                  <Button color="primary">Edit</Button>
                                  <Button color="primary" onClick={() => handleClickOpen(task)}>View Details</Button>
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
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{selectedTask.content}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                {selectedTask.description}
              </DialogContentText>
              <Typography variant="body2">Created at: {selectedTask.createdAt}</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">Close</Button>
            </DialogActions>
          </Dialog>
        )}
      </div>
    </>
  );
}

export default TaskBoard2;
