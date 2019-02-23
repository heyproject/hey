import HomeScreen from './pages/HomeScreen';
import VerificationCodeScreen from './pages/VerificationCodeScreen';
import UserScreen from './pages/UserScreen';
import { createStackNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation';

const AuthenticationConfig = {
  headerMode: 'none',
  initialRouteName: 'Home'
}

const AuthenticationNavigator = createStackNavigator({
  Home: HomeScreen,
  VerificationCode: VerificationCodeScreen,
}, AuthenticationConfig);

const AppNavigator = createSwitchNavigator({
  Auth: AuthenticationNavigator,
  User: UserScreen,
});

export default createAppContainer(AppNavigator);