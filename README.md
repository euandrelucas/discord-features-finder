# Discord Features Finder

- Este código pode acarretar problemas por API abuse, use por sua conta e risco
- Este código foi feito para encontrar servidores que possuem experimentos do discord ativos
- O código foi feito em javascript usando o discord.js v12 (o código será atualizado no futuro)

## Índice

- [Discord Features Finder](#discord-features-finder)
  - [Índice](#índice)
  - [Como Utilizar](#como-utilizar)
    - [Passo 1 - Clone o Repositório](#passo-1---clone-o-repositório)
    - [Passo 2 - Instale as Dependências](#passo-2---instale-as-dependências)
    - [Passo 3 - Defina as Configurações](#passo-3---defina-as-configurações)
    - [Passo 4 - Execute o Código](#passo-4---execute-o-código)
    - [Passo 5 - Aguarde até que o Bot retorne "\[INFO\] Experiment Found!" no Console](#passo-5---aguarde-até-que-o-bot-retorne-info-experiment-found-no-console)
  - [Como funciona?](#como-funciona)
  - [Avisos](#avisos)

## Como Utilizar

1 - Clone o Repositório.
2 - Instale as Dependências
3 - Defina as Configurações.
4 - Execute o Código.
5 - Aguarde até que o Bot retorne "[INFO] Experiment Found!" no Console.

### Passo 1 - Clone o Repositório

```bash
git clone https://github.com/andrelucaas/discord-features-finder/
```

### Passo 2 - Instale as Dependências

```bash
npm install
```

### Passo 3 - Defina as Configurações

- Edite o nome do arquivo "config.example.json" para "config.json" e configure da seguinte forma:

```json
{
    "guild": {
        "name": "ClydeAI", // Nome do Servidor que será criado
        "icon": "https://imgur.com/Cjyo6l5.png", // Link para o Ícone do Servidor que será criado
        "owner": "717766639260532826" // ID do Usuário que deverá receber posse do Servidor que será criado.
    },
    "experiment": {
        "id": "2023-03_clyde_ai", // ID do experiment a ser procurado (https://rollouts.advaith.io/)
        "position": 100, // Posição do experiment a ser procurado (Leia abaixo)
        "searchCooldown": 60 // Cooldown em segundos (Para evitar Rate Limit e Banimentos por Spam na API)
    },
    "bot": {
        "leaveGuilds": false, // Se ativado, caso o Bot esteja em mais de 9 servidores (10 ou mais) ele vai sair de todos os servidores até que tenham apenas 8.
        "token": "TOKEN" // O Token do bot ~~Lembre de manter ele privado a todo custo~~
    }
}
```

> O ID do experimento é o que vem logo abaixo do nome do experimento, [exemplo](https://i.imgur.com/rZp4k4a.png)
>
> A posição do experiment é o que geralmente vem escrito em "Treatment 1: Enabled: 100% (0 - 10000)", o número que vem depois do "-" é a posição que deve ser definida nas configurações

### Passo 4 - Execute o Código

```bash
npm start
```

### Passo 5 - Aguarde até que o Bot retorne "[INFO] Experiment Found!" no Console

```bash
[INFO] Experiment Found!
[INFO] Invite URL Saved!
```

Dai agora você apenas precisa abrir o arquivo "invite.txt" e o link do convite estará lá!

## Como funciona?

- Você deve pegar um experimento válido [aqui](https://rollouts.advaith.io)
- O Bot irá criar um servidor com o nome (e ícone) que você definiu nas [configurações](#passo-3---defina-as-configurações)
- O Bot irá testar o servidor para o experimento que você definiu nas [configurações](#passo-3---defina-as-configurações)
- O Bot irá transferir o servidor para o "dono" que você definiu nas [configurações](#passo-3---defina-as-configurações) assim que o mesmo entrar no dito servidor.

## Avisos

- ⚠️ Este código tende a ser lento por limitações do propio discord a bots criarem servidores
- 🔗 O convite do servidor será salvo no arquivo invite.txt
