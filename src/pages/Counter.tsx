import { Button, Space } from 'antd';
import { useAppDispatch, useAppSelector } from '~/hooks/useStore';
import {
  decrement,
  increment,
  incrementByAmount,
} from '~/store/counter/counterSlice';
import { RootState } from '~/store/store';

export function Counter() {
  const count = useAppSelector((state: RootState) => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <div>
      <Space>
        <Button
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          Increment
        </Button>
        <span>{count}</span>
        <Button
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          Decrement
        </Button>
        <hr />
        <Button
          aria-label="Decrement value"
          onClick={() => dispatch(incrementByAmount(count))}
        >
          incrementByAmount
        </Button>
      </Space>
    </div>
  );
}
