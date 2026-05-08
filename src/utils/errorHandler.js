// simple utility for turning various error objects into user-friendly strings

export function handleError(err) {
  if (!err) return "Unknown error";
  if (typeof err === "string") return err;
  if (err.message) return err.message;
  if (err.code) return `Error code: ${err.code}`;
  return JSON.stringify(err);
}

export function handleFirebaseError(err) {
  // map common codes
  if (!err) return "Unknown Firebase error";
  if (err.code) {
    switch (err.code) {
      case "auth/network-request-failed":
        return "Network error - please check your connection.";
      case "auth/user-not-found":
        return "User not found.";
      default:
        return err.message || err.code;
    }
  }
  return handleError(err);
}

export function handleAPIError(err) {
  if (!err) return "Unknown API error";
  if (err.message) return err.message;
  return handleError(err);
}
