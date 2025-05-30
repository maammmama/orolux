const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

// Store connected clients
const clients = new Map();
const adminClients = new Set();

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        
        if (data.type === 'admin_connect') {
            adminClients.add(ws);
            sendUsersList(ws);
        } else if (data.type === 'user_connect') {
            clients.set(data.userId, ws);
            broadcastToAdmins({
                type: 'user_status',
                userId: data.userId,
                status: 'online'
            });
        } else if (data.type === 'admin_message') {
            const userWs = clients.get(data.userId);
            if (userWs) {
                userWs.send(JSON.stringify({
                    type: 'message',
                    message: data.message
                }));
            }
            broadcastToAdmins({
                type: 'new_message',
                userId: data.userId,
                message: data.message
            });
        } else if (data.type === 'user_message') {
            broadcastToAdmins({
                type: 'new_message',
                userId: data.userId,
                message: data.message
            });
        }
    });

    ws.on('close', () => {
        if (adminClients.has(ws)) {
            adminClients.delete(ws);
        } else {
            for (const [userId, userWs] of clients.entries()) {
                if (userWs === ws) {
                    clients.delete(userId);
                    broadcastToAdmins({
                        type: 'user_status',
                        userId: userId,
                        status: 'offline'
                    });
                    break;
                }
            }
        }
    });
});

function broadcastToAdmins(message) {
    adminClients.forEach(client => {
        client.send(JSON.stringify(message));
    });
}

function sendUsersList(ws) {
    const users = Array.from(clients.keys()).map(userId => ({
        id: userId,
        status: 'online',
        // Add other user info as needed
    }));
    ws.send(JSON.stringify({
        type: 'users_list',
        users: users
    }));
}

console.log('WebSocket server running on port 8080');
