//standard get options for fetch requests , I used a separate file because I used it like 30 times in different files
import accessToken from "./accessToken.js";
export default {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: accessToken,
  },
};
