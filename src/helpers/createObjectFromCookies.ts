const createObjectFromCookies = (
  cookies: string
): { [key: string]: string } => {
  if (!cookies) return {};

  return cookies.split(';').reduce((object, cookieData) => {
    const [key, value] = cookieData.split('=');
    const formattedKey = key.trim();

    return { ...object, [formattedKey]: value };
  }, {});
};

export default createObjectFromCookies;
