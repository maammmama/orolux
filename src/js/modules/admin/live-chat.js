// Replace mock data initialization with WebSocket connection
        let ws;
        let state = {
            currentUser: null,
            users: [],
            messages: {},
            searchTerm: ''
        };

        function connectWebSocket() {
            ws = new WebSocket('ws://localhost:8080');

            ws.onopen = () => {
                console.log('Connected to chat server');
                document.querySelector('.status-dot').classList.add('online');
            };

            ws.onclose = () => {
                console.log('Disconnected from chat server');
                document.querySelector('.status-dot').classList.remove('online');
                // Attempt to reconnect after 5 seconds
                setTimeout(connectWebSocket, 5000);
            };

            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                handleWebSocketMessage(data);
            };
        }

        function handleWebSocketMessage(data) {
            switch(data.type) {
                case 'users_list':
                    state.users = data.users;
                    renderUserList();
                    break;
                case 'new_message':
                    if (!state.messages[data.userId]) {
                        state.messages[data.userId] = [];
                    }
                    state.messages[data.userId].push(data.message);
                    updateUserLastMessage(data.userId, data.message);
                    if (state.currentUser?.id === data.userId) {
                        renderChatWindow();
                    }
                    renderUserList();
                    break;
                case 'user_status':
                    const user = state.users.find(u => u.id === data.userId);
                    if (user) {
                        user.status = data.status;
                        renderUserList();
                        if (state.currentUser?.id === data.userId) {
                            renderChatWindow();
                        }
                    }
                    break;
            }
        }

        function updateUserLastMessage(userId, message) {
            const user = state.users.find(u => u.id === userId);
            if (user) {
                user.lastMessage = message.text;
                user.lastMessageTime = message.time;
                if (state.currentUser?.id !== userId) {
                    user.unread = (user.unread || 0) + 1;
                }
            }
        }

        // DOM elements
        const userListEl = document.getElementById('userList');
        const chatContentEl = document.getElementById('chatContent');
        const userSearchEl = document.getElementById('userSearch');

        // Initialize the app with WebSocket connection
        function init() {
            connectWebSocket();
            setupEventListeners();
        }

        // Set up event listeners
        function setupEventListeners() {
            userSearchEl.addEventListener('input', (e) => {
                state.searchTerm = e.target.value.toLowerCase();
                renderUserList();
            });

            // Simulate sending a message
            document.addEventListener('click', (e) => {
                if (e.target.classList.contains('send-button') && state.currentUser) {
                    const input = document.querySelector('.chat-input');
                    const message = input.value.trim();
                    
                    if (message) {
                        sendMessage(state.currentUser.id, message);
                        input.value = '';
                    }
                }
            });

            // Handle pressing Enter to send message
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && state.currentUser && !e.shiftKey) {
                    e.preventDefault();
                    const input = document.querySelector('.chat-input');
                    const message = input.value.trim();
                    
                    if (message) {
                        sendMessage(state.currentUser.id, message);
                        input.value = '';
                    }
                }
            });
        }

        // Render the user list
        function renderUserList() {
            userListEl.innerHTML = '';
            
            const filteredUsers = state.users.filter(user => 
                user.name.toLowerCase().includes(state.searchTerm) || 
                user.id.toLowerCase().includes(state.searchTerm)
            );

            if (filteredUsers.length === 0) {
                userListEl.innerHTML = `
                    <div class="empty-state" style="color: var(--text-light); padding: 20px;">
                        <div class="empty-state-icon">🔍</div>
                        <p>No users found</p>
                    </div>
                `;
                return;
            }

            filteredUsers.forEach(user => {
                const userEl = document.createElement('div');
                userEl.className = `user-item ${state.currentUser?.id === user.id ? 'active' : ''}`;
                userEl.innerHTML = `
                    <div class="user-avatar">
                        ${user.avatar}
                        <div class="user-status ${user.status}"></div>
                    </div>
                    <div class="user-info">
                        <div class="user-name">
                            <span>${user.name}</span>
                            ${user.unread > 0 ? `<span class="unread-count">${user.unread}</span>` : ''}
                        </div>
                        <div class="user-last-msg">
                            ${user.lastMessage}
                        </div>
                    </div>
                    <div class="user-time">
                        ${user.lastMessageTime}
                    </div>
                `;
                userEl.addEventListener('click', () => selectUser(user.id));
                userListEl.appendChild(userEl);
            });
        }

        // Select a user to chat with
        function selectUser(userId) {
            const user = state.users.find(u => u.id === userId);
            if (!user) return;

            state.currentUser = user;
            
            // Mark messages as read
            user.unread = 0;
            
            renderUserList();
            renderChatWindow();
        }

        // Render the chat window for the selected user
        function renderChatWindow() {
            if (!state.currentUser) {
                chatContentEl.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">💬</div>
                        <h3>No chat selected</h3>
                        <p>Select a user from the sidebar to start chatting</p>
                    </div>
                `;
                return;
            }

            const user = state.currentUser;
            const messages = state.messages[user.id] || [];

            chatContentEl.innerHTML = `
                <div class="chat-header">
                    <div class="chat-header-avatar">
                        ${user.avatar}
                        <div class="chat-header-status ${user.status}"></div>
                    </div>
                    <div class="chat-header-info">
                        <h3>${user.name}</h3>
                        <p>
                            <span class="chat-header-status ${user.status}"></span>
                            ${user.status === 'online' ? 'Online' : 'Offline'}
                        </p>
                    </div>
                </div>
                <div class="chat-messages" id="chatMessages">
                    ${messages.map(msg => renderMessage(msg)).join('')}
                    ${user.typing ? `
                        <div class="typing-indicator">
                            <span></span>
                            <span></span>
                            <span></span>
                            <span>${user.name} is typing...</span>
                        </div>
                    ` : ''}
                </div>
                <div class="chat-input-container">
                    <textarea class="chat-input" placeholder="Type your message here..." rows="1"></textarea>
                    <button class="send-button" ${user.status === 'offline' ? 'disabled' : ''}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22 2L11 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
            `;

            // Auto-scroll to bottom of chat
            const chatMessagesEl = document.getElementById('chatMessages');
            if (chatMessagesEl) {
                chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
            }

            // Auto-resize textarea
            const textarea = document.querySelector('.chat-input');
            if (textarea) {
                textarea.addEventListener('input', function() {
                    this.style.height = 'auto';
                    this.style.height = (this.scrollHeight) + 'px';
                });
            }
        }

        // Render a single message
        function renderMessage(message) {
            const isAdmin = message.sender === 'admin';
            return `
                <div class="message ${isAdmin ? 'admin' : 'user'}">
                    <div class="message-content">${message.text}</div>
                    <div class="message-time">
                        ${message.time}
                        ${isAdmin && message.status ? `
                            <span class="message-status">${message.status === 'read' ? '✓✓' : '✓'}</span>
                        ` : ''}
                    </div>
                </div>
            `;
        }

        // Send a message to the current user
        function sendMessage(userId, text) {
            if (!text.trim() || !ws) return;

            const message = {
                type: 'admin_message',
                userId: userId,
                message: {
                    text: text,
                    time: getCurrentTime(),
                    sender: 'admin'
                }
            };

            ws.send(JSON.stringify(message));
        }

        // Initialize the app
        init();