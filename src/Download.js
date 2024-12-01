import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Download() {
    const API_BASE_URL = process.env.REACT_APP_SERVER_API_BASE_URL;

    const [books, setBooks] = useState([]);
    const [selectedStoryIds, setSelectedStoryIds] = useState([]);
    const [error, setError] = useState('');
    const [isLoadingExcel, setIsLoadingExcel] = useState(false); // Excel 로딩 상태
    const [isLoadingImages, setIsLoadingImages] = useState(false); // Images 로딩 상태

    // 책 데이터 가져오기
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/story/get-all-books`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                    },
                });
                if (response.data.success) {
                    setBooks(response.data.data);
                } else {
                    setError('책 데이터를 가져오는 데 실패했습니다.');
                }
            } catch (error) {
                console.error('책 데이터 가져오기 실패:', error);
                setError('책 데이터를 가져오는 데 실패했습니다.');
            }
        };
        fetchBooks();
    }, [API_BASE_URL]);

    // 책 선택 핸들러
    const handleSelectBook = (storyId) => {
        setSelectedStoryIds((prev) =>
            prev.includes(storyId)
                ? prev.filter((id) => id !== storyId) // 선택 해제
                : [...prev, storyId] // 선택 추가
        );
    };

    // Excel 다운로드
    const handleDownloadExcel = async () => {
        setIsLoadingExcel(true);
        try {
            const response = await axios.post(
                `${API_BASE_URL}/downloadStoryExcel`,
                selectedStoryIds,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                    },
                    responseType: 'blob',
                }
            );

            const blob = new Blob([response.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = 'stories.xlsx';
            link.click();
        } catch (error) {
            console.error('Excel 다운로드 실패:', error);
            setError('Excel 파일 다운로드에 실패했습니다. 다시 시도해주세요.');
        } finally {
            setIsLoadingExcel(false);
        }
    };

    // 이미지 다운로드
    const handleDownloadImages = async () => {
        if (!selectedStoryIds || selectedStoryIds.length === 0) {
            console.error('선택된 Story ID가 없습니다.');
            setError('다운로드할 Story ID를 선택해주세요.');
            return;
        }

        setIsLoadingImages(true);
        try {
            for (const storyId of selectedStoryIds) {
                const response = await axios.post(
                    `${API_BASE_URL}/downloadImage`,
                    null,
                    {
                        params: { storyId },
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                        },
                    }
                );

                // JSON 응답에서 제목과 파일 데이터 읽기
                const { title: storyTitle, file } = response.data;

                // Base64 디코딩 후 파일 다운로드 처리
                const blob = new Blob(
                    [Uint8Array.from(atob(file), c => c.charCodeAt(0))], // Base64 디코딩
                    { type: 'application/zip' }
                );

                // 파일 다운로드
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = storyTitle ? `${storyTitle}.zip` : `story_${storyId}.zip`; // 제목을 파일 이름으로 사용
                link.click();
            }
        } catch (error) {
            console.error('이미지 다운로드 실패:', error.response || error.message);
            setError('이미지 압축 파일 다운로드에 실패했습니다. 다시 시도해주세요.');
        } finally {
            setIsLoadingImages(false);
        }
    };

    return (
        <div className="Download">
            <h2>Download Stories</h2>
            {error && <p className="error-message">{error}</p>}

            <div className="book-list">
                <h3>Select Books</h3>
                {books.map((book) => (
                    <div key={book.storyId} className="book-item">
                        <input
                            type="checkbox"
                            id={`book-${book.storyId}`}
                            value={book.storyId}
                            onChange={() => handleSelectBook(book.storyId)}
                        />
                        <label htmlFor={`book-${book.storyId}`}>
                            <img
                                src={book.imageUrl}
                                alt={book.title}
                                style={{ width: '50px', height: '50px', marginRight: '10px' }}
                            />
                            {book.title} - {book.author} ({book.status})
                        </label>
                    </div>
                ))}
            </div>

            <button onClick={handleDownloadExcel} disabled={isLoadingExcel || selectedStoryIds.length === 0}>
                {isLoadingExcel ? 'Downloading Excel...' : 'Download Excel'}
            </button>
            <button onClick={handleDownloadImages} disabled={isLoadingImages || selectedStoryIds.length === 0}>
                {isLoadingImages ? 'Downloading Images...' : 'Download Images'}
            </button>
        </div>
    );
}

export default Download;
