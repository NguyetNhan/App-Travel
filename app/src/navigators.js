import { createBottomTabNavigator, createDrawerNavigator, createStackNavigator, createSwitchNavigator } from 'react-navigation';

import Home from './home/components';
import Search from './search/components';
import Map from './map/components';
import Notification from './notification/components';
import Follow from './follow/components';
import AuthLoading from './auth_loading/components';
import Login from './login/components';
import SignUp from './sign_up/components';

const RouteBottomTabConfig = {
        Home: {
                screen: Home
        },
        Search: {
                screen: Search
        },
        Map: {
                screen: Map
        },
        Notification: {
                screen: Notification
        },
        Follow: {
                screen: Follow
        }
};

const BottomTabNavigatorConfig = {
        initialRouteName: 'Home',
        defaultNavigationOptions: ({ navigation }) => ({
        }),
        order: ['Home', 'Search', 'Map', 'Notification', 'Follow'],
        tabBarOptions: {
                activeTintColor: 'black',
                inactiveTintColor: 'gray',
        },
};

const BottomTabNavigator = createBottomTabNavigator(RouteBottomTabConfig, BottomTabNavigatorConfig);

const AuthStack = createStackNavigator({
        Login: {
                screen: Login
        },
        SignUp: {
                screen: SignUp
        }
},
        {
                initialRouteName: 'Login'
        });

export default AppNavigator = createSwitchNavigator(
        {
                AuthLoading: {
                        screen: AuthLoading
                },
                App: {
                        screen: BottomTabNavigator
                },
                Auth: {
                        screen: AuthStack
                }
        },
        {
                initialRouteName: 'AuthLoading',
        }
);

