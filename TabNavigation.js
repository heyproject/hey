
import InfoScreen from './components/Info';
import ReviewScreen from './components/Review';
import { createBottomTabNavigator, createStackNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation';

const TabNavigator = createBottomTabNavigator({
  ReviewScreen : ReviewScreen,
  InfoScreen : InfoScreen,
});

export default createAppContainer(TabNavigator);
