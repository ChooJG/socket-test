import React, { useState } from 'react';

const Signup = () => {
    const [status, setStatus] = useState('');

    // 로그인 데이터 입력
    const jsonData = []



    const handleSignup = async () => {
        setStatus('Processing...');
        try {
            for (const user of jsonData) {

                // url 입력
                const response = await fetch('https://example-com/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(user),
                });

                if (response.ok) {
                    console.log(`User ${user.userName} signed up successfully`);
                } else {
                    console.error(`Failed to signup user ${user.userName}: `, await response.text());
                }
            }
            setStatus('All users processed.');
        } catch (error) {
            console.error('Error during signup:', error);
            setStatus('Error occurred during signup.');
        }
    };

    return (
        <div>
            <h1>Signup</h1>
            <p>Status: {status}</p>
            <button onClick={handleSignup}>Start Signup</button>
        </div>
    );
};

export default Signup;
