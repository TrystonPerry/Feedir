const API_URL = process.env.VUE_APP_API_URL;

const http = {
  get(path, options = {}) {
    return fetch(`${API_URL}/api${path}`, {
      ...options,
      body: JSON.stringify(options.body),
      headers: {
        "Content-type": "application/json",
        ...(options.headers || {}),
        "oauth_token": localStorage.getItem("OAUTH_TOKEN"),
        "oauth_token_secret": localStorage.getItem("OAUTH_TOKEN_SECRET")
      }
    })
      .then(async res => {
        const { data, error } = await res.json();

        return {
          ok: res.ok,
          data,
          error
        };
      })
      .catch(console.error);
  },

  post(path, options = {}) {
    return http.get(path, {
      method: "POST",
      ...options
    });
  },

  put(path, options = {}) {
    return http.get(path, {
      method: "PUT",
      ...options
    });
  },

  delete(path, options = {}) {
    return http.get(path, {
      method: "DELETE",
      ...options
    });
  }
};

export default {
  oauth: {
    requestToken(body) {
      return http.post("/oauth/request_token", { body });
    },

    accessToken(body) {
      return http.post("/oauth/access_token", { body });
    }
  },

  tweet(body) {
    return http.post("/tweet", { body });
  },

  user(screen_name) {
    return http.get(`/user/${screen_name}`);
  }
};
