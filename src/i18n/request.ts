import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';

// Valid locales
const locales = ['en', 'ar'];

export default getRequestConfig(async ({locale}) => {
  if (!locales.includes(locale as any)) notFound();

  return {
    // This assumes your messages are in root/messages/en.json
    // Note the `../../` because we are now deeper in src/i18n/
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
