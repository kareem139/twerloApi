import Joi from '@hapi/joi';
import { JoiObjectId, JoiUrlEndpoint } from '../../../helper/validator';

export default {

  incidentId: Joi.object().keys({
    id: Joi.string().required(),
  }),

  pagination: Joi.object().keys({
    pageNumber: Joi.number().required().integer().min(1),
    pageItemCount: Joi.number().required().integer().min(1),
  }),
  paginationAuthor: Joi.object().keys({
    pageNumber: Joi.number().required().integer().min(1),
    pageItemCount: Joi.number().required().integer().min(1),

  }),
  search: Joi.object().keys({
    query: Joi.string().required(),
    pageItemCount: Joi.number().required().integer().min(1),

  }),
  authorId: Joi.object().keys({
    id: JoiObjectId().required(),
  }),
  incidentCreate: Joi.object().keys({
    title: Joi.string().required().min(3).max(500),
    description: Joi.string().required().min(3).max(2000),
    asignTo:Joi.string().required()
  }),
  incidentUpdate: Joi.object().keys({
    title: Joi.string().optional().min(3).max(500),
    description: Joi.string().optional().min(3).max(2000)
  }),
};
