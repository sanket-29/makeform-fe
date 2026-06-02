export const isAuthenticated = () => {
  if (typeof window === "undefined") return false;

  const token = localStorage.getItem("token");
  return !!token;
};

export const getUserType = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("userType");
};

export const isAdmin = () => getUserType() === "admin";
export const isUser = () => getUserType() === "user";

export const loginAdmin = async (username: string, password: string) => {
  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Admin login failed");
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("userType", "admin");
    return data;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const res = await fetch("http://localhost:5000/api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Login failed");
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("userType", "user");

    const user = data.user ?? {
      name: data.name ?? data.fullName ?? data.username ?? data.email ?? "",
      email: data.email ?? data.user?.email ?? "",
      profilePic: data.profilePic ?? data.user?.profilePic ?? data.avatar ?? data.user?.avatar ?? "",
    };

    localStorage.setItem("user", JSON.stringify(user));
    return data;
  } catch (error) {
    throw error;
  }
};

export const registerUser = async (name: string, email: string, password: string) => {
  try {
    const res = await fetch("http://localhost:5000/api/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Registration failed");
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("userType", "user");

    const user = data.user ?? {
      name: name,
      email: email,
      profilePic: data.profilePic ?? data.user?.profilePic ?? data.avatar ?? data.user?.avatar ?? "",
    };

    localStorage.setItem("user", JSON.stringify(user));
    return data;
  } catch (error) {
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userType");
  localStorage.removeItem("user");
};

export const getUser = () => {
  if (typeof window === "undefined") return null;

  const user = localStorage.getItem("user");
  try {
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

export const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

export const fetchUserProfile = async () => {
  const token = getToken();
  if (!token) {
    throw new Error("No authentication token available");
  }

  const res = await fetch("http://localhost:5000/api/user/profile", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch user profile");
  }

  const user = {
    ...data,
    id: data.id,
    name: data.name,
    email: data.email,
  };

  localStorage.setItem("user", JSON.stringify(user));
  return user;
};