import { isAuthenticated, isOwner } from './../middleware/index';
import { deleteUser, getAllUsers } from './../Controllers/users';
import express from 'express';

export default (router: express.Router) => {
  router.get('/users', isAuthenticated, getAllUsers);
  router.delete('/users/:id', isAuthenticated, isOwner, deleteUser);
};
