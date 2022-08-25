import express from 'express';
import { SuccessResponse, SuccessMsgResponse } from '../../../@core/ApiResponse';
import { ProtectedRequest } from 'app-request';
import { BadRequestError, ForbiddenError } from '../../../@core/ApiError';
import IncidentRepo from '../../../database/repository/IncidentRepo';
import { RoleCode } from '../../../database/model/Role';
import { Types } from 'mongoose';
import validator, { ValidationSource } from '../../../helper/validator';
import schema from './schema';
import asyncHandler from '../../../helper/asyncHandler';
import authentication from '../../../auth/authentication';
import authorization from '../../../auth/authorization';
import role from '../../../helper/role';

const router = express.Router();

/*-------------------------------------------------------------------------*/
// Below all APIs are private APIs protected for Access Token and Editor's Role

/*-------------------------------------------------------------------------*/


router.put(
  '/done',authentication, role(RoleCode.EDITOR), authorization,
  validator(schema.incidentId, ValidationSource.QUERY),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const incident = await IncidentRepo.findIncidentAllDataById(new Types.ObjectId(req.query.id as string));
    if (!incident) throw new BadRequestError('incident does not exists');
    // if (!incident.author._id.equals(req.user._id))
    //   throw new ForbiddenError("You don't have necessary permissions");


      incident.status = true;
    

    await IncidentRepo.update(incident);
    return new SuccessMsgResponse('incident updated successfully').send(res);
  }),
);

router.put(
  '/done/test',authentication, role(RoleCode.EDITOR), authorization,
  validator(schema.incidentId, ValidationSource.QUERY),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const incident = {_id:new Types.ObjectId().toHexString(),status:false};
    if (!incident) throw new BadRequestError('incident does not exists');
    // if (!incident.author._id.equals(req.user._id))
      incident.status = true;
    return new SuccessMsgResponse('incident updated successfully').send(res);
  }),
);

router.delete(
  '/', authentication, role(RoleCode.ADMIN), authorization,
  validator(schema.incidentId, ValidationSource.QUERY),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const incident = await IncidentRepo.findIncidentAllDataById(new Types.ObjectId(req.query.id as string));
    if (!incident) throw new BadRequestError('incident does not exists');

    incident.isDraft = true;

    await IncidentRepo.update(incident);
    return new SuccessMsgResponse('incident deleted successfully').send(res);
  }),
);





export default router;
