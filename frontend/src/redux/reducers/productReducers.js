import * as actionTypes from "../constants/productConstants";

export const getProductsReducer = (state = { products: [] }, action) => {
  switch (action.type) {
    case actionTypes.GET_PRODUCTS_REQUEST:
      return {
        loading: true,
        products: [],
      };
    case actionTypes.GET_PRODUCTS_SUCCESS:
      return {
        products: action.payload,
        loading: false,
      };
    case actionTypes.GET_PRODUCTS_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const getProductDetailsReducer = (state = { product: {} }, action) => {
  switch (action.type) {
    case actionTypes.GET_PRODUCT_DETAILS_REQUEST:
      return {
        loading: true,
      };
    case actionTypes.GET_PRODUCT_DETAILS_SUCCESS:
      return {
        loading: false,
        product: action.payload,
      };
    case actionTypes.GET_PRODUCT_DETAILS_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case actionTypes.GET_PRODUCT_DETAILS_RESET:
      return {
        product: {},
      };
    default:
      return state;
  }
};

export const createProductReducer = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.CREATE_PRODUCT_REQUEST:
      return {
        loading: true,
      };
    case actionTypes.CREATE_PRODUCT_SUCCESS:
      return {
        loading: false,
        success: true,
        product: action.payload,
      };
    case actionTypes.CREATE_PRODUCT_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case actionTypes.CREATE_PRODUCT_RESET:
      return {};
    default:
      return state;
  }
};

export const updateProductReducer = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.UPDATE_PRODUCT_REQUEST:
      return {
        loading: true,
      };
    case actionTypes.UPDATE_PRODUCT_SUCCESS:
      return {
        loading: false,
        success: true,
        product: action.payload,
      };
    case actionTypes.UPDATE_PRODUCT_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case actionTypes.UPDATE_PRODUCT_RESET:
      return {};
    default:
      return state;
  }
};

export const deleteProductReducer = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.DELETE_PRODUCT_REQUEST:
      return {
        loading: true,
      };
    case actionTypes.DELETE_PRODUCT_SUCCESS:
      return {
        loading: false,
        success: true,
      };
    case actionTypes.DELETE_PRODUCT_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const uploadImageReducer = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.UPLOAD_IMAGE_REQUEST:
      return {
        loading: true,
      };
    case actionTypes.UPLOAD_IMAGE_SUCCESS:
      return {
        loading: false,
        imageUrl: action.payload,
      };
    case actionTypes.UPLOAD_IMAGE_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

