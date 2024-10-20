import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, Select, Popconfirm } from 'antd';
import axios from 'axios';
import moment from 'moment';


interface Book {
  Id: number;
  title: string;
  comment: string;
  Writer_Email: string;
  createdate: string;
  Book_Type: number;
}

interface BookType {
  Id: number;
  title: string;
}

export const Books: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [bookTypes, setBookTypes] = useState<BookType[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [form] = Form.useForm();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  useEffect(() => {
    fetchBooks();
    fetchBookTypes();
  }, []);

  const fetchBooks = async () => {
    const response = await axios.get('http://localhost:8000/api/books',{
      headers: {"Content-Type": "application/json",},
      } );
    setBooks(response.data);
  };

  const fetchBookTypes = async () => {
    const response = await axios.get('http://localhost:8000/api/booktypes', {
      headers: {"Content-Type": "application/json"},
    });
    setBookTypes(response.data);
  };

  const handleAdd = () => {
    setEditingBook(null);
    setIsModalVisible(true);
    form.resetFields();
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setIsModalVisible(true);
    form.setFieldsValue({ ...book,createdate: moment(book.createdate) });
  };

  const handleDelete = async (Id: number) => {
    await axios.delete(`http://localhost:8000/api/book/${Id}`, {
      headers: {"Content-Type": "application/json"},
    });
    fetchBooks();
  };

  const handleOk = async () => {
    const values = form.getFieldsValue();
    const bookData = { ...values, createdate: values.createdate.format('YYYY-MM-DD') };
    if (editingBook) {
      await axios.put(`http://localhost:8000/api/book/${editingBook.Id}`, bookData, {
        headers: {"Content-Type": "application/json"},
      });
    } else {
      await axios.post('http://localhost:8000/api/books', bookData, {
        headers: {"Content-Type": "application/json"},
      });
    }
    setIsModalVisible(false);
    fetchBooks();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDateFilter = async () => {
    const params: any = {};
    if (startDate) params.startDate = startDate.toISOString().split('T')[0];
    if (endDate) params.endDate = endDate.toISOString().split('T')[0];
    const response = await axios.get('http://localhost:8000/api/books', { params });
    setBooks(response.data);
  };

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Button onClick={handleAdd} type="primary">
          Add Book
        </Button>
        <DatePicker
          placeholder="Start Date"
          onChange={setStartDate}
          style={{ marginLeft: 16 }}
        />
        <DatePicker
          placeholder="End Date"
          onChange={setEndDate}
          style={{ marginLeft: 16 }}
        />
        <Button onClick={handleDateFilter} style={{ marginLeft: 16 }}>
          Filter
        </Button>
      </div>
      <Table
        dataSource={books}
        rowKey="Id"
        columns={[
          { title: 'ID', dataIndex: 'Id', key: 'Id' },
          { title: 'Title', dataIndex: 'title', key: 'title' },
          { title: 'Comment', dataIndex: 'comment', key: 'comment' },
          { title: 'Writer Email', dataIndex: 'Writer_Email', key: 'Writer_Email' },
          { title: 'Created Date', dataIndex: 'createdate', key: 'createdate' },
          {
            title: 'Book Type',
            dataIndex: 'Book_Type',
            key: 'Book_Type',
            render: (Book_Type) => bookTypes.find(bt => bt.Id === Book_Type)?.title,
          },
          {
            title: 'Actions',
            render: (text, record) => (
              <>
                <Button onClick={() => handleEdit(record)} style={{ marginRight: 8 }}>
                  Edit
                </Button>
                <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.Id)}>
                  <Button danger>Delete</Button>
                </Popconfirm>
              </>
            ),
          },
        ]}
      />

      <Modal
        title={editingBook ? "Edit Book" : "Add Book"}
        open={isModalVisible} 
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="Id" label="ID" rules={[{ required: true }]}>
            <Input disabled={!!editingBook} />
          </Form.Item>
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="comment" label="Comment">
            <Input />
          </Form.Item>
          <Form.Item name="Writer_Email" label="Writer Email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="createdate" label="Created Date">
            <DatePicker />
          </Form.Item>
          <Form.Item>
          <DatePicker
          placeholder="Start Date"
          onChange={(date) => setStartDate(date?.toDate() || null)}
          style={{ marginLeft: 16 }}
        />
        </Form.Item>
        <Form.Item>
        <DatePicker
          placeholder="End Date"
          onChange={(date) => setEndDate(date?.toDate() || null)}
          style={{ marginLeft: 16 }}
        />
           </Form.Item>
          <Form.Item name="Book_Type" label="Book Type" rules={[{ required: true }]}>
            <Select>
              {bookTypes.map((bt) => (
                <Select.Option key={bt.Id} value={bt.Id}>
                  {bt.title}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};