import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers/StoreProvider';
import axios from 'axios';
import { Portfolio, getPortfolioDataSelector } from 'entities/Portfolio';
import { fetchPortfolioData } from '../../../../entities/Portfolio/model/services/fetchPortfolioData';
import { getUserData } from '../../../../entities/User/model/selectors/getUserData';
import { NewPortfolioData } from '../types/AddNewTransactionSchema';

export const updatePortfolioDataService = createAsyncThunk<
  Portfolio,
  NewPortfolioData,
  ThunkConfig<string>
>(
  'updatePortfolioDataService',
  async (transactionData, thunkAPI) => {
    const { rejectWithValue, getState, dispatch } = thunkAPI;

    const portfolioData = getPortfolioDataSelector(getState());
    const user = getUserData(getState());

    const isInPortfolio =
      portfolioData.find((item) => item.ticker === transactionData.ticker) ||
      null;

    if (user) {
      if (isInPortfolio) {
        let totalCount = isInPortfolio.count;

        if (transactionData.type === 'BUY') {
          totalCount += transactionData.count;
        } else if (transactionData.type === 'SELL') {
          totalCount -= transactionData.count;
        }

        try {
          const response = await axios.put<Portfolio>(
            `http://localhost:9000/portfolio/${isInPortfolio.id}`,
            {
              ...isInPortfolio,
              count: totalCount,
              avgBuyPrice:
                (isInPortfolio.avgBuyPrice + transactionData.price) / 2,
            },
          );

          dispatch(fetchPortfolioData(user.id));

          return response.data;
        } catch (e) {
          return rejectWithValue('Error');
        }
      } else {
        try {
          const response = await axios.post<Portfolio>(
            `http://localhost:9000/portfolio`,
            {
              userId: `${user?.id}`,
              ticker: transactionData.ticker,
              count: transactionData.count,
              avgBuyPrice: transactionData.price,
            },
          );

          dispatch(fetchPortfolioData(user.id));

          return response.data;
        } catch (e) {
          return rejectWithValue('Error');
        }
      }
    } else {
      return rejectWithValue('Error');
    }
  },
);