import { getAuthHeaders } from 'src/utils/auth';

/**
 * Track chapter read activity
 */
export async function trackChapterRead(chapterId: string, isNovel: boolean = false) {
  try {
    const response = await fetch('/api2/activity/track-read', {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chapterId,
        isNovel,
      }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error tracking chapter read:', error);
    return { success: false, error };
  }
}

/**
 * Track daily login
 */
export async function trackDailyLogin() {
  try {
    const response = await fetch('/api2/achievements/track-login', {
      method: 'POST',
      headers: getAuthHeaders(),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error tracking login:', error);
    return { success: false, error };
  }
}

