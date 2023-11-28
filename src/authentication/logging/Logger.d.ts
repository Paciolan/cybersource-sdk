import MerchantConfig from '../core/MerchantConfig';
import { Logger } from 'winston';
import { LiteralUnion } from 'type-fest';

export function getLogger(
  merchantConfig: MerchantConfig,
  loggerCategory: LiteralUnion<string, 'UnknownCategoryLogger'>,
): Logger;
