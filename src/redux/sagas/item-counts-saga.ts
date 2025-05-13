import { call, put, select, takeLatest } from 'redux-saga/effects';
import {
    fetchItemCountsRequest,
    fetchItemCountsSuccess,
    fetchItemCountsFailure
} from '../slices/item-counts-slice';
import { RootState } from '../store';
import { GetItemCountsResponseDto } from '../../dto/item-counts/get-item-counts-response.dto';

const selectRecordsBaseUri = (state: RootState) => state.config.recordsBaseUri;
const selectUserId = (state: RootState) => state.auth.fetchUser.userId;

const fetchItemCountsApi = async (recordsBaseUri: string, userId: string) => {
    const response = await fetch(`${recordsBaseUri}/item-counts?userId=${userId}`, {
        method: 'GET',
        credentials: 'include', // Include cookies for authentication
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const responseData: GetItemCountsResponseDto = await response.json();

    if (!response.ok) {
        throw new Error(responseData.system_message || 'Get Item Counts failed');
    }

    return responseData;
};

function* fetchItemCountsSaga() {
    try {
        const userId: string = yield select(selectUserId);
        const recordsBaseUri: string = yield select(selectRecordsBaseUri);
        const response: GetItemCountsResponseDto = yield call(fetchItemCountsApi, recordsBaseUri, userId);
        yield put(fetchItemCountsSuccess({ itemCounts: response.data.itemCounts }));
    } catch (error: any) {
        yield put(fetchItemCountsFailure({ error: error.message }));
    }
}

export function* itemCountsSaga() {
    yield takeLatest(fetchItemCountsRequest.type, fetchItemCountsSaga);
}