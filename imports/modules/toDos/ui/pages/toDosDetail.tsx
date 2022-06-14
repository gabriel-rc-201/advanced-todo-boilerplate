import React from "react";
import Meteor from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import { IToDos } from "../../api/toDosSch";
import { toDosApi } from "../../api/toDosApi";
import SimpleForm from "../../../../ui/components/SimpleForm/SimpleForm";
import SelectField from "../../../../ui/components/SimpleFormFields/SelectField/SelectField";
import { getUser } from "/imports/libs/getUser";
import * as appStyle from "/imports/materialui/styles";
import { PageLayout } from "/imports/ui/layouts/pageLayout";
import { showNotification } from "/imports/ui/AppGeneralComponents";
import { IMeteorError } from "/imports/typings/BoilerplateDefaultTypings";
import TextField from "/imports/ui/components/SimpleFormFields/TextField/TextField";
import ImageCompactField from "/imports/ui/components/SimpleFormFields/ImageCompactField/ImageCompactField";
import Print from "@mui/icons-material/Print";
import Close from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import { useTheme } from "@mui/material/styles";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";

interface IToDosDetail {
  screenState: string;
  loading: boolean;
  isPrintView: boolean;
  toDosDoc: IToDos;
  save: (doc: IToDos, callback?: () => void) => void;
  navigate: (url: string | -1, state?: object) => void;
}

const ToDosDetail = (props: IToDosDetail) => {
  const { isPrintView, screenState, loading, toDosDoc, save, navigate } = props;

  const theme = useTheme();

  const handleSubmit = (doc: IToDos) => {
    save(doc);
  };

  return (
    <PageLayout
      title={
        screenState === "view"
          ? "Visualizar To Do"
          : screenState === "edit"
          ? "Editar To Do"
          : "Criar To Do"
      }
      onBack={() => navigate("/toDos")}
      actions={[
        !isPrintView ? (
          <span
            style={{
              cursor: "pointer",
              marginRight: 10,
              color: theme.palette.secondary.main,
            }}
            onClick={() => {
              navigate(`/toDos/printview/${toDosDoc._id}`);
            }}
          >
            <Print />
          </span>
        ) : (
          <span
            style={{
              cursor: "pointer",
              marginRight: 10,
              color: theme.palette.secondary.main,
            }}
            onClick={() => {
              navigate(`/toDos/view/${toDosDoc._id}`);
            }}
          >
            <Close />
          </span>
        ),
      ]}
    >
      <SimpleForm
        mode={screenState}
        schema={toDosApi.getSchema()}
        doc={toDosDoc}
        onSubmit={handleSubmit}
        loading={loading}
      >
        <ImageCompactField label={"Imagem Zoom+Slider"} name={"image"} />

        {screenState === "view" ? (
          <>
            <Typography variant="h1" sx={appStyle.h1(1)} gutterBottom>
              {toDosDoc.title}
            </Typography>
            <Typography sx={appStyle.body1(1)} gutterBottom>
              {toDosDoc.description}
            </Typography>
            <br />
            <br />
            <Typography sx={appStyle.body1(1)} gutterBottom>
              {`Situação: ${toDosDoc.check}`}
            </Typography>
            <Typography sx={appStyle.body1(1)} gutterBottom>
              {`Privado: ${toDosDoc.private ? "Sim" : "Não"}`}
            </Typography>
          </>
        ) : (
          <>
            <FormGroup key={"fieldsOne"}>
              <TextField placeholder="Título" name="title" />
              <TextField placeholder="Descrição" multiline name="description" />
            </FormGroup>

            <FormGroup key={"fieldsTwo"}>
              {screenState !== "create" ? (
                <SelectField
                  name="check"
                  options={[
                    {
                      value: "Concluída",
                      label: "Concluída",
                      description: "tarefa concluída",
                    },
                    {
                      value: "Não Concluída",
                      label: "Não Concluída",
                      description: "tarefa não concluída",
                    },
                  ]}
                />
              ) : (
                <></>
              )}

              <FormControlLabel
                control={<Switch />}
                label="Privado"
                name="private"
              />
            </FormGroup>
          </>
        )}
        <div
          key={"Buttons"}
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "left",
            paddingTop: 20,
            paddingBottom: 20,
          }}
        >
          {!isPrintView ? (
            <Button
              key={"b1"}
              style={{ marginRight: 10 }}
              onClick={
                screenState === "edit"
                  ? () => navigate(`/toDos/view/${toDosDoc._id}`)
                  : () => navigate(`/toDos/list`)
              }
              color={"secondary"}
              variant="contained"
            >
              {screenState === "view" ? "Voltar" : "Cancelar"}
            </Button>
          ) : null}

          {!isPrintView && screenState === "view" ? (
            <Button
              key={"b2"}
              onClick={() => {
                const user = getUser();
                if (toDosDoc.createdby !== user._id) {
                  showNotification({
                    type: "warnig",
                    title: "Operação não realizada!",
                    description:
                      "Você não pode modificar esse To Do, ele não lhe pertence",
                  });
                  return;
                }
                navigate(`/toDos/edit/${toDosDoc._id}`);
              }}
              color={"primary"}
              variant="contained"
            >
              {"Editar"}
            </Button>
          ) : null}
          {!isPrintView && screenState !== "view" ? (
            <Button
              key={"b3"}
              color={"primary"}
              variant="contained"
              submit="true"
            >
              {"Salvar"}
            </Button>
          ) : null}
        </div>
      </SimpleForm>
    </PageLayout>
  );
};

interface IToDosDetailContainer {
  screenState: string;
  id: string;
  navigate: (url: string | -1, state?: object) => void;
  showNotification: (data: {
    type: string;
    title: string;
    description: string;
  }) => void;
}

export const ToDosDetailContainer = withTracker(
  (props: IToDosDetailContainer) => {
    const { screenState, id, navigate, showNotification } = props;

    const subHandle = !!id
      ? toDosApi.subscribe("toDosDetail", { _id: id })
      : null;
    let toDosDoc =
      id && subHandle?.ready() ? toDosApi.findOne({ _id: id }) : {};

    return {
      screenState,
      toDosDoc,
      save: (doc: IToDos, callback: () => void) => {
        const selectedAction = screenState === "create" ? "insert" : "update";
        if (selectedAction === "insert") doc.check = "Não Concluída";

        toDosApi[selectedAction](doc, (e: IMeteorError) => {
          if (!e) {
            navigate(`/toDos/list`);
            showNotification({
              type: "success",
              title: "Operação realizada!",
              description: `O To Do foi ${
                doc._id ? "atualizado" : "cadastrado"
              } com sucesso!`,
            });
          } else {
            console.log("Error:", e);
            showNotification({
              type: "warning",
              title: "Operação não realizada!",
              description: `Erro ao realizar a operação: ${e.reason}`,
            });
          }
        });
      },
    };
  }
)(ToDosDetail);
