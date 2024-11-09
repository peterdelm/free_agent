import { EXPO_PUBLIC_BASE_URL } from "../.config.js";
import authFetch from "./authCalls.js";

export const deleteGameRequest = async (gameId) => {
  console.log("Sending deleteGame request");
  const url = `${EXPO_PUBLIC_BASE_URL}api/games/${gameId}`;
  try {
    const response = await authFetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      return response;
    } else if (response.status === 401) {
      alert("Unauthorized: Invalid email or password.");
    } else if (response.status === 400) {
      alert(response.body.message);
    } else {
      const errorText = await response.text();
      alert(`Error: ${response.status} - ${errorText}`);
      throw new Error(`Unexpected response: ${response.status} - ${errorText}`);
    }
  } catch (error) {
    console.error("Failed to delete game:", error);
    alert("An unexpected error occurred. Please try again."); // Generic error message
    throw error;
  }
};

export const quitGameRequest = async (gameId) => {
  console.log("Sending deleteGame request");
  const url = `${EXPO_PUBLIC_BASE_URL}api/games/quitGame`;
  const body = {
    gameId: gameId,
  };
  try {
    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    };
    const response = await authFetch(url, requestOptions);

    if (response.status === 200) {
      return response;
    } else if (response.status === 401) {
      alert("Unauthorized: Invalid email or password.");
    } else if (response.status === 400) {
      alert(response.body.message);
    } else {
      const errorText = await response.text();
      alert(`Error: ${response.status} - ${errorText}`);
      throw new Error(`Unexpected response: ${response.status} - ${errorText}`);
    }
  } catch (error) {
    console.error("Failed to delete game:", error);
    alert("An unexpected error occurred. Please try again."); // Generic error message
    throw error;
  }
};

export const submitUserReview = async (text) => {
  console.log("Sending submitUserReview request");
  const url = `${EXPO_PUBLIC_BASE_URL}api/reviews`;
  const body = {
    review: text,
  };

  try {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    };
    const response = await authFetch(url, requestOptions);

    if (response.status === 200) {
      return response;
    } else if (response.status === 401) {
      alert("Unauthorized: Invalid email or password.");
    } else if (response.status === 400) {
      alert(response.body.message);
    } else {
      throw new Error(`Unexpected response`);
    }
  } catch (error) {
    console.error("Failed to submit review:", error);
    alert("An unexpected error occurred. Please try again."); // Generic error message
    throw error;
  }
};
