import React, { useEffect, useState, useRef } from 'react';

const Chat = () => {
    const [socket, setSocket] = useState(null);
    const [message, setMessage] = useState('');
    const [chatLog, setChatLog] = useState([]);
    const [status, setStatus] = useState('Connecting...');
    const [showNextButton, setShowNextButton] = useState(false);

    const chatLogRef = useRef(null); // 채팅 로그 스크롤을 자동으로 내려주기 위해 사용

    useEffect(() => {
        const jwtToken = localStorage.getItem('jwtToken'); // localStorage에서 JWT 토큰을 가져옴
        if (!jwtToken) {
            setStatus('JWT 토큰이 없습니다.');
            return;
        }

        // WebSocket 연결 생성
        const newSocket = new WebSocket('ws://localhost/chat');
        setSocket(newSocket);

        newSocket.onopen = () => {
            console.log('Connected to server');
            setStatus('Connected');
            addMessageToLog('Server', '무슨 내용의 책을 작성하고 싶나요?');

            // WebSocket 연결 성공 시 JWT 토큰을 서버에 전송하여 인증
            // const authMessage = { type: 'AUTH', token: jwtToken };
            // newSocket.send(JSON.stringify(authMessage)); // 인증 메시지 전송
        };

        newSocket.onmessage = (event) => {
            console.log('Message from server:', event.data);

            const serverMessage = JSON.parse(event.data);
            addMessageToLog('Server', serverMessage.message);

            if (serverMessage.message.includes('Q&A session complete')) {
                setShowNextButton(true);
            }
        };

        newSocket.onclose = () => {
            console.log('Disconnected from server');
            setStatus('Disconnected');
            setShowNextButton(true);
        };

        newSocket.onerror = (error) => {
            console.error('WebSocket error:', error);
            setStatus('Error');
        };

        return () => {
            if (newSocket) newSocket.close();
        };
    }, []);

    const addMessageToLog = (sender, message) => {
        setChatLog((prevLog) => [...prevLog, { sender, message }]);

        // 새 메시지 수신 시 스크롤을 맨 아래로 이동
        setTimeout(() => {
            chatLogRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleSendMessage = () => {
        const jwtToken = localStorage.getItem('jwtToken'); // localStorage에서 JWT 토큰을 가져옴
        if (message.trim() !== '' && socket) {
            const messageObject = { message: message, token: jwtToken, isGeneralChatEnd: true}; // 메시지와 JWT 토큰을 전송
            socket.send(JSON.stringify(messageObject));
            addMessageToLog('You', message);
            setMessage('');
        }
    };

    const handleDisconnect = () => {
        if (socket) socket.close();
    };

    const redirectToSummaryPage = () => {
        fetch('/api/auth/profile')
            .then((response) => {
                if (!response.ok) throw new Error('Profile data could not be fetched.');
                return response.json();
            })
            .then((profile) => {
                const storyId = profile.storyId;
                if (storyId) {
                    window.location.href = `/summary-page?storyId=${storyId}`;
                } else {
                    alert('Story ID를 가져오지 못했습니다.');
                }
            })
            .catch((error) => {
                console.error('Error fetching profile:', error);
            });
    };

    return (
        <div>
            <h2>WebSocket Chat</h2>
            <div>{status}</div>

            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {chatLog.map((log, index) => (
                    <p key={index}>
                        <strong>{log.sender}:</strong> {log.message}
                    </p>
                ))}
                <div ref={chatLogRef}></div>
            </div>

            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here"
            />
            <button onClick={handleSendMessage}>Send</button>
            <button onClick={handleDisconnect}>Disconnect</button>

            {showNextButton && (
                <div>
                    <button onClick={redirectToSummaryPage}>다음으로</button>
                </div>
            )}
        </div>
    );
};

export default Chat;