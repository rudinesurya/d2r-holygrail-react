import { put, takeLatest } from 'redux-saga/effects';
import {
    fetchConfigRequest,
    fetchConfigSuccess,
    fetchConfigFailure,
} from '../slices/config-slice';

function* fetchConfigSaga() {
    try {
        // In a real-world scenario you might fetch this from an endpoint.
        // Here we simply read the value from the environment.
        console.log(import.meta.env.VITE_AUTH_BASE_URI);
        const authBaseUri: string = import.meta.env.VITE_AUTH_BASE_URI;
        const recordsBaseUri: string = import.meta.env.VITE_RECORDS_BASE_URI;
        const graphqlBaseUri: string = import.meta.env.VITE_GRAPHQL_GATEWAY_BASE_URI;
        yield put(fetchConfigSuccess({ authBaseUri, recordsBaseUri, graphqlBaseUri }));
    } catch (error: any) {
        yield put(fetchConfigFailure({ error: error.message }));
    }
}

export function* configSaga() {
    yield takeLatest(fetchConfigRequest.type, fetchConfigSaga);
}