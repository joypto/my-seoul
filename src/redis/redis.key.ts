// manage create admin
export const ADMIN_USERNAMES = `admin_usernames`;
export const ADMIN_CODE = (username: string) => `admin_code:${username}`;

// auth email
export const EMAIL_AUTH_CODE = (email: string) => `email_auth_code:${email}`;
export const EMAIL_AUTH_STATUS = (email: string) => `email_auth_status:${email}`;
