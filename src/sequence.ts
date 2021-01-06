import { inject } from '@loopback/context';
import {
  RequestContext,
  FindRoute,
  InvokeMethod,
  ParseParams,
  Reject,
  RestBindings,
  Send,
  HttpErrors,
  SequenceHandler,
} from '@loopback/rest';
import { Logger } from '../logger-extention';
import {
  AuthenticateFn,
  AuthenticationBindings,
} from 'loopback4-authentication';
import { Users } from './models';
import {
  AuthorizationBindings,
  AuthorizeErrorKeys,
  AuthorizeFn,
} from 'loopback4-authorization';

const SequenceActions = RestBindings.SequenceActions;
export class MySequence implements SequenceHandler {
  constructor(
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) public send: Send,
    @inject(SequenceActions.REJECT) public reject: Reject,
    @inject('logger') public logger: Logger,
    @inject(AuthenticationBindings.USER_AUTH_ACTION)
    protected authenticateRequest: AuthenticateFn<Users>,
    @inject(AuthorizationBindings.AUTHORIZE_ACTION)
    protected checkAuthorization: AuthorizeFn
  ) {}
  async handle(context: RequestContext) {
    const requestTime = Date.now();
    const { request, response } = context;
    try {
      this.logger.info(`Request ${request.method} ${
        request.url
      } started at ${requestTime.toString()}.
        Request Details
        Referer = ${request.headers.referer}
        User Agent = ${request.headers['user-agent']}
        Remote Address = ${request.connection.remoteAddress}`);
      const route = this.findRoute(request);
      const args = await this.parseParams(request, route);
      request.body = args[args.length - 1];
      await this.authenticateRequest(request);
      const authUser: Users = await this.authenticateRequest(request, response);
      const isAccessAllowed: boolean = await this.checkAuthorization(
        authUser && authUser.permissions,
        request
      );
      if (!isAccessAllowed) {
        throw new HttpErrors.Forbidden(AuthorizeErrorKeys.NotAllowedAccess);
      }
      const result = await this.invoke(route, args);
      this.send(response, result);
    } catch (err) {
      this.logger.info(`Request ${request.url} failed. Error => ${err}`);
      this.reject(context, err);
    } finally {
      this.logger.info(
        `Request ${request.url} Completed in ${Date.now() - requestTime}ms`
      );
    }
  }
}
