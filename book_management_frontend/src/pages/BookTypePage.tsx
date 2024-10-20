import React from 'react';
import { BookType } from '../components/BookType';

const BookTypePage: React.FC = () => {
  return (
    <div>
      <h1>Manage Book Types</h1>
      <BookType />
    </div>
  );
};

export default BookTypePage;