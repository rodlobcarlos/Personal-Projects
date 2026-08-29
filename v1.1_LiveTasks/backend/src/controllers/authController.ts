import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/tokens';

interface AuthBody {
  name?: string;
  email: string;
  password: string;
  token?: string;
}

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body as AuthBody;

    if (!name || !email || !password) {
      res.status(400).json({ message: 'Nombre, email y contraseña son obligatorios' });
      return;
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      res.status(409).json({ message: 'Ya existe una cuenta con este email' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      authProvider: 'local',
    });

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        theme: user.theme,
        authProvider: user.authProvider,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as AuthBody;

    if (!email || !password) {
      res.status(400).json({ message: 'Email y contraseña son obligatorios' });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ message: 'Credenciales inválidas' });
      return;
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        theme: user.theme,
        authProvider: user.authProvider,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
};

export const googleAuth = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?._id;

    if (!userId) {
      res.status(401).json({ message: 'Autenticación de Google fallida' });
      return;
    }

    const accessToken = generateAccessToken(userId.toString());
    const refreshToken = generateRefreshToken(userId.toString());

    res.redirect(
      `${process.env.CLIENT_ORIGIN}?token=${accessToken}&refresh=${refreshToken}`
    );
  } catch (error) {
    res.status(500).json({ message: 'Error en autenticación de Google' });
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        theme: user.theme,
        authProvider: user.authProvider,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuario' });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { name, theme, avatar } = req.body;

    const updated = await User.findByIdAndUpdate(
      user.id,
      { ...(name && { name }), ...(theme && { theme }), ...(avatar && { avatar }) },
      { new: true }
    );

    res.status(200).json({
      user: {
        id: updated?.id,
        name: updated?.name,
        email: updated?.email,
        avatar: updated?.avatar,
        theme: updated?.theme,
        authProvider: updated?.authProvider,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar perfil' });
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.body as AuthBody;

    if (!token) {
      res.status(400).json({ message: 'Token de refresco requerido' });
      return;
    }

    const decoded = verifyRefreshToken(token);
    const accessToken = generateAccessToken(decoded.id);

    res.status(200).json({ accessToken });
  } catch (error) {
    res.status(401).json({ message: 'Token de refresco inválido o expirado' });
  }
};
