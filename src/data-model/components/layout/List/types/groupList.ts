import { ListProps, DefaultItemT } from './list';

export interface GroupListProps<ItemT extends DefaultItemT> extends ListProps<ItemT> {
  groupId: string;
  id: string;
}
