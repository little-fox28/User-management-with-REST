import express from 'express';
import { authentication, random } from '../helper';
import { createUser, getUserByEmail, getUsers } from '../Model/users';

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.sendStatus(400);
    }

    const salt: any = random();
    const user = createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });
    console.log('[User-Register:]', user);

    const existingUser: any = await getUserByEmail(email);

    if (existingUser) {
      return res.sendStatus(400);
    }

    await user.save();
    return res.status(200).json(user);
  } catch (error) {
    console.log('[Register:]', error);
    return res.sendStatus(400);
  }
};

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.sendStatus(400);
    }
    const user = await getUserByEmail(email).select(
      '+authentication.salt +authentication.password'
    );
    console.log('[User-Login:]', user);

    if (!user) {
      return res.sendStatus(400);
    }

    const expectedHash = authentication(user.authentication.salt, password);
    console.log('[expectedHash:]', expectedHash);

    if (user.authentication.password !== expectedHash) {
      return res.status(400).json('Wrong password !!!').end();
    }
    const salt: any = random();
    user.authentication.sessionToken = authentication(
      salt,
      user._id.toString()
    );
    await user.save();
    res.cookie('USER-AUTH', user.authentication.sessionToken, {
      domain: 'localhost',
      path: '/',
    });
    return res.status(200).json(user);
  } catch (error) {
    console.log('[Login:]', error);
    res.sendStatus(400);
  }
};
