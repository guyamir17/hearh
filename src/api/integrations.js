import { staticClient } from './staticClient';

export const Core = staticClient.integrations.Core;
export const InvokeLLM = staticClient.integrations.Core.InvokeLLM;
export const SendEmail = staticClient.integrations.Core.SendEmail;
export const SendSMS = staticClient.integrations.Core.SendSMS;
export const UploadFile = staticClient.integrations.Core.UploadFile;
export const GenerateImage = staticClient.integrations.Core.GenerateImage;
export const ExtractDataFromUploadedFile = staticClient.integrations.Core.ExtractDataFromUploadedFile;
