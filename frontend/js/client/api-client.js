/* =================================
   API CLIENT
================================= */

export function createApiClient({ baseUrl, token }) {

  return {
    fetch(path, options = {}) {
      const requestOptions = { ...options };

      if (token) {
        requestOptions.headers = {
          ...(options.headers || {}),
          Authorization: `Bearer ${token}`
        };
      }

      return fetch(`${baseUrl}${path}`, requestOptions);
    }
  };
}
