import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import accessToken from "../assets/accessToken";
import getOptions from "../assets/getOptions"; 
const fetch = require('node-fetch');

const generateTokenThunk = createAsyncThunk("user/generateTokenThunk", async () => {
    try {
        const generateTokenUrl = "https://api.themoviedb.org/3/authentication/token/new";
        const options = getOptions;
        const response = await fetch(generateTokenUrl, options);
        const json = await response.json();
        window.open("https://www.themoviedb.org/authenticate/" + json.request_token, '_blank');
        return json.request_token;
      } 
      catch (error) {
        console.error('Error generating the token. ', error);
        throw new Error('Error generating the token. ' + error);
      }
})
const tryCreateSessionThunk = createAsyncThunk("user/tryCreateSessionThunk", async (token) => {
    try {
        const validateSessionUrl = 'https://api.themoviedb.org/3/authentication/session/new';
        const validateSessionOptions = {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                Authorization: accessToken
            },
            body: JSON.stringify({
                request_token: token
            })
        };
        const validateSessionResponse = await fetch(validateSessionUrl, validateSessionOptions);
        const validateSessionData = await validateSessionResponse.json();
        if(validateSessionData.failure === true)
            throw new Error(validateSessionData.status_message);
        else
            return validateSessionData.session_id;
    } catch (error) {
        console.error('Error creating the session. ', error);
        throw new Error('Error creating the session. ' + error);
    }
});
const fetchUserInformationThunk = createAsyncThunk("user/fetchUserInformationThunk", async (sessionId) => {
    try {
        const accountDetailsUrl = 'https://api.themoviedb.org/3/account';
        const accountDetailsOptions = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: accessToken
            },
            params: {
                session_id: sessionId
            }
        };

        const accountDetailsResponse = await fetch(accountDetailsUrl, accountDetailsOptions);
        const accountDetailsData = await accountDetailsResponse.json();
        return accountDetailsData;
    } catch (error) {
        console.error('Error fetching account details. ', error);
        throw new Error('Error fetching account details. ' + error);
    }
});

const userSlice = createSlice({
    name: "user",
    initialState: {
        token: null,
        tokenError: null,
        tokenState: 'idle',
        sessionError: null,
        sessionState: 'idle',
        sessionId: null,
        user: null,
        userState: 'idle',
        userError: null,
    },
    reducers: {
    },
    extraReducers(builder) {
        builder.addCase(generateTokenThunk.fulfilled, (state,action) => {
            state.tokenState = "succeeded";
            state.token = action.payload;
        })

        builder.addCase(generateTokenThunk.pending, (state) => {
            state.tokenState = "loading";
        })

        builder.addCase(generateTokenThunk.rejected, (state,action) => {
            state.tokenState = "failed";
            state.tokenError = action.error.message;
        })

        builder.addCase(tryCreateSessionThunk.fulfilled, (state,action) => {   
                 
            state.sessionState = "succeeded";
            state.sessionId = action.payload;
        })

        builder.addCase(tryCreateSessionThunk.pending, (state) => {
            state.sessionState = "loading";
        })

        builder.addCase(tryCreateSessionThunk.rejected, (state,action) => {
            state.sessionState = "failed";
            state.sessionError = action.error.message;
        })

        builder.addCase(fetchUserInformationThunk.fulfilled, (state,action) => {
            state.userState = "succeeded";
            state.user = action.payload;
        })

        builder.addCase(fetchUserInformationThunk.pending, (state) => {
            state.userState = "loading";
        })

        builder.addCase(fetchUserInformationThunk.rejected, (state,action) => {
            state.userState = "failed";
            state.userError = action.error.message;
        })
       
    }
});
export {generateTokenThunk , tryCreateSessionThunk , fetchUserInformationThunk};
export default userSlice.reducer;