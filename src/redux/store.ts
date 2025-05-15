import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import authReducer from './slices/auth-slice';
import configReducer from './slices/config-slice';
import itemsReducer from './slices/items-slice';
import recordsReducer from './slices/records-slice';
import stashReducer from './slices/stash-slice';
import { authSaga } from './sagas/auth-saga';
import { configSaga } from './sagas/config-saga';
import { itemsSaga } from './sagas/items-saga';
import { recordsSaga } from './sagas/records-saga';
import { stashSaga } from './sagas/stash-saga';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
    reducer: {
        auth: authReducer,
        config: configReducer,
        items: itemsReducer,
        records: recordsReducer,
        stash: stashReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(sagaMiddleware),
});

sagaMiddleware.run(authSaga);
sagaMiddleware.run(configSaga);
sagaMiddleware.run(itemsSaga);
sagaMiddleware.run(recordsSaga);
sagaMiddleware.run(stashSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;