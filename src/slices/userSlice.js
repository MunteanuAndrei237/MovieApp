import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import accessToken from "../assets/accessToken";
import getOptions from "../assets/getOptions"; 
const fetch = require('node-fetch');


const options = getOptions;

const generateTokenUrl = "https://api.themoviedb.org/3/authentication/token/new";
const accountDetailsUrl = 'https://api.themoviedb.org/3/account';
const validateSessionUrl = 'https://api.themoviedb.org/3/authentication/session/new';

const generateTokenThunk = createAsyncThunk("user/generateTokenThunk", async () => {
    try {
        const response = await fetch(generateTokenUrl, options);
        const json = await response.json();
        window.open("https://www.themoviedb.org/authenticate/" + json.request_token, '_blank');
        return json.request_token;
      } catch (error) {
        console.error('Error generating the token:', error);
      }
})

const tryValidateTokenThunk = createAsyncThunk("user/tryValidateTokenThunk", async (sessionToken) => {
    try {
        const validateSessionOptions = {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                Authorization: accessToken
            },
            body: JSON.stringify({
                request_token: sessionToken
            })
        };

        const validateSessionResponse = await fetch(validateSessionUrl, validateSessionOptions);
        const validateSessionData = await validateSessionResponse.json();

        if (validateSessionData.success) {
            try {
                const accountDetailsOptions = {
                    method: 'GET',
                    headers: {
                        accept: 'application/json',
                        Authorization: accessToken
                    },
                    params: {
                        session_id: validateSessionData.session_id
                    }
                };

                const accountDetailsResponse = await fetch(accountDetailsUrl, accountDetailsOptions);
                const accountDetailsData = await accountDetailsResponse.json();

                return accountDetailsData;
            } catch (error) {
                console.error('Error fetching account details:', error);
                // Handle the error or return an appropriate value
                throw new Error('Error fetching account details');
            }
        } else {
            console.error('Error validating session:', validateSessionData.status_message);
            throw new Error(validateSessionData.status_message);
        }
    } catch (error) {
        console.error('An error occurred:', error);
        // Ensure the error is caught and prevents the 'fulfilled' section from being executed
        throw error;
    }
});



const userSlice = createSlice({
    name: "user",
    initialState: {
        user: null,
        sessionToken: null
    },
    reducers: {
        setUserLogin: (state, action) => {
            state.user = action.payload;
        },
        setSignOut: (state) => {
            state.user = null;
        },
    },
    extraReducers(builder) {
        builder.addCase(generateTokenThunk.fulfilled, (state,action) => {
            state.sessionToken = action.payload;
        })
        builder.addCase(tryValidateTokenThunk.fulfilled, (state,action) => {        
            state.user = action.payload;
        })
       
    }
});
export {generateTokenThunk , tryValidateTokenThunk };
export default userSlice.reducer;