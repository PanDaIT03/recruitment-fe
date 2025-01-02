import { Col, Flex, message, Popconfirm, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ColumnsType } from 'antd/es/table';
import classNames from 'classnames';
import { memo, useCallback, useMemo, useState } from 'react';

import { FilterAdmin } from '~/assets/svg';
import Button from '~/components/Button/Button';
import ButtonAction from '~/components/Button/ButtonAction';
import Content from '~/components/Content/Content';
import FormItem from '~/components/Form/FormItem';
import FormWrapper from '~/components/Form/FormWrapper';
import Input from '~/components/Input/Input';
import Table from '~/components/Table/Table';
import usePagination from '~/hooks/usePagination';
import useQueryParams from '~/hooks/useQueryParams';
import { useAppSelector } from '~/hooks/useStore';
import { getAllFunctionals } from '~/store/thunk/functional';
import { IFunctionalItem } from '~/types/Functional';
import icons from '~/utils/icons';
import AdminModal from '../components/AdminModal/AdminModal';
import FilterFunctional from './FilterFunctional';

interface IForm {
  code: string;
  title: string;
}

const {
  EditOutlined,
  PlusOutlined,
  CloseOutlined,
  SaveOutlined,
  QuestionCircleOutlined,
} = icons;

const FunctionalManagement = () => {
  const [form] = useForm<IForm>();
  const queryParams = useQueryParams();

  const [isOpenModal, setIsOpenModal] = useState(true);
  const [isOpenFilter, setIsOpenFilter] = useState(false);

  const { functionals, loading } = useAppSelector((state) => state.functional);

  const paginationParams = {
    page: Number(queryParams.get('page') || 1),
    pageSize: Number(queryParams.get('pageSize') || 10),
  };

  const { currentPage, itemsPerPage, handlePageChange } = usePagination({
    fetchAction: getAllFunctionals,
    pageInfo: {
      currentPage: paginationParams.page,
      itemsPerPage: paginationParams.pageSize,
      totalItems: functionals?.pageInfo?.totalItems || 0,
    },
    items: functionals?.items,
  });

  const columns = useMemo(() => {
    return [
      {
        width: 50,
        title: 'STT',
        align: 'center',
        render: (_, __, index: number) =>
          index + 1 + paginationParams.pageSize * (paginationParams.page - 1),
      },
      {
        width: 200,
        dataIndex: 'title',
        title: 'Tên chức năng',
      },
      {
        width: 50,
        title: 'Mã',
        dataIndex: 'code',
      },
      {
        width: 50,
        fixed: 'right',
        align: 'center',
        title: 'Thao tác',
        render: (_, record) => {
          return (
            <Flex justify="center">
              <ButtonAction
                tooltipTitle="Chỉnh sửa"
                title={<EditOutlined />}
                onClick={() => handleEdit(record)}
              />
              <Popconfirm
                okText="Có"
                cancelText="Không"
                placement="topLeft"
                title={<span className="text-black">Xoá mục này</span>}
                description={
                  <span className="text-black">
                    Bạn có chắc chắn muốn xoá mục này?
                  </span>
                }
                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                onConfirm={() => handleDelete(record.id)}
              >
                <ButtonAction tooltipTitle="Xóa" title={<CloseOutlined />} />
              </Popconfirm>
            </Flex>
          );
        },
      },
    ] as ColumnsType<IFunctionalItem>;
  }, [paginationParams]);

  const handleEdit = useCallback(
    (record: IFunctionalItem) => {
      const { id, ...others } = record;
      form.setFieldsValue({ ...others });

      setIsOpenModal(true);
    },
    [form]
  );

  const handleDelete = useCallback((id: number) => {
    if (id === null || id === undefined) {
      message.error('Không tìm thấy thông tin chức năng cần xóa!');
      return;
    }

    console.log('delete', id);
  }, []);

  const handleModalCancel = useCallback(() => {
    form.resetFields();
    setIsOpenModal(false);
  }, [form]);

  const handleFinish = useCallback(() => {
    console.log('finish', form.getFieldsValue());
  }, []);

  return (
    <>
      <Row gutter={[8, 16]} align={'middle'} justify={'end'}>
        <Col>
          <Button
            title={<FilterAdmin />}
            className={classNames(
              'text-admin-primary border-primary-110 hover:bg-primary-110 hover:text-white',
              isOpenFilter && 'text-white bg-admin-primary'
            )}
            onClick={() => setIsOpenFilter(true)}
          />
        </Col>
        <Col>
          <Button
            title="Tạo"
            iconBefore={<PlusOutlined />}
            onClick={() => setIsOpenModal(true)}
          />
        </Col>
      </Row>
      <FilterFunctional />
      <Content className="!bg-[#2f2f41b3]">
        <Table<IFunctionalItem>
          loading={loading}
          columns={columns}
          scroll={{ x: 'max-content' }}
          dataSource={functionals?.items}
          pagination={{
            current: currentPage,
            pageSize: itemsPerPage,
            total: functionals?.pageInfo?.totalItems,
            onChange: handlePageChange,
          }}
        />
      </Content>
      <AdminModal
        open={isOpenModal}
        title="Thêm chức năng"
        footer={
          <Flex justify="end" gap={16}>
            <Button
              title="Hủy"
              iconBefore={<CloseOutlined />}
              onClick={handleModalCancel}
            />
            <Button
              fill
              title="Lưu"
              iconBefore={<SaveOutlined />}
              onClick={() => form.submit()}
            />
          </Flex>
        }
        onCancel={handleModalCancel}
      >
        <FormWrapper form={form} onFinish={handleFinish}>
          <FormItem
            label="Mã"
            name="code"
            labelClassName="text-white"
            rules={[{ required: true, message: 'Vui lòng nhập mã' }]}
          >
            <Input />
          </FormItem>
          <FormItem
            label="Chức năng"
            name="title"
            labelClassName="text-white"
            rules={[{ required: true, message: 'Vui lòng nhập chức năng' }]}
          >
            <Input />
          </FormItem>
        </FormWrapper>
      </AdminModal>
    </>
  );
};

export default memo(FunctionalManagement);
