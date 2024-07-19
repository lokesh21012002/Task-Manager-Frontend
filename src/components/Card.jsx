import * as React from 'react';
import { TaskBoardCard, TaskBoardCardHeader } from '@progress/kendo-react-taskboard';
import { CardBody } from '@progress/kendo-react-layout';
import { cards } from './cards';
const images = {};
cards.forEach(card => {
  images[String(card.id)] = card.image;
});
const CardHeaderComponent = props => {
  return <TaskBoardCardHeader {...props} title={props.task.description} />;
};
const CardBodyComponent = props => {
  return <CardBody>
      <img src={images[String(props.task.id)]} style={{
      height: '135px',
      width: '270px'
    }} alt={`KendoReact TaskBoard ${props.task.title}`} draggable={false} />
    </CardBody>;
};
export const Card = props => {
  return <TaskBoardCard {...props} cardHeader={CardHeaderComponent} cardBody={CardBodyComponent} />;
};