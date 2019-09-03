import { connect } from 'react-redux';
import Component from '../components';
import { onFetchListRestaurant, onFetchListBar, onFetchListCoffee } from '../actions';

const mapStateToProps = (state) => {
        const fetchListRestaurantSucceeded = state.HomeReducers.FetchListRestaurantSucceeded;
        const fetchListRestaurantFailed = state.HomeReducers.FetchListRestaurantFailed;
        const fetchListBarSucceeded = state.HomeReducers.FetchListBarSucceeded;
        const fetchListBarFailed = state.HomeReducers.FetchListBarFailed;
        const fetchListCoffeeSucceeded = state.HomeReducers.FetchListCoffeeSucceeded;
        const fetchListCoffeeFailed = state.HomeReducers.FetchListCoffeeFailed;
        if (fetchListRestaurantSucceeded !== undefined) {
                return {
                        isLoading: false,
                        listRestaurant: fetchListRestaurantSucceeded.data.data,
                };
        } else if (fetchListRestaurantFailed !== undefined) {
                return {
                        isLoading: false,
                        messages: fetchListRestaurantFailed.messages
                };
        } else if (fetchListBarSucceeded !== undefined) {
                return {
                        isLoading: false,
                        listBar: fetchListBarSucceeded.data.data,
                };
        } else if (fetchListBarFailed !== undefined) {
                return {
                        isLoading: false,
                        messages: fetchListBarFailed.messages
                };
        } else if (fetchListCoffeeSucceeded !== undefined) {
                return {
                        isLoading: false,
                        listCoffee: fetchListCoffeeSucceeded.data.data,
                };
        } else if (fetchListCoffeeFailed !== undefined) {
                return {
                        isLoading: false,
                        messages: fetchListCoffeeFailed.messages
                };
        }
        else {
                return {
                        isLoading: false
                };
        }

};
const mapDispatchToProps = (dispatch) => {
        return {
                onFetchListRestaurant: (data) => {
                        dispatch(onFetchListRestaurant(data));
                },
                onFetchListBar: (data) => {
                        dispatch(onFetchListBar(data));
                },
                onFetchListCoffee: (data) => {
                        dispatch(onFetchListCoffee(data));
                }
        };
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);



