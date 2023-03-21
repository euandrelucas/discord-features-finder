# Discord Features Founder
- Este código foi feito para encontrar servidores que possuem experimentos do discord ativos
- O código foi feito em javascript usando o discord.js v12 (o código será atualizado no futuro)
# Como usar:
- Baixe o código
- Instale as dependências
```bash
npm install
```
- Edite o arquivo config.example.json para config.json e configure da seguinte forma:
```json
{
    "guild": {
        "name": "Clyde IA", // Nome do Servidor
        "icon": "https://imgur.com/Cjyo6l5.png", // Link de alguma imagem para ser o icon
        "owner": "717766639260532826", // ID do cara que vai receber a posse quando entrar no servidor
        "experiment": "2023-03_clyde_ai", // Experimento que vai ser ativado
        "experimentPos": 100, // A posição do experimento
        "seconds": 30 // A cada quantos segundos o bot vai criar um servidor novo para ver se ele tem o experimento
    },
    "bot": {
        "exitGuilds": false, // Se o bot vai sair do servidor se ele estiver em mais de 10
        "token": "TOKEN" // O Token do Bot
    }
}
```
- Rode o código
```bash
npm start
```
# Como funciona:
- Você deve pegar um experimento válido em: https://rollouts.advaith.io
- O código vai criar um servidor com o nome que você colocou no config.json
- O código vai colocar o experimento que você colocou no config.json
- O código vai colocar o experimento na posição que você colocou no config.json
> A posição é o que geralmente vem escrito em "Treatment 1: Enabled: 100% (0 - 10000)", o número entre que vem depois do "-" é a posição que deve ser colocada
> Código do experimento, é o que vem embaixo do código do experimento, exemplo: 2023-03_clyde_ai
# Avisos
- ⚠️ Este código tende a ser lento por limitações do propio discord a bots criarem servidores
- 🔗 O convite do servidor será salvo no arquivo invite.txt