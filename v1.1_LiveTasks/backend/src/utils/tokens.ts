import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config';

interface TokenPayload {
  id: string;
}

const accessOptions: SignOptions = {
  expiresIn: config.jwtExpiresIn as SignOptions['expiresIn'],
};

const refreshOptions: SignOptions = {
  expiresIn: config.jwtRefreshExpiresIn as SignOptions['expiresIn'],
};

export const generateAccessToken = (userId: string): string => {
  return jwt.sign({ id: userId } as TokenPayload, config.jwtSecret, accessOptions);
};

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign(
    { id: userId } as TokenPayload,
    config.jwtRefreshSecret,
    refreshOptions
  );
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, config.jwtRefreshSecret) as TokenPayload;
};
