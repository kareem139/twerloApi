import express from 'express';
import apikey from '../../auth/apikey';
import signup from './access/signup';
import login from './access/login';
import logout from './access/logout';
import token from './access/token';
import incidentList from './incident/incidentList';
import incidentDetail from './incident/incidentDetail';
import writer from './incident/writer';
import editor from './incident/editor';
import user from './profile/user';

const router = express.Router();

/*-------------------------------------------------------------------------*/
// Below all APIs are public APIs protected by api-key
//router.use('/', apikey);
/*-------------------------------------------------------------------------*/

router.use('/signup', signup);
router.use('/login', login);
router.use('/logout', logout);
router.use('/token', token);
router.use('/incidents', incidentList);
router.use('/incident', incidentDetail);
router.use('/writer/incident', writer);
router.use('/editor/incident', editor);
router.use('/user', user);

export default router;
