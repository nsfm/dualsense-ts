import { NodeHIDProvider } from './node_hid_provider'
import { WebHIDProvider } from './web_hid_provider'

export const PlatformHIDProvider = typeof window === 'undefined' ? NodeHIDProvider : WebHIDProvider;
