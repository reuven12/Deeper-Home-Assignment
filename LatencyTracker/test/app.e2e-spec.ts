import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});

//1
export default class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorCode?: string;
  public readonly details?: any;

  constructor(
    message: string,
    statusCode: number = 500,
    errorCode?: string,
    details?: any
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found', details?: any) {
    super(message, 404, 'NOT_FOUND', details);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Validation failed', details?: any) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

export class DuplicateKeyError extends AppError {
  constructor(message: string = 'Duplicate key error', details?: any) {
    super(message, 409, 'DUPLICATE_KEY', details);
  }
}

export class ApiKeyMissingError extends AppError {
  constructor(message: string = 'API Key is missing', details?: any) {
    super(message, 401, 'API_KEY_MISSING', details);
  }
}

export class InvalidApiKeyError extends AppError {
  constructor(message: string = 'Invalid API Key', details?: any) {
    super(message, 403, 'INVALID_API_KEY', details);
  }
}

//2

//mapMongoError
import mongoose from 'mongoose';
import { ValidationError, DuplicateKeyError, AppError } from './errors';

export function mapMongoError(error: any): never {
  if (error instanceof mongoose.Error.ValidationError) {
    throw new ValidationError('Validation failed', {
      fields: Object.keys(error.errors),
      messages: Object.values(error.errors).map((e: any) => e.message),
    });
  } else if (error instanceof mongoose.Error.CastError) {
    throw new AppError('Invalid ID format', 400, 'INVALID_ID', {
      field: error.path,
      value: error.value,
    });
  } else if (error.code === 11000) {
    throw new DuplicateKeyError('Duplicate key error', {
      field: Object.keys(error.keyValue)[0],
      value: Object.values(error.keyValue)[0],
    });
  } else {
    throw new AppError('Unexpected database error', 500, 'DB_ERROR', {
      originalError: error.message,
    });
  }
}
//3 exemple in ripository

public async create(userData: Partial<User>): Promise<User> {
    try {
      const user = new UserModel(userData);
      return await user.save();
    } catch (error) {
      mapMongoError(error); // טיפול בשגיאות עם פרטים
    }
  }

//4
//Middleware error
import { Request, Response, NextFunction } from 'express';
import AppError from './errors/AppError';

export function handleError(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const statusCode = err.statusCode || 500;
  const response: any = {
    success: false,
    message: err.message,
    statusCode: statusCode,
  };

  if (err.errorCode) {
    response.errorCode = err.errorCode;
  }

  if (err.details) {
    response.details = err.details; // פירוט השגיאה
  }

  res.status(statusCode).json(response);
}

//5
//exemple using in controller
public async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await this.userRepository.create(req.body);
      res.status(201).json({ success: true, data: user });
    } catch (error) {
      next(error); // העברת השגיאה ל-`handleError`
    }
  }

//6 apiKeyMiddleware
import { Request, Response, NextFunction } from 'express';
import { ApiKeyMissingError, InvalidApiKeyError } from '../utils/AppError';

export const apiKeyMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    // זרוק שגיאה מותאמת אישית כאשר ה-API Key חסר
    throw new ApiKeyMissingError();
  }

  const validApiKey = process.env.API_KEY;
  if (apiKey !== validApiKey) {
    // זרוק שגיאה מותאמת אישית כאשר ה-API Key שגוי
    throw new InvalidApiKeyError();
  }

  next();
};

//7 init server in middelware
app.use(apiKeyMiddleware);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//8 Swagger/docs exemple
const anticipationDocs = {
  '/anticipation/all': {
    get: {
      summary: 'Get all anticipations',
      tags: ['Anticipation'],
      responses: {
        200: {
          description: 'A list of anticipations',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
  },
  '/anticipation/create': {
    post: {
      summary: 'Create a new anticipation',
      tags: ['Anticipation'],
      responses: {
        200: {
          description: 'Anticipation created successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
  },
  '/anticipation/{id}': {
    delete: {
      summary: 'Delete an anticipation',
      tags: ['Anticipation'],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'ID of the anticipation to delete',
          schema: {
            type: 'string',
          },
        },
      ],
      responses: {
        200: {
          description: 'Anticipation deleted successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
  },
};

export default anticipationDocs;

//9 Swagger/index
import swaggerJSDoc from 'swagger-jsdoc';
import anticipationDocs from '../routes/docs/anticipationDocs';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Anticipation API',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: [], // אנחנו לא משתמשים בקבצים עם הערות ישירות
};

const swaggerSpec = {
  ...swaggerJSDoc(swaggerOptions),
  paths: {
    ...anticipationDocs,
  },
};

export default swaggerSpec;

components: {
      securitySchemes: {
        apiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-api-key',
        },
      },
    },
    security: [
      {
        apiKeyAuth: [],
      },
    ], // ברירת מחדל לכל המסלולים
  },





