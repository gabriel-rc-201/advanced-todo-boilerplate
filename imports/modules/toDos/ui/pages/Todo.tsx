import React from "react";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import Avatar from "@mui/material/Avatar";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

import * as appStyle from "/imports/materialui/styles";
import { toDosApi } from "../../api/toDosApi";
import { IToDos } from "../../api/toDosSch";

interface ITodo {
  todo: IToDos;
  index: Number;
  showDrawer?: ({}) => void;
  onClick?: () => void;
  callRemove?: (todo: IToDos) => void;
  home?: Boolean;
}

const handleCheckToDo = (id, currentCheck) => {
  toDosApi.checkToDo(id, currentCheck, (e, r) => {
    console.log("Error", e);
    console.log("Result", r);
  });
};

export const ToDo = ({
  todo,
  index,
  showDrawer,
  onClick,
  callRemove,
  home,
}: ITodo) => {
  return (
    <ListItem
      key={index}
      sx={{
        bgcolor: todo.check === "Concluída" ? appStyle.primaryColor : "",
        color: todo.check === "Concluída" ? appStyle.textWhite : "",
      }}
    >
      <ListItem
        onClick={() => {
          if (home) return;
          showDrawer({
            url: `/toDos/view/${todo._id}`,
            title: `${todo.title}`,
          });
        }}
      >
        <ListItemAvatar>
          <Avatar src={todo.image} />
        </ListItemAvatar>
        <ListItemText
          primary={todo.title}
          secondary={<Typography> {todo.nomeUsuario} </Typography>}
        />
      </ListItem>
      <ListItem
        onClick={() => {
          handleCheckToDo(todo._id, todo.check);
        }}
      >
        <ListItemText primary={`Check: ${todo.check}`} />
      </ListItem>
      <ListItemIcon
        sx={{ display: home ? "none" : "" }}
        onClick={(e) => {
          if (home) return;
          onClick(e, todo);
        }}
      >
        <Edit />
      </ListItemIcon>
      <ListItemIcon
        sx={{ display: home ? "none" : "" }}
        onClick={(e) => {
          if (home) return;
          e.preventDefault();
          callRemove(todo);
        }}
      >
        <Delete />
      </ListItemIcon>
    </ListItem>
  );
};
