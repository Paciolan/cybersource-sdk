import * as MerchantConfig from "./MerchantConfig";
import * as Constants from "../util/Constants";
import * as Logger from "../logging/Logger";
import * as Authorization from "./Authorization";
import * as PayloadDigest from "../payloadDigest/DigestGenerator";
import * as querystring from "querystring";

// Code added by Infosys dev team

export class AuthenticationHeader {
  /**
   * This method will set the merchantConfig object global
   *
   * @param {Configuration} configObject merchantConfiguration properties.
   */
  setConfiguration(configObject) {
    this.merchantConfig = new MerchantConfig(configObject);
    this.constants = Constants;
    if (this.merchantConfig.getIntermediateHost()) {
      if (
        this.merchantConfig.getIntermediateHost().startsWith(this.constants.HTTP_URL_PREFIX) ||
        this.merchantConfig.getIntermediateHost().startsWith("http://")
      ) {
        this.basePath = this.merchantConfig.getIntermediateHost();
      } else {
        this.basePath = this.constants.HTTP_URL_PREFIX + this.merchantConfig.getIntermediateHost();
      }
    } else {
      this.basePath = this.constants.HTTP_URL_PREFIX + this.merchantConfig.getRequestHost();
    }
    this.logger = Logger.getLogger(this.merchantConfig, "ApiClient");
  }

  /**
   * This method is to generate headers for http and jwt authentication.
   *
   * @param {String} httpMethod
   * @param {String} requestTarget
   * @param {String} requestBody
   */

  callAuthenticationHeader(httpMethod, requestTarget, requestBody, headerParams) {
    this.merchantConfig.setRequestTarget(requestTarget);
    this.merchantConfig.setRequestType(httpMethod);
    this.merchantConfig.setRequestJsonData(requestBody);

    this.logger.info("Authentication Type : " + this.merchantConfig.getAuthenticationType());
    this.logger.info(this.constants.REQUEST_TYPE + " : " + httpMethod.toUpperCase());

    var token = Authorization.getToken(this.merchantConfig, this.logger);

    // var clientId = getClientId();

    // headerParams['v-c-client-id'] = clientId;

    // if (this.merchantConfig.getSolutionId() != null && this.merchantConfig.getSolutionId() != '') {
    // headerParams['v-c-solution-id'] = this.merchantConfig.getSolutionId();
    // }

    if (this.merchantConfig.getAuthenticationType().toLowerCase() === this.constants.JWT) {
      token = "Bearer " + token;
      headerParams["Authorization"] = token;
      this.logger.info(this.constants.AUTHORIZATION + " : " + token);
    } else if (this.merchantConfig.getAuthenticationType().toLowerCase() === this.constants.HTTP) {
      var date = new Date(Date.now()).toUTCString();

      if (
        httpMethod.toLowerCase() === this.constants.POST ||
        httpMethod.toLowerCase() === this.constants.PATCH ||
        httpMethod.toLowerCase() === this.constants.PUT
      ) {
        var digest = PayloadDigest.generateDigest(this.merchantConfig, this.logger);
        digest = this.constants.SIGNATURE_ALGORITHAM + digest;
        this.logger.info(this.constants.DIGEST + " : " + digest);
        headerParams["digest"] = digest;
      }

      headerParams["v-c-merchant-id"] = this.merchantConfig.getMerchantID();
      headerParams["date"] = date;
      headerParams["host"] = this.merchantConfig.getRequestHost();
      headerParams["signature"] = token;
      headerParams["User-Agent"] = this.constants.USER_AGENT_VALUE;

      this.logger.info("v-c-merchant-id : " + this.merchantConfig.getMerchantID());
      this.logger.info("date : " + date);
      this.logger.info("host : " + this.merchantConfig.getRequestHost());
      this.logger.info("signature : " + token);
      this.logger.info("User-Agent : " + headerParams["User-Agent"]);
      this.logger.info(this.constants.END_TRANSACTION);
    } else if (this.merchantConfig.getAuthenticationType().toLowerCase() === this.constants.OAUTH) {
      token = "Bearer " + token;
      headerParams["Authorization"] = token;
      // this.logger.info(this.constants.AUTHORIZATION + ' : ' + token);
    }

    return headerParams;
  }

  /**
   * Build request target required for the signature generation
   * @param {String} path
   * @param {Object} pathParams
   */
  buildRequestTarget(path, pathParams, queryParams) {
    if (!path.match(/^\//)) {
      path = "/" + path;
    }

    var _this = this;
    var requestTarget = path.replace(/\{([\w-]+)\}/g, function (fullMatch, key) {
      var value;
      if (pathParams.hasOwnProperty(key)) {
        value = _this.paramToString(pathParams[key]);
      } else {
        value = fullMatch;
      }
      return encodeURIComponent(value);
    });

    // added by infosys team, to generate requestTarget with queryParams
    if (Object.keys(queryParams).length !== 0) {
      var queryFlag = false;
      var queryArray = [];
      Object.keys(queryParams).forEach(function (prop) {
        var val = queryParams[prop];

        if (val !== undefined) {
          queryArray[prop] = val;
          queryFlag = true;
        }
      });
      if (queryFlag) requestTarget = requestTarget + "?" + querystring.stringify(queryArray);
    }
    return requestTarget;
  }
}

function getClientId() {
  var packageInfo = require("./../package.json");
  return "cybs-rest-sdk-node-" + packageInfo.version;
}
