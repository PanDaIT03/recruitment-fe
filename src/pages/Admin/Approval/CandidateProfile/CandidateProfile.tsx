import { useMutation } from '@tanstack/react-query';
import { Col, message, Row, Space, Tag } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  DesiredJobAPI,
  IApproveProfileParams,
  IGetAllDesiredJob,
} from '~/apis/desiredJob';
import { FilterAdmin } from '~/assets/svg';
import Button from '~/components/Button/Button';
import ButtonAction from '~/components/Button/ButtonAction';
import Content from '~/components/Content/Content';
import Table from '~/components/Table/Table';
import { useBreadcrumb } from '~/contexts/BreadcrumProvider';
import { useTitle } from '~/contexts/TitleProvider';
import { STATUS_CODE } from '~/enums';
import usePagination from '~/hooks/usePagination';
import { useAppDispatch, useAppSelector } from '~/hooks/useStore';
import { getAllDesiredJob } from '~/store/thunk/desiredJob';
import { IDesiredJob } from '~/types/DesiredJob';
import { formatCurrencyVN } from '~/utils/functions';
import icons from '~/utils/icons';
import PATH from '~/utils/path';
import FilterCandidateProfile from './FilterCandidateProfile';
import ModalRejectProfile from './ModalRejectProfile';
import { ApprovalAPI } from '~/apis/approval';

export interface IRejectedForm {
  reason: string;
}

export interface IFilterCandidateForm {
  fullName: string;
  statusId: number;
  createdDate: string;
  jobFieldId: number;
  startAfterOffer: string;
  totalYearExperience: number;
}

const { EyeOutlined, CheckOutlined, CloseOutlined } = icons;

const CandidateProfile = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { setTitle } = useTitle();
  const { setBreadcrumb } = useBreadcrumb();

  const [rejectedForm] = useForm<IRejectedForm>();
  const [filterForm] = useForm<IFilterCandidateForm>();

  const [editIndex, setEditIndex] = useState(-1);
  const [filterParams, setFilterParams] = useState<IGetAllDesiredJob>({});

  const [isOpenFilter, setIsOpenFilter] = useState(false);
  const [isOpenReasonModal, setIsOpenReasonModal] = useState(false);

  const { desiredJob, loading } = useAppSelector((state) => state.desiredJob);

  const { pageInfo, handlePageChange, handleClearURLSearchParams } =
    usePagination({
      items: desiredJob?.items,
      extraParams: filterParams,
      setFilterParams,
      fetchFn: (params) => dispatch(getAllDesiredJob(params)),
    });

  const { mutate: approveProfile, isPending: isApproveProfilePending } =
    useMutation({
      mutationFn: (params: IApproveProfileParams) =>
        DesiredJobAPI.approveProfile(params),
      onSuccess: (res) => {
        message.success(res?.message);

        setFilterParams({});
        handleCancelRejected();
      },
      onError: (error: any) => {
        message.error(error?.response?.data?.message);
      },
    });

  useEffect(() => {
    setTitle('Hồ sơ ứng viên');
    setBreadcrumb([{ title: 'Tuyển dụng' }, { title: 'Hồ sơ ứng viên' }]);
  }, []);

  const handleApprove = useCallback(
    (params: IApproveProfileParams) => approveProfile(params),
    []
  );

  const handleFinishRejected = useCallback(
    (values: IRejectedForm) =>
      handleApprove({
        id: editIndex,
        type: 'reject',
        rejectReason: values?.reason,
      }),
    [editIndex]
  );

  const handleCancelRejected = useCallback(() => {
    rejectedForm.resetFields();
    setIsOpenReasonModal(false);
  }, []);

  const handleCancelFilter = useCallback(() => {
    setFilterParams({});
    setIsOpenFilter(false);

    filterForm.resetFields();
    handleClearURLSearchParams();
  }, []);

  const handleFinishFilter = useCallback(
    (values: IFilterCandidateForm) => setFilterParams(values),
    []
  );

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
            const { id, user, status } = record;
            const isApproved = status?.code !== STATUS_CODE.APPROVAL_PENDING;

            return (
              <Space>
                <ButtonAction
                  disabled={isApproved}
                  tooltipTitle="Phê duyệt"
                  title={<CheckOutlined className="[&>svg]:fill-green-500" />}
                  onClick={() => handleApprove({ id, type: 'approve' })}
                />
                <ButtonAction
                  disabled={isApproved}
                  tooltipTitle="Từ chối"
                  title={<CloseOutlined className="[&>svg]:fill-red-500" />}
                  onClick={() => {
                    setEditIndex(id);
                    setIsOpenReasonModal(true);
                  }}
                />
                <ButtonAction
                  title={<EyeOutlined />}
                  tooltipTitle="Xem chi tiết"
                  onClick={() =>
                    navigate(
                      `${PATH.ADMIN_CANDIDATE_PROFILE_DETAIL_MANAGEMENT}?id=${id}&userId=${user?.id}`
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
    <>
      <Row gutter={[8, 16]} align="middle" justify="end">
        <Col>
          <Button
            className="bg-white"
            title={<FilterAdmin />}
            onClick={() => setIsOpenFilter(!isOpenFilter)}
          />
        </Col>
      </Row>
      <FilterCandidateProfile
        form={filterForm}
        isOpen={isOpenFilter}
        onCancel={handleCancelFilter}
        onFinish={handleFinishFilter}
        onPageChange={handlePageChange}
      />
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
      <ModalRejectProfile
        form={rejectedForm}
        isOpen={isOpenReasonModal}
        loading={isApproveProfilePending}
        onCancel={handleCancelRejected}
        onFinish={handleFinishRejected}
      />
    </>
  );
};

export default CandidateProfile;
