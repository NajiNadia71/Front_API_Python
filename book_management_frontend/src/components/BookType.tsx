import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Popconfirm } from 'antd';
import axios from 'axios';

interface BookType {
  Id: number;
  title: string;
  comment: string;
  createdate: string;
}

export const BookType: React.FC = () => {
  const [bookTypes, setBookTypes] = useState<BookType[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBookType, setEditingBookType] = useState<BookType | null>(null);
  const [form] = Form.useForm();

  // Fetch book types when component loads
  useEffect(() => {
    fetchBookTypes();
  }, []);

  const fetchBookTypes = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/booktypes',{
      //   headers: {
      //     // "Content-Type": "application/json",
      //     //  "Access-Control-Allow-Origin": "*"
      //      "Access-Control-Allow-Headers": "Content-Type"
      //     },
              // });
      headers: {
        "Content-Type": "application/json",
        // "Access-Control-Allow-Origin": "*",
        // "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
        // "Access-Control-Allow-Headers": "Content-Type"
      },
      } );
      setBookTypes(response.data);
    } catch (error) {
      console.error('Error fetching book types:', error);
    }
  };

  const handleAdd = () => {
    setEditingBookType(null);
    setIsModalVisible(true);
    form.resetFields();
  };

  const handleEdit = (bookType: BookType) => {
    setEditingBookType(bookType);
    setIsModalVisible(true);
    form.setFieldsValue(bookType);
  };

  const handleDelete = async (Id: number) => {
    try {
      await axios.delete(`/api/booktypes/${Id}`);
      fetchBookTypes();
    } catch (error) {
      console.error('Error deleting book type:', error);
    }
  };

  const handleOk = async () => {
    try {
      const values = form.getFieldsValue();
      if (editingBookType) {
        // Update existing book type
        await axios.put(`/api/booktypes/${editingBookType.Id}`, values);
      } else {
        // Create new book type
        await axios.post('/api/booktypes', values);
      }
      setIsModalVisible(false);
      fetchBookTypes();
    } catch (error) {
      console.error('Error saving book type:', error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
        Add Book Type
      </Button>
      <Table
        dataSource={bookTypes}
        rowKey="Id"
        columns={[
          { title: 'ID', dataIndex: 'Id', key: 'Id' },
          { title: 'Title', dataIndex: 'title', key: 'title' },
          { title: 'Comment', dataIndex: 'comment', key: 'comment' },
          { title: 'Created Date', dataIndex: 'createdate', key: 'createdate' },
          {
            title: 'Actions',
            render: (text, record) => (
              <>
                <Button onClick={() => handleEdit(record)} style={{ marginRight: 8 }}>
                  Edit
                </Button>
                <Popconfirm
                  title="Are you sure you want to delete?"
                  onConfirm={() => handleDelete(record.Id)}
                >
                  <Button danger>Delete</Button>
                </Popconfirm>
              </>
            ),
          },
        ]}
      />

      <Modal
        title={editingBookType ? "Edit Book Type" : "Add Book Type"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="Id" label="ID" rules={[{ required: true }]}>
            <Input disabled={!!editingBookType} />
          </Form.Item>
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="comment" label="Comment">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};