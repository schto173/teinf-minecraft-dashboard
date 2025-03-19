
# Minecraft Server with Node.js RCON Integration

## Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/schto173/teinf-minecraft-dashboard
   cd teinf-minecraft-dashboard
   ```

2. Edit the RCON password in the `.env` file:
   ```bash
   RCON_PASSWORD=your_secure_password_here
   ```

3. Start the services:
   ```bash
   docker compose up -d
   ```

4. Access the web interface at `http://localhost:3000`.

## How It Works

The setup consists of two main services that communicate via RCON:

- **Minecraft Server (Port 25565)**:
  - Uses the `itzg/minecraft-server` Docker image.
  - RCON is enabled on port `25575`.
  - World data is stored in the `./minecraft-server/data` directory.

- **Node.js App (Port 3000)**:
  - Connects to the Minecraft server via RCON.
  - Provides a web interface and API endpoints.
  - Displays player positions and allows sending commands like giving items.

## API Endpoints

### GET `/api/players`
- Returns a list of online players and their positions.
- Also provides server version and player count.

### POST `/api/give-diamond`
- Gives a diamond to a specified player.
- Requires the player's name in the request body:
  ```json
  {
    "playerName": "Player1"
  }
  ```

## Updating

When new code is pushed to the repository, follow these steps to update:

1. Pull the latest changes:
   ```bash
   git pull
   ```

2. Rebuild and restart the services:
   ```bash
   docker compose down
   docker compose build
   docker compose up -d
   ```

## Stopping

To stop all services, run:
```bash
docker compose down
```

## Troubleshooting

### If the Node.js app can't connect:
- Verify that the RCON password in the `.env` file matches the one in the `docker-compose.yml` file.
- Ensure the Minecraft server is fully started.
- Check the logs for errors:
  ```bash
  docker compose logs -f
  ```

### If ports are already in use:
- Change the ports in the `docker-compose.yml` file.
- Default ports:
  - `25565` for the Minecraft server.
  - `3000` for the Node.js app.

## File Structure

```
minecraft-nodejs-project/
├── docker-compose.yml     # Service configuration
├── .env                   # RCON password
├── nodejs-app/         
│   ├── Dockerfile         # Dockerfile for Node.js app
│   ├── src/            
│   │   └── index.js       # Main server code
│   └── public/            # Web interface
└── minecraft-server/   
    └── data/              # World data
```
```