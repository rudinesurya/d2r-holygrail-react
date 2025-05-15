import { call, put, select, takeLatest } from 'redux-saga/effects';
import {
    fetchRecordsRequest,
    fetchRecordsSuccess,
    fetchRecordsFailure,
    createRecordRequest,
    createRecordFailure,
    createRecordSuccess
} from '../slices/records-slice';
import { RootState } from '../store';
import { GetRecordsResponseDto } from '../../dto/records/get-records-response.dto';
import { CreateRecordDto } from '../../dto/records/create-record-payload.dto';
import { CreateRecordResponseDto } from '../../dto/records/create-record-response.dto';

const selectRecordsBaseUri = (state: RootState) => state.config.recordsBaseUri;
const selectGraphqlBaseUri = (state: RootState) => state.config.graphqlBaseUri;
const selectUserId = (state: RootState) => state.auth.fetchUser.userId;

const createRecordApi = async (recordsBaseUri: string, payload: CreateRecordDto) => {
    const response = await fetch(`${recordsBaseUri}/records`, {
        method: 'POST',
        credentials: 'include', // Include cookies for authentication
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    const responseData: CreateRecordResponseDto = await response.json();

    if (!response.ok) {
        throw new Error(responseData.message || 'Create Record failed');
    }

    return responseData;
};

function* createRecordSaga(action: { payload: CreateRecordDto; type: string }) {
    try {
        const recordsBaseUri: string = yield select(selectRecordsBaseUri);
        const response: CreateRecordResponseDto = yield call(createRecordApi, recordsBaseUri, action.payload);
        yield put(createRecordSuccess());
    } catch (error: any) {
        yield put(createRecordFailure({ error: error.message }));
    }
}

const fetchRecentRecordsApi = async (graphqlBaseUri: string, userId: string) => {
    const response = await fetch(`${graphqlBaseUri}/graphql`, {
        method: 'POST',
        credentials: 'include', // Include cookies for authentication
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: `
                query ($userId: String!) {
                    records(userId: $userId, sort: "-timestamp", limit: 10) {
                        itemName
                        location
                        timestamp
                    }
                }
            `,
            variables: {
                userId: userId,
            },
        }),
    });

    const responseData: GetRecordsResponseDto = await response.json();

    if (!response.ok) {
        throw new Error(responseData.message || 'Get Recent Records failed');
    }

    return responseData;
};

function* fetchRecentRecordsSaga() {
    try {
        const userId: string = yield select(selectUserId);
        const graphqlBaseUri: string = yield select(selectGraphqlBaseUri);
        const response: GetRecordsResponseDto = yield call(fetchRecentRecordsApi, graphqlBaseUri, userId);
        yield put(fetchRecordsSuccess({ recentRecords: response.data.records }));
    } catch (error: any) {
        yield put(fetchRecordsFailure({ error: error.message }));
    }
}

export function* recordsSaga() {
    yield takeLatest(createRecordRequest.type, createRecordSaga);
    yield takeLatest(fetchRecordsRequest.type, fetchRecentRecordsSaga);
}