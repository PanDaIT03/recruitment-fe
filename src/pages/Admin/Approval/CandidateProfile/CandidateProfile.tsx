import { useMutation } from '@tanstack/react-query';
import { message, Space, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  DesiredJobAPI,
  IApproveProfileParams,
  IGetAllDesiredJob,
} from '~/apis/desiredJob';
import ButtonAction from '~/components/Button/ButtonAction';
import Content from '~/components/Content/Content';
import Table from '~/components/Table/Table';
import { useBreadcrumb } from '~/contexts/BreadcrumProvider';
import { useTitle } from '~/contexts/TitleProvider';
import { STATUS_CODE } from '~/enums';
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

  const [filterParams, setFilterParams] = useState<IGetAllDesiredJob>();

  const { desiredJob, loading } = useAppSelector((state) => state.desiredJob);

  const { pageInfo, handlePageChange } = usePagination({
    items: desiredJob?.items,
    extraParams: filterParams,
    fetchAction: getAllDesiredJob,
    setFilterParams: setFilterParams,
  });

  const { mutate: approveProfile, isPending: isApproveProfilePending } =
    useMutation({
      mutationFn: (params: IApproveProfileParams) =>
        DesiredJobAPI.approveProfile(params),
      onSuccess: (res) => {
        message.success(res?.message);

        setFilterParams({});
      },
      onError: (error: any) => {
        message.error(error?.response?.data?.message);
      },
    });

  useEffect(() => {
    setTitle('Hồ sơ ứng viên');
    setBreadcrumb([{ title: 'Tuyển dụng' }, { title: 'Hồ sơ ứng viên' }]);
  }, []);

  const handleApprove = useCallback((params: IApproveProfileParams) => {
    approveProfile(params);
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
          width: 180,
          title: 'Thời gian bắt đầu',
          dataIndex: 'startAfterOffer',
        },
        {
          width: 150,
          title: 'Trạng thái',
          dataIndex: 'status',
          render: (_, record) => {
            const { status } = record;

            return (
              <Tag
                color={
                  status?.code === STATUS_CODE.APPROVAL_APPROVED
                    ? 'green'
                    : status?.code === STATUS_CODE.APPROVAL_REJECTED
                      ? 'red'
                      : 'blue'
                }
              >
                {status?.title}
              </Tag>
            );
          },
        },
        {
          width: 180,
          title: 'Người tạo',
          dataIndex: ['creator', 'fullName'],
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
          title: 'Người chỉnh sửa',
          dataIndex: ['updater', 'fullName'],
        },
        {
          width: 200,
          title: 'Ngày chỉnh sửa',
          dataIndex: 'updateAt',
          render: (value: string) =>
            value ? dayjs(value).format('DD/MM/YYYY HH:MM') : '-',
        },
        {
          width: 180,
          title: 'Người phê duyệt',
          dataIndex: ['approver', 'fullName'],
        },
        {
          width: 200,
          title: 'Ngày phê duyệt',
          dataIndex: 'approveAt',
          render: (value: string) =>
            value ? dayjs(value).format('DD/MM/YYYY HH:MM') : '-',
        },
        {
          width: 100,
          fixed: 'right',
          align: 'center',
          title: 'Thao tác',
          render: (_, record) => {
            const isApproved = !!Object.keys(record?.status)?.length;

            return (
              <Space>
                <ButtonAction
                  disabled={isApproved}
                  tooltipTitle="Phê duyệt"
                  title={<CheckOutlined className="[&>svg]:fill-green-500" />}
                  onClick={() =>
                    handleApprove({ id: record?.id, type: 'approve' })
                  }
                />
                <ButtonAction
                  disabled={isApproved}
                  tooltipTitle="Từ chối"
                  title={<CloseOutlined className="[&>svg]:fill-red-500" />}
                  onClick={() =>
                    handleApprove({ id: record?.id, type: 'reject' })
                  }
                />
                <ButtonAction
                  title={<EyeOutlined />}
                  tooltipTitle="Xem chi tiết"
                  onClick={() =>
                    navigate(
                      `${PATH.ADMIN_CANDIDATE_PROFILE_DETAIL_MANAGEMENT}?id=${record?.id}&userId=${record?.user?.id}`
                    )
                  }
                />
              </Space>
            );
          },
        },
      ] as ColumnsType<IDesiredJob>,
    [pageInfo]
  );

  return (
    <Content>
      <Table<IDesiredJob>
        columns={columns}
        dataSource={desiredJob?.items}
        loading={loading || isApproveProfilePending}
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
