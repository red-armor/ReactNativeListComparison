import { OnEndReachedHelperProps,
  ViewabilityConfig,
  ViewabilityConfigCallbackPairs,
} from '@infinite-list/data-model';
import { ComponentType, PropsWithChildren } from 'react';

import { OnViewableItemsChanged } from '../../../container/ScrollView';

export type ListGroupProps = PropsWithChildren<{
  GroupListSeparatorComponent?: ComponentType<any> | null | undefined;
  id: string;
  onViewableItemsChanged?: OnViewableItemsChanged;
  viewabilityConfig?: ViewabilityConfig;
  viewabilityConfigCallbackPairs?: ViewabilityConfigCallbackPairs;
  initialNumToRender?: number;
  windowSize?: number;
  maxToRenderPerBatch?: number;
  onRenderFinished?: () => void;
  persistanceIndices?: number[];
}> &
  OnEndReachedHelperProps;

export type indexKeyMeta = {
  listKey?: string;
  key: string;
};
