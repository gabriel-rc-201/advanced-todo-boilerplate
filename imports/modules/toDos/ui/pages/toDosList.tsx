import React from "react";
import { withTracker } from "meteor/react-meteor-data";
import { toDosApi } from "../../api/toDosApi";
import _ from "lodash";
import Add from "@mui/icons-material/Add";
import Delete from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import Fab from "@mui/material/Fab";
import Pagination from "@mui/material/Pagination";
import { ReactiveVar } from "meteor/reactive-var";
import { initSearch } from "../../../../libs/searchUtils";
import * as appStyle from "/imports/materialui/styles";
import shortid from "shortid";
import { PageLayout } from "/imports/ui/layouts/pageLayout";
import TextField from "/imports/ui/components/SimpleFormFields/TextField/TextField";
import {
  IDefaultContainerProps,
  IDefaultListProps,
  IMeteorError,
} from "/imports/typings/BoilerplateDefaultTypings";
import { IToDos } from "../../api/toDosSch";
import { IConfigList } from "/imports/typings/IFilterProperties";
import { Recurso } from "../../config/Recursos";
import { RenderComPermissao } from "/imports/seguranca/ui/components/RenderComPermisao";
import List from "@mui/material/List";
import { getUser } from "/imports/libs/getUser";
import { showNotification } from "/imports/ui/AppGeneralComponents";
import { ToDo } from "./Todo";

interface IToDosList extends IDefaultListProps {
  toDoss: IToDos[];
  showDialog: (options?: Object) => void;
  setFilter: (newFilter: Object) => void;
  clearFilter: () => void;
}

const ToDosList = (props: IToDosList) => {
  const {
    toDoss,
    navigate,
    remove,
    showDialog,
    showDrawer,
    onSearch,
    total,
    loading,
    setFilter,
    clearFilter,
    setPage,
    setPageSize,
    searchBy,
    pageProperties,
  } = props;

  const idToDos = shortid.generate();

  const onClick = (event: React.SyntheticEvent, todo: IToDos) => {
    const user = getUser();
    if (todo.createdby !== user._id) {
      showNotification({
        type: "warnig",
        title: "Operação não realizada!",
        description: "Você não pode modificar esse To Do, ele não lhe pertence",
      });

      return;
    }
    navigate("/toDos/view/" + todo._id);
  };

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const [text, setText] = React.useState(searchBy || "");

  const change = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearFilter();
    if (text.length !== 0 && e.target.value.length === 0) {
      onSearch();
    }
    setText(e.target.value);
  };

  const keyPress = (e: React.SyntheticEvent, a) => {
    // if (e.key === 'Enter') {
    if (text && text.trim().length > 0) {
      onSearch(text.trim());
    } else {
      onSearch();
    }
    // }
  };

  const click = (...e: any) => {
    if (text && text.trim().length > 0) {
      onSearch(text.trim());
    } else {
      onSearch();
    }
  };

  const callRemove = (doc: IToDos) => {
    const dialogOptions = {
      icon: <Delete />,
      title: "Remover exemplo",
      content: () => <p>{`Deseja remover o exemplo "${doc.title}"?`}</p>,
      actions: ({ closeDialog }: { closeDialog: () => void }) => [
        <Button variant={"outlined"} color={"secondary"} onClick={closeDialog}>
          {"Não"}
        </Button>,
        <Button
          variant={"contained"}
          onClick={() => {
            remove(doc);
            closeDialog();
          }}
          color={"primary"}
        >
          {"Sim"}
        </Button>,
      ],
    };
    showDialog(dialogOptions);
  };

  return (
    <PageLayout title={"Lista de To Do's"} actions={[]}>
      <TextField
        name={"pesquisar"}
        label={"Pesquisar"}
        value={text}
        onChange={change}
        onKeyPress={keyPress}
        placeholder="Digite aqui o que deseja pesquisa..."
        action={{ icon: "search", onClick: click }}
      />

      <List>
        {toDoss.map((todo, index) => (
          <ToDo
            todo={todo}
            index={index}
            home={false}
            showDrawer={showDrawer}
            onClick={onClick}
            callRemove={callRemove}
          />
        ))}
      </List>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        {/* @ts-ignore */}
        <Pagination
          count={Math.ceil(total / 4)}
          style={{ width: "fit-content", overflow: "unset" }}
          onChange={handleChangePage}
        />
      </div>

      <RenderComPermissao recursos={[Recurso.EXEMPLO_CREATE]}>
        <div style={appStyle.fabContainer}>
          <Fab
            id={"add"}
            onClick={() => navigate(`/toDos/create/${idToDos}`)}
            color={"primary"}
          >
            <Add />
          </Fab>
        </div>
      </RenderComPermissao>
    </PageLayout>
  );
};

