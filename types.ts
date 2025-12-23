
export interface Dashboard {
  id: string;
  name: string;
  url: string;
  createdAt: number;
}

export type LayoutState = 'viewing' | 'settings';
