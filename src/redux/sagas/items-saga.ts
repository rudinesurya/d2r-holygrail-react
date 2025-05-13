import { call, put, select, takeLatest } from 'redux-saga/effects';
import {
    fetchItemsRequest,
    fetchItemsSuccess,
    fetchItemsFailure
} from '../slices/items-slice';
import { RootState } from '../store';
import { GetItemsResponseDto } from '../../dto/items/get-items-response.dto';

const selectGraphqlBaseUri = (state: RootState) => state.config.graphqlBaseUri;

const fetchItemsApi = async (graphqlBaseUri: string) => {
    const response = await fetch(`${graphqlBaseUri}/graphql`, {
        method: 'POST',
        credentials: 'include', // Include cookies for authentication
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: `
                query {
                    items {
                        itemName
                        itemQuality
                        itemType
                    }
                }
            `,
        }),
    });

    const responseData: GetItemsResponseDto = await response.json();

    if (!response.ok) {
        throw new Error(responseData.system_message || 'Get Items failed');
    }

    return responseData;
};

function* fetchItemsSaga() {
    try {
        const graphqlBaseUri: string = yield select(selectGraphqlBaseUri);
        const response: GetItemsResponseDto = yield call(fetchItemsApi, graphqlBaseUri);
        yield put(fetchItemsSuccess({ items: response.data.items }));
    } catch (error: any) {
        yield put(fetchItemsFailure({ error: error.message }));
    }
}

export function* itemsSaga() {
    yield takeLatest(fetchItemsRequest.type, fetchItemsSaga);
}