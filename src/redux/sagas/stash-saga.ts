import { call, put, select, takeLatest } from 'redux-saga/effects';
import {
    fetchStashRequest,
    fetchStashSuccess,
    fetchStashFailure
} from '../slices/stash-slice';
import { RootState } from '../store';
import { GetStashResponseDto } from '../../dto/stash/get-stash-response.dto';

const selectGraphqlBaseUri = (state: RootState) => state.config.graphqlBaseUri;
const selectUserId = (state: RootState) => state.auth.fetchUser.userId;

const fetchStashApi = async (graphqlBaseUri: string, userId: string) => {
    const response = await fetch(`${graphqlBaseUri}/graphql`, {
        method: 'POST',
        credentials: 'include', // Include cookies for authentication
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: `
                query ($userId: String!) {
                    stash(userId: $userId) {
                        userId
                        itemName
                        count
                    }
                }
            `,
            variables: {
                userId: userId,
            },
        }),
    });

    const responseData: GetStashResponseDto = await response.json();

    if (!response.ok) {
        throw new Error(responseData.message || 'Get Stash failed');
    }

    return responseData;
};

function* fetchStashSaga() {
    try {
        const userId: string = yield select(selectUserId);
        const graphqlBaseUri: string = yield select(selectGraphqlBaseUri);
        const response: GetStashResponseDto = yield call(fetchStashApi, graphqlBaseUri, userId);
        yield put(fetchStashSuccess({ stash: response.data.stash }));
    } catch (error: any) {
        yield put(fetchStashFailure({ error: error.message }));
    }
}

export function* stashSaga() {
    yield takeLatest(fetchStashRequest.type, fetchStashSaga);
}