Minecraft Server with Node.js RCON Integration
Quick Start
Clone the repository
bash
Copy Code
git clone https://github.com/yourusername/minecraft-nodejs-project.git
cd minecraft-nodejs-project
Edit the RCON password in .env file
bash
Copy Code
RCON_PASSWORD=your_secure_password_here
Start the services
bash
Copy Code
docker compose up -d
Access the web interface at http://localhost:3000
How It Works
The setup consists of two main services that communicate via RCON:

Minecraft Server (Port 25565)
Uses itzg/minecraft-server image
RCON enabled on port 25575
World data stored in ./minecraft-server/data
Node.js App (Port 3000)
Connects to Minecraft server via RCON
Provides web interface and API endpoints
Shows player positions and allows giving items
API Endpoints
GET /api/players

Returns online players and their positions
Shows server version and player count
POST /api/give-diamond

Gives a diamond to specified player
Requires player name in request body
Updating
When new code is pushed to the repository:

bash
Copy Code
# Pull latest changes
git pull

# Rebuild and restart
docker compose down
docker compose build
docker compose up -d
Stopping
Stop all services:

bash
Copy Code
docker compose down
Troubleshooting
If the Node.js app can't connect:

Verify RCON password matches in .env
Check if Minecraft server is fully started
Look at logs: docker compose logs -f
If ports are already in use:

Change ports in docker-compose.yml
Default ports: 25565 (Minecraft), 3000 (Web interface)
File Structure
minecraft-nodejs-project/
├── docker-compose.yml     # Service configuration
├── .env                   # RCON password
├── nodejs-app/           
│   ├── Dockerfile        
│   ├── src/              
│   │   └── index.js      # Main server code
│   └── public/           # Web interface
└── minecraft-server/     
    └── data/             # World data
