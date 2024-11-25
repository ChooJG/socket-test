import { fetchProfile } from '../services/api';

const redirectToSummaryPage = async () => {
  try {
    const profile = await fetchProfile();
    const storyId = profile.storyId;
    if (storyId) {
      window.location.href = `/summary-page?storyId=${storyId}`;
    } else {
      alert('Story ID를 가져오지 못했습니다.');
    }
  } catch (error) {
    console.error('Error fetching profile:', error);
  }
};
