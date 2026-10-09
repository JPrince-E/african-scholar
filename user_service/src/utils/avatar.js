// Default neutral academic profile avatar used for new user accounts and unconfigured profiles
export const DEFAULT_AVATAR = '/default-avatar.svg';

export const getAvatarUrl = (url) => {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return DEFAULT_AVATAR;
  }
  return url;
};
