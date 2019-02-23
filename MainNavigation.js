import HomeScreen from './pages/HomeScreen';
import VerificationCodeScreen from './pages/VerificationCodeScreen';
import UserScreen from './pages/UserScreen';
import { createStackNavigator, createAppContainer } from 'react-navigation';

const screens = {
  Home: {
    screen: HomeScreen
  },
  VerificationCode: {
    screen: VerificationCodeScreen
  },
  User: {
    screen: UserScreen
  }
}

const config = {
  headerMode: 'none',
  initialRouteName: 'Home'
}

const MainNavigator = createStackNavigator(screens,config);
export default createAppContainer(MainNavigator);