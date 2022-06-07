# Andamento

- [x] História BMR-01 – O sistema só estará disponível para o usuário logado, ou seja, o acesso aos seus módulos depende de login e senha

- [ ] História BMR-02 – Após fazer login no sistema o usuário será encaminhado para uma tela de boas vindas que apresentará….

  - [ ] uma lista com as 05 últimas tarefas adicionadas/atualizadas, com suas respectivas situações, com o título: “Atividades recentes”.
    - [ ] ATENÇÃO: O filtro deve ser feito do lado do servidor, utilizando as publicações do meteor.
  - [ ] A tela deverá apresentar também um botão para acessar as tarefas do usuário, com o título “Minhas Tarefas”. Ao clicar nesse botão o usuário deverá ser encaminhado para a tela do módulo ToDo List.
  - [ ] Obs: Deve ser possível voltar para a tela de boas vindas e/ou acessar a tela do módulo ToDoList através do menu da aplicação.

- [x] História BMR-03 – “ToDo List” com inserção,edição e lista de tarefas.

  - [x] Crie um novo módulo, chamado 'toDos'
  - [x] A lista de tarefas deverá ser implementada com o componente List, exibindo um ícone ou imagem que corresponda à idéia de item, a descrição da tarefa no texto primário e o nome do usuário que criou a tarefa no texto secundário.
  - [x] Ao clicar em “Adicionar” deverá ser exibida uma tela para fazer a inserçaõ. Após inserir a tarefa o sistema deve voltar para a tela que lista todas as tarefas. A tarefa que acaba de ser inserida deve ter a situação “Não concluída”. A tarefa deve ter um campo “descrição” que é o campo que será exibido na lista. Ao incluir uma tarefa, mostrar uma notificação de sucesso/erro, caso a inserção tenha sido bem/mal sucedida. (usar o método showNotification, provido pelo Boilerplate)
  - [x] Deve ser possível editar uma tarefa acionamento um botão que corresponda à tarefa exibida na lista. De preferência esse botão deve ser um ícone. Ao clicar nesse botão deve ser exibida uma tela que permite realizar a edição da tarefa. Ao editá-la o sistema deve voltar para a tela que lista todas as tarefas.
  - [x] EXTRA: Ao clicar na tarefa a visuaização dela deve ser exibida em uma tela modal.
  - [x] EXTRA: Fazer a mensagem de sucesso/erro vir do backend.
