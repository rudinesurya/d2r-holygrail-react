import { call, put, select, takeLatest } from 'redux-saga/effects';
import {
    fetchRecordsRequest,
    fetchRecordsSuccess,
    fetchRecordsFailure
} from '../slices/records-slice';
import { RootState } from '../store';
import { GetRecordsResponseDto } from '../../dto/records/get-records-response.dto';

const selectGraphqlBaseUri = (state: RootState) => state.config.graphqlBaseUri;
const selectUserId = (state: RootState) => state.auth.fetchUser.userId;

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
        throw new Error(responseData.system_message || 'Get Recent Records failed');
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
    yield takeLatest(fetchRecordsRequest.type, fetchRecentRecordsSaga);
}