import { configureStore } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';
import dashbordReducer from './DashboardAction';
import authReducer from './AuthAction';
import dateReducer from './ReportDateAction';
// import modeReducer from './modeAction';

const store = configureStore({
  reducer: {
    ui: dashbordReducer,
    auth: authReducer,
    date: dateReducer,
    // mode: modeReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

export const useAppSelector = useSelector.withTypes<RootState>();

export default store;
