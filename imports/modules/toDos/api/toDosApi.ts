// region Imports
import { Meteor } from "meteor/meteor";
import { ProductBase } from "../../../api/productBase";
import { segurancaApi } from "/imports/seguranca/api/SegurancaApi";
import { Recurso } from "../config/Recursos";
import { toDosSch, IToDos } from "./toDosSch";
import { getUser } from "/imports/libs/getUser";
import { userprofileApi } from "/imports/userprofile/api/UserProfileApi";
import { check } from "meteor/check";
// endregion

class ToDosApi extends ProductBase<IToDos> {
  constructor() {
    super("toDos", toDosSch, {
      enableCallMethodObserver: true,
      enableSubscribeObserver: true,
    });

    this.addTransformedPublication(
      "toDosList",
      (filter = {}, options = {}) => {
        const user = getUser();

        if (!segurancaApi.podeAcessarRecurso(user, Recurso.EXEMPLO_VIEW))
          throw new Meteor.Error(
            "erro.toDos.permissaoInsuficiente",
            "Você não possui permissão o suficiente para visualizar estes dados!"
          );

        const newFilter = { ...filter };
        const newOptions = {
          ...options,
          projection: {
            _id: 1,
            image: 1,
            title: 1,
            description: 1,
            createdby: 1,
            check: 1,
          },
        };
        return this.defaultCollectionPublication(newFilter, newOptions);
      },
      (doc: IToDos & { nomeUsuario: string }) => {
        const userProfileDoc = userprofileApi
          .getCollectionInstance()
          .findOne({ _id: doc.createdby });
        return { ...doc, nomeUsuario: userProfileDoc?.username };
      }
    );

    this.addPublication("toDosDetail", (filter = {}, options = {}) => {
      const newFilter = { ...filter };
      const newOptions = { ...options };
      return this.defaultCollectionPublication(newFilter, newOptions);
    });

    this.registerMethod("checkToDo", this.serverCheckToDo);
  }

  serverCheckToDo = (id: String, currentCheck: String, contex) => {
    check(id, String);

    const toDo = {
      check: currentCheck === "Não Concluída" ? "Concluída" : "Não Concluída",
    };

    return this.serverUpdate({ _id: id, ...toDo }, contex);
  };

  checkToDo = (id: String, currentCheck: String, callback = () => {}) => {
    this.callMethod("checkToDo", id, currentCheck, callback);
  };
}

export const toDosApi = new ToDosApi();
