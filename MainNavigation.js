import HomeScreen from './pages/HomeScreen';
import VerificationCodeScreen from './pages/VerificationCodeScreen';
import UserScreen from './pages/UserScreen';
import SignUpPartOneScreen from './pages/SignUpPartOneScreen';
import SignUpPartTwoScreen from './pages/SignUpPartTwoScreen';
import MapScreen from './pages/MapScreen';
import MainTabScreen from './pages/MainTabScreen';
import MenuScreen from './components/Menu';
import ProductSearchScreen from './pages/ProductSearchScreen';
import JobHistoryScreen from './pages/JobHistoryScreen';
import { createStackNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation';

const AuthenticationConfig = {
  headerMode: 'none',
  initialRouteName: 'Home'
}

const AuthenticationNavigator = createStackNavigator({
  Home: HomeScreen,
  VerificationCode: VerificationCodeScreen,
  SignUpPartOne: SignUpPartOneScreen,
  SignUpPartTwo: SignUpPartTwoScreen,
}, AuthenticationConfig);

const AppNavigator = createSwitchNavigator({
  Auth: AuthenticationNavigator,
  User: UserScreen,
  MapScreen: MapScreen,
  MainTab: MainTabScreen,
  MenuScreen: MenuScreen,
  ProductSearchScreen: ProductSearchScreen,
  JobHistoryScreen: JobHistoryScreen,
});

export default createAppContainer(AppNavigator);
