import { GraphQLError, GraphQLErrorExtensions } from 'graphql';
import { t } from 'i18next';

export const Custom = new GraphQLError('Your');

export class HttpException extends GraphQLError {
  status: number;
  message: string;
  extensions: GraphQLErrorExtensions;

  constructor(status: number, message: string, code?: string) {
    super(message);
    this.message = message;
    this.extensions = { code, status };
  }
}

export class BadRequestException extends HttpException {
  constructor(message?: string) {
    super(400, message || t('common_error_bad_request'), 'BAD_REQUEST_ERROR');
  }
}

export class UnauthorizedException extends HttpException {
  constructor(message?: string) {
    super(401, message || t('common_error_unauthorized'), 'UNAUTHORIZED_ERROR');
  }
}

export class ForbiddenException extends HttpException {
  constructor(message?: string) {
    super(403, message || t('common_error_forbidden'), 'FORBIDDEN_ERROR');
  }
}
export class ConflictException extends HttpException {
  constructor(message?: string) {
    super(408, message || t('common_error_conflict'), 'CONFLICT_ERROR');
  }
}

export class NotFoundException extends HttpException {
  constructor(message?: string) {
    super(404, message || t('common_error_notFound'), 'NOT_FOUND');
  }
}

export class InternalServerException extends HttpException {
  constructor(message?: string) {
    super(
      500,
      message || t('common_error_internalServer'),
      'INTERNAL_SERVER_ERROR'
    );
  }
}

export class NotImplementedException extends HttpException {
  constructor(message?: string) {
    super(501, message || t('common_error_notImplemented'), 'NOT_IMPLEMENTED');
  }
}

export class BadGatewayException extends HttpException {
  constructor(message?: string) {
    super(502, message || t('common_error_badGateway'), 'BAD_GATEWAY');
  }
}

export class ServiceUnavailableException extends HttpException {
  constructor(message?: string) {
    super(
      503,
      message || t('common_error_serviceUnavailable'),
      'SERVICE_UNAVAILABLE'
    );
  }
}
