import 'assets/css/global.css';
import 'focus-watcher';
import { start } from './Session';
import form from './components/form';
import modal from './components/modal';
import stylesReference from './components/styles-reference';

stylesReference();
modal();
form();

start();
