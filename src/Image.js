import React, { useState } from 'react';
import axios from 'axios';

const ImageComponent = () => {
    const [prompt, setPrompt] = useState(
                 `character1: white hair, white dress, white skin, girl,
                  character2: white hair, black shirts, white skin, boy,
                  watercolor illustration style,
                  Situation: walk`
                  )
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        const requestData = {
            model: 'dall-e-3',
            prompt: prompt,
            n: 1,
            size: '1024x1024'
        };

        setLoading(true);
        try {
            const response = await axios.post(
                'https://api.openai.com/v1/images/generations',
                JSON.stringify(requestData),
                {
                    headers: {
                        'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            setResults(response.data.data);
            console.log(response.data.data)
        } catch (error) {
            console.error('Error uploading the image:', error);
            console.log(error.response.data)
            alert('Failed to generate variations. Please try again.');
        }
        setLoading(false);
    };

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h1>Image Generation</h1>
            <button onClick={handleSubmit} disabled={loading}>
                {loading ? 'Processing...' : 'Generate Image'}
            </button>

            <div style={{ marginTop: '20px' }}>
                {results.length > 0 && results.map((result, index) => (
                    <img key={index} src={result.url} alt={`Generated image ${index + 1}`} width="300px" style={{ margin: '10px' }} />
                ))}
            </div>
        </div>
    );
};

export default ImageComponent;
