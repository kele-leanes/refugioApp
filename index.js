/**
 * @format
 */

import moment from 'moment'
import 'moment/locale/es';
import { AppRegistry } from 'react-native';
import Navigation from './src/navigation';
import { name as appName } from './app.json';
moment.locale('es')

AppRegistry.registerComponent(appName, () => Navigation);
