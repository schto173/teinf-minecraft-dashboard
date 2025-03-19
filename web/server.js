const express = require('express');
const util = require('minecraft-server-util');
const { Rcon } = require('rcon-client');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

// Your specific server configuration
const MC_SERVER = {
    host: 'mc',
    port: 25565,
    rconPort: 25575,
    rconPassword: process.env.RCON_PASSWORD
};

// Function to get player position using RCON
async function getPlayerPosition(playerName) {
    const rcon = new Rcon({
        host: MC_SERVER.host,
        port: MC_SERVER.rconPort,
        password: MC_SERVER.rconPassword
    });

    try {
        await rcon.connect();
        const response = await rcon.send(`data get entity ${playerName} Pos`);
        await rcon.end();

        // Parse position from response
        if (response.includes("No entity was found")) {
            return null;
        }

        const posMatch = response.match(/\[(.*?)\]/);
        if (posMatch) {
            const coords = posMatch[1].split(',').map(num => parseFloat(num.trim()));
            return { x: coords[0], y: coords[1], z: coords[2] };
        }
        return null;
    } catch (err) {
        console.error('RCON Error:', err);
        return null;
    }
}

// Get online players and their positions
app.get('/api/players', async (req, res) => {
    try {
        const options = {
            timeout: 5000,
            enableSRV: true
        };

        const status = await util.status(MC_SERVER.host, MC_SERVER.port, options);
        const players = [];

        if (status.players.sample) {
            for (const player of status.players.sample) {
                const position = await getPlayerPosition(player.name);
                players.push({
                    name: player.name,
                    position: position || { x: 0, y: 64, z: 0 }
                });
            }
        }

        res.json({
            players,
            online: status.players.online,
            max: status.players.max,
            version: status.version.name
        });
    } catch (err) {
        console.error('Server Status Error:', err);
        res.status(503).json({
            error: 'Server not ready or unavailable',
            players: [],
            online: 0,
            max: 0
        });
    }
});

// Give diamond to player
app.post('/api/give-diamond', async (req, res) => {
    const { playerName } = req.body;
    
    try {
        const rcon = new Rcon({
            host: MC_SERVER.host,
            port: MC_SERVER.rconPort,
            password: MC_SERVER.rconPassword
        });

        await rcon.connect();
        const response = await rcon.send(`give ${playerName} diamond 1`);
        await rcon.end();

        res.json({
            success: true,
            message: `Gave diamond to ${playerName}`,
            serverResponse: response
        });
    } catch (err) {
        console.error('RCON Error:', err);
        res.status(500).json({
            error: 'Failed to execute command',
            details: err.message
        });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log('Minecraft server configuration:', {
        ...MC_SERVER,
        rconPassword: '****'
    });
});