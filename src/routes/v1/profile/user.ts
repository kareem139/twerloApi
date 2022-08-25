import express from 'express';
import { SuccessResponse } from '../../../@core/ApiResponse';
import UserRepo from '../../../database/repository/UserRepo';
import { ProtectedRequest } from 'app-request';
import { BadRequestError, NoDataError } from '../../../@core/ApiError';
import { Types } from 'mongoose';
import validator, { ValidationSource } from '../../../helper/validator';
import schema from './schema';
import asyncHandler from '../../../helper/asyncHandler';
import _ from 'lodash';
import authentication from '../../../auth/authentication';

const router = express.Router();

router.get(
  '/public/id/:id',
  validator(schema.userId, ValidationSource.PARAM),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const user = await UserRepo.findPublicProfileById(new Types.ObjectId(req.params.id));
    if (!user) throw new BadRequestError('User not registered');
    return new SuccessResponse('success', _.pick(user, ['name', 'profilePicUrl'])).send(res);
  }),
);

/*-------------------------------------------------------------------------*/
// Below all APIs are private APIs protected for Access Token
router.use('/', authentication);
/*-------------------------------------------------------------------------*/

router.get(
  '/my',
  asyncHandler(async (req: ProtectedRequest, res) => {
    const user = await UserRepo.findProfileById(req.user._id);
    if (!user) throw new BadRequestError('User not registered');
    return new SuccessResponse('success', _.pick(user, ['name', 'profilePicUrl', 'roles'])).send(
      res,
    );
  }),
);

router.get(
  '/my/test',
  asyncHandler(async (req: ProtectedRequest, res) => {
    const user = {_id:new Types.ObjectId().toHexString(),name:"test",email:"test@gmail.com"};
    if (!user) throw new BadRequestError('User not registered');
    return new SuccessResponse('success',user).send(
      res,
    );
  }),
);
router.get(
  '/all',
  asyncHandler(async (req: ProtectedRequest, res) => {
    const users = await UserRepo.getAllNormalUser(req.user._id);
    if (users.length<1) throw new NoDataError('User not found');
    return new SuccessResponse('success',users).send(
      res,
    );
  }),
);


router.put(
  '/',
  validator(schema.profile),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const user = await UserRepo.findProfileById(req.user._id);
    if (!user) throw new BadRequestError('User not registered');

    if (req.body.name) user.name = req.body.name;
    if (req.body.profilePicUrl) user.profilePicUrl = req.body.profilePicUrl;

    await UserRepo.updateInfo(user);
    return new SuccessResponse(
      'Profile updated',
      _.pick(user, ['name', 'profilePicUrl', 'roles']),
    ).send(res);
  }),
);

export default router;
