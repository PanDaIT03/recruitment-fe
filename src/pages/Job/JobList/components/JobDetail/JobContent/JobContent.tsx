import { Flex } from 'antd';
import { memo } from 'react';
import { Salary } from '~/assets/svg';

const JobContent = () => {
  return (
    <div className="bg-white rounded-2xl border">
      <div className="px-6 py-4 border-b">
        <p className="text-base font-semibold">Chi tiết tin tuyển dụng</p>
      </div>
      <div className="p-6">
        <div className="space-y-4 bg-orange-50 p-4 rounded-2xl border border-orange-200">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Flex align="center" gap={16}>
              <div className="flex aspect-square items-center justify-center rounded-full bg-orange-400 p-2 text-main">
                <Salary />
              </div>
              <div className="text-sm">
                <p className="text-sub font-medium">Mức lương</p>
                <p className="font-semibold text-accent">5tr - 15tr VND</p>
              </div>
            </Flex>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(JobContent);
