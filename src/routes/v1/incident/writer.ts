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
import Incident from '../../../database/model/Incident';
import UserRepo from '../../../database/repository/UserRepo'
import { object } from '@hapi/joi';
const router = express.Router();

/*-------------------------------------------------------------------------*/
// Below all APIs are private APIs protected for writer's role
router.use('/', authentication, role(RoleCode.ADMIN), authorization);
/*-------------------------------------------------------------------------*/

const formatEndpoint = (endpoint: string) => endpoint.replace(/\s/g, '').replace(/\//g, '-');

router.post(
  '/',
  validator(schema.incidentCreate),
  asyncHandler(async (req: ProtectedRequest, res) => {
    req.body.title = formatEndpoint(req.body.title);

    const incident = await IncidentRepo.findInfoByTitle(req.body.title);
    if (incident) throw new BadRequestError('incident with this title already exists');
    const asign=await UserRepo.findById(req.body.asignTo);
    if(!asign) throw new BadRequestError('can not found asign');
    const createdInc = await IncidentRepo.create({
      title: req.body.title,
      description: req.body.description,
      author: req.user,
      createdBy: req.user,
      updatedBy: req.user,
      asignTo:asign
    
    } as Incident);

    new SuccessResponse('Blog created successfully', createdInc).send(res);
  }),
);

router.post(
  '/test',
  validator(schema.incidentCreate),
  asyncHandler(async (req: ProtectedRequest, res) => {
    req.body.title = formatEndpoint(req.body.title);

    const incident = {_id:new Types.ObjectId().toHexString(),title:"test"};
    if (incident.title==req.body.title) throw new BadRequestError('incident with this title already exists');

 
    const createdInc ={_d:new Types.ObjectId().toHexString(),title:req.body.title}

    new SuccessResponse('Blog created successfully', createdInc).send(res);
  }),
);

router.put(
  '/:id',
  validator(schema.incidentId, ValidationSource.PARAM),
  validator(schema.incidentUpdate),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const incident = await IncidentRepo.findIncidentAllDataById(new Types.ObjectId(req.params.id));
    if (incident == null) throw new BadRequestError('Blog does not exists');
    if (!incident.author._id.equals(req.user._id))
      throw new ForbiddenError("You don't have necessary permissions");


    if (req.body.title) incident.title = req.body.title;
    if (req.body.description) incident.description = req.body.description;



    await IncidentRepo.update(incident);
    new SuccessResponse('Blog updated successfully', incident).send(res);
  }),
);


export default router;
