export const toDosSch = {
  image: {
    type: String,
    label: "Imagem",
    defaultValue: "",
    optional: true,
    isImage: true,
  },
  title: {
    type: String,
    label: "Título",
    defaultValue: "",
    optional: true,
  },
  description: {
    type: String,
    label: "Descrição",
    defaultValue: "",
    optional: true,
  },
  private: {
    type: Boolean,
    label: "É privado?",
    defaultValue: false,
    optional: true,
    options: [
      { value: true, label: "Sim" },
      { value: false, label: "Não" },
    ],
  },
  check: {
    type: String,
    label: "check box",
    optional: true,
    options: [
      { value: "Concluída", label: "Concluída" },
      { value: "Não Concluída", label: "Não Concluída" },
    ],
  },
};

export interface IToDos {
  _id?: string;
  image: string;
  title: string;
  description: string;
  private: Boolean;
  check: String;
  createdat: Date;
  updatedat: Date;
  createdby: string;
}
