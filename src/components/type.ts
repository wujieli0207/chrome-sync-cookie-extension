export interface ICookieTableDataSource {
  id: string;
  type: string;
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
