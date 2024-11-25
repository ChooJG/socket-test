import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [userName, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [jwtToken, setJwtToken] = useState(''); // JWT 토큰을 화면에 표시하기 위한 상태
    const navigate = useNavigate(); // 페이지 이동을 위한 React Router Hook

    const handleLogin = async (event) => {
        event.preventDefault(); // 기본 폼 동작 막기

        try {
            const response = await fetch('http://localhost/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userName, password }),
                credentials: 'include', // 쿠키 전달 옵션
            });

            if (!response.ok) {
                throw new Error('로그인에 실패했습니다. 다시 시도해주세요.');
            }

            const data = await response.json();
            console.log('로그인 성공:', data);

            // Authorization 헤더에서 JWT 토큰을 추출
            let token = null;
            const authorizationHeader = response.headers.get('Authorization'); // 'Authorization'으로 수정
            if (authorizationHeader) {
                // Bearer 토큰 형식이라면 "Bearer "를 제외한 토큰 값만 추출
                token = authorizationHeader.replace('Bearer ', '');

                // JWT 토큰을 localStorage에 저장
                localStorage.setItem('jwtToken', token); // 로컬 스토리지에 저장
                setJwtToken(token); // 화면에 보여주기 위해 상태에 저장
            } else {
                throw new Error('Authorization 헤더에서 토큰을 찾을 수 없습니다.');
            }

            console.log('로그인 성공, JWT 토큰:', token);

            // 로그인 성공 시 Chat 페이지로 이동
            navigate('/chat');
        } catch (error) {
            console.error('로그인 오류:', error);
            setError('로그인에 실패했습니다. 다시 시도해주세요.');
        }
    };

    return (
        <div className="login-container">
            <h2>로그인</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">로그인</button>
                {error && <p className="error-message">{error}</p>}
            </form>

            {/* JWT 토큰이 있으면 화면에 표시 */}
            {jwtToken && (
                <div className="token-display">
                    <h3>JWT Token</h3>
                    <p>{jwtToken}</p>
                </div>
            )}
        </div>
    );
}

export default Login;
