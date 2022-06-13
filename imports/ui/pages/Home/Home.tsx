import React from "react";
import { useNavigate } from "react-router-dom";

import { withTracker } from "meteor/react-meteor-data";

import * as appStyle from "/imports/materialui/styles";
import { homeStyles } from "./HomeStyle";

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import { getUser } from "/imports/libs/getUser";
import { toDosApi } from "/imports/modules/toDos/api/toDosApi";
import { ToDo } from "../../../modules/toDos/ui/pages/Todo";

const Home = (props) => {
  const user = getUser();

  const { toDos, loading } = props;

  const navigate = useNavigate();

  return (
    <Box sx={homeStyles.containerHome}>
      <Box sx={homeStyles.homeGreetings}>
        <Typography style={appStyle.h1(0.7)} variant="h1">
          {`Olá, ${user.username}`}
        </Typography>
        <Typography style={appStyle.body1(1)}>
          {
            "Seus projetos muito mais organizados. Veja as tarefas adicionadas por seu time, por você e para você!"
          }
        </Typography>
      </Box>

      <Box sx={homeStyles.homeList}>
        <Typography style={appStyle.h2(0.7)} variant="h2">
          {"Adicionadas Recentemente"}
        </Typography>

        <List>
          {toDos.map((todo, index) => (
            <ToDo todo={todo} index={index} home={true} />
          ))}
        </List>
      </Box>

      <Button variant="contained" onClick={() => navigate("/toDos")}>
        {"Minhas Tarefas >>"}
      </Button>
    </Box>
  );
};

export const HomeContainer = withTracker(() => {
  const sort = { lastupdate: -1 };

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
  };
})(Home);

export default Home;
