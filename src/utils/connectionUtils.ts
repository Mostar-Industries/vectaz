import axios from 'axios';

export async function safeApiCall(
  url: string,
  options: {
    retries?: number;
    timeout?: number;
    fallback?: () => Promise<any>;
  } = {}
) {
  const { retries = 3, timeout = 5000, fallback } = options;
  
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios({
        url,
        method: 'GET',
        timeout,
        validateStatus: () => true
      });
      
      if (response.status < 400) {
        return response.data;
      }
      
      if (i === retries - 1 && fallback) {
        return await fallback();
      }
    } catch (error) {
      console.warn(`Attempt ${i + 1}: Failed to connect to ${url}`);
      if (i === retries - 1) {
        if (fallback) return await fallback();
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}

// Health check for local services
export async function checkLocalService(port: number) {
  try {
    await safeApiCall(`http://localhost:${port}/health`, { retries: 1, timeout: 1000 });
    return true;
  } catch {
    return false;
  }
}
