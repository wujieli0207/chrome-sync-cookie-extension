export interface ICookieTableDataSource {
  id: string;
  from: string;
  cookieName: string;
  to: string;
  action?: string;
}

export interface ICookieTableColumn {
  title: string;
  dataIndex: string;
  key: string;
  align?: string;
}

export interface ICookie {
  /** The domain of the cookie (e.g. "www.google.com", "example.com"). */
  domain: string;
  /** The name of the cookie. */
  name: string;
  /** The ID of the cookie store containing this cookie, as provided in getAllCookieStores(). */
  storeId?: string;
  /** The value of the cookie. */
  value: string;
  /** True if the cookie is a session cookie, as opposed to a persistent cookie with an expiration date. */
  session?: boolean;
  /** True if the cookie is a host-only cookie (i.e. a request's host must exactly match the domain of the cookie). */
  hostOnly?: boolean;
  /** Optional. The expiration date of the cookie as the number of seconds since the UNIX epoch. Not provided for session cookies.  */
  expirationDate?: number | undefined;
  /** The path of the cookie. */
  path: string;
  /** True if the cookie is marked as HttpOnly (i.e. the cookie is inaccessible to client-side scripts). */
  httpOnly?: boolean;
  /** True if the cookie is marked as Secure (i.e. its scope is limited to secure channels, typically HTTPS). */
  secure?: boolean;
  /**
   * The cookie's same-site status (i.e. whether the cookie is sent with cross-site requests).
   * @since Chrome 51.
   */
  sameSite?: "unspecified" | "no_restriction" | "lax" | "strict";
}

export type TCookieConfig = Partial<ICookieTableDataSource>;

// 存储在 localStorage 里的数据 key
export const LIST_KEY = "domainList";