export const subscribeConfig = new ReactiveVar<IConfigList>({
  pageProperties: {
    currentPage: 1,
    pageSize: 4,
  },
  sortProperties: { field: "createdat", sortAscending: true },
  filter: {},
  searchBy: null,
});

const toDosSearch = initSearch(
  toDosApi, // API
  subscribeConfig, // ReactiveVar subscribe configurations
  ["description"] // list of fields, pesquisa utilizando somente a descrição
);

let onSearchToDosTyping: any;

export const ToDosListContainer = withTracker(
  (props: IDefaultContainerProps) => {
    const { showNotification } = props;

    //Reactive Search/Filter
    const config = subscribeConfig.get();
    const sort = {
      [config.sortProperties.field]: config.sortProperties.sortAscending
        ? 1
        : -1,
    };
    toDosSearch.setActualConfig(config);

    //Subscribe parameters
    const filter = { ...config.filter };
    // const filter = filtroPag;
    const limit = config.pageProperties.pageSize;
    const skip =
      (config.pageProperties.currentPage - 1) * config.pageProperties.pageSize;

    //Collection Subscribe
    const subHandle = toDosApi.subscribe("toDosList", filter, {
      sort,
      limit,
      skip,
    });
    const toDoss = subHandle?.ready()
      ? toDosApi.find(filter, { sort }).fetch()
      : [];

    return {
      toDoss,
      loading: !!subHandle && !subHandle.ready(),
      remove: (doc: IToDos) => {
        toDosApi.remove(doc, (e: IMeteorError, r) => {
          if (!e) {
            showNotification({
              type: "success",
              title: "Operação realizada!",
              message: `O exemplo foi removido com sucesso!`,
            });
          } else {
            console.log("Error:", e);
            showNotification({
              type: "warning",
              title: "Operação não realizada!",
              message: `Erro ao realizar a operação: ${e.reason}`,
            });
          }
        });
      },
      searchBy: config.searchBy,
      onSearch: (...params: any) => {
        onSearchToDosTyping && clearTimeout(onSearchToDosTyping);
        onSearchToDosTyping = setTimeout(() => {
          config.pageProperties.currentPage = 1;
          subscribeConfig.set(config);
          toDosSearch.onSearch(...params);
        }, 1000);
      },
      total: subHandle ? subHandle.total : toDoss.length,
      pageProperties: config.pageProperties,
      filter,
      sort,
      setPage: (page = 1) => {
        config.pageProperties.currentPage = page;
        subscribeConfig.set(config);
      },
      setFilter: (newFilter = {}) => {
        config.filter = { ...filter, ...newFilter };
        Object.keys(config.filter).forEach((key) => {
          if (config.filter[key] === null || config.filter[key] === undefined) {
            delete config.filter[key];
          }
        });
        subscribeConfig.set(config);
      },
      clearFilter: () => {
        config.filter = {};
        subscribeConfig.set(config);
      },
      setSort: (sort = { field: "createdat", sortAscending: true }) => {
        config.sortProperties = sort;
        subscribeConfig.set(config);
      },
      setPageSize: (size = 4) => {
        config.pageProperties.pageSize = size;
        subscribeConfig.set(config);
      },
    };
  }
)(ToDosList);
