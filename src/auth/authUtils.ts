import { Tokens } from 'app-request';
import { AuthFailureError, InternalError } from '../@core/ApiError';
import JWT, { JwtPayload } from '../@core/JWT';
import { Types } from 'mongoose';
import User from '../database/model/User';
import { tokenInfo } from '../config';

export const getAccessToken = (authorization?: string) => {
  if (!authorization) throw new AuthFailureError('Invalid Authorization');
  if (!authorization.startsWith('Bearer ')) throw new AuthFailureError('Invalid Authorization');
  return authorization.split(' ')[1];
};

export const validateTokenData = (payload: JwtPayload): boolean => {
  if (
    !payload ||
    !payload.iss ||
    !payload.sub ||
    !payload.aud ||
    !payload.prm ||
    payload.iss !== 'twerlo' ||
    payload.aud !== 'twerlo' ||
    !Types.ObjectId.isValid(payload.sub)
  )
    throw new AuthFailureError('Invalid Access Token');
  return true;
};

export const createTokens = async (
  user: User,
  accessTokenKey: string,
  refreshTokenKey: string,
): Promise<Tokens> => {
  const accessToken = await JWT.encode(
    new JwtPayload(
      'twerlo',
      'twerlo',
      user._id.toString(),
      accessTokenKey,
      120,
      user.roles[0].code
    ),
  );

  if (!accessToken) throw new InternalError();

  const refreshToken = await JWT.encode(
    new JwtPayload(
      'twerlo',
      'twerlo',
      user._id.toString(),
      refreshTokenKey,
      120,
      user.roles[0].code
    ),
  );

  if (!refreshToken) throw new InternalError();

  return {
    accessToken: accessToken,
    refreshToken: refreshToken,
  } as Tokens;
};
