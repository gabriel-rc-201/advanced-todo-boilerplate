import React from "react";
import Meteor from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import { exampleApi } from "../../api/exampleApi";
import SimpleForm from "../../../../ui/components/SimpleForm/SimpleForm";
import Button from "@mui/material/Button";
import FormGroup from "@mui/material/FormGroup";
import TextField from "/imports/ui/components/SimpleFormFields/TextField/TextField";
import TextMaskField from "../../../../ui/components/SimpleFormFields/TextMaskField/TextMaskField";
import RadioButtonField from "../../../../ui/components/SimpleFormFields/RadioButtonField/RadioButtonField";
import SelectField from "../../../../ui/components/SimpleFormFields/SelectField/SelectField";
import UploadFilesCollection from "../../../../ui/components/SimpleFormFields/UploadFiles/uploadFilesCollection";
import ChipInput from "../../../../ui/components/SimpleFormFields/ChipInput/ChipInput";
import SliderField from "/imports/ui/components/SimpleFormFields/SliderField/SliderField";
import AudioRecorder from "/imports/ui/components/SimpleFormFields/AudioRecorderField/AudioRecorder";
import ImageCompactField from "/imports/ui/components/SimpleFormFields/ImageCompactField/ImageCompactField";
import Print from "@mui/icons-material/Print";
import Close from "@mui/icons-material/Close";
import { PageLayout } from "/imports/ui/layouts/pageLayout";
import { IExample } from "../../api/exampleSch";
import { IMeteorError } from "/imports/typings/BoilerplateDefaultTypings";
import { useTheme } from "@mui/material/styles";

interface IExampleDetail {
  screenState: string;
  loading: boolean;
  isPrintView: boolean;
  exampleDoc: IExample;
  save: (doc: IExample, callback?: () => void) => void;
  navigate: (url: string | -1, state?: object) => void;
}

const ExampleDetail = (props: IExampleDetail) => {
  const { isPrintView, screenState, loading, exampleDoc, save, navigate } =
    props;

  const theme = useTheme();

  const handleSubmit = (doc: IExample) => {
    save(doc);
  };

  return (
    <PageLayout
      title={
        screenState === "view"
          ? "Visualizar exemplo"
          : screenState === "edit"
          ? "Editar Exemplo"
          : "Criar exemplo"
      }
      onBack={() => navigate("/example")}
      actions={[
        !isPrintView ? (
          <span
            style={{
              cursor: "pointer",
              marginRight: 10,
              color: theme.palette.secondary.main,
            }}
            onClick={() => {
              navigate(`/example/printview/${exampleDoc._id}`);
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
              navigate(`/example/view/${exampleDoc._id}`);
            }}
          >
            <Close />
          </span>
        ),
      ]}
    >
      <SimpleForm
        mode={screenState}
        schema={exampleApi.getSchema()}
        doc={exampleDoc}
        onSubmit={handleSubmit}
        loading={loading}
      >
        <ImageCompactField label={"Imagem Zoom+Slider"} name={"image"} />

        <FormGroup key={"fieldsOne"}>
          <TextField placeholder="Titulo" name="title" />
          <TextField placeholder="Descri????o" name="description" />
        </FormGroup>
        <FormGroup key={"fieldsTwo"}>
          <SelectField placeholder="Selecione um tipo" name="type" />
          <SelectField placeholder="Selecione alguns tipos" name="typeMulti" />
        </FormGroup>
        <FormGroup key={"fieldsThree"} formType={"subform"} name={"contacts"}>
          <TextMaskField placeholder="Telefone" name="phone" />
          <TextMaskField placeholder="CPF" name="cpf" />
        </FormGroup>
        <FormGroup key={"fieldsFour"} formType={"subformArray"} name={"tasks"}>
          <TextField placeholder="Nome da Tarefa" name="name" />
          <TextField placeholder="Descri????o da Tarefa" name="description" />
        </FormGroup>

        <SliderField placeholder="Slider" name="slider" />

        <RadioButtonField
          placeholder="Op????es da Tarefa"
          name="statusRadio"
          options={[
            { value: "valA", label: "Valor A" },
            { value: "valB", label: "Valor B" },
            { value: "valC", label: "Valor C" },
          ]}
        />

        <FormGroup key={"fields"}>
          <AudioRecorder placeholder="??udio" name="audio" />
        </FormGroup>

        <UploadFilesCollection
          name="files"
          label={"Arquivos"}
          doc={exampleDoc}
        />
        <FormGroup key={"fieldsFive"} name={"chips"}>
          <ChipInput name="chip" placeholder="Chip" />
        </FormGroup>
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
                  ? () => navigate(`/example/view/${exampleDoc._id}`)
                  : () => navigate(`/example/list`)
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
                navigate(`/example/edit/${exampleDoc._id}`);
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

interface IExampleDetailContainer {
  screenState: string;
  id: string;
  navigate: (url: string | -1, state?: object) => void;
  showNotification: (data: {
    type: string;
    title: string;
    description: string;
  }) => void;
}

export const ExampleDetailContainer = withTracker(
  (props: IExampleDetailContainer) => {
    const { screenState, id, navigate, showNotification } = props;

    const subHandle = !!id
      ? exampleApi.subscribe("exampleDetail", { _id: id })
      : null;
    let exampleDoc =
      id && subHandle?.ready() ? exampleApi.findOne({ _id: id }) : {};

    return {
      screenState,
      exampleDoc,
      save: (doc: IExample, callback: () => void) => {
        const selectedAction = screenState === "create" ? "insert" : "update";
        exampleApi[selectedAction](doc, (e: IMeteorError, r: string) => {
          if (!e) {
            navigate(`/example/view/${screenState === "create" ? r : doc._id}`);
            showNotification({
              type: "success",
              title: "Opera????o realizada!",
              description: `O exemplo foi ${
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
)(ExampleDetail);
