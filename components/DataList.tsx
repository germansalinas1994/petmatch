// DataList.tsx
import React, { useEffect, useState } from 'react';
import { View, FlatList, ListRenderItem } from 'react-native';
import SkeletonItem from './SkeletonItem';

type DataListProps<T> = {
  fetchData: () => Promise<T[]>;
  renderItem: ListRenderItem<T>;
  renderSkeleton: () => JSX.Element;
  skeletonCount?: number;
  itemKeyExtractor: (item: T) => string;
};

function DataList<T>({ fetchData, renderItem, renderSkeleton, skeletonCount = 10, itemKeyExtractor }: DataListProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const dataList = await fetchData();
      setData(dataList);
      setLoading(false);
    };

    fetch();
  }, [fetchData]);

  return (
    <View>
      {loading ? (
        <FlatList
          data={Array(skeletonCount).fill({})}
          renderItem={renderSkeleton}
          keyExtractor={(_, index) => index.toString()}
        />
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={itemKeyExtractor}
        />
      )}
    </View>
  );
}

export default DataList;
