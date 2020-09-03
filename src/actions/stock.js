import {
  FIND_STOCK_REQUEST,
  DELETE_STOCK_REQUEST,
  SAVE_STOCK_REQUEST,
  FIND_STOCKS_REQUEST
} from './constants';

export function save(data) {
  return {
    type: SAVE_STOCK_REQUEST,
    data: data
  };
}

export function deleteById(id) {
  return {
    type: DELETE_STOCK_REQUEST,
    id: id
  };
}

export function findById(id) {
  return {
    type: FIND_STOCK_REQUEST,
    id: id
  };
}

export function findAll(params) {
  return {
    type: FIND_STOCKS_REQUEST,
    params: params
  };
}
