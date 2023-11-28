import * as LogConfiguration from '../logging/LogConfiguration';
import { Logger } from 'winston';

export interface Stringable {
  toString(): string;
}

export type MerchantConfigOptions = Partial<
  Pick<
    MerchantConfig,
    | 'authenticationType'
    | 'requestJsonPath'
    | 'merchantID'
    | 'keysDirectory'
    | 'keyAlias'
    | 'keyPass'
    | 'keyFilename'
    | 'useProxy'
    | 'proxyAddress'
    | 'proxyPort'
    | 'proxyUser'
    | 'proxyPassword'
    | 'merchantKeyId'
    | 'merchantsecretKey'
    | 'useMetaKey'
    | 'portfolioID'
    | 'enableClientCert'
    | 'clientCertDir'
    | 'sslClientCert'
    | 'privateKey'
    | 'clientId'
    | 'clientSecret'
    | 'accessToken'
    | 'refreshToken'
    | 'runEnvironment'
    | 'intermediateHost'
    | 'solutionId'
    | 'logConfiguration'
    | 'defaultHeaders'
  > & {
    /** @deprecated use `keyFilename` instead */
    keyFileName: MerchantConfig['keyFilename'];
  }
>;

export = class MerchantConfig {
  /*Common Parameters*/
  authenticationType?: string;
  url;
  requestHost;
  requestJsonPath;
  merchantID?: string | Stringable;
  requestType;
  requestTarget;
  requestJsonData;

  /* JWT Parameters*/
  keysDirectory?: string;
  keyAlias?: string | Stringable;
  keyPass?: string | Stringable;
  keyType?;
  keyFilename?: string | Stringable;
  useHttpClient: boolean;

  /* proxy Parameters*/
  useProxy: boolean;
  proxyAddress?: string;
  proxyPort?: string | number;
  proxyUser?: string;
  proxyPassword?: string;

  /*HTTP Parameters*/
  merchantKeyId?: string | Stringable;
  merchantsecretKey?: string | Stringable;

  /* MetaKey Parameters */
  useMetaKey: boolean;
  portfolioID?: string;

  /* MutualAuth Parameters */
  enableClientCert: boolean;
  clientCertDir?: string;
  sslClientCert?: string | Stringable;
  privateKey?: string | Stringable;

  /* OAuth Parameters */
  clientId?: string | Stringable;
  clientSecret?: string | Stringable;
  accessToken?: string | Stringable;
  refreshToken?: string | Stringable;

  runEnvironment?: string | Stringable;

  /* Intermediate Host */
  intermediateHost;

  solutionId;

  logConfiguration: LogConfiguration;

  /* Default Custom Headers */
  defaultHeaders;

  constructor(result: MerchantConfigOptions);

  getAuthenticationType(): MerchantConfig['authenticationType'];

  setAuthenticationType(authType: MerchantConfig['authenticationType']): void;

  setMerchantID(merchantID: MerchantConfig['merchantID']): void;

  setRequestHost(requestHost: MerchantConfig['requestHost']): void;

  setKeyAlias(keyAlias: MerchantConfig['keyAlias']): void;

  setKeyPass(keyPass: MerchantConfig['keyPass']): void;

  setKeysDirectory(keysDirectory: MerchantConfig['keysDirectory']): void;

  setMerchantKeyID(merchantKeyId: MerchantConfig['merchantKeyId']): void;

  setMerchantsecretKey(
    merchantsecretKey: MerchantConfig['merchantsecretKey'],
  ): void;

  setUseMetaKey(useMetaKey: MerchantConfig['useMetaKey']): void;

  setPortfolioID(portfolioID: MerchantConfig['portfolioID']): void;

  setEnableClientCert(
    enableClientCert: MerchantConfig['enableClientCert'],
  ): void;

  setClientCertDir(clientCertDir: MerchantConfig['clientCertDir']): void;

  setSSLClientCert(sslClientCert: MerchantConfig['sslClientCert']): void;

  setPrivateKey(privateKey: MerchantConfig['privateKey']): void;

  setClientId(clientId: MerchantConfig['clientId']): void;

  setClientSecret(clientSecret: MerchantConfig['clientSecret']): void;

  setAccessToken(accessToken: MerchantConfig['accessToken']): void;

  setRefreshToken(refreshToken: MerchantConfig['refreshToken']): void;

  setSolutionId(solutionId: MerchantConfig['solutionId']): void;

  setURL(url: MerchantConfig['url']): void;

  getMerchantID(): MerchantConfig['merchantID'];

  getRequestHost(): MerchantConfig['requestHost'];

  getKeyAlias(): MerchantConfig['keyAlias'];

  getKeyPass(): MerchantConfig['keyPass'];

  getUseMetaKey(): MerchantConfig['useMetaKey'];

  getPortfolioID(): MerchantConfig['portfolioID'];

  getEnableClientCert(): MerchantConfig['enableClientCert'];

  getClientCertDir(): MerchantConfig['clientCertDir'];

  getSSLClientCert(): MerchantConfig['sslClientCert'];

  getPrivateKey(): MerchantConfig['privateKey'];

  getClientId(): MerchantConfig['clientId'];

  getClientSecret(): MerchantConfig['clientSecret'];

  getAccessToken(): MerchantConfig['accessToken'];

  getRefreshToken(): MerchantConfig['refreshToken'];

  getKeysDirectory(): MerchantConfig['keysDirectory'];

  getMerchantKeyID(): MerchantConfig['merchantKeyId'];

  getMerchantsecretKey(): MerchantConfig['merchantsecretKey'];

  getSolutionId(): MerchantConfig['solutionId'];

  getURL(): MerchantConfig['url'];

  getRequestTarget(): MerchantConfig['requestTarget'];

  setRequestJsonData(requestJsonData: MerchantConfig['requestJsonData']): void;

  getRequestJsonData(): MerchantConfig['requestJsonData'];

  setRequestTarget(requestTarget: MerchantConfig['requestTarget']): void;

  getRequestJsonPath(): MerchantConfig['requestJsonPath'];

  setRequestJsonPath(requestJsonPath: MerchantConfig['requestJsonPath']): void;

  getRequestType(): MerchantConfig['requestType'];

  setRequestType(requestType: MerchantConfig['requestType']): void;

  getRunEnvironment(): MerchantConfig['runEnvironment'];

  setRunEnvironment(runEnvironment: MerchantConfig['runEnvironment']): void;

  getIntermediateHost(): MerchantConfig['intermediateHost'];

  setIntermediateHost(
    intermediateHost: MerchantConfig['intermediateHost'],
  ): void;

  getProxyAddress(): MerchantConfig['proxyAddress'];

  setProxyAddress(proxyAddress: MerchantConfig['proxyAddress']);

  getProxyPort(): MerchantConfig['proxyPort'];

  setProxyPort(proxyPort: MerchantConfig['proxyPort']);

  getUseProxy(): MerchantConfig['useProxy'];

  setUseProxy(useProxy): MerchantConfig['useProxy'];

  getProxyUser(): MerchantConfig['proxyUser'];

  setProxyUser(proxyUser: MerchantConfig['proxyUser']): void;

  getProxyPassword(): MerchantConfig['proxyPassword'];

  setProxyPassword(proxyPassword: MerchantConfig['proxyPassword']): void;

  getKeyFileName(): MerchantConfig['keyFilename'];

  setKeyFileName(keyFilename: MerchantConfig['keyFilename']): void;

  getLogConfiguration(): MerchantConfig['logConfiguration'];

  setLogConfiguration(logConfig: MerchantConfig['logConfiguration']): void;

  getDefaultHeaders(): MerchantConfig['defaultHeaders'];

  setDefaultHeaders(defaultHeaders: MerchantConfig['defaultHeaders']): void;

  runEnvironmentCheck(logger: Logger): void;

  //This method is for fallback
  defaultPropValues(): void;

  /**
   * This method is to log all merchantConfig properties
   * excluding HideMerchantConfigProperties defined in Constants
   *
   * @param {*} merchantConfig
   */
  getAllProperties(
    merchantConfig,
  ): Exclude<
    MerchantConfig,
    | 'merchantID'
    | 'merchantsecretKey'
    | 'merchantKeyId'
    | 'keyAlias'
    | 'keyPass'
    | 'requestJsonData'
  >;
};
