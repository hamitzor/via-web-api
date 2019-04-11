/**
 * @author kgnugur@gmail.com (Kagan Ugur)
 */
import express from 'express';

const router = express.Router();

router.get('/video', (req, res) => {
  //Return all videos
  res.send('Video route');
});

router.post('/video', (req, res) => {});

router.delete('video', (req, res) => {});

router.put('video', (req, res) => {});

export default router;
