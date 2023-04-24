import { getUserById } from './../Model/users';
import express from 'express';

import { getUsers, deleteUserById } from '../Model/users';

export const getAllUsers = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const users = await getUsers();
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const deleteUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const deleteUser = await deleteUserById(id);
    return res
      .status(200)
      .json(`delete user ${deleteUser.username} successfully !!!`);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const updateUser = async (
  req: express.Request,
  res: express.Response
) => {
  const { id } = req.params;
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.sendStatus(400);
  }
  const user = await getUserById(id);
  user.username = username;
  user.email = email;

  await user.save();

  try {
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
