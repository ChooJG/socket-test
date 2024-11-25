import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Chat from './Chat';  // Chat 컴포넌트 불러오기
import Login from './Login';  // Login 컴포넌트 불러오기
import './App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Login />} />  {/* 로그인 페이지 */}
                    <Route path="/chat" element={<Chat />} />  {/* 채팅 페이지 */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
