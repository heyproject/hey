import HomeScreen from './pages/HomeScreen';
import VerificationCodeScreen from './pages/VerificationCodeScreen';
import UserScreen from './pages/UserScreen';
import SignUpPartOneScreen from './pages/SignUpPartOneScreen';
import SignUpPartTwoScreen from './pages/SignUpPartTwoScreen';
import MapScreen from './pages/MapScreen';
import MainTabScreen from './pages/MainTabScreen';
import MenuScreen from './components/Menu';
import MenuScreen2 from './components/Menu2';
import InfoScreen from './components/Info';
import ReviewScreen from './components/Review';
import ProductSearchScreen from './pages/ProductSearchScreen';
import JobHistoryScreen from './pages/JobHistoryScreen';
import { createBottomTabNavigator, createStackNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation';

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
  MenuScreen2: MenuScreen2,
  ProductSearchScreen: ProductSearchScreen,
  JobHistoryScreen: JobHistoryScreen,
  ReviewScreen : ReviewScreen,
  InfoScreen : InfoScreen,
});


export default createAppContainer(AppNavigator);
