import express from 'express';
import multer from 'multer';
import { gfs } from '../db.js';
import { GridFsStorage } from '@thebguy/multer-gridfs-storage';
import Book, { IBook } from '../models/Book.js';
import mongoose from 'mongoose';

const router = express.Router();
const ObjectId = mongoose.Types.ObjectId;

const storage = new GridFsStorage({
  url: process.env.MONGO_URI as string,
  file: (req, file) => {
    const fileId = new ObjectId(file.filename as string);
    return {
      bucketName: 'uploads',
      filename: fileId.toString(),
      metadata: {
        originalFilename: file.originalname,
        fileId: fileId,
      },
      contentType: file.mimetype,
    };
  },
});

const upload = multer({ storage }).single('file');

router.patch('/upload/:id', upload, async (req, res) => {
  try {
    const { file } = req;

    console.log('file: ', !!file);
    if (!file) throw new Error('File is missing');

    const bookId = req.params.id;
    const fileId = new mongoose.Types.ObjectId(file.filename);

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).send('Book not found');
    }

    book.originalFilename = file.originalname;
    book.fileId = fileId;

    console.log('try to save uploaded book');
    await book.save();

    res.status(200).send({
      message: 'File uploaded successfully',
      downloadUrl: `/content/download/${file.originalname}`,
    });
  } catch (err) {
    console.log('error uploading: ', err);
    res.status(500).send('Error uploading file');
  }
});

// Download endpoint
router.get('/download/:filename', async (req, res) => {
  try {
    const book = (await Book.findOne({
      originalFilename: req.params.filename,
    })) as IBook;
    if (!book) {
      return res.status(404).send('No file exists');
    }

    console.log('try to run download stream: ', book);
    const downloadStream = gfs.openDownloadStreamByName(book.fileId.toString());
    downloadStream.on('error', (err) => {
      console.error('Error in download stream: ', err);
      res.status(500).send('Error retrieving file');
    });
    downloadStream.pipe(res);
  } catch (err) {
    res.status(500).send('Error retrieving file');
  }
});

export default router;
