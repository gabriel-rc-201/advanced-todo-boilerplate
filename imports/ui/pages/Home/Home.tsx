import React from "react";
import { useNavigate } from "react-router-dom";

import { withTracker } from "meteor/react-meteor-data";

import Container from "@mui/material/Container";
import * as appStyle from "/imports/materialui/styles";
import { getUser } from "/imports/libs/getUser";
import Typography from "@mui/material/Typography";
import { toDosApi } from "/imports/modules/toDos/api/toDosApi";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";

const Home = (props) => {
  const user = getUser();

  const { toDos, check, loading } = props;

  const handleCheckToDo = (id, currentCheck) => {
    check(id, currentCheck, (e, r) => {
      console.log("Error", e);
      console.log("Result", r);
    });
  };

  const navigate = useNavigate();

  return (
    <>
      <Container>
        <Typography style={appStyle.h1(1)} variant="h1">
          {`Olá, ${user.username}`}
        </Typography>
        <Typography style={appStyle.body1(1.2)}>
          {
            "Seus projetos muito mais organizados. Veja as tarefas adicionadas por seu time, por você e para você!"
          }
        </Typography>

        <Typography style={appStyle.h2(1)} variant="h2">
          {"Adicionadas Recentemente"}
        </Typography>

        <List>
          {toDos.map((todo, index) => (
            <ListItem
              key={index}
              sx={{ bgcolor: todo.check === "Concluída" ? "green" : "" }}
            >
              <ListItem>
                <ListItemAvatar>
                  <Avatar src={todo.image} />
                </ListItemAvatar>
                <ListItemText
                  primary={todo.description}
                  secondary={todo.nomeUsuario}
                />
              </ListItem>
              <ListItem
                onClick={() => {
                  handleCheckToDo(todo._id, todo.check);
                }}
              >
                <ListItemText primary={`Check: ${todo.check}`} />
              </ListItem>
            </ListItem>
          ))}
        </List>

        <Button variant="contained" onClick={() => navigate("/toDos")}>
          {"Minhas Tarefas >>"}
        </Button>
      </Container>
    </>
  );
};

export const HomeContainer = withTracker(() => {
  const sort = { lastupdate: 1 };

  const filter = {};

  const subHandle = toDosApi.subscribe("toDosList", filter, {
    sort,
    limit: 5,
    skip: 0,
  });

  const isHandlerReady = subHandle?.ready();

  const toDos = isHandlerReady
    ? toDosApi.find({}, { lastupdate: 1 }).fetch()
    : [];

  return {
    toDos,
    loading: !!subHandle && !subHandle.ready(),
    check: (id, currentCheck, callback) =>
      toDosApi.checkToDo(id, currentCheck, callback),
  };
})(Home);

export default Home;
