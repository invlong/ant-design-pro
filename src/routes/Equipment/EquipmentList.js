import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Icon, Button, InputNumber, DatePicker, Badge, Modal } from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './EquipmentList.less';

const { Option } = Select;
const FormItem = Form.Item;
const statusMap = ['success', 'error'];

@connect(state => ({
  equipmentList: state.equipmentList,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    expandForm: false,
    selectedRows: [],
    modalVisible: false,
    inputValue: '正在开发中...',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'equipmentList/fetch',
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'equipmentList/fetch',
      payload: {},
    });
  }

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  }

  handleRefresh = () => {
    this.setState({
      modalVisible: true,
    });
  }

  handleAdd = () => {
    this.setState({
      modalVisible: false,
    });
  }

  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
    });
  }

  handleSearch = (e) => {
    e.preventDefault();
    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
      };
      dispatch({
        type: 'equipmentList/fetch',
        payload: values,
      });
    });
  }

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="应用名">
              {getFieldDecorator('name')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="规则编号">
              {getFieldDecorator('no')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="调用次数">
              {getFieldDecorator('number')(
                <InputNumber style={{ width: '100%' }} />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="更新日期">
              {getFieldDecorator('date')(
                <DatePicker style={{ width: '100%' }} placeholder="请输入更新日期" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status3')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status4')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </span>
        </div>
      </Form>
    );
  }

  renderForm() {
    return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const { equipmentList: { loading, data } } = this.props;
    const { selectedRows, modalVisible, inputValue } = this.state;
    const status = ['启动', '关闭'];
    const pageHeaderExtra = (
      <div className={styles.pageHeaderExtra}>
        <div>
          <p>设备总数</p>
          <p>56</p>
        </div>
        <div>
          <p>在线设备数</p>
          <p>8</p>
        </div>
        <div>
          <p>故障设备</p>
          <p>5</p>
        </div>
      </div>
    );
    const columns = [
      {
        title: '网关编号',
        dataIndex: 'gatewayNo',
      },
      {
        title: '网关名称',
        dataIndex: 'gatewayName',
      },
      {
        title: '网关IP',
        dataIndex: 'gatewayIP',
      },
      {
        title: '设备数',
        dataIndex: 'equipmentNo',
      },
      {
        title: '在线数',
        dataIndex: 'onlineNo',
      },
      {
        title: '离线数',
        dataIndex: 'offlineNo',
      },
      {
        title: '故障数',
        dataIndex: 'faultyNo',
      },
      {
        title: '上行带宽',
        dataIndex: 'upSpeed',
      },
      {
        title: '下行带宽',
        dataIndex: 'downSpeed',
      },
      {
        title: '是否启用',
        dataIndex: 'enable',
        filters: [
          {
            text: status[0],
            value: true,
          },
          {
            text: status[1],
            value: false,
          },
        ],
        render(val) {
          return (
            <Badge
              status={statusMap[val === true ? 0 : 1]}
              text={status[val === true ? 0 : 1]}
            />
          );
        },
      },
      {
        title: '自动添加设备',
        dataIndex: 'auto',
        filters: [
          {
            text: status[0],
            value: true,
          },
          {
            text: status[1],
            value: false,
          },
        ],
        render(val) {
          return (
            <Badge
              status={statusMap[val === true ? 0 : 1]}
              text={status[val === true ? 0 : 1]}
            />
          );
        },
      },
    ];

    return (
      <PageHeaderLayout
        extraContent={pageHeaderExtra}
      >
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>
            <div className={styles.tableListOperator}>
              <Button icon="sync" type="primary" onClick={() => this.handleRefresh()}>刷新</Button>
              <Button icon="caret-right" type="primary" onClick={() => this.handleRefresh()}>启用设备自动添加</Button>
              <Button icon="minus-circle" type="primary" onClick={() => this.handleRefresh()}>禁用设备自动添加</Button>
              <Button icon="info-circle" type="primary" onClick={() => this.handleRefresh()}>重命名</Button>
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={columns}
              onSelectRow={this.handleSelectRows}
            />
          </div>
        </Card>
        <Modal
          title="新建规则"
          visible={modalVisible}
          onOk={this.handleAdd}
          onCancel={() => this.handleModalVisible()}
        >
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="描述"
          >
            <p>{inputValue}</p>
          </FormItem>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
