import { ColumnsType } from 'antd/es/table';
import { useMemo } from 'react';

const FunctionalGroup = () => {
  const columns: ColumnsType = useMemo(() => {
    return [] as ColumnsType;
  }, []);

  console.log(columns);

  return <p></p>;
};

export default FunctionalGroup;
