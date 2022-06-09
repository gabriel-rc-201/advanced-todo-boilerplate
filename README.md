# Andamento

- [x] História BMR-01 – O sistema só estará disponível para o usuário logado, ou seja, o acesso aos seus módulos depende de login e senha

- [x] História BMR-02 – Após fazer login no sistema o usuário será encaminhado para uma tela de boas vindas que apresentará….

  - [x] uma lista com as 05 últimas tarefas adicionadas/atualizadas, com suas respectivas situações, com o título: “Atividades recentes”.
    - [x] ATENÇÃO: O filtro deve ser feito do lado do servidor, utilizando as publicações do meteor.
  - [x] A tela deverá apresentar também um botão para acessar as tarefas do usuário, com o título “Minhas Tarefas”. Ao clicar nesse botão o usuário deverá ser encaminhado para a tela do módulo ToDo List.
  - [x] Obs: Deve ser possível voltar para a tela de boas vindas e/ou acessar a tela do módulo ToDoList através do menu da aplicação.
    > para fazer a home vou precisar
    > do usuário, pra poder dar olá no nome dele,
    > da lista dos ultimos 5 todos adicionados/atualizados
    > verificar a parte dos subscribes como filtro

- [x] História BMR-03 – “ToDo List” com inserção,edição e lista de tarefas.

  - [x] Crie um novo módulo, chamado 'toDos'
  - [x] A lista de tarefas deverá ser implementada com o componente List, exibindo um ícone ou imagem que corresponda à idéia de item, a descrição da tarefa no texto primário e o nome do usuário que criou a tarefa no texto secundário.
  - [x] Ao clicar em “Adicionar” deverá ser exibida uma tela para fazer a inserçaõ. Após inserir a tarefa o sistema deve voltar para a tela que lista todas as tarefas. A tarefa que acaba de ser inserida deve ter a situação “Não concluída”. A tarefa deve ter um campo “descrição” que é o campo que será exibido na lista. Ao incluir uma tarefa, mostrar uma notificação de sucesso/erro, caso a inserção tenha sido bem/mal sucedida. (usar o método showNotification, provido pelo Boilerplate)
  - [x] Deve ser possível editar uma tarefa acionamento um botão que corresponda à tarefa exibida na lista. De preferência esse botão deve ser um ícone. Ao clicar nesse botão deve ser exibida uma tela que permite realizar a edição da tarefa. Ao editá-la o sistema deve voltar para a tela que lista todas as tarefas.
  - [x] EXTRA: Ao clicar na tarefa a visuaização dela deve ser exibida em uma tela modal.
  - [x] EXTRA: Fazer a mensagem de sucesso/erro vir do backend.
  - [x] Ao clicar no “Check” da tarefa ela deve ser marcada como “Concluída”. Se o usuário clicar novamente ela deve mudar de situação para “Não concluída”. Adote alguma referência visual o textual para informar que a tarefa está concluída.
  - [x] Assim como há um ícone para editar a tarefa, deve existir um ícone também que permite excluir a tarefa. Se preferir, pode adicionar um menu que contém as duas opções: Editar ou Excluir.

- [x] História BMR-04 – Altere o sistema para permitir que somente o usuário que criou a tarefa consiga alterá-la ou excluí-la no entanto, todos podem vê-la.

- [x] História BMR-05 – Altere o sistema para permitir que seja informada se a tarefa é pessoal ou não. Neste caso, se for uma tarefa pessoal, somente o usuário que criou a tarefa pode vê-la.

  - [x] A definição se a tarefa é pessoal ou não será realizada na tela de criação/edição da tarefa.
  - [x] Obs: trate essa restrição de visibilidade através da publicação do Meteor.
  - [x] Permitir que a definição seja feita usando um Switch (componente do Material UI)
  - [ ] EXTRA: Criar um wrapper para o Switch, tal como os outros componentes do SimpleForm

- [x] História BMR-06 – Deve existir uma campo de pesquisa acima da lista de tarefas do módulo ToDoList de forma que o usuário consiga pesquisar as tarefas por alguma palavra que faz parte da sua descrição. **ATENÇÃO:** O filtro deve ser feito do lado do servidor, utilizando as publicações do meteor.

- [x] História BMR-07 – EXTRA: Na lista de tarefas, altere o ícone/imagem de forma que se a tarefa estiver aberta ela irá exibir um ícone de tarefa aberta e se estiver concluída deverá exibir um ícone informando que a tarefa está concluída.

  > aqui o icone utilizado foi a imagem escolhido pelo usuário

- [x] História BMR-08 – EXTRA: Adicione paginação na lista sde tarefas. O tamanho máximo da página deve ser de 4 tarefas por página.
      Observação: Utilize SKIP e LIMIT nas pesquisas via MongoDB.
      ATENÇÃO: O filtro deve ser feito do lado do servidor, utilizando as publicações do meteor

- [ ] História BMR-09 – EXTRA: Ajuste visualmente sua aplicação
  - [ ] Ajuste o estilo da aplicação para ela funcionar bem no celular
    > Obs: utilize as configurações do browser (F12) para “simular” um acesso pelo celular.
  - [ ] exercite seus conhecimentos de CSS e criação de componentes REACT.
  - [ ] Faça alterações no tema: altere cores primérias, secundárias, etc.
