import { Router } from 'express';

const router = new Router();

router.get('/', (req, res, next) => {
  res.send('API up!');
});

router.get('/ping', (req, res, next) => {
  res.send('Ping');
});

export default router;
