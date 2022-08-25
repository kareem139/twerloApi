import express from 'express';
import { SuccessResponse } from '../../../@core/ApiResponse';
import { BadRequestError } from '../../../@core/ApiError';
import IncidentRepo from '../../../database/repository/IncidentRepo';
import { Types } from 'mongoose';
import validator, { ValidationSource } from '../../../helper/validator';
import schema from './schema';
import asyncHandler from '../../../helper/asyncHandler';

const router = express.Router();



router.get(
  '/',
  validator(schema.incidentId, ValidationSource.QUERY),
  asyncHandler(async (req, res) => {
    const blog = await IncidentRepo.findInfoById(new Types.ObjectId(req.query.id as string));
    if (!blog) throw new BadRequestError('incident do not exists');
    return new SuccessResponse('success', blog).send(res);
  }),
);

router.get(
  '/test',
  validator(schema.incidentId, ValidationSource.QUERY),
  asyncHandler(async (req, res) => {
    const blog = {_id:new Types.ObjectId(),title:"test"};
    if (blog._id.toString()!=req.query.id) throw new BadRequestError('incident do not exists');
    return new SuccessResponse('success', {_id:req.query.id,title:"test"}).send(res);
  }),
);

export default router;
