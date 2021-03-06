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
import Box from "@mui/material/Box";

interface IToDosDetail {
  screenState: string;
  loading: boolean;
  isPrintView: boolean;
  paragraphs: String[];
  toDosDoc: IToDos;
  save: (doc: IToDos, callback?: () => void) => void;
  navigate: (url: string | -1, state?: object) => void;
}

const ToDosDetail = (props: IToDosDetail) => {
  const {
    isPrintView,
    screenState,
    loading,
    paragraphs,
    toDosDoc,
    save,
    navigate,
  } = props;

  const theme = useTheme();

  const handleSubmit = (doc: IToDos) => {
    if (!!doc.private) save(doc);
    else {
      doc.private = false;
      save(doc);
    }
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
      <Box sx={{ margin: "3rem" }}>
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

              {paragraphs.map((p: String) => (
                <Typography
                  sx={{ ...appStyle.body1(1), textIndent: "2rem" }}
                  gutterBottom
                >
                  {p}
                </Typography>
              ))}

              <br />
              <br />
              <Typography sx={appStyle.body1(1)} gutterBottom>
                {`Situa????o: ${toDosDoc.check}`}
              </Typography>
              <Typography sx={appStyle.body1(1)} gutterBottom>
                {`Privado: ${toDosDoc.private ? "Sim" : "N??o"}`}
              </Typography>
            </>
          ) : (
            <>
              <FormGroup key={"fieldsOne"}>
                <TextField placeholder="T??tulo" name="title" />
                <TextField
                  placeholder="Descri????o"
                  multiline
                  name="description"
                />
              </FormGroup>

              <FormGroup key={"fieldsTwo"}>
                {screenState !== "create" ? (
                  <SelectField
                    name="check"
                    options={[
                      {
                        value: "Conclu??da",
                        label: "Conclu??da",
                        description: "tarefa conclu??da",
                      },
                      {
                        value: "N??o Conclu??da",
                        label: "N??o Conclu??da",
                        description: "tarefa n??o conclu??da",
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
                      title: "Opera????o n??o realizada!",
                      description:
                        "Voc?? n??o pode modificar esse To Do, ele n??o lhe pertence",
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
      </Box>
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

    let paragraphs = subHandle?.ready()
      ? !!toDosDoc
        ? toDosDoc.description.split(/\r?\n/)
        : []
      : [];

    return {
      screenState,
      toDosDoc,
      paragraphs,
      save: (doc: IToDos, callback: () => void) => {
        const selectedAction = screenState === "create" ? "insert" : "update";
        if (selectedAction === "insert") doc.check = "N??o Conclu??da";

        toDosApi[selectedAction](doc, (e: IMeteorError) => {
          if (!e) {
            navigate(`/toDos/list`);
            showNotification({
              type: "success",
              title: "Opera????o realizada!",
              description: `O To Do foi ${
                doc._id ? "atualizado" : "cadastrado"
              } com sucesso!`,
            });
          } else {
            console.log("Error:", e);
            showNotification({
              type: "warning",
              title: "Opera????o n??o realizada!",
              description: `Erro ao realizar a opera????o: ${e.reason}`,
            });
          }
        });
      },
    };
  }
)(ToDosDetail);
