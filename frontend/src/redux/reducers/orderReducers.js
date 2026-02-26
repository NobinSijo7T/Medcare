import * as actionTypes from "../constants/orderConstants";

export const orderCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.ORDER_CREATE_REQUEST:
      return { loading: true };
    case actionTypes.ORDER_CREATE_SUCCESS:
      return { loading: false, success: true, order: action.payload };
    case actionTypes.ORDER_CREATE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const orderDetailsReducer = (
  state = { loading: true, orderItems: [], shippingAddress: {} },
  action
) => {
  switch (action.type) {
    case actionTypes.ORDER_DETAILS_REQUEST:
      return { ...state, loading: true };
    case actionTypes.ORDER_DETAILS_SUCCESS:
      return { loading: false, order: action.payload };
    case actionTypes.ORDER_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const orderListMyReducer = (state = { orders: [] }, action) => {
  switch (action.type) {
    case actionTypes.ORDER_LIST_MY_REQUEST:
      return { loading: true };
    case actionTypes.ORDER_LIST_MY_SUCCESS:
      return { loading: false, orders: action.payload };
    case actionTypes.ORDER_LIST_MY_FAIL:
      return { loading: false, error: action.payload };
    case actionTypes.ORDER_LIST_MY_RESET:
      return { orders: [] };
    default:
      return state;
  }
};

export const orderListAllReducer = (state = { orders: [] }, action) => {
  switch (action.type) {
    case actionTypes.ORDER_LIST_ALL_REQUEST:
      return { loading: true };
    case actionTypes.ORDER_LIST_ALL_SUCCESS:
      return { loading: false, orders: action.payload };
    case actionTypes.ORDER_LIST_ALL_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const orderStatusUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.ORDER_STATUS_UPDATE_REQUEST:
      return { loading: true };
    case actionTypes.ORDER_STATUS_UPDATE_SUCCESS:
      return { loading: false, success: true, order: action.payload };
    case actionTypes.ORDER_STATUS_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    case actionTypes.ORDER_STATUS_UPDATE_RESET:
      return {};
    default:
      return state;
  }
};

export const orderReminderSetReducer = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.ORDER_REMINDER_SET_REQUEST:
      return { loading: true };
    case actionTypes.ORDER_REMINDER_SET_SUCCESS:
      return { loading: false, success: true, order: action.payload };
    case actionTypes.ORDER_REMINDER_SET_FAIL:
      return { loading: false, error: action.payload };
    case actionTypes.ORDER_REMINDER_SET_RESET:
      return {};
    default:
      return state;
  }
};

export const orderRemindersActiveReducer = (state = { reminders: [] }, action) => {
  switch (action.type) {
    case actionTypes.ORDER_REMINDERS_ACTIVE_REQUEST:
      return { loading: true };
    case actionTypes.ORDER_REMINDERS_ACTIVE_SUCCESS:
      return { loading: false, reminders: action.payload };
    case actionTypes.ORDER_REMINDERS_ACTIVE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const orderReminderMarkShownReducer = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.ORDER_REMINDER_MARK_SHOWN_REQUEST:
      return { loading: true };
    case actionTypes.ORDER_REMINDER_MARK_SHOWN_SUCCESS:
      return { loading: false, success: true };
    case actionTypes.ORDER_REMINDER_MARK_SHOWN_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
