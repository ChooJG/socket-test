export const fetchProfile = async () => {
  const response = await fetch('ws://cndowy24.cafe24.com/chat', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) throw new Error('Profile data could not be fetched.');

  return response.json();
};
