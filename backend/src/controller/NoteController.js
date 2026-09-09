import { StatusCodes } from 'http-status-codes';
import Lead from '../models/Lead.js';
import Note from '../models/Note.js';
import { ResponseHandler, CatchErrorHandler } from '../services/CommonServices.js';
import responseMessage from '../utils/ResponseMessage.js';

export const getNotesByLead = async (req, res) => {
  try {
    const { id } = req.params;
    const lead = await Lead.findById(id);

    if (!lead) {
      return ResponseHandler(
        res,
        StatusCodes.NOT_FOUND,
        responseMessage.LEAD_NOT_FOUND
      );
    }

    const notes = await Note.findByLeadId(id);

    return ResponseHandler(
      res,
      StatusCodes.OK,
      responseMessage.NOTES_FETCHED,
      notes
    );
  } catch (error) {
    return CatchErrorHandler(res, error);
  }
};

export const createNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const lead = await Lead.findById(id);
    if (!lead) {
      return ResponseHandler(
        res,
        StatusCodes.NOT_FOUND,
        responseMessage.LEAD_NOT_FOUND
      );
    }

    const authorName = req.user?.name || 'Admin User';
    const note = await Note.create({
      leadId: id,
      content,
      createdBy: authorName,
    });

    return ResponseHandler(
      res,
      StatusCodes.CREATED,
      responseMessage.NOTE_ADDED,
      note
    );
  } catch (error) {
    return CatchErrorHandler(res, error);
  }
};

export const deleteNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const note = await Note.findById(noteId);

    if (!note) {
      return ResponseHandler(
        res,
        StatusCodes.NOT_FOUND,
        responseMessage.NOTE_NOT_FOUND
      );
    }

    await Note.findByIdAndDelete(noteId);

    return ResponseHandler(
      res,
      StatusCodes.OK,
      responseMessage.NOTE_DELETED,
      { id: noteId }
    );
  } catch (error) {
    return CatchErrorHandler(res, error);
  }
};

export default {
  getNotesByLead,
  createNote,
  deleteNote,
};
