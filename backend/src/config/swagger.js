import swaggerJsdoc from 'swagger-jsdoc';
import config from './index.js';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Leads Tracker REST API',
    version: '1.0.0',
    description:
      'Comprehensive RESTful API documentation for the Leads Tracking and Management Portal. Includes Authentication, Lead Management, Notes, and Analytics.',
    contact: {
      name: 'Leads Tracker Support',
    },
  },
  servers: [
    {
      url: `http://localhost:${config.PORT}/api`,
      description: 'Local Development Server',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT access token in the format: Bearer <token>',
      },
    },
    schemas: {
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          statusCode: { type: 'integer', example: 400 },
          message: { type: 'string', example: 'Validation error or invalid request' },
        },
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '65f1a2b3c4d5e6f7a8b9c0d1' },
          name: { type: 'string', example: 'Admin User' },
          email: { type: 'string', format: 'email', example: 'admin@example.com' },
        },
      },
      Lead: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '65f1a2b3c4d5e6f7a8b9c0d2' },
          name: { type: 'string', example: 'John Doe' },
          email: { type: 'string', format: 'email', example: 'john.doe@example.com' },
          phone: { type: 'string', example: '9876543210' },
          status: {
            type: 'string',
            enum: ['new', 'contacted', 'qualified', 'lost'],
            example: 'new',
          },
          source: { type: 'string', example: 'Website' },
          notesCount: { type: 'integer', example: 2 },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Note: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '65f1a2b3c4d5e6f7a8b9c0d3' },
          leadId: { type: 'string', example: '65f1a2b3c4d5e6f7a8b9c0d2' },
          content: { type: 'string', example: 'Followed up via phone call.' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'admin@example.com' },
          password: { type: 'string', format: 'password', example: 'Password123' },
        },
      },
      CreateLeadRequest: {
        type: 'object',
        required: ['name', 'email', 'phone'],
        properties: {
          name: { type: 'string', example: 'John Doe' },
          email: { type: 'string', format: 'email', example: 'john.doe@example.com' },
          phone: { type: 'string', example: '9876543210' },
          status: {
            type: 'string',
            enum: ['new', 'contacted', 'qualified', 'lost'],
            default: 'new',
            example: 'new',
          },
          source: { type: 'string', example: 'Google Ads' },
        },
      },
      UpdateLeadRequest: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'John Doe Updated' },
          email: { type: 'string', format: 'email', example: 'john.new@example.com' },
          phone: { type: 'string', example: '9876543211' },
          status: {
            type: 'string',
            enum: ['new', 'contacted', 'qualified', 'lost'],
            example: 'contacted',
          },
          source: { type: 'string', example: 'Referral' },
        },
      },
      CreateNoteRequest: {
        type: 'object',
        required: ['content'],
        properties: {
          content: { type: 'string', example: 'Client expressed high interest in premium plan.' },
        },
      },
      ForgotPasswordRequest: {
        type: 'object',
        required: ['email'],
        properties: {
          email: { type: 'string', format: 'email', example: 'admin@example.com' },
        },
      },
      VerifyOtpRequest: {
        type: 'object',
        required: ['email', 'otp'],
        properties: {
          email: { type: 'string', format: 'email', example: 'admin@example.com' },
          otp: { type: 'string', example: '123456' },
        },
      },
      SetPasswordRequest: {
        type: 'object',
        required: ['email', 'otp', 'newPassword'],
        properties: {
          email: { type: 'string', format: 'email', example: 'admin@example.com' },
          otp: { type: 'string', example: '123456' },
          newPassword: { type: 'string', format: 'password', example: 'NewStrongPassword123' },
        },
      },
      ChangePasswordRequest: {
        type: 'object',
        required: ['oldPassword', 'newPassword'],
        properties: {
          oldPassword: { type: 'string', format: 'password', example: 'OldPassword123' },
          newPassword: { type: 'string', format: 'password', example: 'NewPassword123' },
        },
      },
      UpdateProfileRequest: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'Updated Name' },
        },
      },
    },
  },
  paths: {
    '/health': {
      get: {
        tags: ['System'],
        summary: 'Health check endpoint',
        description: 'Returns the health status and current timestamp of the server.',
        responses: {
          200: {
            description: 'Server is healthy and up',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'UP' },
                    timestamp: { type: 'string', format: 'date-time' },
                    service: { type: 'string', example: 'Leads Tracker API' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Authentication'],
        summary: 'User Login',
        description: 'Authenticates user credentials and returns an access token and user information.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    statusCode: { type: 'integer', example: 200 },
                    message: { type: 'string', example: 'Login successful.' },
                    data: {
                      type: 'object',
                      properties: {
                        user: { $ref: '#/components/schemas/User' },
                        accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                      },
                    },
                  },
                },
              },
            },
          },
          401: {
            description: 'Invalid credentials',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/auth/refresh-token': {
      post: {
        tags: ['Authentication'],
        summary: 'Refresh Access Token',
        description: 'Generates a new access token using a valid refresh token cookie or body payload.',
        requestBody: {
          required: false,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  refreshToken: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Token refreshed successfully',
          },
          401: {
            description: 'Unauthorized or token expired',
          },
        },
      },
    },
    '/auth/logout': {
      post: {
        tags: ['Authentication'],
        security: [{ BearerAuth: [] }],
        summary: 'User Logout',
        description: 'Invalidates the refresh token and clears auth cookies.',
        responses: {
          200: {
            description: 'Logged out successfully',
          },
        },
      },
    },
    '/auth/profile': {
      get: {
        tags: ['Authentication'],
        security: [{ BearerAuth: [] }],
        summary: 'Get Current User Profile',
        responses: {
          200: {
            description: 'User profile fetched successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/User' },
                  },
                },
              },
            },
          },
        },
      },
      put: {
        tags: ['Authentication'],
        security: [{ BearerAuth: [] }],
        summary: 'Update User Profile',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateProfileRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'Profile updated successfully',
          },
        },
      },
    },
    '/auth/change-password': {
      post: {
        tags: ['Authentication'],
        security: [{ BearerAuth: [] }],
        summary: 'Change User Password',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ChangePasswordRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'Password changed successfully',
          },
        },
      },
    },
    '/auth/forgot-password': {
      post: {
        tags: ['Authentication'],
        summary: 'Request Password Reset OTP',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ForgotPasswordRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'OTP generated and sent',
          },
        },
      },
    },
    '/auth/verify-otp': {
      post: {
        tags: ['Authentication'],
        summary: 'Verify OTP',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/VerifyOtpRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'OTP verified successfully',
          },
        },
      },
    },
    '/auth/resend-otp': {
      post: {
        tags: ['Authentication'],
        summary: 'Resend OTP',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ForgotPasswordRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'OTP resent successfully',
          },
        },
      },
    },
    '/auth/set-password': {
      post: {
        tags: ['Authentication'],
        summary: 'Set New Password with OTP',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SetPasswordRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'Password reset successfully',
          },
        },
      },
    },
    '/leads': {
      get: {
        tags: ['Leads'],
        security: [{ BearerAuth: [] }],
        summary: 'Get all leads with filtering & pagination',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 }, description: 'Page number' },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 }, description: 'Items per page' },
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Search term for name, email, or phone' },
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['new', 'contacted', 'qualified', 'lost'] }, description: 'Filter by lead status' },
          { name: 'sortBy', in: 'query', schema: { type: 'string', default: 'createdAt' }, description: 'Field to sort by' },
          { name: 'sortOrder', in: 'query', schema: { type: 'string', enum: ['asc', 'desc'], default: 'desc' }, description: 'Sort direction' },
        ],
        responses: {
          200: {
            description: 'List of leads retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      properties: {
                        leads: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/Lead' },
                        },
                        total: { type: 'integer', example: 50 },
                        page: { type: 'integer', example: 1 },
                        totalPages: { type: 'integer', example: 5 },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Leads'],
        security: [{ BearerAuth: [] }],
        summary: 'Create a new lead',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateLeadRequest' },
            },
          },
        },
        responses: {
          201: {
            description: 'Lead created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Lead' },
                  },
                },
              },
            },
          },
          400: {
            description: 'Validation failed or duplicate email',
          },
        },
      },
    },
    '/leads/stats': {
      get: {
        tags: ['Leads'],
        security: [{ BearerAuth: [] }],
        summary: 'Get lead statistics & metrics',
        responses: {
          200: {
            description: 'Stats retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      properties: {
                        totalLeads: { type: 'integer', example: 120 },
                        newLeads: { type: 'integer', example: 45 },
                        contactedLeads: { type: 'integer', example: 35 },
                        qualifiedLeads: { type: 'integer', example: 25 },
                        lostLeads: { type: 'integer', example: 15 },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/leads/bulk': {
      post: {
        tags: ['Leads'],
        security: [{ BearerAuth: [] }],
        summary: 'Bulk import leads',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  leads: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/CreateLeadRequest' },
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Bulk leads created successfully',
          },
        },
      },
    },
    '/leads/{id}': {
      get: {
        tags: ['Leads'],
        security: [{ BearerAuth: [] }],
        summary: 'Get a lead by ID',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Lead MongoDB ID' },
        ],
        responses: {
          200: {
            description: 'Lead found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Lead' },
                  },
                },
              },
            },
          },
          404: {
            description: 'Lead not found',
          },
        },
      },
      patch: {
        tags: ['Leads'],
        security: [{ BearerAuth: [] }],
        summary: 'Update lead details',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Lead MongoDB ID' },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateLeadRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'Lead updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Lead' },
                  },
                },
              },
            },
          },
          404: {
            description: 'Lead not found',
          },
        },
      },
      delete: {
        tags: ['Leads'],
        security: [{ BearerAuth: [] }],
        summary: 'Delete a lead (Soft Delete)',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Lead MongoDB ID' },
        ],
        responses: {
          200: {
            description: 'Lead deleted successfully',
          },
          404: {
            description: 'Lead not found',
          },
        },
      },
    },
    '/leads/{id}/notes': {
      get: {
        tags: ['Notes'],
        security: [{ BearerAuth: [] }],
        summary: 'Get all notes for a specific lead',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Lead MongoDB ID' },
        ],
        responses: {
          200: {
            description: 'Notes retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Note' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Notes'],
        security: [{ BearerAuth: [] }],
        summary: 'Add a note to a lead',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Lead MongoDB ID' },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateNoteRequest' },
            },
          },
        },
        responses: {
          201: {
            description: 'Note created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Note' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/leads/{id}/notes/{noteId}': {
      delete: {
        tags: ['Notes'],
        security: [{ BearerAuth: [] }],
        summary: 'Delete a specific note from a lead',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Lead MongoDB ID' },
          { name: 'noteId', in: 'path', required: true, schema: { type: 'string' }, description: 'Note MongoDB ID' },
        ],
        responses: {
          200: {
            description: 'Note deleted successfully',
          },
          404: {
            description: 'Note not found',
          },
        },
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: [], // Defined inline in swaggerDefinition
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
