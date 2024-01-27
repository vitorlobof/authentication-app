# Sistema de Autenticação

Este projeto consiste em um sistema de autenticação. O backend foi desenvolvido utilizando o framework Django, e a autenticação é realizada através de JWT.

## Como Iniciar

### Backend

1. No terminal, navegue até o diretório "backend" utilizando o comando `cd backend` e certifique-se de que todos os requisitos listados no arquivo `backend/requirements.txt` foram instalados.

2. Crie um arquivo `.env` contendo as seguintes informações:

    ```env
    DEBUG=True
    ROOT=http://127.0.0.1:8000
    EMAIL_USER=example@gmail.com
    EMAIL_PASSWORD=example_password
    ```

3. Após configurar o arquivo `.env`, execute o seguinte comando no terminal para iniciar o servidor:

    ```bash
    python manage.py runserver
    ```

### Frontend

1. Abra um novo terminal e inicie o servidor do frontend utilizando um dos seguintes comandos:

    ```bash
    npm run dev
    # ou
    yarn dev
    # ou
    pnpm dev
    ```

2. Acesse [http://localhost:3000](http://localhost:3000) no seu navegador para visualizar o resultado.
