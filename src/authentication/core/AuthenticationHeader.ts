import type { Logger as WinstonLogger } from 'winston';
import MerchantConfig from './MerchantConfig';
import type { MerchantConfigOptions, Stringable } from './MerchantConfig';
import * as Constants from '../util/Constants';
import * as Logger from '../logging/Logger';
import * as Authorization from './Authorization';
import * as PayloadDigest from '../payloadDigest/DigestGenerator';
import * as querystring from 'querystring';

// Code added by Infosys dev team

export class AuthenticationHeader {
  merchantConfig: MerchantConfig;
  constants = Constants;
  basePath: string;
  logger: WinstonLogger;

  /**
   * This method will set the merchantConfig object global
   * @param configObject merchantConfiguration properties.
   */
  setConfiguration(configObject: MerchantConfigOptions) {
    this.merchantConfig = new MerchantConfig(configObject);
    this.constants = Constants;
    if (this.merchantConfig.getIntermediateHost()) {
      if (
        this.merchantConfig
          .getIntermediateHost()
          .startsWith(this.constants.HTTP_URL_PREFIX) ||
        this.merchantConfig.getIntermediateHost().startsWith('http://')
      ) {
        this.basePath = this.merchantConfig.getIntermediateHost();
      } else {
        this.basePath =
          this.constants.HTTP_URL_PREFIX +
          this.merchantConfig.getIntermediateHost();
      }
    } else {
      this.basePath =
        this.constants.HTTP_URL_PREFIX + this.merchantConfig.getRequestHost();
    }
    this.logger = Logger.getLogger(this.merchantConfig, 'ApiClient');
  }

  /**
   * This method is to generate headers for http and jwt authentication.
   */
  callAuthenticationHeader(
    httpMethod: string,
    requestTarget: string,
    requestBody: string,
    headerParams,
  ) {
    this.merchantConfig.setRequestTarget(requestTarget);
    this.merchantConfig.setRequestType(httpMethod);
    this.merchantConfig.setRequestJsonData(requestBody);

    this.logger.info(
      'Authentication Type : ' + this.merchantConfig.getAuthenticationType(),
    );
    this.logger.info(
      this.constants.REQUEST_TYPE + ' : ' + httpMethod.toUpperCase(),
    );

    var token = Authorization.getToken(this.merchantConfig, this.logger);

    if (
      this.merchantConfig.getAuthenticationType()?.toLowerCase() ===
      this.constants.JWT
    ) {
      token = 'Bearer ' + token;
      headerParams['Authorization'] = token;
      this.logger.info(this.constants.AUTHORIZATION + ' : ' + token);
    } else if (
      this.merchantConfig.getAuthenticationType()?.toLowerCase() ===
      this.constants.HTTP
    ) {
      var date = new Date(Date.now()).toUTCString();

      if (
        httpMethod.toLowerCase() === this.constants.POST ||
        httpMethod.toLowerCase() === this.constants.PATCH ||
        httpMethod.toLowerCase() === this.constants.PUT
      ) {
        var digest = PayloadDigest.generateDigest(
          this.merchantConfig,
          this.logger,
        );
        digest = this.constants.SIGNATURE_ALGORITHAM + digest;
        this.logger.info(this.constants.DIGEST + ' : ' + digest);
        headerParams['digest'] = digest;
      }

      headerParams['v-c-merchant-id'] = this.merchantConfig.getMerchantID();
      headerParams['date'] = date;
      headerParams['host'] = this.merchantConfig.getRequestHost();
      headerParams['signature'] = token;
      headerParams['User-Agent'] = this.constants.USER_AGENT_VALUE;

      this.logger.info(
        'v-c-merchant-id : ' + this.merchantConfig.getMerchantID(),
      );
      this.logger.info('date : ' + date);
      this.logger.info('host : ' + this.merchantConfig.getRequestHost());
      this.logger.info('signature : ' + token);
      this.logger.info('User-Agent : ' + headerParams['User-Agent']);
      this.logger.info(this.constants.END_TRANSACTION);
    } else if (
      this.merchantConfig.getAuthenticationType()?.toLowerCase() ===
      this.constants.OAUTH
    ) {
      token = 'Bearer ' + token;
      headerParams['Authorization'] = token;
      // this.logger.info(this.constants.AUTHORIZATION + ' : ' + token);
    }

    return headerParams;
  }

  /**
   * Build request target required for the signature generation
   */
  buildRequestTarget(
    path: string,
    pathParams: Record<string, string | null>,
    queryParams: Record<string, string | null>,
  ) {
    if (!path.match(/^\//)) {
      path = '/' + path;
    }

    var _this = this;
    var requestTarget = path.replace(
      /\{([\w-]+)\}/g,
      function (fullMatch, key) {
        var value;
        if (pathParams.hasOwnProperty(key)) {
          value = _this.paramToString(pathParams[key]);
        } else {
          value = fullMatch;
        }
        return encodeURIComponent(value);
      },
    );

    // added by infosys team, to generate requestTarget with queryParams
    if (Object.keys(queryParams).length !== 0) {
      var queryFlag = false;
      var queryArray: Record<string, string | null> = {};
      Object.keys(queryParams).forEach(function (prop) {
        var val = queryParams[prop];

        if (val !== undefined) {
          queryArray[prop] = val;
          queryFlag = true;
        }
      });
      if (queryFlag)
        requestTarget = requestTarget + '?' + querystring.stringify(queryArray);
    }
    return requestTarget;
  }

  /**
   * Returns a string representation for an actual parameter.
   * @param param The actual parameter.
   * @returns The string representation of <code>param</code>.
   */
  paramToString(param: null | undefined | Date | Stringable): string {
    if (param == undefined || param == null) {
      return '';
    }
    if (param instanceof Date) {
      return param.toJSON();
    }
    return param.toString();
  }
}
