import { select, call, put, takeLatest } from "redux-saga/effects";
import { loginSuccess, loginFailure, registerSuccess, registerFailure, logoutRequest, logout, loginRequest, registerRequest, fetchUserRequest, fetchUserSuccess, fetchUserFailure } from "../slices/auth-slice";
import { RootState } from "../store";
import { CreateUserResponseDto } from "../../dto/auth/create-user-response.dto";
import { LoginUserResponseDto } from "../../dto/auth/login-user-response.dto";
import { LoginUserDto } from "../../dto/auth/login-user-payload.dto";
import { CreateUserDto } from "../../dto/auth/create-user-payload.dto";
import { LogoutUserResponseDto } from "../../dto/auth/logout-user-response.dto";
import { GetUserResponseDto } from "../../dto/auth/get-user-response.dto";

const selectAuthBaseUri = (state: RootState) => state.config.authBaseUri;

const fetchUserApi = async (authBaseUri: string) => {
    const response = await fetch(`${authBaseUri}/users`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
    });
    
    const responseData: GetUserResponseDto = await response.json();
    
    if (!response.ok) {
        
        throw new Error(responseData.message || 'Get User failed');
    }

    return responseData;
};

function* fetchUserSaga() {
    try {
        const authBaseUri: string = yield select(selectAuthBaseUri);
        const response: GetUserResponseDto = yield call(fetchUserApi, authBaseUri);
        yield put(fetchUserSuccess({ email: response.data.user.email, userId: response.data.user._id }));
    } catch (error: any) {
        yield put(fetchUserFailure({ error: error.message }));
    }
}

const loginApi = async (authBaseUri: string, payload: LoginUserDto) => {
    const response = await fetch(`${authBaseUri}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
    });

    const responseData: LoginUserResponseDto = await response.json();

    if (!response.ok) {
        throw new Error(responseData.message || 'Login failed');
    }

    return responseData;
};

function* loginSaga(action: { payload: LoginUserDto; type: string }) {
    try {
        const authBaseUri: string = yield select(selectAuthBaseUri);
        const response: LoginUserResponseDto = yield call(loginApi, authBaseUri, action.payload);
        yield put(loginSuccess({ token: response.data.token }));
    } catch (error: any) {
        yield put(loginFailure({ error: error.message }));
    }
}

const registerApi = async (authBaseUri: string, payload: CreateUserDto) => {
    const response = await fetch(`${authBaseUri}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    const responseData: CreateUserResponseDto = await response.json();

    if (!response.ok) {
        throw new Error(responseData.message || 'Registration failed');
    }

    return responseData;
};

function* registerSaga(action: { payload: CreateUserDto; type: string }) {
    try {
        const authBaseUri: string = yield select(selectAuthBaseUri);
        yield call(registerApi, authBaseUri, action.payload);
        yield put(registerSuccess());
    } catch (error: any) {
        yield put(registerFailure({ error: error.message }));
    }
}

const logoutApi = async (authBaseUri: string) => {
    const response = await fetch(`${authBaseUri}/auth/logout`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
    });

    const responseData: LogoutUserResponseDto = await response.json();

    if (!response.ok) {
        throw new Error(responseData.message || 'Logout failed');
    }

    return responseData;
};

function* logoutSaga() {
    const authBaseUri: string = yield select(selectAuthBaseUri);
    yield call(logoutApi, authBaseUri);
    yield put(logout());
}

export function* authSaga() {
    yield takeLatest(loginRequest.type, loginSaga);
    yield takeLatest(registerRequest.type, registerSaga);
    yield takeLatest(logoutRequest.type, logoutSaga);
    yield takeLatest(fetchUserRequest.type, fetchUserSaga);
}