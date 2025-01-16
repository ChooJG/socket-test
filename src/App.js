import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Chat from './Chat';  // Chat 컴포넌트
import Login from './Login';  // Login 컴포넌트
import Signup from './Signup'; // Signup 컴포넌트
import Download from './Download'; // 책 다운로드 페이지 추가
import Image from './Image'; // Image 컴포넌트 추가
import PDF from './pdf';
import './App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <nav>
                    <Link to="/">Login</Link> |
                    <Link to="/chat">Chat</Link> |
                    <Link to="/signup">Signup</Link> |
                    <Link to="/download">Download</Link> |
                    <Link to="/image">Image</Link> {/* Image 페이지로 이동 버튼 */} |
                    <Link to="/pdf">PDF</Link> {/* PDF 다운로드 페이지로 이동 버튼 */}
                </nav>
                <Routes>
                    <Route path="/" element={<Login />} />  {/* 로그인 페이지 */}
                    <Route path="/chat" element={<Chat />} />  {/* 채팅 페이지 */}
                    <Route path="/signup" element={<Signup />} />  {/* 회원가입 페이지 */}
                    <Route path="/download" element={<Download />} />  {/* 책 다운로드 페이지 */}
                    <Route path="/image" element={<Image />} />  {/* Image 페이지 */}
                    <Route path="/pdf" element={<PDF />} />  {/* PDF 다운로드 페이지 */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
