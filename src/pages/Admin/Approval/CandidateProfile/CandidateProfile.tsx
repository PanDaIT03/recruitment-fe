import { Space } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ButtonAction from '~/components/Button/ButtonAction';
import Content from '~/components/Content/Content';
import Table from '~/components/Table/Table';
import { useBreadcrumb } from '~/contexts/BreadcrumProvider';
import { useTitle } from '~/contexts/TitleProvider';
import usePagination from '~/hooks/usePagination';
import { useAppSelector } from '~/hooks/useStore';
import { getAllDesiredJob } from '~/store/thunk/desiredJob';
import { IDesiredJob } from '~/types/DesiredJob';
import { formatCurrencyVN } from '~/utils/functions';
import icons from '~/utils/icons';
import PATH from '~/utils/path';

const { EyeOutlined, CheckOutlined, CloseOutlined } = icons;

const CandidateProfile = () => {
  const navigate = useNavigate();
  const { setTitle } = useTitle();
  const { setBreadcrumb } = useBreadcrumb();

  const [filterParams, setFilterParams] = useState();

  const { desiredJob, loading } = useAppSelector((state) => state.desiredJob);

  console.log('desiredJob', desiredJob);

  const { pageInfo, handlePageChange } = usePagination({
    items: desiredJob?.items,
    extraParams: filterParams,
    fetchAction: getAllDesiredJob,
    setFilterParams: setFilterParams,
  });

  useEffect(() => {
    setTitle('Hồ sơ ứng viên');
    setBreadcrumb([{ title: 'Tuyển dụng' }, { title: 'Hồ sơ ứng viên' }]);
  }, []);

  const columns = useMemo(
    () =>
      [
        {
          width: 50,
          title: 'STT',
          dataIndex: 'id',
          render: (_: any, __: any, index: number) =>
            index + 1 + pageInfo.pageSize * (pageInfo.page - 1),
        },
        {
          width: 150,
          title: 'Tên',
          dataIndex: ['user', 'fullName'],
        },
        {
          width: 150,
          title: 'Lĩnh vực',
          dataIndex: ['jobField', 'title'],
        },
        {
          width: 150,
          align: 'center',
          title: 'Năm kinh nghiệm',
          dataIndex: 'totalYearExperience',
        },
        {
          width: 150,
          align: 'center',
          title: 'Mức lương kỳ vọng',
          dataIndex: 'salarayExpectation',
          render: (value) => <span>{formatCurrencyVN(value)} VNĐ</span>,
        },
        {
          width: 150,
          title: 'Thời gian bắt đầu',
          dataIndex: 'startAfterOffer',
        },
        {
          width: 150,
          title: 'Trạng thái',
          dataIndex: 'status',
        },
        {
          width: 200,
          title: 'Ngày tạo',
          dataIndex: 'createAt',
          render: (value: string) =>
            value ? dayjs(value).format('DD/MM/YYYY HH:MM') : '-',
        },
        {
          width: 180,
          title: 'Người phê duyệt',
          dataIndex: ['updater', 'fullName'],
        },
        {
          width: 200,
          title: 'Ngày phê duyệt',
          dataIndex: 'updateAt',
          render: (value: string) =>
            value ? dayjs(value).format('DD/MM/YYYY HH:MM') : '-',
        },
        {
          width: 100,
          fixed: 'right',
          align: 'center',
          title: 'Thao tác',
          render: (_, record) => (
            <Space>
              <ButtonAction
                title={<EyeOutlined />}
                tooltipTitle="Xem chi tiết"
                onClick={() =>
                  navigate(
                    `${PATH.ADMIN_CANDIDATE_PROFILE_DETAIL_MANAGEMENT}?id=${record?.id}&userId=${record?.user?.id}`
                  )
                }
              />
              <ButtonAction
                tooltipTitle="Phê duyệt"
                title={<CheckOutlined className="[&>svg]:fill-green-500" />}
              />
              <ButtonAction
                tooltipTitle="Từ chối"
                title={<CloseOutlined className="[&>svg]:fill-red-500" />}
              />
            </Space>
          ),
        },
      ] as ColumnsType<IDesiredJob>,
    [pageInfo]
  );

  return (
    <Content>
      <Table<IDesiredJob>
        columns={columns}
        loading={loading}
        dataSource={desiredJob?.items}
        pagination={{
          current: pageInfo.page,
          pageSize: pageInfo.pageSize,
          total: desiredJob?.pageInfo?.totalItems,
          onChange: handlePageChange,
        }}
      />
    </Content>
  );
};

export default CandidateProfile;
