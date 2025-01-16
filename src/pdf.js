import axios from 'axios';
import React from 'react';

const downloadPdf = async () => {
    const API_BASE_URL = process.env.REACT_APP_SERVER_API_BASE_URL;
    const storyId = 1;

    try {
        // 로컬 스토리지에서 JWT 토큰 가져오기
        const token = localStorage.getItem('jwtToken');

        // API 요청 보내기
        const response = await axios.get(`${API_BASE_URL}/pdf/${storyId}`, {
            responseType: 'blob', // 바이너리 데이터를 처리하기 위해 blob 설정
            headers: {
                Authorization: `Bearer ${token}`, // JWT 토큰 추가
            },
        });

        // Blob 데이터를 기반으로 PDF 다운로드
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'story.pdf'); // 파일 이름 설정
        document.body.appendChild(link);
        link.click();

        // 다운로드 후 리소스 정리
        link.remove();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('PDF 다운로드 실패:', error);
    }
};

const PdfDownloadButton = () => {
    return (
        <button onClick={downloadPdf}>
            PDF 다운로드
        </button>
    );
};

export default PdfDownloadButton;
