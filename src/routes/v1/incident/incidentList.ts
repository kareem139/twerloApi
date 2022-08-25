import express from 'express';
import { SuccessResponse } from '../../../@core/ApiResponse';
import { NoDataError, BadRequestError } from '../../../@core/ApiError';
import IncidentRepo from '../../../database/repository/IncidentRepo';
import { Types } from 'mongoose';
import validator, { ValidationSource } from '../../../helper/validator';
import schema from './schema';
import asyncHandler from '../../../helper/asyncHandler';
import User from '../../../database/model/User';
import authentication from '../../../auth/authentication';
import authorization from '../../../auth/authorization';
import role from '../../../helper/role';
import { RoleCode } from '../../../database/model/Role';
import { ProtectedRequest } from 'app-request';
const router = express.Router();





router.get(
  '/',authentication,
  validator(schema.paginationAuthor, ValidationSource.QUERY),
  asyncHandler(async (req:ProtectedRequest, res) => {
    const incidents = await IncidentRepo.findLatestIncidents(
      parseInt(req.query.pageNumber as string),
      parseInt(req.query.pageItemCount as string),
      new Types.ObjectId(req.user._id as string)
    );

    if (!incidents || incidents.length < 1) throw new NoDataError();

    return new SuccessResponse('success', incidents).send(res);
  }),
);
router.get(
  '/editor',authentication,
  validator(schema.paginationAuthor, ValidationSource.QUERY),
  asyncHandler(async (req:ProtectedRequest, res) => {
    const incidents = await IncidentRepo.findLatestIncidentsforEditor(
      parseInt(req.query.pageNumber as string),
      parseInt(req.query.pageItemCount as string),
      new Types.ObjectId(req.user._id as string)
    );

    if (!incidents || incidents.length < 1) throw new NoDataError();

    return new SuccessResponse('success', incidents).send(res);
  }),
);
router.get(
  '/search',authentication,
  validator(schema.search, ValidationSource.QUERY),
  asyncHandler(async (req:ProtectedRequest, res) => {
    const incidents = await IncidentRepo.search(
      req.query.query as string,
      req.query.pageItemCount 
    );

    if (!incidents || incidents.length < 1) throw new NoDataError();

    return new SuccessResponse('success', incidents).send(res);
  }),
);

router.get(
  '/draft',authentication,
  validator(schema.paginationAuthor),
  asyncHandler(async (req:ProtectedRequest, res) => {
    const incidents = await IncidentRepo.findAllDraftsIncidents(
      parseInt(req.query.pageNumber as string),
      parseInt(req.query.pageItemCount as string),
      new Types.ObjectId(req.user._id as string)
    );
    if (!incidents || incidents.length < 1) throw new NoDataError();
    return new SuccessResponse('success', incidents).send(res);
  }),
);

export default router;
