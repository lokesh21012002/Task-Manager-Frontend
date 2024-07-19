import React from 'react';
import { Card, CardContent, Typography, Button } from '@material-ui/core';

const TaskCard = ({ task, handleClickOpenView, handleClickOpenEdit, handleClickOpenDelete, classes }) => {
  return (
    <Card className={classes.card}>
      <CardContent className={classes.cardContent}>
        <Typography variant="h6">{task.content}</Typography>
        <Typography>{task.description}</Typography>
        <Typography>{new Date(task.dueDate).toLocaleDateString()}</Typography>
        <Typography>Assigned User: {task.assignedTo.name}</Typography>
      </CardContent>
      <div className={classes.cardActions}>
        <Button
          backgroundColor="blue"
          size="small"
          onClick={() => handleClickOpenView(task)}
        >
          View
        </Button>
        <Button
          backgroundColor="green"
          size="small"
          onClick={(e) => { e.stopPropagation(); handleClickOpenEdit(task); }}
        >
          Edit
        </Button>
        <Button
          backgroundColor="red"
          size="small"
          onClick={(e) => { e.stopPropagation(); handleClickOpenDelete(task); }}
        >
          Delete
        </Button>
      </div>
    </Card>
  );
};

export default TaskCard;
