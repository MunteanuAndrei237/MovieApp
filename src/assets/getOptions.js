import accessToken from "./accessToken.js";
export default {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: accessToken,
  },
};
