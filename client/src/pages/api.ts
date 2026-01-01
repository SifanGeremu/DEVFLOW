
const api = {
  getUser: async (userId: string) => {
    const response = await fetch(`/api/users/${userId}`);
    return response.json();
  },