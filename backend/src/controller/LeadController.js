import { StatusCodes } from 'http-status-codes';
import Lead from '../models/Lead.js';
import { ResponseHandler, CatchErrorHandler } from '../services/CommonServices.js';
import responseMessage from '../utils/ResponseMessage.js';

export const getAllLeads = async (req, res) => {
  try {
    const {
      search = '',
      status = '',
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = req.query;

    const result = await Lead.findAndCountAll({
      search,
      status,
      page: parseInt(page),
      limit: parseInt(limit),
      sortBy,
      sortOrder,
    });

    return ResponseHandler(
      res,
      StatusCodes.OK,
      responseMessage.LEADS_FETCHED,
      result.leads,
      {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      }
    );
  } catch (error) {
    return CatchErrorHandler(res, error);
  }
};

export const getLeadById = async (req, res) => {
  try {
    const { id } = req.params;
    const lead = await Lead.findOne({ _id: id, isDeleted: false });

    if (!lead) {
      return ResponseHandler(res, StatusCodes.NOT_FOUND, responseMessage.LEAD_NOT_FOUND);
    }

    return ResponseHandler(res, StatusCodes.OK, responseMessage.LEAD_FETCHED, lead);
  } catch (error) {
    return CatchErrorHandler(res, error);
  }
};

export const createLead = async (req, res) => {
  try {
    const { name, email, phone, status, source } = req.body;

    const newLead = await Lead.create({
      name,
      email,
      phone,
      status: status || 'new',
      source: source || 'Web Portal',
    });

    return ResponseHandler(
      res,
      StatusCodes.CREATED,
      responseMessage.LEAD_CREATED,
      newLead
    );
  } catch (error) {
    return CatchErrorHandler(res, error);
  }
};

export const updateLead = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await Lead.findOne({ _id: id, isDeleted: false });

    if (!existing) {
      return ResponseHandler(res, StatusCodes.NOT_FOUND, responseMessage.LEAD_NOT_FOUND);
    }

    const updatedLead = await Lead.findByIdAndUpdate(id, req.body, { new: true });

    return ResponseHandler(
      res,
      StatusCodes.OK,
      responseMessage.LEAD_UPDATED,
      updatedLead
    );
  } catch (error) {
    return CatchErrorHandler(res, error);
  }
};

export const deleteLead = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await Lead.findOne({ _id: id, isDeleted: false });

    if (!existing) {
      return ResponseHandler(res, StatusCodes.NOT_FOUND, responseMessage.LEAD_NOT_FOUND);
    }

    await Lead.findByIdAndUpdate(id, { isDeleted: true });

    return ResponseHandler(
      res,
      StatusCodes.OK,
      responseMessage.LEAD_DELETED,
      { id }
    );
  } catch (error) {
    return CatchErrorHandler(res, error);
  }
};

export const getLeadStats = async (req, res) => {
  try {
    const stats = await Lead.getStats();
    return ResponseHandler(res, StatusCodes.OK, responseMessage.LEAD_STATS_FETCHED, stats);
  } catch (error) {
    return CatchErrorHandler(res, error);
  }
};

export const bulkCreateLeads = async (req, res) => {
  try {
    const { leads } = req.body;
    if (!Array.isArray(leads) || leads.length === 0) {
      return ResponseHandler(res, StatusCodes.BAD_REQUEST, responseMessage.LEADS_ARRAY_REQUIRED);
    }

    const sanitized = leads.map((lead) => ({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      status: lead.status || 'new',
      source: lead.source || 'Batch Import',
    }));

    const created = await Lead.insertMany(sanitized);

    return ResponseHandler(
      res,
      StatusCodes.CREATED,
      responseMessage.LEADS_BULK_CREATED,
      created
    );
  } catch (error) {
    return CatchErrorHandler(res, error);
  }
};

export default {
  getAllLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  getLeadStats,
  bulkCreateLeads,
};
